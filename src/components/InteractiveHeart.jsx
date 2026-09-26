import React, { useState } from 'react';
import { celestialAudio } from '../utils/audioSynth';

export default function InteractiveHeart({ herName, triggerBurst }) {
  const [pulseCount, setPulseCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [lastMessage, setLastMessage] = useState('Touch my heart to feel it beat for you');

  const messages = [
    'Every single beat belongs to you, Nishi.',
    'You are the reason my pulse races.',
    'A million beats, and each one whispers your name.',
    'My heart found its true rhythm the day we met.',
    'Forever bound to your orbit, my love.'
  ];

  const handleHeartInteraction = (e) => {
    if (e && e.type === 'touchstart' && e.cancelable) {
      // allow default scroll unless double tap
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Trigger grand explosion of hearts and sparkles
    if (triggerBurst) {
      triggerBurst(centerX, centerY, 55, true);
    }

    // Play heartbeat audio + burst chime + mobile haptic vibration!
    celestialAudio.playHeartbeat();
    celestialAudio.playBurstChime();

    setPulseCount((prev) => prev + 1);
    setLastMessage(messages[(pulseCount + 1) % messages.length]);
  };

  return (
    <section
      id="interactive-heart"
      style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 16px',
        textAlign: 'center',
        zIndex: 5
      }}
    >
      {/* Background Soft Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isHovered ? 'clamp(280px, 80vw, 480px)' : 'clamp(240px, 70vw, 380px)',
          height: isHovered ? 'clamp(280px, 80vw, 480px)' : 'clamp(240px, 70vw, 380px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 45, 117, 0.25) 0%, rgba(157, 78, 221, 0.12) 50%, transparent 70%)',
          filter: 'blur(50px)',
          transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none'
        }}
      />

      {/* Decorative Constellation Rings */}
      <div
        style={{
          position: 'absolute',
          width: 'clamp(240px, 70vw, 320px)',
          height: 'clamp(240px, 70vw, 320px)',
          borderRadius: '50%',
          border: '1px dashed rgba(255, 117, 143, 0.2)',
          animation: 'spinSlow 35s linear infinite',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 'clamp(280px, 80vw, 380px)',
          height: 'clamp(280px, 80vw, 380px)',
          borderRadius: '50%',
          border: '1px solid rgba(157, 78, 221, 0.15)',
          animation: 'spinSlowReverse 45s linear infinite',
          pointerEvents: 'none'
        }}
      />

      {/* Tag */}
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 'clamp(0.7rem, 2.2vw, 0.8rem)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(255, 143, 163, 0.85)',
          marginBottom: '12px'
        }}
      >
        THE CORE OF MY UNIVERSE
      </span>

      <h2
        style={{
          fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
          fontSize: 'clamp(1.8rem, 5.5vw, 2.8rem)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: '#ffffff',
          marginBottom: '10px',
          textShadow: '0 0 25px rgba(255, 45, 117, 0.4)'
        }}
      >
        Listen To My Heart
      </h2>

      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.05rem, 3.5vw, 1.35rem)',
          fontStyle: 'italic',
          color: 'rgba(255, 215, 230, 0.85)',
          maxWidth: '520px',
          marginBottom: '32px',
          padding: '0 12px'
        }}
      >
        "{lastMessage}"
      </p>

      {/* Main Interactive Heart Element */}
      <div
        onClick={handleHeartInteraction}
        onTouchStart={handleHeartInteraction}
        onMouseEnter={() => {
          setIsHovered(true);
          celestialAudio.playHeartbeat();
        }}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'relative',
          width: 'clamp(150px, 45vw, 220px)',
          height: 'clamp(150px, 45vw, 220px)',
          cursor: 'pointer',
          transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          touchAction: 'manipulation'
        }}
      >
        {/* Pulsing Aura SVG */}
        <svg
          viewBox="0 0 24 24"
          style={{
            width: '100%',
            height: '100%',
            filter: isHovered
              ? 'drop-shadow(0 0 35px rgba(255, 45, 117, 0.95)) drop-shadow(0 0 70px rgba(255, 117, 143, 0.8))'
              : 'drop-shadow(0 0 20px rgba(255, 45, 117, 0.65)) drop-shadow(0 0 40px rgba(157, 78, 221, 0.4))',
            animation: isHovered ? 'heartbeatRapid 0.85s infinite' : 'heartbeat 1.6s infinite',
            transition: 'filter 0.4s ease'
          }}
        >
          <defs>
            <linearGradient id="mainHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d6d" />
              <stop offset="45%" stopColor="#ff2d75" />
              <stop offset="85%" stopColor="#e61e5c" />
              <stop offset="100%" stopColor="#9d4edd" />
            </linearGradient>

            <radialGradient id="heartShine" cx="35%" cy="30%" r="40%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0.0" />
            </radialGradient>
          </defs>

          <path
            fill="url(#mainHeartGrad)"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />

          <path
            fill="url(#heartShine)"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>

        {/* Floating sparkles */}
        <span
          style={{
            position: 'absolute',
            top: '8%',
            left: '12%',
            fontSize: '1rem',
            animation: 'floatSlow 2.5s ease-in-out infinite',
            pointerEvents: 'none'
          }}
        >
          ✨
        </span>
        <span
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '10%',
            fontSize: '1.1rem',
            animation: 'floatSlow 3s ease-in-out infinite 1s',
            pointerEvents: 'none'
          }}
        >
          💖
        </span>
      </div>

      {/* Pulse Counter Badge */}
      <div
        style={{
          marginTop: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 20px',
          borderRadius: '9999px',
          background: 'rgba(255, 45, 117, 0.12)',
          border: '1px solid rgba(255, 117, 143, 0.3)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          maxWidth: '90vw'
        }}
      >
        <span style={{ fontSize: '1rem', color: '#ff2d75', animation: 'heartbeat 1.4s infinite' }}>
          💓
        </span>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(0.78rem, 2.5vw, 0.85rem)',
            fontWeight: 500,
            color: 'rgba(255, 220, 235, 0.9)'
          }}
        >
          {pulseCount === 0
            ? 'Tap the heart to unleash a shower of love'
            : `Beating for ${herName}: ${pulseCount} ${pulseCount === 1 ? 'time' : 'times'}`}
        </span>
      </div>
    </section>
  );
}
