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

// Helper: Fetch data from Cloud Storage
async function getCloudData(key) {
  // 1. Try Upstash / Vercel KV with any prefix (STORAGE, UPSTASH, KV)
  const { url, token } = getRedisCredentials();

  if (url && token) {
    try {
      const res = await fetch(`${url}/get/${key}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        return data.result ? JSON.parse(data.result) : null;
      }
    } catch (e) {}
  }

  // 2. Default Free Cloud KV fallback (Zero config needed)
  try {
    const res = await fetch(`${CLOUD_STORE_URL}${key}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}

  return null;
}

// Helper: Save data to Cloud Storage
async function saveCloudData(key, value) {
  const jsonStr = JSON.stringify(value);

  // 1. Try Upstash / Vercel KV with any prefix (STORAGE, UPSTASH, KV)
  const { url, token } = getRedisCredentials();

  if (url && token) {
    try {
      await fetch(`${url}/set/${key}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify([jsonStr])
      });
      return;
    } catch (e) {}
  }

  // 2. Default Free Cloud KV fallback
  try {
    await fetch(`${CLOUD_STORE_URL}${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonStr
    });
  } catch (e) {}
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
    const cloudSessions = (await getCloudData('universe_sessions')) || [];
    const cloudWhispers = (await getCloudData('universe_whispers')) || [];

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
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

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

      // Location resolution (client lookup details + Vercel edge headers fallback)
      const country = body.clientCountry || req.headers['x-vercel-ip-country'] || 'India';
      const city = body.clientCity || (req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : '');
      const region = body.clientRegion || req.headers['x-vercel-ip-country-region'] || '';
      const postal = body.clientPostal || '';
      const latitude = body.clientLat || null;
      const longitude = body.clientLon || null;
      const mapsUrl = body.clientMapsUrl || (latitude && longitude ? `https://www.google.com/maps?q=${latitude},${longitude}` : '');
      const isp = body.clientIsp || 'Telecom / Wi-Fi';

      // Build readable location
      let locationString = country;
      if (city) {
        let locParts = [city];
        if (region) locParts.push(region);
        if (postal) locParts.push(`PIN: ${postal}`);
        locParts.push(country);
        locationString = locParts.join(', ');
      }

      const now = new Date();
      const localTimeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const localDateString = now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

      // Handle Whisper Messages from Nishi
      if (body.action === 'whisper_message') {
        const whisperEntry = {
          id: Date.now() + Math.random().toString(36).substring(2, 6),
          text: body.message,
          time: localTimeString,
          date: localDateString,
          timestamp: now.toISOString(),
          device: `${environment.deviceLabel} (${environment.osLabel})`,
          location: locationString,
          mapsUrl: mapsUrl || body.clientMapsUrl
        };

        const existingWhispers = (await getCloudData('universe_whispers')) || [];
        existingWhispers.unshift(whisperEntry);
        await saveCloudData('universe_whispers', existingWhispers.slice(0, 50));

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
      const durationSeconds = body.durationSeconds || 1;
      let existingSessions = (await getCloudData('universe_sessions')) || [];

      const sessionIndex = existingSessions.findIndex((s) => s.sessionId === sessionId);

      if (sessionIndex === -1) {
        // New session entry
        const newSession = {
          sessionId,
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
          city: city,
          region: region,
          postal: postal,
          latitude: latitude,
          longitude: longitude,
          mapsUrl: mapsUrl,
          isp: isp,
          status: body.action === 'session_end' ? 'completed' : 'active',
          actions: [body.action || 'page_view']
        };
        applyEnvironment(newSession, environment, isp);
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

        if (durationSeconds > (sess.durationSeconds || 0)) {
          sess.durationSeconds = durationSeconds;
          sess.durationFormatted = formatDuration(durationSeconds);
        }

        if (body.action === 'session_end') {
          sess.status = 'completed';
          sess.endedAt = localTimeString;
        }

        if (body.battery && body.battery !== 'Unavailable') {
          sess.battery = body.battery;
        }

        const incomingScore = environmentDetailScore(environment);
        const storedScore = environmentDetailScore(sess.environment);
        if (body.client && incomingScore >= storedScore) {
          applyEnvironment(sess, environment, isp || sess.isp);
        }

        if (city && (!sess.city || sess.city === 'Unknown City')) {
          sess.city = city;
          sess.region = region;
          sess.postal = postal;
          sess.latitude = latitude;
          sess.longitude = longitude;
          sess.mapsUrl = mapsUrl;
          sess.location = locationString;
        }

        if (body.clientMapsUrl && !sess.mapsUrl) {
          sess.mapsUrl = body.clientMapsUrl;
        }

        if (isp && (!sess.isp || sess.isp === 'Telecom / Wi-Fi')) {
          sess.isp = isp;
        }

        if (body.action && !sess.actions.includes(body.action) && !body.action.startsWith('duration_')) {
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
