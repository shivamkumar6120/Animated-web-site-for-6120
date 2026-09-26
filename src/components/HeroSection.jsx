import React, { useState, useCallback } from 'react';
import ParticleNameFormation from './ParticleNameFormation';

export default function HeroSection({ herName, triggerBurst }) {
  const [isExplosionDone, setIsExplosionDone] = useState(false);

  const handleParticleComplete = useCallback(() => {
    setIsExplosionDone(true);
  }, []);

  return (
    <section
      id="hero"
      className="full-screen-height"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 16px 70px',
        textAlign: 'center',
        zIndex: 5
      }}
    >
      {/* Soft celestial halo behind name */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(260px, 75vw, 650px)',
          height: 'clamp(260px, 75vw, 650px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 45, 117, 0.2) 0%, rgba(157, 78, 221, 0.12) 40%, rgba(6, 2, 12, 0) 75%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          animation: 'pulseGlow 5s ease-in-out infinite'
        }}
      />

      {/* Floating Constellation Crown above name */}
      <div
        style={{
          marginBottom: '12px',
          opacity: isExplosionDone ? 1 : 0.6,
          transition: 'all 1s ease',
          transform: isExplosionDone ? 'scale(1)' : 'scale(0.85)'
        }}
      >
        <span
          style={{
            display: 'inline-block',
            fontSize: 'clamp(1.5rem, 5vw, 2.1rem)',
            animation: 'floatSlow 4s ease-in-out infinite',
            filter: 'drop-shadow(0 0 15px #ff2d75)'
          }}
        >
          👑
        </span>
      </div>

      {/* Pre-title tag */}
      <div
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 'clamp(0.7rem, 2.2vw, 0.88rem)',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(255, 209, 220, 0.85)',
          marginBottom: '10px',
          textShadow: '0 0 15px rgba(255, 117, 143, 0.5)'
        }}
      >
        TO THE QUEEN OF MY HEART
      </div>

      {/* Particle-Based Name Formation */}
      <ParticleNameFormation
        herName={herName}
        onComplete={handleParticleComplete}
        triggerBurst={triggerBurst}
      />

      {/* Romantic Subtitle */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.15rem, 4vw, 1.85rem)',
          fontStyle: 'italic',
          color: 'rgba(255, 229, 240, 0.92)',
          maxWidth: '650px',
          lineHeight: 1.55,
          marginTop: '16px',
          marginBottom: '26px',
          padding: '0 12px',
          textShadow: '0 0 20px rgba(255, 45, 117, 0.35)',
          opacity: isExplosionDone ? 1 : 0,
          transform: isExplosionDone ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
        }}
      >
        "In a sky overflowing with countless stars, my heart will always gravitate to you."
      </p>

      {/* Floating Interactive Hearts Bar */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 12px',
          opacity: isExplosionDone ? 1 : 0,
          transition: 'opacity 1.2s ease 0.6s'
        }}
      >
        <span style={{ fontSize: '1rem', animation: 'floatSlow 3s ease-in-out infinite' }}>
          💖
        </span>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(0.72rem, 2.5vw, 0.85rem)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255, 182, 193, 0.85)'
          }}
        >
          You make eternity feel like a moment
        </span>
        <span style={{ fontSize: '1rem', animation: 'floatSlow 3s ease-in-out infinite 1.5s' }}>
          ✨
        </span>
      </div>

      {/* Scroll Down Indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '18px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          opacity: isExplosionDone ? 0.75 : 0,
          transition: 'opacity 1.5s ease 0.9s',
          cursor: 'pointer',
          touchAction: 'manipulation'
        }}
        onClick={() => {
          document.getElementById('interactive-heart')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.68rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.6)'
          }}
        >
          Scroll Into Our Journey
        </span>
        <div
          style={{
            width: '20px',
            height: '32px',
            borderRadius: '16px',
            border: '2px solid rgba(255, 117, 143, 0.5)',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '5px'
          }}
        >
          <div
            style={{
              width: '3px',
              height: '6px',
              borderRadius: '2px',
              backgroundColor: '#ff2d75',
              boxShadow: '0 0 8px #ff2d75',
              animation: 'scrollWheel 1.8s ease-in-out infinite'
            }}
          />
        </div>
      </div>
    </section>
  );
}
