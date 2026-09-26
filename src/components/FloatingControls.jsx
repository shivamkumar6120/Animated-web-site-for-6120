import React, { useState, useEffect } from 'react';
import { celestialAudio } from '../utils/audioSynth';

export default function FloatingControls({ herName, onUpdateName }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempName, setTempName] = useState(herName);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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

  const handleSaveName = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateName(tempName.trim());
      setShowNameModal(false);
    }
  };

  const handleCopyShareLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('name', herName);
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  return (
    <>
      {/* Floating Control Hub */}
      <div
        style={{
          position: 'fixed',
          top: 'max(14px, env(safe-area-inset-top, 14px))',
          right: 'max(14px, env(safe-area-inset-right, 14px))',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 100,
          touchAction: 'manipulation'
        }}
      >
        {/* Name Customizer Trigger */}
        <button
          onClick={() => {
            setTempName(herName);
            setShowNameModal(true);
          }}
          title="Change Her Name"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '9999px',
            background: 'rgba(15, 6, 26, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 117, 143, 0.35)',
            color: 'rgba(255, 220, 235, 0.95)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.78rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            outline: 'none',
            touchAction: 'manipulation'
          }}
        >
          <span>✍️</span>
          <span>{herName}</span>
        </button>

        {/* Audio Toggle with Animated Equalizer Bars */}
        <button
          onClick={toggleMusic}
          title={isPlaying ? 'Pause Music' : 'Play Celestial Ambient Music'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '9999px',
            background: 'rgba(15, 6, 26, 0.75)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 117, 143, 0.35)',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            outline: 'none',
            touchAction: 'manipulation'
          }}
        >
          {isPlaying ? (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '12px' }}>
              <div style={{ width: '2.5px', height: '100%', background: '#ff2d75', animation: 'equalizer 0.8s infinite 0.1s' }} />
              <div style={{ width: '2.5px', height: '100%', background: '#ff758f', animation: 'equalizer 0.8s infinite 0.3s' }} />
              <div style={{ width: '2.5px', height: '100%', background: '#9d4edd', animation: 'equalizer 0.8s infinite 0.5s' }} />
            </div>
          ) : (
            <span style={{ fontSize: '0.8rem' }}>🔇</span>
          )}
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.78rem', color: 'rgba(255, 220, 235, 0.95)' }}>
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
        >
          ▲
        </button>
      )}

      {/* Interactive Name Customization Modal */}
      {showNameModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowNameModal(false)}
        >
          <div
            style={{
              background: '#0d0519',
              border: '1px solid rgba(255, 117, 143, 0.35)',
              borderRadius: '24px',
              padding: '28px 22px',
              maxWidth: '380px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 45, 117, 0.25)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
                fontSize: '1.35rem',
                color: '#ffffff',
                marginBottom: '8px',
                textAlign: 'center'
              }}
            >
              Customize Her Name
            </h3>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: '0.82rem',
                color: 'rgba(255, 209, 225, 0.75)',
                marginBottom: '20px',
                textAlign: 'center'
              }}
            >
              Type her name below to update the entire romantic universe instantly:
            </p>

            <form onSubmit={handleSaveName} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter Her Name..."
                maxLength={30}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 117, 143, 0.4)',
                  color: '#ffffff',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '1.05rem',
                  outline: 'none',
                  textAlign: 'center'
                }}
                autoFocus
              />

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowNameModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #ff2d75, #9d4edd)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    boxShadow: '0 4px 20px rgba(255, 45, 117, 0.4)'
                  }}
                >
                  Update ✨
                </button>
              </div>
            </form>

            <div style={{ marginTop: '18px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '14px' }}>
              <button
                type="button"
                onClick={handleCopyShareLink}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ff758f',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {copiedLink ? '✓ Copied Shareable Link!' : '🔗 Copy Shareable Link for Nishi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
