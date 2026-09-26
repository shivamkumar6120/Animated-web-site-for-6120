import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ onClose }) {
  const [sessions, setSessions] = useState([]);
  const [whispers, setWhispers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/track?secret=shivam6120');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
        setWhispers(data.whispers || []);
      } else {
        // Fallback to local storage
        loadFromLocalStorage();
      }
    } catch (err) {
      loadFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const localSessions = JSON.parse(localStorage.getItem('nishi_universe_sessions') || '{}');
      const sessionArr = Object.values(localSessions);
      setSessions(sessionArr);

      const localWhispers = JSON.parse(localStorage.getItem('nishi_universe_whispers') || '[]');
      setWhispers(localWhispers);
    } catch (e) {
      setSessions([]);
      setWhispers([]);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const totalSessions = sessions.length;
  const mobileCount = sessions.filter((s) => /iPhone|Android|iPad/i.test(s.device)).length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 2, 10, 0.96)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px',
        overflowY: 'auto',
        color: '#ffffff',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          width: '100%',
          maxWidth: '1150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          borderBottom: '1px solid rgba(255, 117, 143, 0.25)',
          paddingBottom: '16px'
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #ffffff, #ff758f)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '4px'
            }}
          >
            Visitor Intelligence Dashboard
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255, 209, 225, 0.75)' }}>
            Live tracking for Nishi's Romantic Universe on Vercel
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={fetchLogs}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 45, 117, 0.25)',
              border: '1px solid rgba(255, 117, 143, 0.5)',
              color: '#ffffff',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            ✕ Close View
          </button>
        </div>
      </div>

      {/* 💌 WHISPERS FROM NISHI (HIGHLIGHT SECTION) */}
      <div
        style={{
          width: '100%',
          maxWidth: '1150px',
          background: 'rgba(255, 45, 117, 0.1)',
          border: '1px solid rgba(255, 117, 143, 0.4)',
          borderRadius: '20px',
          padding: '22px',
          marginBottom: '24px',
          boxShadow: '0 10px 30px rgba(255, 45, 117, 0.15)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <span style={{ fontSize: '1.4rem' }}>💌</span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff' }}>
            Whispers from Nishi ({whispers.length})
          </h3>
        </div>

        {whispers.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'rgba(255, 220, 235, 0.7)', fontStyle: 'italic' }}>
            No whispers received yet. When she writes in the message box at the bottom of the site, her note will appear here instantly!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {whispers.map((w) => (
              <div
                key={w.id}
                style={{
                  background: 'rgba(15, 6, 26, 0.8)',
                  border: '1px solid rgba(255, 117, 143, 0.3)',
                  borderRadius: '16px',
                  padding: '16px 20px'
                }}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '1.25rem',
                    fontStyle: 'italic',
                    color: '#ffffff',
                    marginBottom: '8px'
                  }}
                >
                  "{w.text}"
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.75rem', color: 'rgba(255, 182, 193, 0.85)' }}>
                  <span>🕒 {w.time} ({w.date})</span>
                  {w.device && <span>📱 {w.device}</span>}
                  {w.location && <span>📍 {w.location}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Metric Cards */}
      <div
        style={{
          width: '100%',
          maxWidth: '1150px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div style={{ background: 'rgba(255, 45, 117, 0.08)', border: '1px solid rgba(255, 117, 143, 0.3)', borderRadius: '16px', padding: '18px' }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ff758f' }}>
            TOTAL VISITING SESSIONS
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, marginTop: '6px' }}>{totalSessions}</div>
        </div>

        <div style={{ background: 'rgba(157, 78, 221, 0.08)', border: '1px solid rgba(157, 78, 221, 0.3)', borderRadius: '16px', padding: '18px' }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c77dff' }}>
            MOBILE PHONES
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, marginTop: '6px' }}>
            {mobileCount} <span style={{ fontSize: '0.9rem', color: '#e0aaff' }}>({totalSessions ? Math.round((mobileCount / totalSessions) * 100) : 0}%)</span>
          </div>
        </div>

        <div style={{ background: 'rgba(255, 209, 102, 0.08)', border: '1px solid rgba(255, 209, 102, 0.3)', borderRadius: '16px', padding: '18px' }}>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#ffd166' }}>
            DESKTOP COMPUTERS
          </span>
          <div style={{ fontSize: '2.2rem', fontWeight: 700, marginTop: '6px' }}>{totalSessions - mobileCount}</div>
        </div>
      </div>

      {/* DISTINCT SESSION TIMELINE TABLE */}
      <div
        style={{
          width: '100%',
          maxWidth: '1150px',
          background: 'rgba(15, 6, 26, 0.75)',
          border: '1px solid rgba(255, 117, 143, 0.25)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)'
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '4px' }}>
            Distinct Visitor Sessions & Duration
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255, 209, 225, 0.7)' }}>
            Each return visit is logged as a separate session showing start time, exact duration active, battery %, network, and location.
          </p>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#ff758f' }}>
            Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
            No sessions recorded yet. Open your website to log the first visit!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)', textAlign: 'left', color: 'rgba(255, 182, 193, 0.85)' }}>
                  <th style={{ padding: '12px 10px' }}>Session Start Time</th>
                  <th style={{ padding: '12px 10px' }}>Duration Spent</th>
                  <th style={{ padding: '12px 10px' }}>Device & OS</th>
                  <th style={{ padding: '12px 10px' }}>Network & Battery</th>
                  <th style={{ padding: '12px 10px' }}>Location & Carrier</th>
                  <th style={{ padding: '12px 10px' }}>Milestones Reached</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, index) => (
                  <tr
                    key={s.sessionId || index}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                      background: index === 0 ? 'rgba(255, 45, 117, 0.04)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '14px 10px', color: '#ffffff', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 600 }}>{s.startTime}</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)' }}>{s.date}</div>
                    </td>

                    <td style={{ padding: '14px 10px', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: 'rgba(255, 209, 102, 0.15)',
                          border: '1px solid rgba(255, 209, 102, 0.4)',
                          color: '#ffd166',
                          fontWeight: 600
                        }}
                      >
                        ⏱️ {s.durationFormatted || (s.durationSeconds ? `${s.durationSeconds}s` : 'Active')}
                      </span>
                    </td>

                    <td style={{ padding: '14px 10px' }}>
                      <div style={{ color: '#ffffff', fontWeight: 600 }}>
                        {/iPhone|iPad/i.test(s.device) ? '📱 ' : /Android/i.test(s.device) ? '🤖 ' : '💻 '}
                        {s.device}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                        {s.os} • {s.browser} • {s.screen}
                      </div>
                    </td>

                    <td style={{ padding: '14px 10px', fontSize: '0.78rem' }}>
                      <div style={{ color: '#e0aaff' }}>📶 {s.network}</div>
                      <div style={{ color: s.battery?.includes('Charging') ? '#4ade80' : 'rgba(255, 255, 255, 0.7)' }}>
                        🔋 {s.battery}
                      </div>
                    </td>

                    <td style={{ padding: '14px 10px' }}>
                      <div style={{ color: '#ff758f', fontWeight: 500 }}>
                        📍 {s.location || s.city || 'India'}
                      </div>
                      {s.isp && s.isp !== 'Telecom / Wi-Fi' && (
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.55)' }}>
                          Carrier: {s.isp}
                        </div>
                      )}
                    </td>

                    <td style={{ padding: '14px 10px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {(s.actions || ['page_view']).map((act, i) => (
                          <span
                            key={i}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontSize: '0.7rem',
                              background: act === 'love_shower_sent'
                                ? 'rgba(255, 45, 117, 0.35)'
                                : act === 'whisper_message'
                                ? 'rgba(255, 209, 102, 0.3)'
                                : 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: '#ffffff'
                            }}
                          >
                            {act}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Secret URL Footer Note */}
      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
        🔒 Access anytime: add <code>?secret=shivam6120</code> to your website URL.
      </div>
    </div>
  );
}
