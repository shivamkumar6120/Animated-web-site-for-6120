/**
 * First-party browser environment collected in the page.
 * High-entropy values come from the User-Agent Client Hints API.
 * The server re-parses this payload and is the source of truth.
 */

const HIGH_ENTROPY_HINTS = [
  'architecture',
  'bitness',
  'model',
  'platformVersion',
  'fullVersionList',
  'wow64'
];

let cachedProfile = null;
let pendingProfile = null;

function matchMediaSafe(query) {
  try {
    return window.matchMedia(query).matches;
  } catch (err) {
    return false;
  }
}

function readConnection() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) return null;

  return {
    effectiveType: conn.effectiveType || '',
    type: conn.type || '',
    downlink: typeof conn.downlink === 'number' ? conn.downlink : null,
    rtt: typeof conn.rtt === 'number' ? conn.rtt : null,
    saveData: Boolean(conn.saveData)
  };
}

function readSyncProfile() {
  const uaData = navigator.userAgentData;

  return {
    schemaVersion: 1,
    language: navigator.language || '',
    languages: Array.isArray(navigator.languages) ? navigator.languages.slice(0, 8) : [],
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    screen: {
      width: window.screen?.width || 0,
      height: window.screen?.height || 0,
      colorDepth: window.screen?.colorDepth || 0
    },
    viewport: {
      width: window.innerWidth || 0,
      height: window.innerHeight || 0
    },
    pixelRatio: window.devicePixelRatio || 1,
    orientation: window.screen?.orientation?.type || '',
    maxTouchPoints: navigator.maxTouchPoints || 0,
    cores: navigator.hardwareConcurrency || null,
    deviceMemory: navigator.deviceMemory || null,
    connection: readConnection(),
    colorScheme: matchMediaSafe('(prefers-color-scheme: dark)') ? 'dark' : 'light',
    reducedMotion: matchMediaSafe('(prefers-reduced-motion: reduce)'),
    uaClientHints: uaData
      ? {
          brands: uaData.brands || [],
          mobile: typeof uaData.mobile === 'boolean' ? uaData.mobile : null,
          platform: uaData.platform || ''
        }
      : null
  };
}

async function readHighEntropyHints(profile) {
  const uaData = navigator.userAgentData;
  if (!uaData?.getHighEntropyValues) return profile;

  try {
    const hints = await uaData.getHighEntropyValues(HIGH_ENTROPY_HINTS);
    profile.uaClientHints = {
      brands: uaData.brands || [],
      mobile: typeof uaData.mobile === 'boolean' ? uaData.mobile : null,
      platform: hints.platform || uaData.platform || '',
      platformVersion: hints.platformVersion || '',
      architecture: hints.architecture || '',
      bitness: hints.bitness || '',
      model: hints.model || '',
      fullVersionList: Array.isArray(hints.fullVersionList) ? hints.fullVersionList : [],
      wow64: Boolean(hints.wow64)
    };
  } catch (err) {
    // Low-entropy brands from userAgentData are still useful.
  }

  try {
    const extra = await uaData.getHighEntropyValues(['formFactors']);
    if (profile.uaClientHints && Array.isArray(extra.formFactors)) {
      profile.uaClientHints.formFactors = extra.formFactors;
    }
  } catch (err) {
    // formFactors is not available in every Chromium version.
  }

  return profile;
}

export function collectClientEnvironment() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (cachedProfile) return Promise.resolve(cachedProfile);
  if (pendingProfile) return pendingProfile;

  pendingProfile = readHighEntropyHints(readSyncProfile())
    .then((profile) => {
      cachedProfile = profile;
      pendingProfile = null;
      return profile;
    })
    .catch(() => {
      const fallback = readSyncProfile();
      cachedProfile = fallback;
      pendingProfile = null;
      return fallback;
    });

  return pendingProfile;
}
