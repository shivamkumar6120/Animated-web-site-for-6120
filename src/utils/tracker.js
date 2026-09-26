/**
 * ADVANCED VISITOR INTELLIGENCE & SESSION TRACKER
 * 
 * Tracks:
 * - Distinct sessions (e.g. 10:00 AM for 4 min, 10:30 AM for 6 min)
 * - Real-time duration active (synced every 10s + synchronous beacon on tab close)
 * - Exact City, State, Country, Postal/PIN Code & ISP
 * - Direct Google Maps link with coordinates
 * - Network (5G / 4G / Wi-Fi / Carrier name)
 * - Battery % and charging state (with iOS privacy fallbacks)
 * - Device, Screen, OS, Browser
 * - Exclusion of admin visits (?secret=)
 * - Secret whispers/messages from Nishi
 */

// Check if current user is admin to avoid tracking own visits
export function isCurrentAdmin() {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const rawSecret = (params.get('secret') || params.get('admin') || '').trim().replace(/[./]+$/, '').toLowerCase();
    if (['shivam6120', 'niraj6120', 'shivam', 'niraj'].includes(rawSecret)) {
      sessionStorage.setItem('nishi_is_admin', 'true');
      return true;
    }
    return sessionStorage.getItem('nishi_is_admin') === 'true';
  } catch (e) {
    return false;
  }
}

// Unique session management (new session after 20 minutes of inactivity)
function getSessionId() {
  if (typeof window === 'undefined') return 'unknown-session';

  let sessionId = sessionStorage.getItem('nishi_universe_session_id');
  const sessionLastActive = parseInt(sessionStorage.getItem('nishi_universe_last_active') || '0', 10);
  const now = Date.now();

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
export function getDurationSeconds() {
  return Math.max(1, Math.round((Date.now() - sessionStartTime) / 1000));
}

// Cached IP & Location lookup
let cachedLocationInfo = null;
let isFetchingLocation = false;

async function fetchLocationDetails() {
  if (cachedLocationInfo) return cachedLocationInfo;
  if (isFetchingLocation) return null;
  isFetchingLocation = true;

  // Try Provider 1: ipwho.is (includes city, region, postal/PIN code, lat/lon, ISP)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2800);
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
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          mapsUrl: data.latitude ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}` : '',
          isp: data.connection?.isp || data.connection?.org || ''
        };
        isFetchingLocation = false;
        return cachedLocationInfo;
      }
    }
  } catch (e) {}

  // Try Provider 2 fallback: freeipapi.com
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('https://freeipapi.com/api/json', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      cachedLocationInfo = {
        city: data.cityName || '',
        region: data.regionName || '',
        country: data.countryName || '',
        postal: data.zipCode || '',
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        mapsUrl: data.latitude ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}` : '',
        isp: ''
      };
      isFetchingLocation = false;
      return cachedLocationInfo;
    }
  } catch (e) {}

  isFetchingLocation = false;
  return null;
}

// Battery Info helper with iOS & Desktop intelligence
async function getBatteryInfo() {
  if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
    try {
      const battery = await navigator.getBattery();
      const pct = Math.round(battery.level * 100);
      return `${pct}% ${battery.charging ? '⚡ (Charging)' : '🔋 (Battery)'}`;
    } catch (e) {}
  }

  // Device context when battery API is not exposed
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) {
      return '📱 iPhone (iOS Protected)';
    }
    if (/Android/i.test(ua)) {
      return '🤖 Android (Protected)';
    }
    return '💻 Desktop AC Power';
  }

  return 'Unavailable';
}

// Network Info helper (5G, 4G, Wi-Fi, Carrier)
function getNetworkInfo(isp = '') {
  let netType = 'Cellular / Wi-Fi';

  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const conn = navigator.connection;
    const effective = (conn.effectiveType || '').toUpperCase();
    const downlink = conn.downlink || 0; // Mbps
    const rtt = conn.rtt || 0; // ms

    if (downlink >= 15 || (effective === '4G' && rtt <= 45)) {
      netType = '5G / Ultra-Fast';
    } else if (effective === '4G') {
      netType = '4G LTE';
    } else if (effective) {
      netType = effective;
    }
  }

  // If ISP contains recognizable names like Jio or Airtel
  if (isp) {
    if (/Jio/i.test(isp)) {
      return `${netType} • Jio`;
    }
    if (/Airtel/i.test(isp)) {
      return `${netType} • Airtel`;
    }
    if (/Vodafone|Vi/i.test(isp)) {
      return `${netType} • Vi`;
    }
    if (/Fiber|Broadband|ACT|Hathway|BSNL/i.test(isp)) {
      return `Wi-Fi (${isp.split(' ')[0]})`;
    }
  }

  return netType;
}

// Main event dispatcher
export async function trackVisitorEvent(action = 'page_view', extraData = {}) {
  if (typeof window === 'undefined') return;
  if (isCurrentAdmin()) return; // Never track admin visits

  try {
    const sessionId = getSessionId();
    const duration = getDurationSeconds();
    const battery = await getBatteryInfo();
    const locationInfo = cachedLocationInfo || (await fetchLocationDetails());
    const network = getNetworkInfo(locationInfo?.isp);

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
      battery: battery,
      network: network,
      clientCity: locationInfo?.city || '',
      clientRegion: locationInfo?.region || '',
      clientCountry: locationInfo?.country || '',
      clientPostal: locationInfo?.postal || '',
      clientLat: locationInfo?.latitude || null,
      clientLon: locationInfo?.longitude || null,
      clientMapsUrl: locationInfo?.mapsUrl || '',
      clientIsp: locationInfo?.isp || '',
      ...extraData
    };

    const json = JSON.stringify(payload);

    // Send immediately
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

    // If location wasn't available on the initial page_view, fetch it and update session
    if (!cachedLocationInfo && action === 'page_view') {
      fetchLocationDetails().then((loc) => {
        if (loc) {
          trackVisitorEvent('metadata_enrichment', {
            clientCity: loc.city,
            clientRegion: loc.region,
            clientCountry: loc.country,
            clientPostal: loc.postal,
            clientLat: loc.latitude,
            clientLon: loc.longitude,
            clientMapsUrl: loc.mapsUrl,
            clientIsp: loc.isp,
            network: getNetworkInfo(loc.isp)
          });
        }
      });
    }

  } catch (err) {}
}

// Synchronous termination beacon (runs instantly on tab close / reload)
function sendSessionEndBeacon() {
  if (typeof window === 'undefined') return;
  if (isCurrentAdmin()) return;

  try {
    const sessionId = sessionStorage.getItem('nishi_universe_session_id');
    if (!sessionId) return;

    const duration = getDurationSeconds();
    const payload = JSON.stringify({
      sessionId,
      action: 'session_end',
      durationSeconds: duration,
      clientMapsUrl: cachedLocationInfo?.mapsUrl || ''
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/track', blob);
    }
  } catch (e) {}
}

// Function to send a romantic whisper/message from Nishi
export async function sendWhisperMessage(messageText) {
  if (!messageText || !messageText.trim()) return false;

  const sessionId = getSessionId();
  const locationInfo = cachedLocationInfo || (await fetchLocationDetails());

  const payload = {
    action: 'whisper_message',
    message: messageText.trim(),
    sessionId,
    timestamp: new Date().toISOString(),
    localTime: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
    clientCity: locationInfo?.city,
    clientCountry: locationInfo?.country,
    clientMapsUrl: locationInfo?.mapsUrl
  };

  try {
    const res = await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return res.ok;
  } catch (e) {
    return false;
  }
}

// Lifecycle listeners
if (typeof window !== 'undefined') {
  // Duration heartbeat: updates time spent every 10 seconds
  setInterval(() => {
    if (!isCurrentAdmin() && document.visibilityState === 'visible') {
      trackVisitorEvent('duration_tick');
    }
  }, 10000);

  // Instant duration sync on tab switch
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendSessionEndBeacon();
    } else {
      trackVisitorEvent('session_resume');
    }
  });

  // Instant duration sync on page close
  window.addEventListener('pagehide', sendSessionEndBeacon);
  window.addEventListener('beforeunload', sendSessionEndBeacon);
}

