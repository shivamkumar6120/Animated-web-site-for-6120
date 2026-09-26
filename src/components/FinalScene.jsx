import React, { useState } from 'react';
import { CONFIG } from '../config';
import { celestialAudio } from '../utils/audioSynth';

export default function FinalScene({ herName, triggerBurst, triggerVortex }) {
  const [loveShowerActive, setLoveShowerActive] = useState(false);
  const [showerCount, setShowerCount] = useState(0);

  const handleSendLove = (e) => {
    if (e && e.preventDefault && e.type === 'touchstart') {
      e.preventDefault();
    }
    setLoveShowerActive(true);
    setShowerCount((prev) => prev + 1);
    celestialAudio.playBurstChime();
    celestialAudio.playHeartbeat();

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.45;

    // 1. Trigger the cosmic particle vortex
    if (triggerVortex) {
      triggerVortex(centerX, centerY);
    }

    // 2. Trigger grand sequential particle fireworks
    if (triggerBurst) {
      triggerBurst(centerX, centerY, 80, true);
      setTimeout(() => triggerBurst(centerX - 120, centerY + 50, 50, false), 200);
      setTimeout(() => triggerBurst(centerX + 120, centerY + 50, 50, false), 400);
      setTimeout(() => triggerBurst(centerX, centerY - 90, 65, true), 650);
      setTimeout(() => triggerBurst(centerX, centerY, 90, true), 950);
    }

    setTimeout(() => {
      setLoveShowerActive(false);
    }, 2800);
  };

  return (
    <section
      id="finale"
      className="full-screen-height"
      style={{
        position: 'relative',
        padding: '100px 16px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        zIndex: 5
      }}
    >
      {/* Dynamic Cosmic Portal Aura */}
      <div
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(280px, 85vw, 750px)',
          height: 'clamp(280px, 85vw, 750px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 45, 117, 0.22) 0%, rgba(157, 78, 221, 0.16) 45%, rgba(6, 2, 12, 0) 75%)',
          filter: 'blur(55px)',
          animation: 'pulseGlow 6s ease-in-out infinite',
          pointerEvents: 'none'
        }}
      />

      {/* Rotating Nebula Rings */}
      <div
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(240px, 65vw, 500px)',
          height: 'clamp(240px, 65vw, 500px)',
          borderRadius: '50%',
          border: '1px dashed rgba(255, 117, 143, 0.3)',
          animation: 'spinSlow 40s linear infinite',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '42%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(280px, 75vw, 620px)',
          height: 'clamp(280px, 75vw, 620px)',
          borderRadius: '50%',
          border: '1px solid rgba(224, 170, 255, 0.2)',
          animation: 'spinSlowReverse 50s linear infinite',
          pointerEvents: 'none'
        }}
      />

      {/* Heart Centerpiece */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <svg
          viewBox="0 0 24 24"
          style={{
            width: 'clamp(70px, 18vw, 120px)',
            height: 'clamp(70px, 18vw, 120px)',
            filter: 'drop-shadow(0 0 30px rgba(255, 45, 117, 0.9)) drop-shadow(0 0 60px rgba(157, 78, 221, 0.6))',
            animation: loveShowerActive ? 'heartbeatRapid 0.7s infinite' : 'heartbeat 1.6s ease-in-out infinite',
            transition: 'all 0.3s ease'
          }}
        >
          <defs>
            <linearGradient id="finaleHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff5388" />
              <stop offset="50%" stopColor="#ff2d75" />
              <stop offset="100%" stopColor="#9d4edd" />
            </linearGradient>
          </defs>
          <path
            fill="url(#finaleHeartGrad)"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>

        <span
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            fontSize: '1.2rem',
            animation: 'floatSlow 3s ease-in-out infinite'
          }}
        >
          ✨
        </span>
        <span
          style={{
            position: 'absolute',
            bottom: '0',
            left: '-10px',
            fontSize: '1.2rem',
            animation: 'floatSlow 3.5s ease-in-out infinite 1s'
          }}
        >
          💖
        </span>
      </div>

      {/* Prominent Majestic Name */}
      <h2
        style={{
          fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
          fontSize: 'clamp(3rem, 14vw, 6.5rem)',
          fontWeight: 900,
          letterSpacing: '0.1em',
          background: 'linear-gradient(135deg, #ffffff 0%, #ffe0ec 35%, #ff5388 70%, #d4a5ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '24px',
          textShadow: '0 0 45px rgba(255, 45, 117, 0.75), 0 0 90px rgba(157, 78, 221, 0.5)',
          animation: 'letterGlowBreath 4s ease-in-out infinite alternate',
          cursor: 'pointer',
          touchAction: 'manipulation'
        }}
        onClick={handleSendLove}
        onTouchStart={handleSendLove}
        title="Tap to shower Nishi with love ❤️"
      >
        {herName}
      </h2>

      {/* Romantic Core Statement */}
      <div
        style={{
          maxWidth: '680px',
          width: '100%',
          padding: '24px 20px',
          borderRadius: '24px',
          background: 'rgba(15, 6, 26, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 117, 143, 0.25)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 25px rgba(255, 45, 117, 0.08)',
          marginBottom: '32px'
        }}
      >
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.35rem, 5vw, 2.3rem)',
            fontStyle: 'italic',
            lineHeight: 1.5,
            color: '#ffffff',
            textShadow: '0 0 25px rgba(255, 255, 255, 0.35)',
            marginBottom: '10px'
          }}
        >
          "{CONFIG.finalQuote}"
        </p>

        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)',
            color: 'rgba(255, 209, 225, 0.9)',
            letterSpacing: '0.04em'
          }}
        >
          {CONFIG.finalSubQuote}
        </p>
      </div>

      {/* Interactive "Send Her Endless Love" Button */}
      <button
        onClick={handleSendLove}
        onTouchStart={handleSendLove}
        style={{
          width: '100%',
          maxWidth: '320px',
          padding: '16px 28px',
          borderRadius: '9999px',
          background: 'linear-gradient(135deg, #ff2d75, #9d4edd)',
          color: '#ffffff',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 'clamp(0.85rem, 3vw, 0.95rem)',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 0 35px rgba(255, 45, 117, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.25)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          outline: 'none',
          marginBottom: '40px',
          touchAction: 'manipulation',
          transform: loveShowerActive ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 0.3s ease'
        }}
      >
        <span>Send Her My Endless Love</span>
        <span style={{ fontSize: '1.2rem', animation: 'heartbeat 1.2s infinite' }}>💖</span>
      </button>

      {showerCount > 0 && (
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.82rem',
            color: 'rgba(255, 182, 193, 0.9)',
            marginBottom: '32px',
            animation: 'fadeIn 0.5s ease'
          }}
        >
          ✨ Showered Nishi with love {showerCount} {showerCount === 1 ? 'time' : 'times'}
        </p>
      )}

      {/* Romantic Cinematic Ending Tag */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          maxWidth: '400px'
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.78rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.5)'
          }}
        >
          ETERNALLY YOURS
        </span>
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: '1.05rem',
            color: '#ffe49e'
          }}
        >
          Across all galaxies, horizons, and lifetimes.
        </span>
      </div>
    </section>
  );
}
