/**
 * ADVANCED VISITOR INTELLIGENCE & SESSION TRACKER
 * 
 * Tracks:
 * - Distinct sessions (10:00 AM for 4 min, 10:30 AM for 6 min)
 * - Duration active
 * - City, State, Country & ISP (via client lookup + Vercel edge headers)
 * - Network (4G/5G/Wi-Fi)
 * - Battery % and charging state
 * - Device, Screen, OS, Browser
 * - Secret whispers/messages from Nishi
 */

// Unique session management
function getSessionId() {
  if (typeof window === 'undefined') return 'unknown-session';

  let sessionId = sessionStorage.getItem('nishi_universe_session_id');
  const sessionLastActive = parseInt(sessionStorage.getItem('nishi_universe_last_active') || '0', 10);
  const now = Date.now();

  // If inactive for more than 20 minutes, start a new session
  if (!sessionId || (sessionLastActive && now - sessionLastActive > 20 * 60 * 1000)) {
    sessionId = 'session_' + now.toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    sessionStorage.setItem('nishi_universe_session_id', sessionId);
    sessionStorage.setItem('nishi_universe_session_start', now.toString());
  }

  sessionStorage.setItem('nishi_universe_last_active', now.toString());
  return sessionId;
}

// Session duration tracking
const sessionStartTime = Date.now();
function getDurationSeconds() {
  return Math.round((Date.now() - sessionStartTime) / 1000);
}

// Cached IP & Location lookup
let cachedLocationInfo = null;
async function getLocationAndISP() {
  if (cachedLocationInfo) return cachedLocationInfo;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.success !== false) {
        cachedLocationInfo = {
          city: data.city || '',
          region: data.region || '',
          country: data.country || '',
          postal: data.postal || '',
          isp: data.connection?.isp || data.connection?.org || ''
        };
        return cachedLocationInfo;
      }
    }
  } catch (e) {}

  return null;
}

// Battery Info helper
async function getBatteryInfo() {
  if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
    try {
      const battery = await navigator.getBattery();
      return {
        level: Math.round(battery.level * 100) + '%',
        charging: battery.charging ? 'Charging' : 'On Battery'
      };
    } catch (e) {}
  }
  return null;
}

// Network Info helper
function getNetworkInfo() {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const conn = navigator.connection;
    return {
      type: conn.effectiveType ? conn.effectiveType.toUpperCase() : 'Wi-Fi / Cellular',
      saveData: conn.saveData ? 'Data Saver On' : 'Standard'
    };
  }
  return null;
}

// Main event dispatcher
export async function trackVisitorEvent(action = 'page_view', extraData = {}) {
  if (typeof window === 'undefined') return;

  try {
    const sessionId = getSessionId();
    const duration = getDurationSeconds();
    const battery = await getBatteryInfo();
    const network = getNetworkInfo();
    const locationInfo = await getLocationAndISP();

    const payload = {
      sessionId,
      action,
      durationSeconds: duration,
      screen: `${window.screen.width} × ${window.screen.height}`,
      pixelRatio: window.devicePixelRatio || 1,
      orientation: window.screen.width < window.screen.height ? 'Portrait' : 'Landscape',
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      cores: navigator.hardwareConcurrency || 'Unknown',
      ram: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      referrer: document.referrer || 'Direct Link',
      url: window.location.href,
      battery: battery ? `${battery.level} (${battery.charging})` : 'Unavailable',
      network: network ? network.type : 'Standard',
      clientCity: locationInfo?.city,
      clientRegion: locationInfo?.region,
      clientCountry: locationInfo?.country,
      clientIsp: locationInfo?.isp,
      ...extraData
    };

    const json = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      const blob = new Blob([json], { type: 'application/json' });
      navigator.sendBeacon('/api/track', blob);
    } else {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
        keepalive: true
      }).catch(() => {});
    }

    // Client-side backup in localStorage
    try {
      const storedSessions = JSON.parse(localStorage.getItem('nishi_universe_sessions') || '{}');
      if (!storedSessions[sessionId]) {
        storedSessions[sessionId] = {
          sessionId,
          startTime: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString(),
          durationSeconds: duration,
          screen: payload.screen,
          actions: [action],
          battery: payload.battery,
          network: payload.network,
          city: payload.clientCity,
          isp: payload.clientIsp
        };
      } else {
        storedSessions[sessionId].durationSeconds = duration;
        if (!storedSessions[sessionId].actions.includes(action)) {
          storedSessions[sessionId].actions.push(action);
        }
      }
      localStorage.setItem('nishi_universe_sessions', JSON.stringify(storedSessions));
    } catch (e) {}

  } catch (err) {}
}

// Function to send a romantic whisper/message from Nishi
export async function sendWhisperMessage(messageText) {
  if (!messageText || !messageText.trim()) return false;

  const sessionId = getSessionId();
  const locationInfo = await getLocationAndISP();

  const payload = {
    action: 'whisper_message',
    message: messageText.trim(),
    sessionId,
    timestamp: new Date().toISOString(),
    localTime: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
    clientCity: locationInfo?.city,
    clientCountry: locationInfo?.country
  };

  try {
    const res = await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Save locally too
    try {
      const localWhispers = JSON.parse(localStorage.getItem('nishi_universe_whispers') || '[]');
      localWhispers.unshift({
        id: Date.now(),
        text: messageText.trim(),
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
      });
      localStorage.setItem('nishi_universe_whispers', JSON.stringify(localWhispers));
    } catch (e) {}

    return res.ok;
  } catch (e) {
    return false;
  }
}

// Heartbeat updater for duration: updates time spent every 30 seconds
if (typeof window !== 'undefined') {
  setInterval(() => {
    trackVisitorEvent('duration_tick');
  }, 30000);

  // Send duration when tab closes or changes visibility
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      trackVisitorEvent('session_inactive');
    } else {
      trackVisitorEvent('session_resume');
    }
  });

  window.addEventListener('pagehide', () => {
    trackVisitorEvent('session_end');
  });
}
