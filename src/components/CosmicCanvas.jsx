import React, { useEffect, useRef } from 'react';

/**
 * ENHANCED COSMIC CANVAS ENGINE
 * 
 * Cinematic romantic animations:
 * - Fluid undulating Aurora Borealis background (celestial violet, rose, magenta & cyan starlight)
 * - Multi-depth starfield with parallax and shooting stars with sparkle trails
 * - Realistic 3D procedural tumbling Rose Petals responsive to scroll breeze
 * - Ascending ambient glowing Micro-Hearts
 * - Interactive Fireflies that react to mouse & touch proximity
 * - Stardust light trails
 * - Multi-tiered Heart Explosions with shockwave rings
 * - Grand Cosmic Vortex for dramatic climax
 */
export default function CosmicCanvas({ onBurstReady, onVortexReady }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = width < 768;
    const STAR_COUNT = isMobile ? 90 : 170;
    const PETAL_COUNT = isMobile ? 18 : 34;
    const FIREFLY_COUNT = isMobile ? 18 : 32;
    const AMBIENT_HEART_COUNT = isMobile ? 10 : 18;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

    // Mouse & Touch Tracking
    const pointer = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isDown: false,
      active: false
    };

    // Scroll Breeze Tracking
    let lastScrollY = window.scrollY;
    let scrollBreeze = 0;

    // 1. Aurora Borealis Ribbons Configuration
    const auroraWaves = [
      { baseHeight: 0.22, amplitude: 55, frequency: 0.0018, speed: 0.0008, phase: 0, colorStart: 'rgba(157, 78, 221, 0.14)', colorEnd: 'rgba(255, 45, 117, 0)' },
      { baseHeight: 0.28, amplitude: 70, frequency: 0.0014, speed: 0.0006, phase: 2, colorStart: 'rgba(255, 45, 117, 0.12)', colorEnd: 'rgba(255, 117, 143, 0)' },
      { baseHeight: 0.35, amplitude: 85, frequency: 0.0011, speed: 0.0005, phase: 4, colorStart: 'rgba(64, 224, 208, 0.06)', colorEnd: 'rgba(157, 78, 221, 0)' }
    ];

    // 2. Starfield
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.7 + 0.4,
      baseAlpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
      phase: Math.random() * Math.PI * 2,
      color: ['#ffffff', '#ffe4f0', '#ffd166', '#e0aaff'][Math.floor(Math.random() * 4)],
      depth: Math.random() * 0.5 + 0.5
    }));

    // 3. Shooting Stars with Sparkle Wake
    const shootingStars = [];
    const spawnShootingStar = () => {
      if (shootingStars.length < 2 && Math.random() < 0.016) {
        shootingStars.push({
          x: Math.random() * width * 0.85 + width * 0.05,
          y: Math.random() * height * 0.3,
          length: Math.random() * 85 + 65,
          speed: Math.random() * 8 + 7,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.25,
          alpha: 1,
          life: 0,
          maxLife: 60,
          sparkles: []
        });
      }
    };

    // 4. Procedural 3D Rose Petals
    const petals = Array.from({ length: PETAL_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 10 + 9,
      speedY: Math.random() * 0.75 + 0.45,
      speedX: Math.random() * 0.5 - 0.25,
      angle: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.02,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.02 + 0.01,
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.025 + 0.012,
      color: ['#ff2d75', '#e61e5c', '#ff5388', '#b5179e', '#f72585'][Math.floor(Math.random() * 5)],
      alpha: Math.random() * 0.35 + 0.5
    }));

    // 5. Ascending Ambient Floating Hearts
    const ambientHearts = Array.from({ length: AMBIENT_HEART_COUNT }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * height,
      size: Math.random() * 7 + 4,
      speedY: Math.random() * 0.5 + 0.3,
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.018 + 0.008,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.015,
      color: ['#ff4d6d', '#ff758f', '#e0aaff', '#ffd166'][Math.floor(Math.random() * 4)],
      alpha: Math.random() * 0.35 + 0.25
    }));

    // 6. Interactive Fireflies (Reacts to cursor/touch proximity)
    const fireflies = Array.from({ length: FIREFLY_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseVx: (Math.random() - 0.5) * 0.5,
      baseVy: (Math.random() - 0.5) * 0.5,
      vx: 0,
      vy: 0,
      size: Math.random() * 2.5 + 1.2,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.03 + 0.02,
      color: ['#ffe49e', '#ff758f', '#ffb703', '#f72585'][Math.floor(Math.random() * 4)]
    }));

    // 7. Stardust cursor trail particles
    const trailParticles = [];
    const addTrailParticle = (x, y) => {
      if (trailParticles.length > 45) return;
      trailParticles.push({
        x: x + (Math.random() - 0.5) * 14,
        y: y + (Math.random() - 0.5) * 14,
        vx: (Math.random() - 0.5) * 1.0,
        vy: (Math.random() - 0.5) * 1.0 - 0.35,
        size: Math.random() * 2.4 + 1.0,
        alpha: 0.85,
        decay: Math.random() * 0.025 + 0.02,
        color: ['#ff4d6d', '#ffd166', '#ffffff', '#e0aaff'][Math.floor(Math.random() * 4)],
        isHeart: Math.random() < 0.28
      });
    };

    // 8. Multi-tiered Shockwaves and Bursts
    const shockwaves = [];
    const burstParticles = [];

    const createHeartBurst = (originX, originY, count = 55, isGrand = false) => {
      // 1. Luminous shockwave ripple ring
      shockwaves.push({
        x: originX,
        y: originY,
        radius: 10,
        maxRadius: isGrand ? 160 : 95,
        alpha: 0.85,
        color: isGrand ? '#ff5388' : '#ff2d75',
        lineWidth: isGrand ? 3.5 : 2.0
      });

      const particleCount = isGrand ? Math.round(count * 1.6) : count;
      const palette = ['#ff2d75', '#ff4d6d', '#ff758f', '#ff8fa3', '#e0aaff', '#ffd166', '#ffffff'];

      for (let i = 0; i < particleCount; i++) {
        const isParametricHeart = i < particleCount * 0.55;
        const t = (Math.PI * 2 * i) / (particleCount * 0.55);
        let vx, vy;

        if (isParametricHeart) {
          const heartX = 16 * Math.pow(Math.sin(t), 3);
          const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
          const force = (Math.random() * 0.24 + 0.18) * (isGrand ? 1.5 : 1.0);
          vx = heartX * force + (Math.random() - 0.5) * 0.8;
          vy = heartY * force + (Math.random() - 0.5) * 0.8;
        } else {
          const angle = Math.random() * Math.PI * 2;
          const speed = (Math.random() * 5.5 + 2.0) * (isGrand ? 1.4 : 1.0);
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
          size: Math.random() * 6.5 + 3.5,
          alpha: 1,
          decay: Math.random() * 0.016 + 0.012,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.15,
          color: palette[Math.floor(Math.random() * palette.length)],
          isHeartShape: Math.random() < 0.65
        });
      }
    };

    // 9. Grand Cosmic Vortex Climax
    const vortexParticles = [];
    const triggerCosmicVortex = (centerX, centerY) => {
      const vX = centerX || width / 2;
      const vY = centerY || height * 0.45;

      for (let i = 0; i < 90; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 260 + 80;
        vortexParticles.push({
          angle: angle,
          dist: dist,
          speed: Math.random() * 0.04 + 0.03,
          radialSpeed: Math.random() * 1.8 + 1.2,
          centerX: vX,
          centerY: vY,
          size: Math.random() * 5 + 3,
          color: ['#ff2d75', '#e0aaff', '#ffd166', '#ffffff'][Math.floor(Math.random() * 4)],
          alpha: 1,
          life: 0,
          maxLife: 140,
          isHeart: Math.random() < 0.5
        });
      }
    };

    if (onBurstReady) onBurstReady(createHeartBurst);
    if (onVortexReady) onVortexReady(triggerCosmicVortex);

    // Helper: Draw 3D procedural rose petal
    const drawPetal = (x, y, size, angle, flip, color, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(1, Math.cos(flip));
      ctx.globalAlpha = alpha;

      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.8, -size * 0.8, size * 0.9, size * 0.4, 0, size);
      ctx.bezierCurveTo(-size * 0.9, size * 0.4, -size * 0.8, -size * 0.8, 0, -size);
      ctx.closePath();

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      grad.addColorStop(0, '#ffa8ba');
      grad.addColorStop(0.5, color);
      grad.addColorStop(1, '#500018');
      ctx.fillStyle = grad;
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
    const render = () => {
      // Smooth pointer easing
      pointer.x += (pointer.targetX - pointer.x) * 0.08;
      pointer.y += (pointer.targetY - pointer.y) * 0.08;

      // Damp scroll breeze back to neutral
      scrollBreeze *= 0.92;

      // Deep space backdrop
      ctx.fillStyle = '#06020c';
      ctx.fillRect(0, 0, width, height);

      // 1. FLUID AURORA BOREALIS LAYER
      if (!prefersReducedMotion) {
        auroraWaves.forEach((wave) => {
          wave.phase += wave.speed;
          const waveY = height * wave.baseHeight;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(0, height);

          // Draw organic sinusoidal wave across width
          for (let x = 0; x <= width; x += 25) {
            const y = waveY + Math.sin(x * wave.frequency + wave.phase) * wave.amplitude + Math.cos(x * wave.frequency * 0.6 + wave.phase * 0.8) * (wave.amplitude * 0.4);
            ctx.lineTo(x, y);
          }
          ctx.lineTo(width, height);
          ctx.closePath();

          const grad = ctx.createLinearGradient(0, waveY - wave.amplitude, 0, waveY + wave.amplitude * 2.5);
          grad.addColorStop(0, wave.colorStart);
          grad.addColorStop(1, wave.colorEnd);
          ctx.fillStyle = grad;
          ctx.fill();
          ctx.restore();
        });
      }

      // 2. Multi-depth Starfield with Parallax
      const parallaxX = (pointer.x - width / 2) * 0.018;
      const parallaxY = (pointer.y - height / 2) * 0.018;

      stars.forEach((star) => {
        star.phase += star.twinkleSpeed;
        const twinkle = Math.sin(star.phase) * 0.35 + star.baseAlpha;
        const sx = (star.x + parallaxX * star.depth + width) % width;
        const sy = (star.y + parallaxY * star.depth + height) % height;

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, twinkle));
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 3. Shooting Stars with Sparkles
      if (!prefersReducedMotion) spawnShootingStar();

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life++;

        // Spawn occasional wake sparkles
        if (Math.random() < 0.4) {
          ss.sparkles.push({
            x: ss.x,
            y: ss.y,
            alpha: 0.8,
            size: Math.random() * 2 + 1
          });
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, 'rgba(255, 220, 240, 0.9)');

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();

        // Render wake sparkles
        for (let s = ss.sparkles.length - 1; s >= 0; s--) {
          const sp = ss.sparkles[s];
          sp.alpha -= 0.04;
          if (sp.alpha <= 0) {
            ss.sparkles.splice(s, 1);
            continue;
          }
          ctx.globalAlpha = sp.alpha;
          ctx.fillStyle = '#ffe49e';
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        if (ss.life > ss.maxLife || ss.x > width + 50 || ss.y > height + 50) {
          shootingStars.splice(i, 1);
        }
      }

      // 4. Interactive Fireflies
      fireflies.forEach((ff) => {
        ff.phase += ff.pulseSpeed;

        // Proximity repulsion/attraction to cursor or touch
        const dx = pointer.x - ff.x;
        const dy = pointer.y - ff.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120 && pointer.active) {
          const force = (120 - dist) / 120;
          ff.vx -= (dx / dist) * force * 0.7;
          ff.vy -= (dy / dist) * force * 0.7;
        }

        ff.vx *= 0.94;
        ff.vy *= 0.94;

        ff.x += ff.baseVx + ff.vx + Math.sin(ff.phase) * 0.4;
        ff.y += ff.baseVy + ff.vy + Math.cos(ff.phase * 0.8) * 0.4;

        if (ff.x < -20) ff.x = width + 20;
        if (ff.x > width + 20) ff.x = -20;
        if (ff.y < -20) ff.y = height + 20;
        if (ff.y > height + 20) ff.y = -20;

        const pulse = (Math.sin(ff.phase) + 1) * 0.4 + 0.2;
        ctx.save();
        ctx.globalAlpha = pulse;
        ctx.fillStyle = ff.color;
        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 5. Procedural 3D Rose Petals (Responsive to scroll breeze)
      petals.forEach((p) => {
        p.swayOffset += p.swaySpeed;
        p.flip += p.flipSpeed;
        p.angle += p.spinSpeed;

        p.y += p.speedY + scrollBreeze * 0.4;
        p.x += p.speedX + Math.sin(p.swayOffset) * 0.75;

        if (p.y > height + 40) {
          p.y = -40;
          p.x = Math.random() * width;
        }
        if (p.y < -50) {
          p.y = height + 30;
          p.x = Math.random() * width;
        }
        if (p.x < -40) p.x = width + 40;
        if (p.x > width + 40) p.x = -40;

        drawPetal(p.x, p.y, p.size, p.angle, p.flip, p.color, p.alpha);
      });

      // 6. Ambient Ascending Micro-Hearts
      ambientHearts.forEach((ah) => {
        ah.swayOffset += ah.swaySpeed;
        ah.rotation += ah.rotSpeed;
        ah.y -= ah.speedY - scrollBreeze * 0.2;
        ah.x += Math.sin(ah.swayOffset) * 0.6;

        if (ah.y < -30) {
          ah.y = height + 30;
          ah.x = Math.random() * width;
        }

        drawMiniHeart(ah.x, ah.y, ah.size, ah.rotation, ah.color, ah.alpha);
      });

      // 7. Stardust Cursor / Touch Trail
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
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, tp.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // 8. Shockwave Ripple Rings
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += 4.5;
        sw.alpha -= 0.025;

        if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = sw.alpha;
        ctx.strokeStyle = sw.color;
        ctx.lineWidth = sw.lineWidth;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 9. Interactive Heart Bursts & Explosions
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

      // 10. Cosmic Vortex Climax
      for (let i = vortexParticles.length - 1; i >= 0; i--) {
        const vp = vortexParticles[i];
        vp.life++;
        vp.angle += vp.speed;
        vp.dist -= vp.radialSpeed;
        vp.alpha = Math.max(0, 1 - vp.life / vp.maxLife);

        if (vp.dist <= 15 || vp.alpha <= 0) {
          // Errupt into celebratory spark
          createHeartBurst(vp.centerX, vp.centerY, 12, false);
          vortexParticles.splice(i, 1);
          continue;
        }

        const px = vp.centerX + Math.cos(vp.angle) * vp.dist;
        const py = vp.centerY + Math.sin(vp.angle) * vp.dist;

        if (vp.isHeart) {
          drawMiniHeart(px, py, vp.size, vp.angle, vp.color, vp.alpha);
        } else {
          ctx.save();
          ctx.globalAlpha = vp.alpha;
          ctx.fillStyle = vp.color;
          ctx.beginPath();
          ctx.arc(px, py, vp.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // Event Listeners
    const handlePointerMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      pointer.targetX = clientX;
      pointer.targetY = clientY;
      pointer.active = true;
      addTrailParticle(clientX, clientY);
    };

    const handlePointerDown = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      pointer.isDown = true;
      pointer.active = true;
      createHeartBurst(clientX, clientY, 26, false);
    };

    const handlePointerUp = () => {
      pointer.isDown = false;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      scrollBreeze = Math.max(-5, Math.min(5, delta * 0.15));
      lastScrollY = currentScrollY;
    };

    window.addEventListener('resize', setCanvasSize);
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onBurstReady, onVortexReady]);

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
