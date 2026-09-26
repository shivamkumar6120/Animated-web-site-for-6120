import React, { useEffect, useRef, useState } from 'react';

/**
 * PARTICLE-BASED NAME FORMATION
 * 
 * Hundreds of stardust & romantic light particles gather from across the cosmos
 * and assemble into the letters of her name ("Nishi").
 * Supports touch & mouse interactive magnetic repulsion.
 */
export default function ParticleNameFormation({ herName, onComplete, triggerBurst }) {
  const canvasRef = useRef(null);
  const [isFormed, setIsFormed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = 200);

    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // 1. Generate text target positions using an offscreen canvas
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    offCanvas.width = width;
    offCanvas.height = height;

    const fontSize = isMobile ? Math.min(width * 0.18, 65) : Math.min(width * 0.15, 105);
    offCtx.font = `900 ${fontSize}px 'Cinzel', 'Cormorant Garamond', serif`;
    offCtx.fillStyle = '#ffffff';
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText(herName, width / 2, height / 2);

    const imgData = offCtx.getImageData(0, 0, width, height).data;
    const targets = [];
    const step = isMobile ? 6 : 5; // Sample density

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        const alpha = imgData[index + 3];
        if (alpha > 128) {
          targets.push({ x, y });
        }
      }
    }

    // 2. Spawn particles from cosmic periphery
    const palette = ['#ffffff', '#ffe0ec', '#ff5388', '#ff2d75', '#c77dff', '#ffd166'];
    const particles = targets.map((target, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (width * 0.6) + 100;
      return {
        x: width / 2 + Math.cos(angle) * dist,
        y: height / 2 + Math.sin(angle) * dist,
        targetX: target.x,
        targetY: target.y,
        vx: 0,
        vy: 0,
        size: Math.random() * 2.2 + 1.2,
        color: palette[i % palette.length],
        alpha: Math.random() * 0.5 + 0.5,
        twinkle: Math.random() * 0.05 + 0.02,
        phase: Math.random() * Math.PI * 2,
        ease: Math.random() * 0.04 + 0.035
      };
    });

    // Interaction pointer
    const mouse = { x: -1000, y: -1000, active: false };

    let startTime = performance.now();
    let completedTriggered = false;

    // 3. Render loop with spring dynamics & magnetic dispersion
    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      let allArrived = true;
      const elapsed = time - startTime;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.phase += p.twinkle;

        // Spring toward target
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const distToTarget = Math.sqrt(dx * dx + dy * dy);

        if (distToTarget > 2) {
          allArrived = false;
        }

        p.vx += dx * p.ease;
        p.vy += dy * p.ease;
        p.vx *= 0.84;
        p.vy *= 0.84;

        // Interactive mouse / touch repulsion
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          const maxRepelDist = isMobile ? 65 : 85;

          if (mdist < maxRepelDist && mdist > 0) {
            const repelForce = (maxRepelDist - mdist) / maxRepelDist;
            p.vx += (mdx / mdist) * repelForce * 4.5;
            p.vy += (mdy / mdist) * repelForce * 4.5;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Subtle breathing shimmer
        const shimmer = Math.sin(p.phase) * 0.25 + p.alpha;
        ctx.save();
        ctx.globalAlpha = Math.max(0.2, Math.min(1, shimmer));
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Check arrival completion
      if ((allArrived || elapsed > 2400) && !completedTriggered) {
        completedTriggered = true;
        setIsFormed(true);
        if (onComplete) onComplete();
        if (triggerBurst) {
          const rect = canvas.getBoundingClientRect();
          triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 60, true);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // Event listeners
    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
      mouse.active = true;
    };

    const handleLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchmove', handleMove, { passive: true });
    canvas.addEventListener('mouseleave', handleLeave);
    canvas.addEventListener('touchend', handleLeave);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('mouseleave', handleLeave);
      canvas.removeEventListener('touchend', handleLeave);
    };
  }, [herName, onComplete, triggerBurst]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '180px'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          touchAction: 'manipulation',
          cursor: 'pointer'
        }}
      />
      {isFormed && (
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.72rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255, 182, 193, 0.75)',
            marginTop: '8px',
            animation: 'fadeIn 1s ease'
          }}
        >
          ✨ Touch the stardust to interact
        </span>
      )}
    </div>
  );
}
