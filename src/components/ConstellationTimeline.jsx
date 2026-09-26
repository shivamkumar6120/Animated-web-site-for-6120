import React, { useState } from 'react';
import { CONFIG } from '../config';
import { celestialAudio } from '../utils/audioSynth';

export default function ConstellationTimeline({ triggerBurst }) {
  const [activeMilestone, setActiveMilestone] = useState(0);

  // Heart-shaped constellation star coordinates
  // Beautiful parametric heart geometry
  const constellationStars = [
    { id: 0, x: 160, y: 75, label: 'The Spark', icon: '✨' },
    { id: 1, x: 235, y: 55, label: 'Whispers', icon: '🌙' },
    { id: 2, x: 285, y: 110, label: 'Warmth', icon: '💫' },
    { id: 3, x: 250, y: 180, label: 'Sanctuary', icon: '🌌' },
    { id: 4, x: 160, y: 245, label: 'Forever', icon: '💖' },
    { id: 5, x: 70, y: 180, label: 'Devotion', icon: '⭐' },
    { id: 6, x: 35, y: 110, label: 'Kindred', icon: '✨' },
    { id: 7, x: 85, y: 55, label: 'Orbit', icon: '💫' }
  ];

  const handleMilestoneClick = (index, e) => {
    const validIndex = index % CONFIG.milestones.length;
    setActiveMilestone(validIndex);
    celestialAudio.playBurstChime();
    
    if (triggerBurst && e) {
      const rect = e.currentTarget.getBoundingClientRect();
      triggerBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 40, false);
    }
  };

  return (
    <section
      id="constellation"
      style={{
        position: 'relative',
        minHeight: '100vh',
        padding: '70px 16px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 5
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(280px, 80vw, 600px)',
          height: 'clamp(280px, 80vw, 600px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(157, 78, 221, 0.14) 0%, rgba(255, 45, 117, 0.08) 50%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px', padding: '0 10px' }}>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(0.7rem, 2vw, 0.78rem)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(224, 170, 255, 0.85)',
            display: 'block',
            marginBottom: '10px'
          }}
        >
          OUR STORY WRITTEN IN THE STARS
        </span>
        <h2
          style={{
            fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
            fontSize: 'clamp(1.8rem, 5vw, 3.2rem)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            background: 'linear-gradient(135deg, #ffffff 20%, #f3d2ff 60%, #c77dff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(157, 78, 221, 0.4)'
          }}
        >
          Heart-Shaped Constellation
        </h2>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(0.95rem, 2.5vw, 1.3rem)',
            fontStyle: 'italic',
            color: 'rgba(255, 220, 240, 0.8)',
            maxWidth: '520px',
            margin: '10px auto 0'
          }}
        >
          "We do not need photographs when every memory is etched into our celestial chart."
        </p>
      </div>

      {/* INTERACTIVE HEART-SHAPED CELESTIAL CONSTELLATION CHART */}
      <div
        style={{
          position: 'relative',
          width: 'clamp(280px, 85vw, 380px)',
          height: 'clamp(240px, 75vw, 310px)',
          marginBottom: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg
          viewBox="0 0 320 280"
          style={{
            width: '100%',
            height: '100%',
            overflow: 'visible',
            filter: 'drop-shadow(0 0 20px rgba(255, 45, 117, 0.25))'
          }}
        >
          {/* Constellation Connecting Heart Beams */}
          <path
            d="M 160 75 L 235 55 L 285 110 L 250 180 L 160 245 L 70 180 L 35 110 L 85 55 Z"
            fill="rgba(255, 45, 117, 0.03)"
            stroke="rgba(255, 117, 143, 0.35)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            style={{ animation: 'spinSlow 60s linear infinite', transformOrigin: '160px 140px' }}
          />

          {/* Internal Starlight Harmonic Cross-lines */}
          <line x1="160" y1="75" x2="160" y2="245" stroke="rgba(224, 170, 255, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="35" y1="110" x2="285" y2="110" stroke="rgba(224, 170, 255, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="85" y1="55" x2="250" y2="180" stroke="rgba(255, 117, 143, 0.15)" strokeWidth="1" />
          <line x1="235" y1="55" x2="70" y2="180" stroke="rgba(255, 117, 143, 0.15)" strokeWidth="1" />

          {/* Constellation Star Nodes */}
          {constellationStars.map((star, idx) => {
            const isMilestoneActive = activeMilestone === (idx % CONFIG.milestones.length);

            return (
              <g
                key={star.id}
                onClick={(e) => handleMilestoneClick(idx, e)}
                style={{ cursor: 'pointer' }}
              >
                {/* Active Pulsing Ring */}
                {isMilestoneActive && (
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r="16"
                    fill="none"
                    stroke="#ff2d75"
                    strokeWidth="1.5"
                    style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}
                  />
                )}

                {/* Starlight Aura */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={isMilestoneActive ? 9 : 5}
                  fill={isMilestoneActive ? '#ff2d75' : '#ffe49e'}
                  style={{
                    filter: isMilestoneActive
                      ? 'drop-shadow(0 0 10px #ff2d75) drop-shadow(0 0 20px #9d4edd)'
                      : 'drop-shadow(0 0 5px #ffd166)',
                    transition: 'all 0.3s ease'
                  }}
                />

                {/* Star center diamond */}
                <circle cx={star.x} cy={star.y} r="2.5" fill="#ffffff" />
              </g>
            );
          })}
        </svg>

        <span
          style={{
            position: 'absolute',
            bottom: '-12px',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255, 182, 193, 0.75)'
          }}
        >
          ✦ Tap any star to trace our journey ✦
        </span>
      </div>

      {/* Responsive Constellation Timeline Tracker */}
      <div
        className="timeline-container"
        style={{
          position: 'relative',
          maxWidth: '900px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Animated Connecting Starlight Spine */}
        <div
          className="timeline-spine"
          style={{
            position: 'absolute',
            top: '30px',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '2px',
            background: 'linear-gradient(180deg, #ff2d75 0%, #9d4edd 50%, #ffe49e 100%)',
            boxShadow: '0 0 15px #ff2d75, 0 0 30px #9d4edd',
            zIndex: 1
          }}
        />

        {/* Milestone Nodes */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '50px', zIndex: 2 }}>
          {CONFIG.milestones.map((milestone, idx) => {
            const isLeft = idx % 2 === 0;
            const isActive = activeMilestone === idx;

            return (
              <div
                key={milestone.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  position: 'relative'
                }}
              >
                <div
                  className="timeline-item-wrapper"
                  style={{
                    display: 'flex',
                    flexDirection: isLeft ? 'row' : 'row-reverse',
                    alignItems: 'center',
                    width: '100%',
                    justifyContent: 'space-between',
                    gap: '20px',
                    position: 'relative'
                  }}
                >
                  {/* Card Content */}
                  <div
                    className="timeline-card"
                    onClick={(e) => handleMilestoneClick(idx, e)}
                    style={{
                      flex: 1,
                      maxWidth: '380px',
                      background: isActive ? 'rgba(26, 10, 42, 0.85)' : 'rgba(15, 6, 26, 0.65)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: isActive
                        ? '1px solid rgba(255, 117, 143, 0.75)'
                        : '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '20px',
                      padding: '24px 26px',
                      boxShadow: isActive
                        ? '0 10px 35px rgba(255, 45, 117, 0.3), inset 0 0 20px rgba(255, 45, 117, 0.15)'
                        : '0 8px 25px rgba(0, 0, 0, 0.35)',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isActive ? 'scale(1.02)' : 'scale(1)',
                      textAlign: isLeft ? 'right' : 'left'
                    }}
                  >
                    <div
                      className="timeline-header"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isLeft ? 'flex-end' : 'flex-start',
                        gap: '8px',
                        marginBottom: '8px'
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          fontSize: '0.72rem',
                          letterSpacing: '0.22em',
                          textTransform: 'uppercase',
                          color: '#ff758f'
                        }}
                      >
                        {milestone.date}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontFamily: "'Cinzel', 'Cormorant Garamond', serif",
                        fontSize: 'clamp(1.2rem, 3.5vw, 1.45rem)',
                        fontWeight: 600,
                        color: '#ffffff',
                        marginBottom: '8px'
                      }}
                    >
                      {milestone.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 'clamp(0.85rem, 2.5vw, 0.92rem)',
                        color: 'rgba(255, 220, 235, 0.85)',
                        lineHeight: 1.6,
                        marginBottom: '10px'
                      }}
                    >
                      {milestone.description}
                    </p>

                    <p
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontStyle: 'italic',
                        fontSize: 'clamp(0.95rem, 2.8vw, 1.1rem)',
                        color: '#ffe49e',
                        textShadow: '0 0 10px rgba(255, 228, 158, 0.4)'
                      }}
                    >
                      {milestone.quote}
                    </p>
                  </div>

                  {/* Central Constellation Star Node */}
                  <div
                    className="timeline-node"
                    onClick={(e) => handleMilestoneClick(idx, e)}
                    style={{
                      position: 'relative',
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: isActive
                        ? 'radial-gradient(circle, #ff2d75 0%, #9d4edd 100%)'
                        : 'rgba(15, 6, 26, 0.95)',
                      border: isActive
                        ? '2px solid #ffffff'
                        : '2px solid rgba(255, 117, 143, 0.5)',
                      boxShadow: isActive
                        ? '0 0 25px #ff2d75, 0 0 45px #9d4edd'
                        : '0 0 10px rgba(255, 45, 117, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 3,
                      transition: 'all 0.4s ease',
                      transform: isActive ? 'scale(1.15)' : 'scale(1)',
                      flexShrink: 0
                    }}
                  >
                    <span style={{ fontSize: '1.15rem' }}>
                      {milestone.icon}
                    </span>

                    {isActive && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: '-6px',
                          borderRadius: '50%',
                          border: '1px dashed rgba(255, 228, 158, 0.8)',
                          animation: 'spinSlow 6s linear infinite'
                        }}
                      />
                    )}
                  </div>

                  {/* Spacer for desktop */}
                  <div style={{ flex: 1, maxWidth: '380px' }} className="desktop-only" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
