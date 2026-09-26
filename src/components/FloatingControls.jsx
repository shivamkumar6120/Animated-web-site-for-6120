import React, { useState, useEffect } from 'react';
import { celestialAudio } from '../utils/audioSynth';

export default function FloatingControls() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setIsPlaying(celestialAudio.isPlaying);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMusic = () => {
    const active = celestialAudio.toggle();
    setIsPlaying(active);
  };

  return (
    <>
      {/* Floating Audio Control */}
      <div
        style={{
          position: 'fixed',
          top: 'max(14px, env(safe-area-inset-top, 14px))',
          right: 'max(14px, env(safe-area-inset-right, 14px))',
          zIndex: 100,
          touchAction: 'manipulation'
        }}
      >
        <button
          onClick={toggleMusic}
          title={isPlaying ? 'Pause Music' : 'Play Celestial Ambient Music'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '9999px',
            background: 'rgba(15, 6, 26, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 117, 143, 0.35)',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            outline: 'none',
            touchAction: 'manipulation',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ff2d75';
            e.currentTarget.style.boxShadow = '0 4px 25px rgba(255, 45, 117, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 117, 143, 0.35)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
          }}
        >
          {isPlaying ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '12px' }}>
              <div style={{ width: '2.5px', height: '100%', background: '#ff2d75', animation: 'equalizer 0.8s infinite 0.1s' }} />
              <div style={{ width: '2.5px', height: '100%', background: '#ff758f', animation: 'equalizer 0.8s infinite 0.3s' }} />
              <div style={{ width: '2.5px', height: '100%', background: '#9d4edd', animation: 'equalizer 0.8s infinite 0.5s' }} />
            </div>
          ) : (
            <span style={{ fontSize: '0.85rem' }}>🔇</span>
          )}
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 500,
              color: 'rgba(255, 220, 235, 0.95)',
              letterSpacing: '0.04em'
            }}
          >
            {isPlaying ? 'Music On' : 'Music Off'}
          </span>
        </button>
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Return to Beginning"
          style={{
            position: 'fixed',
            bottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
            right: 'max(20px, env(safe-area-inset-right, 20px))',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(25, 10, 40, 0.8)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 117, 143, 0.4)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 90,
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
            transition: 'all 0.3s ease',
            touchAction: 'manipulation'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#ff2d75';
            e.currentTarget.style.transform = 'scale(1.1) translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 117, 143, 0.4)';
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
          }}
        >
          ▲
        </button>
      )}
    </>
  );
}
