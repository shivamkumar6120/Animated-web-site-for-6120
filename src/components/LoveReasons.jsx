import React, { useState } from 'react';
import { CONFIG } from '../config';
import { celestialAudio } from '../utils/audioSynth';

export default function LoveReasons({ herName, triggerBurst }) {
  const [activeReason, setActiveReason] = useState(null);

  const handleCardClick = (idx, e) => {
    setActiveReason(activeReason === idx ? null : idx);
    celestialAudio.playBurstChime();
    if (triggerBurst) {
      const rect = e.currentTarget.getBoundingClientRect();
      triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35, false);
    }
  };

  return (
    <section
      id="reasons"
      style={{
        position: 'relative',
        minHeight: '90vh',
        padding: '100px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 45, 117, 0.08) 0%, rgba(157, 78, 221, 0.06) 50%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '55px' }}>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.78rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(255, 117, 143, 0.85)',
            display: 'block',
            marginBottom: '12px'
          }}
        >
          AN INFINITE GALAXY OF REASONS
        </span>
        <h2
          style={{
            fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            background: 'linear-gradient(135deg, #ffffff 10%, #ffd166 60%, #ff758f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255, 209, 102, 0.3)'
          }}
        >
          Why You Are My Universe
        </h2>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            fontStyle: 'italic',
            color: 'rgba(255, 220, 235, 0.8)',
            maxWidth: '540px',
            margin: '12px auto 0'
          }}
        >
          "I could search the heavens for a thousand years and never find another soul like yours."
        </p>
      </div>

      {/* Interactive Grid of Crystal Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          maxWidth: '1000px',
          width: '100%'
        }}
      >
        {CONFIG.reasons.map((reason, idx) => {
          const isSelected = activeReason === idx;

          return (
            <div
              key={reason.id}
              onClick={(e) => handleCardClick(idx, e)}
              style={{
                background: isSelected ? 'rgba(28, 12, 45, 0.75)' : 'rgba(15, 6, 26, 0.55)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: `1px solid ${isSelected ? reason.glow : 'rgba(255, 255, 255, 0.12)'}`,
                borderRadius: '20px',
                padding: '30px 26px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isSelected ? 'translateY(-6px) scale(1.02)' : 'translateY(0)',
                boxShadow: isSelected
                  ? `0 12px 35px ${reason.glow}33, inset 0 0 20px ${reason.glow}1a`
                  : '0 8px 25px rgba(0, 0, 0, 0.35)'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = reason.glow;
                  e.currentTarget.style.boxShadow = `0 10px 30px ${reason.glow}26`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.35)';
                }
              }}
            >
              {/* Subtle top indicator bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, transparent, ${reason.glow}, transparent)`
                }}
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#ffffff'
                  }}
                >
                  {reason.title}
                </h3>
                <span style={{ fontSize: '1.1rem', color: reason.glow }}>✦</span>
              </div>

              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '0.92rem',
                  lineHeight: 1.65,
                  color: 'rgba(255, 225, 238, 0.88)'
                }}
              >
                {reason.text}
              </p>

              <div
                style={{
                  marginTop: '18px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.72rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: reason.glow,
                    opacity: 0.85
                  }}
                >
                  {isSelected ? 'Tapped with love' : 'Tap to cherish'}
                </span>
                <span style={{ fontSize: '0.8rem', color: reason.glow }}>❤️</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
