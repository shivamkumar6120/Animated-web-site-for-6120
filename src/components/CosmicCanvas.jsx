import React, { useEffect, useRef } from 'react';

/**
 * COSMIC CANVAS ENGINE
 * 
 * Renders an ethereal, cinematic romantic cosmos:
 * - Breathing Nebula clouds
 * - Twinkling multi-depth Starfield & rare graceful shooting stars
 * - Procedural drifting 3D Rose Petals
 * - Floating Fireflies & Stardust
 * - Cursor stardust trails
 * - Heart-shaped particle explosions on click
 */
export default function CosmicCanvas({ onBurstReady }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive particle counts based on screen size
    const isMobile = width < 768;
    const STAR_COUNT = isMobile ? 85 : 160;
    const PETAL_COUNT = isMobile ? 18 : 32;
    const FIREFLY_COUNT = isMobile ? 20 : 35;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // High DPI scaling (capped at 2 for performance)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    setCanvasSize();

    // Mouse / Touch tracking for light trails and parallax
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      moving: false,
      lastMoved: 0
    };

    // Nebula cloud coordinates & phases
    const nebulas = [
      { x: 0.25, y: 0.35, r: 450, color: 'rgba(255, 45, 117, 0.085)', phase: 0, speed: 0.0006 },
      { x: 0.75, y: 0.65, r: 520, color: 'rgba(157, 78, 221, 0.075)', phase: 2, speed: 0.0005 },
      { x: 0.5, y: 0.5, r: 400, color: 'rgba(255, 117, 143, 0.065)', phase: 4, speed: 0.0007 },
      { x: 0.8, y: 0.2, r: 350, color: 'rgba(255, 209, 102, 0.04)', phase: 1, speed: 0.0004 }
    ];

    // Star generation
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      baseAlpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      phase: Math.random() * Math.PI * 2,
      color: ['#ffffff', '#ffe4f0', '#ffd166', '#e0aaff'][Math.floor(Math.random() * 4)],
      depth: Math.random() * 0.5 + 0.5
    }));

    // Shooting stars
    const shootingStars = [];
    const spawnShootingStar = () => {
      if (shootingStars.length < 2 && Math.random() < 0.02) {
        shootingStars.push({
          x: Math.random() * width * 0.8 + width * 0.1,
          y: Math.random() * height * 0.3,
          length: Math.random() * 80 + 60,
          speed: Math.random() * 9 + 8,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          alpha: 1,
          life: 0,
          maxLife: 60
        });
      }
    };

    // Realistic procedural Rose Petals
    const petals = Array.from({ length: PETAL_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 11 + 9,
      speedY: Math.random() * 0.8 + 0.5,
      speedX: Math.random() * 0.6 - 0.3,
      angle: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.025,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.03 + 0.015,
      color: ['#ff2d75', '#e61e5c', '#ff5388', '#b5179e', '#f72585'][Math.floor(Math.random() * 5)],
      alpha: Math.random() * 0.35 + 0.5
    }));

    // Floating Fireflies
    const fireflies = Array.from({ length: FIREFLY_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1.2,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.03 + 0.02,
      color: ['#ffe49e', '#ff758f', '#ffb703', '#f72585'][Math.floor(Math.random() * 4)]
    }));

    // Stardust cursor trail particles
    const trailParticles = [];
    const addTrailParticle = (x, y) => {
      if (trailParticles.length > 50) return;
      trailParticles.push({
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2 - 0.4,
        size: Math.random() * 2.5 + 1.0,
        alpha: 0.9,
        decay: Math.random() * 0.025 + 0.02,
        color: ['#ff4d6d', '#ffd166', '#ffffff', '#e0aaff'][Math.floor(Math.random() * 4)],
        isHeart: Math.random() < 0.25
      });
    };

    // Heart bursts & Click Explosions
    const burstParticles = [];
    const createHeartBurst = (originX, originY, count = 55, isGrand = false) => {
      const particleCount = isGrand ? count * 1.8 : count;
      const palette = ['#ff2d75', '#ff4d6d', '#ff758f', '#ff8fa3', '#e0aaff', '#ffd166', '#ffffff'];

      for (let i = 0; i < particleCount; i++) {
        // Parametric heart or radial trajectory
        const angle = (Math.PI * 2 * i) / (particleCount * 0.7) + (Math.random() - 0.5) * 0.5;
        const speed = (Math.random() * 5.5 + 2.0) * (isGrand ? 1.4 : 1.0);
        
        // Cardioid bias for some particles to naturally form heart shapes
        const isParametricHeart = i < particleCount * 0.55;
        const t = (Math.PI * 2 * i) / (particleCount * 0.55);
        let vx, vy;

        if (isParametricHeart) {
          // Mathematical heart shape burst
          const heartX = 16 * Math.pow(Math.sin(t), 3);
          const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
          const force = (Math.random() * 0.25 + 0.2) * (isGrand ? 1.5 : 1.0);
          vx = heartX * force + (Math.random() - 0.5) * 1.0;
          vy = heartY * force + (Math.random() - 0.5) * 1.0;
        } else {
          // Sparkle corona
          vx = Math.cos(angle) * speed;
          vy = Math.sin(angle) * speed;
        }

        burstParticles.push({
          x: originX,
          y: originY,
          vx: vx,
          vy: vy,
          drag: 0.955,
          gravity: 0.065,
          size: Math.random() * 7 + 4,
          alpha: 1,
          decay: Math.random() * 0.016 + 0.012,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.15,
          color: palette[Math.floor(Math.random() * palette.length)],
          isHeartShape: Math.random() < 0.65,
          sparkle: Math.random() < 0.35
        });
      }
    };

    // Expose burst function
    if (onBurstReady) {
      onBurstReady(createHeartBurst);
    }

    // Helper: Draw procedural 2D / 3D rose petal
    const drawPetal = (x, y, size, angle, flip, color, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(1, Math.cos(flip)); // 3D flipping projection
      ctx.globalAlpha = alpha;

      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.8, -size * 0.8, size * 0.9, size * 0.4, 0, size);
      ctx.bezierCurveTo(-size * 0.9, size * 0.4, -size * 0.8, -size * 0.8, 0, -size);
      ctx.closePath();

      // Velvet gradient
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      grad.addColorStop(0, '#ffa8ba');
      grad.addColorStop(0.5, color);
      grad.addColorStop(1, '#500018');
      ctx.fillStyle = grad;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.fill();

      ctx.restore();
    };

    // Helper: Draw glowing mini heart
    const drawMiniHeart = (x, y, size, angle, color, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = size * 1.5;

      const s = size / 16;
      ctx.beginPath();
      ctx.moveTo(0, -3 * s);
      ctx.bezierCurveTo(-6 * s, -12 * s, -16 * s, -2 * s, 0, 14 * s);
      ctx.bezierCurveTo(16 * s, -2 * s, 6 * s, -12 * s, 0, -3 * s);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    // Main animation loop
    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Clear with deep romantic space backdrop
      ctx.fillStyle = '#06020c';
      ctx.fillRect(0, 0, width, height);

      // 1. Nebula Layer (Breathing cosmic clouds)
      nebulas.forEach((neb) => {
        neb.phase += neb.speed * (prefersReducedMotion ? 0.2 : 1);
        const breath = Math.sin(neb.phase) * 45;
        const currentR = neb.r + breath;
        const cx = neb.x * width + Math.cos(neb.phase * 0.7) * 40;
        const cy = neb.y * height + Math.sin(neb.phase * 0.8) * 30;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, currentR);
        grad.addColorStop(0, neb.color);
        grad.addColorStop(0.6, neb.color.replace(/[\d\.]+\)$/, '0.02)'));
        grad.addColorStop(1, 'rgba(6, 2, 12, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      });

      // 2. Multi-depth Starfield with Parallax
      const parallaxX = (mouse.x - width / 2) * 0.02;
      const parallaxY = (mouse.y - height / 2) * 0.02;

      stars.forEach((star) => {
        star.phase += star.twinkleSpeed;
        const twinkle = Math.sin(star.phase) * 0.35 + star.baseAlpha;
        const sx = (star.x + parallaxX * star.depth + width) % width;
        const sy = (star.y + parallaxY * star.depth + height) % height;

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, twinkle));
        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = star.size * 2;
        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 3. Rare Shooting Stars
      if (!prefersReducedMotion) {
        spawnShootingStar();
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life++;

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, 'rgba(255, 220, 240, 0.9)');

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#ff758f';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();
        ctx.restore();

        if (ss.life > ss.maxLife || ss.x > width || ss.y > height) {
          shootingStars.splice(i, 1);
        }
      }

      // 4. Floating Fireflies & Golden Stardust
      fireflies.forEach((ff) => {
        ff.phase += ff.pulseSpeed;
        ff.x += ff.vx + Math.sin(ff.phase) * 0.4;
        ff.y += ff.vy + Math.cos(ff.phase * 0.8) * 0.4;

        if (ff.x < -20) ff.x = width + 20;
        if (ff.x > width + 20) ff.x = -20;
        if (ff.y < -20) ff.y = height + 20;
        if (ff.y > height + 20) ff.y = -20;

        const pulse = (Math.sin(ff.phase) + 1) * 0.4 + 0.2;
        ctx.save();
        ctx.globalAlpha = pulse;
        ctx.fillStyle = ff.color;
        ctx.shadowColor = ff.color;
        ctx.shadowBlur = ff.size * 5;
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 5. Procedural 3D Rose Petals
      petals.forEach((p) => {
        p.swayOffset += p.swaySpeed;
        p.flip += p.flipSpeed;
        p.angle += p.spinSpeed;

        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.swayOffset) * 0.8;

        if (p.y > height + 40) {
          p.y = -40;
          p.x = Math.random() * width;
        }
        if (p.x < -40) p.x = width + 40;
        if (p.x > width + 40) p.x = -40;

        drawPetal(p.x, p.y, p.size, p.angle, p.flip, p.color, p.alpha);
      });

      // 6. Stardust Cursor Trail Particles
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const tp = trailParticles[i];
        tp.x += tp.vx;
        tp.y += tp.vy;
        tp.alpha -= tp.decay;

        if (tp.alpha <= 0) {
          trailParticles.splice(i, 1);
          continue;
        }

        if (tp.isHeart) {
          drawMiniHeart(tp.x, tp.y, tp.size * 2.8, 0, tp.color, tp.alpha);
        } else {
          ctx.save();
          ctx.globalAlpha = tp.alpha;
          ctx.fillStyle = tp.color;
          ctx.shadowColor = tp.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, tp.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // 7. Interactive Heart Bursts & Explosions
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const bp = burstParticles[i];
        bp.vx *= bp.drag;
        bp.vy *= bp.drag;
        bp.vy += bp.gravity;
        bp.x += bp.vx;
        bp.y += bp.vy;
        bp.rotation += bp.rotSpeed;
        bp.alpha -= bp.decay;

        if (bp.alpha <= 0) {
          burstParticles.splice(i, 1);
          continue;
        }

        if (bp.isHeartShape) {
          drawMiniHeart(bp.x, bp.y, bp.size, bp.rotation, bp.color, bp.alpha);
        } else {
          ctx.save();
          ctx.translate(bp.x, bp.y);
          ctx.rotate(bp.rotation);
          ctx.globalAlpha = bp.alpha;
          ctx.fillStyle = bp.color;
          ctx.shadowColor = bp.color;
          ctx.shadowBlur = bp.size * 2;
          
          // Shimmer diamond sparkle
          ctx.beginPath();
          ctx.moveTo(0, -bp.size);
          ctx.lineTo(bp.size * 0.4, 0);
          ctx.lineTo(0, bp.size);
          ctx.lineTo(-bp.size * 0.4, 0);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Event Listeners: Mouse Move & Touch Move
    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      mouse.targetX = clientX;
      mouse.targetY = clientY;
      addTrailParticle(clientX, clientY);
    };

    // Click anywhere to spawn mini-burst of hearts
    const handlePointerDown = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      createHeartBurst(clientX, clientY, 26, false);
    };

    window.addEventListener('resize', setCanvasSize);
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [onBurstReady]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
}
