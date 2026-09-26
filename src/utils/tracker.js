/**
 * Visitor session tracker.
 * Browser, OS, and device details are collected in browserProfile.js
 * and resolved on the server. Admin visits are not recorded.
 */

import { collectClientEnvironment } from './browserProfile';

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

let activeMs = 0;
let visibleSince = null;
let timingReady = false;

function readNavigationType() {
  try {
    const nav = performance.getEntriesByType('navigation')[0];
    return nav ? nav.type : 'navigate';
  } catch (e) {
    return 'navigate';
  }
}

function ensureTiming() {
  if (timingReady) return;
  timingReady = true;
  activeMs = parseInt(sessionStorage.getItem('nishi_universe_active_ms') || '0', 10) || 0;
  if (document.visibilityState === 'visible') visibleSince = Date.now();
}

function visibleDurationMs() {
  const running = visibleSince ? Date.now() - visibleSince : 0;
  return activeMs + running;
}

function pauseVisibleTime() {
  ensureTiming();
  if (!visibleSince) return;
  activeMs += Date.now() - visibleSince;
  visibleSince = null;
  sessionStorage.setItem('nishi_universe_active_ms', String(activeMs));
}

function resumeVisibleTime() {
  ensureTiming();
  if (document.visibilityState === 'hidden' || visibleSince) return;
  visibleSince = Date.now();
}

// A fresh open of the link starts a new visit. Switching away keeps this one.
function getSessionId() {
  if (typeof window === 'undefined') return 'unknown-session';

  const now = Date.now();
  let sessionId = sessionStorage.getItem('nishi_universe_session_id');
  const pageToken = window.__nishiPageToken || (window.__nishiPageToken = String(now));
  const markedToken = sessionStorage.getItem('nishi_universe_page_token');

  if (readNavigationType() === 'navigate' && markedToken !== pageToken) {
    sessionId = 'session_' + now.toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    sessionStorage.setItem('nishi_universe_session_id', sessionId);
    sessionStorage.setItem('nishi_universe_page_token', pageToken);
    sessionStorage.setItem('nishi_universe_active_ms', '0');
    activeMs = 0;
    visibleSince = document.visibilityState === 'visible' ? Date.now() : null;
    timingReady = true;
  } else if (!sessionId) {
    sessionId = 'session_' + now.toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    sessionStorage.setItem('nishi_universe_session_id', sessionId);
    sessionStorage.setItem('nishi_universe_active_ms', '0');
    activeMs = 0;
    visibleSince = document.visibilityState === 'visible' ? Date.now() : null;
    timingReady = true;
  } else {
    ensureTiming();
  }

  sessionStorage.setItem('nishi_universe_last_active', String(now));
  return sessionId;
}

export function getDurationSeconds() {
  if (typeof window === 'undefined') return 1;
  ensureTiming();
  return Math.max(1, Math.round(visibleDurationMs() / 1000));
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

function postTrack(json, preferBeacon = false) {
  if (preferBeacon && navigator.sendBeacon) {
    const blob = new Blob([json], { type: 'application/json' });
    if (navigator.sendBeacon('/api/track', blob)) return;
  }

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: json,
    keepalive: true
  }).catch(() => {});
}

// Main event dispatcher
export async function trackVisitorEvent(action = 'page_view', extraData = {}) {
  if (typeof window === 'undefined') return;
  if (isCurrentAdmin()) return; // Never track admin visits

  if (action === 'page_view' || action === 'tap_to_begin') {
    requestDeviceLocation();
  }

  try {
    const sessionId = getSessionId();
    const duration = getDurationSeconds();
    const [battery, client] = await Promise.all([
      getBatteryInfo(),
      collectClientEnvironment()
    ]);
    const locationInfo = cachedLocationInfo;
    const locationPromise = locationInfo ? Promise.resolve(locationInfo) : fetchLocationDetails();

    const payload = {
      sessionId,
      action,
      durationSeconds: duration,
      referrer: document.referrer || 'Direct Link',
      url: window.location.href,
      battery: battery,
      client: client || undefined,
      clientCity: locationInfo?.city || '',
      clientRegion: locationInfo?.region || '',
      clientCountry: locationInfo?.country || '',
      clientPostal: locationInfo?.postal || '',
      clientLat: locationInfo?.latitude || null,
      clientLon: locationInfo?.longitude || null,
      clientMapsUrl: locationInfo?.mapsUrl || '',
      clientIsp: locationInfo?.isp || '',
      clientLocationSource: locationInfo?.source || '',
      ...extraData
    };

    postTrack(JSON.stringify(payload));

    // If location wasn't available on the initial page_view, fetch it and update session
    if (!locationInfo && action === 'page_view') {
      locationPromise.then((loc) => {
        if (loc && loc.source !== 'gps') {
          trackVisitorEvent('metadata_enrichment', {
            clientCity: loc.city,
            clientRegion: loc.region,
            clientCountry: loc.country,
            clientPostal: loc.postal,
            clientLat: loc.latitude,
            clientLon: loc.longitude,
            clientMapsUrl: loc.mapsUrl,
            clientIsp: loc.isp,
            clientLocationSource: 'ip'
          });
        }
      });
    }

  } catch (err) {}
}

let deviceLocationRequested = false;

function requestDeviceLocation() {
  if (deviceLocationRequested || typeof navigator === 'undefined' || !navigator.geolocation) return;
  deviceLocationRequested = true;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const latitude = Math.round(pos.coords.latitude * 1e6) / 1e6;
      const longitude = Math.round(pos.coords.longitude * 1e6) / 1e6;
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      cachedLocationInfo = {
        ...(cachedLocationInfo || {}),
        latitude,
        longitude,
        mapsUrl,
        source: 'gps'
      };
      trackVisitorEvent('metadata_enrichment', {
        clientLat: latitude,
        clientLon: longitude,
        clientMapsUrl: mapsUrl,
        clientLocationSource: 'gps',
        clientCity: '',
        clientRegion: '',
        clientCountry: '',
        clientPostal: ''
      });
    },
    () => {},
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 5 * 60 * 1000 }
  );
}

function sendSessionPauseBeacon() {
  if (typeof window === 'undefined') return;
  if (isCurrentAdmin()) return;

  try {
    pauseVisibleTime();
    const sessionId = sessionStorage.getItem('nishi_universe_session_id');
    if (!sessionId) return;

    postTrack(JSON.stringify({
      sessionId,
      action: 'session_pause',
      durationSeconds: getDurationSeconds(),
      clientMapsUrl: cachedLocationInfo?.mapsUrl || ''
    }), true);
  } catch (e) {}
}

function resumeSession() {
  if (document.visibilityState === 'hidden') return;
  resumeVisibleTime();
  trackVisitorEvent('session_resume');
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

  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendSessionPauseBeacon();
    } else {
      resumeSession();
    }
  });

  window.addEventListener('pagehide', (event) => {
    if (event.persisted) {
      pauseVisibleTime();
      return;
    }
    sendSessionPauseBeacon();
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) resumeSession();
  });
}

