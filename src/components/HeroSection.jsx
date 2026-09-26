import React, { useState, useEffect } from 'react';

export default function HeroSection({ herName, triggerBurst }) {
  const [lettersVisible, setLettersVisible] = useState([]);
  const [isExplosionDone, setIsExplosionDone] = useState(false);

  const letters = herName.split('');

  useEffect(() => {
    // Letter-by-letter reveal with stagger
    letters.forEach((_, index) => {
      setTimeout(() => {
        setLettersVisible((prev) => [...prev, index]);
        // When the last letter lands, trigger a grand heart explosion!
        if (index === letters.length - 1) {
          setTimeout(() => {
            setIsExplosionDone(true);
            if (triggerBurst) {
              const heroRect = document.getElementById('name-container')?.getBoundingClientRect();
              const centerX = heroRect ? heroRect.left + heroRect.width / 2 : window.innerWidth / 2;
              const centerY = heroRect ? heroRect.top + heroRect.height / 2 : window.innerHeight / 2;
              triggerBurst(centerX, centerY, 70, true);
            }
          }, 350);
        }
      }, 300 + index * 160);
    });
  }, [herName, triggerBurst]);

  const handleNameClick = (e) => {
    if (triggerBurst) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      triggerBurst(clientX, clientY, 45, true);
    }
  };

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
        padding: '60px 16px 80px',
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
          background: 'radial-gradient(circle, rgba(255, 45, 117, 0.18) 0%, rgba(157, 78, 221, 0.12) 40%, rgba(6, 2, 12, 0) 75%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          animation: 'pulseGlow 5s ease-in-out infinite'
        }}
      />

      {/* Floating Constellation Crown above name */}
      <div
        style={{
          marginBottom: '16px',
          opacity: isExplosionDone ? 1 : 0.6,
          transition: 'all 1s ease',
          transform: isExplosionDone ? 'scale(1)' : 'scale(0.85)'
        }}
      >
        <span
          style={{
            display: 'inline-block',
            fontSize: 'clamp(1.5rem, 5vw, 2rem)',
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
          fontSize: 'clamp(0.7rem, 2.2vw, 0.9rem)',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(255, 209, 220, 0.85)',
          marginBottom: '14px',
          textShadow: '0 0 15px rgba(255, 117, 143, 0.5)'
        }}
      >
        TO THE QUEEN OF MY HEART
      </div>

      {/* Dramatic Name Reveal Container */}
      <div
        id="name-container"
        onClick={handleNameClick}
        onTouchStart={handleNameClick}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'nowrap',
          cursor: 'pointer',
          padding: '8px 16px',
          borderRadius: '24px',
          transition: 'transform 0.4s ease',
          touchAction: 'manipulation'
        }}
        title="Tap her name for stardust ✨"
      >
        {letters.map((char, index) => {
          const isVisible = lettersVisible.includes(index);
          return (
            <span
              key={index}
              style={{
                fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
                fontSize: 'clamp(3rem, 14vw, 7.5rem)',
                fontWeight: 900,
                letterSpacing: '0.06em',
                display: 'inline-block',
                position: 'relative',
                transition: 'all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(35px) scale(0.6)',
                background: 'linear-gradient(135deg, #ffffff 0%, #ffe0ec 30%, #ff5388 65%, #c77dff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: isExplosionDone
                  ? '0 0 35px rgba(255, 45, 117, 0.7), 0 0 70px rgba(157, 78, 221, 0.4)'
                  : '0 0 20px rgba(255, 255, 255, 0.5)',
                animation: isExplosionDone
                  ? `letterGlowBreath 3.5s ease-in-out infinite alternate ${index * 0.12}s`
                  : 'none',
                margin: char === ' ' ? '0 12px' : '0 2px'
              }}
            >
              {char}
              {/* Micro-sparkle orbital dot */}
              {isVisible && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-2px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: '#ffe49e',
                    boxShadow: '0 0 8px #ffd166, 0 0 14px #ff758f',
                    animation: `pulseGlow 2s ease-in-out infinite alternate ${index * 0.2}s`
                  }}
                />
              )}
            </span>
          );
        })}
      </div>

      {/* Romantic Subtitle */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.15rem, 4vw, 1.85rem)',
          fontStyle: 'italic',
          color: 'rgba(255, 229, 240, 0.92)',
          maxWidth: '650px',
          lineHeight: 1.55,
          marginTop: '18px',
          marginBottom: '28px',
          padding: '0 12px',
          textShadow: '0 0 20px rgba(255, 45, 117, 0.35)',
          opacity: isExplosionDone ? 1 : 0,
          transform: isExplosionDone ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s'
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
          transition: 'opacity 1.2s ease 0.8s'
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
          bottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          opacity: isExplosionDone ? 0.75 : 0,
          transition: 'opacity 1.5s ease 1.2s',
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
