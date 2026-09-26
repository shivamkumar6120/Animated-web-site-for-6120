import React, { useState, useEffect } from 'react';
import { celestialAudio } from '../utils/audioSynth';

export default function TapToBeginModal({ onEnter, herName }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRevealed(true);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = (e) => {
    if (e && e.preventDefault && e.type === 'touchstart') {
      e.preventDefault();
    }
    if (isExiting) return;

    setIsExiting(true);
    celestialAudio.start();
    celestialAudio.playBurstChime();

    setTimeout(() => {
      onEnter();
    }, 1000);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-1000 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundColor: '#05020a',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '24px 20px',
        touchAction: 'manipulation'
      }}
    >
      {/* Background ambient radial glow */}
      <div
        style={{
          position: 'absolute',
          width: 'clamp(280px, 85vw, 500px)',
          height: 'clamp(280px, 85vw, 500px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,45,117,0.2) 0%, rgba(157,78,221,0.08) 50%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'pulseGlow 4s ease-in-out infinite',
          pointerEvents: 'none'
        }}
      />

      {/* Floating Constellation Rings */}
      <div
        style={{
          position: 'absolute',
          width: 'clamp(240px, 70vw, 320px)',
          height: 'clamp(240px, 70vw, 320px)',
          borderRadius: '50%',
          border: '1px solid rgba(255, 117, 143, 0.25)',
          animation: 'spinSlow 22s linear infinite',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 'clamp(280px, 80vw, 380px)',
          height: 'clamp(280px, 80vw, 380px)',
          borderRadius: '50%',
          border: '1px dashed rgba(224, 170, 255, 0.2)',
          animation: 'spinSlowReverse 30s linear infinite',
          pointerEvents: 'none'
        }}
      />

      {/* Center glowing crystal heart */}
      <div
        className={`transition-all duration-1000 transform ${
          isRevealed ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-6'
        }`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '420px'
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 'clamp(75px, 20vw, 95px)',
            height: 'clamp(75px, 20vw, 95px)',
            marginBottom: '26px',
            cursor: 'pointer'
          }}
          onClick={handleStart}
          onTouchStart={handleStart}
        >
          <svg
            viewBox="0 0 24 24"
            fill="url(#openingHeartGrad)"
            style={{
              width: '100%',
              height: '100%',
              filter: 'drop-shadow(0 0 25px rgba(255, 45, 117, 0.85)) drop-shadow(0 0 50px rgba(157, 78, 221, 0.5))',
              animation: 'heartbeat 1.8s ease-in-out infinite'
            }}
          >
            <defs>
              <linearGradient id="openingHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff5388" />
                <stop offset="50%" stopColor="#ff2d75" />
                <stop offset="100%" stopColor="#9d4edd" />
              </linearGradient>
            </defs>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>

        {/* Tag text */}
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(0.72rem, 2.2vw, 0.85rem)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(255, 209, 220, 0.75)',
            marginBottom: '8px'
          }}
        >
          A Private Cinematic Universe
        </p>

        <h1
          style={{
            fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
            fontSize: 'clamp(1.9rem, 7vw, 3rem)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            background: 'linear-gradient(135deg, #ffffff 0%, #ffe4f0 40%, #ff8fa3 75%, #e0aaff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            marginBottom: '16px',
            textShadow: '0 0 30px rgba(255, 77, 109, 0.35)'
          }}
        >
          Created for {herName}
        </h1>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 'clamp(1.05rem, 3.5vw, 1.35rem)',
            color: 'rgba(255, 220, 235, 0.85)',
            textAlign: 'center',
            lineHeight: 1.55,
            marginBottom: '32px',
            padding: '0 10px'
          }}
        >
          "In every star, across all quiet midnight skies, I looked for you."
        </p>

        {/* Enter Button */}
        <button
          onClick={handleStart}
          onTouchStart={handleStart}
          style={{
            width: '100%',
            maxWidth: '280px',
            padding: '16px 36px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(255, 45, 117, 0.9), rgba(157, 78, 221, 0.9))',
            color: '#ffffff',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: 'clamp(0.9rem, 3vw, 1rem)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 0 30px rgba(255, 45, 117, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.2)',
            cursor: 'pointer',
            outline: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            touchAction: 'manipulation'
          }}
        >
          <span>Tap to Begin</span>
          <span style={{ fontSize: '1.2rem', animation: 'heartbeat 1.4s infinite' }}>❤️</span>
        </button>

        <span
          style={{
            marginTop: '16px',
            fontSize: 'clamp(0.7rem, 2.2vw, 0.76rem)',
            color: 'rgba(255, 255, 255, 0.5)',
            letterSpacing: '0.08em',
            textAlign: 'center'
          }}
        >
          ✨ Sound enabled for a cinematic experience
        </span>
      </div>
    </div>
  );
}
