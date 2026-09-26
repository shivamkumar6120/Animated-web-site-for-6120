import React, { useEffect, useRef } from 'react';
import { CONFIG } from '../config';

export default function RomanticMessages({ triggerBurst }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.25 }
    );

    const cards = document.querySelectorAll('.romantic-message-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const handleCardClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (triggerBurst) {
      triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35, false);
    }
  };

  return (
    <section
      id="messages"
      ref={sectionRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '100px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 5
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.78rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(255, 143, 163, 0.8)',
            display: 'block',
            marginBottom: '12px'
          }}
        >
          WHISPERS AMONG THE STARS
        </span>
        <h2
          style={{
            fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            background: 'linear-gradient(135deg, #ffffff 20%, #ffe4f0 60%, #ff758f 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(255, 45, 117, 0.3)'
          }}
        >
          Words From My Soul
        </h2>
      </div>

      {/* Cinematic Message Cards */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '50px',
          maxWidth: '820px',
          width: '100%'
        }}
      >
        {CONFIG.romanticQuotes.map((quote, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div
              key={quote.id}
              className="romantic-message-card"
              onClick={handleCardClick}
              style={{
                alignSelf: isEven ? 'flex-start' : 'flex-end',
                maxWidth: '680px',
                width: '100%',
                background: 'rgba(15, 6, 26, 0.65)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 117, 143, 0.22)',
                borderRadius: '24px',
                padding: 'clamp(28px, 5vw, 42px)',
                position: 'relative',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 45, 117, 0.05)',
                cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isEven ? 'translateX(-30px)' : 'translateX(30px)',
                opacity: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px) scale(1.015)';
                e.currentTarget.style.borderColor = 'rgba(255, 117, 143, 0.55)';
                e.currentTarget.style.boxShadow = '0 20px 45px rgba(255, 45, 117, 0.25), inset 0 0 25px rgba(255, 45, 117, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.borderColor = 'rgba(255, 117, 143, 0.22)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 45, 117, 0.05)';
              }}
            >
              {/* Corner Glowing Accent */}
              <div
                style={{
                  position: 'absolute',
                  top: '-1px',
                  left: isEven ? '30px' : 'auto',
                  right: isEven ? 'auto' : '30px',
                  width: '60px',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #ff2d75, transparent)'
                }}
              />

              {/* Tag / Category */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px'
                }}
              >
                <span style={{ fontSize: '0.9rem', color: '#ff2d75' }}>✦</span>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '0.72rem',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: 'rgba(255, 182, 193, 0.75)'
                  }}
                >
                  {quote.tag}
                </span>
              </div>

              {/* Main Romantic Statement */}
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: 'clamp(1.25rem, 3.2vw, 1.85rem)',
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: '#ffffff',
                  marginBottom: '16px',
                  textShadow: '0 2px 15px rgba(255, 255, 255, 0.2)'
                }}
              >
                "{quote.text}"
              </p>

              {/* Subtext */}
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(0.85rem, 2vw, 0.95rem)',
                  color: 'rgba(255, 209, 220, 0.75)',
                  fontStyle: 'italic',
                  lineHeight: 1.6
                }}
              >
                — {quote.subtext}
              </p>

              {/* Little Floating Heart Icon */}
              <span
                style={{
                  position: 'absolute',
                  bottom: '18px',
                  right: '24px',
                  fontSize: '1rem',
                  opacity: 0.6,
                  transition: 'opacity 0.3s ease'
                }}
              >
                💕
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
