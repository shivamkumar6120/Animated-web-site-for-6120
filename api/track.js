/**
 * ADVANCED VERCEL SERVERLESS VISITOR & WHISPER TRACKING API
 * 
 * Cloud Persistence:
 * - Automatically syncs with Free Cloud Storage (works across different cities & devices)
 * - Supports Upstash Redis / Vercel KV if environment variables are set
 * - Supports Discord Webhook for instant phone notifications
 * - In-memory fallback
 */

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

function parseUserAgent(ua = '') {
  let device = 'Desktop';
  let os = 'Unknown OS';
  let browser = 'Unknown Browser';

  if (/iPhone/i.test(ua)) {
    device = 'iPhone';
    const match = ua.match(/OS (\d+[_.]\d+)/i);
    os = match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS';
  } else if (/iPad/i.test(ua)) {
    device = 'iPad';
    os = 'iPadOS';
  } else if (/Android/i.test(ua)) {
    device = 'Android Phone';
    const match = ua.match(/Android (\d+([.]\d+)?)/i);
    os = match ? `Android ${match[1]}` : 'Android';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    device = 'Mac Desktop';
    os = 'macOS';
  } else if (/Windows/i.test(ua)) {
    device = 'Windows PC';
    os = 'Windows';
  } else if (/Linux/i.test(ua)) {
    device = 'Linux PC';
    os = 'Linux';
  }

  if (/Instagram/i.test(ua)) {
    browser = 'Instagram In-App Browser';
  } else if (/WhatsApp/i.test(ua)) {
    browser = 'WhatsApp In-App Browser';
  } else if (/Chrome/i.test(ua) && !/Edge|OPR/i.test(ua)) {
    browser = /Mobile/i.test(ua) ? 'Chrome Mobile' : 'Chrome';
  } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
    browser = /Mobile/i.test(ua) ? 'Mobile Safari' : 'Safari';
  } else if (/Firefox/i.test(ua)) {
    browser = 'Firefox';
  } else if (/Edg/i.test(ua)) {
    browser = 'Microsoft Edge';
  }

  return { device, os, browser };
}

function formatDuration(seconds = 0) {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 1. GET: Return sessions and whispers for admin dashboard
  if (req.method === 'GET') {
    const rawSecret = (req.query.secret || req.query.admin || '').trim().replace(/[.\/]+$/, '').toLowerCase();
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

  // 2. POST: Process tracking events and whispers
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const userAgent = req.headers['user-agent'] || '';
      const parsedUA = parseUserAgent(userAgent);

      // Location resolution (Vercel edge headers preferred, client lookup fallback)
      const country = req.headers['x-vercel-ip-country'] || body.clientCountry || 'India';
      const city = req.headers['x-vercel-ip-city'] 
        ? decodeURIComponent(req.headers['x-vercel-ip-city']) 
        : (body.clientCity || 'Unknown City');
      const region = req.headers['x-vercel-ip-country-region'] || body.clientRegion || '';
      const isp = body.clientIsp || 'Telecom / Wi-Fi';

      const locationString = city !== 'Unknown City' 
        ? (region ? `${city}, ${region}, ${country}` : `${city}, ${country}`) 
        : country;

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
          device: `${parsedUA.device} (${parsedUA.os})`,
          location: locationString
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
                    { name: '📱 Device', value: parsedUA.device, inline: true },
                    { name: '📍 Location', value: locationString, inline: true }
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
      const durationSeconds = body.durationSeconds || 0;
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
          device: parsedUA.device,
          os: parsedUA.os,
          browser: parsedUA.browser,
          screen: body.screen || 'Unknown',
          battery: body.battery || 'Unavailable',
          network: body.network || 'Wi-Fi / Cellular',
          location: locationString,
          city: city,
          country: country,
          isp: isp,
          actions: [body.action || 'page_view']
        };

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
                  title: '✨ Nishi entered your universe!',
                  color: 16723317,
                  fields: [
                    { name: '📱 Device', value: `${parsedUA.device} (${parsedUA.os})`, inline: true },
                    { name: '🌐 Browser', value: parsedUA.browser, inline: true },
                    { name: '📍 Location', value: locationString, inline: true },
                    { name: '📶 Network', value: `${body.network || 'Cellular'} (${isp})`, inline: true },
                    { name: '🔋 Battery', value: body.battery || 'N/A', inline: true },
                    { name: '🕒 Time', value: localTimeString, inline: true }
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

        if (durationSeconds > sess.durationSeconds) {
          sess.durationSeconds = durationSeconds;
          sess.durationFormatted = formatDuration(durationSeconds);
        }

        if (body.battery && body.battery !== 'Unavailable') {
          sess.battery = body.battery;
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
