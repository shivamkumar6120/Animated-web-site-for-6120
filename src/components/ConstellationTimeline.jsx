import React, { useState } from 'react';
import { CONFIG } from '../config';
import { celestialAudio } from '../utils/audioSynth';

export default function ConstellationTimeline({ triggerBurst }) {
  const [activeMilestone, setActiveMilestone] = useState(0);

  const handleMilestoneClick = (index, e) => {
    setActiveMilestone(index);
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
        padding: '80px 16px',
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
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(280px, 80vw, 600px)',
          height: 'clamp(280px, 80vw, 600px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(157, 78, 221, 0.12) 0%, rgba(255, 45, 117, 0.08) 50%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px', padding: '0 10px' }}>
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
          Constellation of Moments
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
          "We do not need photographs when every memory is etched into the starlight."
        </p>
      </div>

      {/* Interactive Constellation Tracker (Timeline) */}
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
                {/* Responsive Layout Wrapper */}
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

                  {/* Empty Spacer on desktop */}
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
