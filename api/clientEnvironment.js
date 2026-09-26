/**
 * Canonical browser / OS / device profile.
 * Client Hints win over the reduced User-Agent string.
 * The page cannot override the resolved name, version, or OS.
 */

const GREASE_BRAND = /not.?a.?brand/i;

const BRAND_NAMES = {
  'Google Chrome': 'Chrome',
  'Microsoft Edge': 'Edge',
  Chromium: 'Chromium',
  Opera: 'Opera',
  'Opera GX': 'Opera GX',
  Brave: 'Brave',
  'Samsung Internet': 'Samsung Internet',
  Vivaldi: 'Vivaldi',
  Yandex: 'Yandex'
};

const IN_APP_RULES = [
  [/Instagram/i, 'Instagram'],
  [/FBAN|FBAV|FB_IAB|\bFacebook\b/i, 'Facebook'],
  [/WhatsApp/i, 'WhatsApp'],
  [/Telegram/i, 'Telegram'],
  [/TikTok|musical_ly|BytedanceWebview/i, 'TikTok'],
  [/Snapchat/i, 'Snapchat'],
  [/\bLinkedIn/i, 'LinkedIn'],
  [/\bLine\//i, 'LINE'],
  [/\bTwitter/i, 'Twitter'],
  [/GSA\//i, 'Google App']
];

function clip(value, max) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function unquote(value) {
  return clip(String(value || ''), 160).replace(/^"|"$/g, '');
}

function versionSpecificity(version) {
  const parts = String(version || '').split('.').filter((part) => part !== '');
  if (!parts.length) return 0;
  const nonZero = parts.filter((part) => part !== '0').length;
  return nonZero * 10 + parts.length;
}

function majorMinor(version) {
  const parts = String(version || '')
    .split('.')
    .map((part) => part.replace(/[^\d]/g, ''))
    .filter((part) => part !== '');

  if (!parts.length) return '';
  if (!parts[1] || parts[1] === '0') return parts[0];
  return `${parts[0]}.${parts[1]}`;
}

function firstMatch(ua, pattern) {
  const match = ua.match(pattern);
  return match ? match[1].replace(/_/g, '.') : '';
}

function parseBrandList(header) {
  if (!header || typeof header !== 'string') return [];
  const brands = [];
  const pattern = /"([^"]+)";v="([^"]+)"/g;
  let match = pattern.exec(header);
  while (match) {
    brands.push({ brand: match[1], version: match[2] });
    match = pattern.exec(header);
  }
  return brands;
}

function parseMobileHint(value) {
  if (value == null || value === '') return null;
  const normalized = String(value).trim().toLowerCase();
  if (normalized === '?1' || normalized === '1' || normalized === 'true') return true;
  if (normalized === '?0' || normalized === '0' || normalized === 'false') return false;
  return null;
}

function headerValue(headers, name) {
  if (!headers) return '';
  const direct = headers[name] || headers[name.toLowerCase()];
  return typeof direct === 'string' ? direct : '';
}

function mergeHints(headers, clientHints) {
  const fromClient = clientHints && typeof clientHints === 'object' ? clientHints : {};
  const fullVersionList = parseBrandList(headerValue(headers, 'sec-ch-ua-full-version-list'));
  const brands = parseBrandList(headerValue(headers, 'sec-ch-ua'));
  const headerMobile = parseMobileHint(headerValue(headers, 'sec-ch-ua-mobile'));

  return {
    brands: brands.length ? brands : Array.isArray(fromClient.brands) ? fromClient.brands : [],
    fullVersionList: fullVersionList.length
      ? fullVersionList
      : Array.isArray(fromClient.fullVersionList)
        ? fromClient.fullVersionList
        : [],
    mobile: headerMobile == null ? (typeof fromClient.mobile === 'boolean' ? fromClient.mobile : null) : headerMobile,
    platform: unquote(headerValue(headers, 'sec-ch-ua-platform')) || clip(fromClient.platform, 40),
    platformVersion: unquote(headerValue(headers, 'sec-ch-ua-platform-version')) || clip(fromClient.platformVersion, 40),
    model: unquote(headerValue(headers, 'sec-ch-ua-model')) || clip(fromClient.model, 80),
    architecture: unquote(headerValue(headers, 'sec-ch-ua-arch')) || clip(fromClient.architecture, 20),
    bitness: unquote(headerValue(headers, 'sec-ch-ua-bitness')) || clip(fromClient.bitness, 8),
    wow64: Boolean(fromClient.wow64),
    formFactors: Array.isArray(fromClient.formFactors) ? fromClient.formFactors.slice(0, 4) : []
  };
}

function specificBrand(list) {
  const usable = (list || []).filter((item) => item?.brand && !GREASE_BRAND.test(item.brand));
  return usable.find((item) => !/^chromium$/i.test(item.brand)) || usable[0] || null;
}

function normalizeBrand(brand) {
  return BRAND_NAMES[brand] || brand;
}

function detectInApp(ua) {
  for (const [pattern, name] of IN_APP_RULES) {
    if (pattern.test(ua)) return name;
  }
  return '';
}

function detectBrowser(ua) {
  const electronVersion = firstMatch(ua, /Electron\/(\d+(?:\.\d+)*)/i);
  if (electronVersion) {
    const app = ua.match(/\b(Cursor)\/(\d+(?:\.\d+)*)/i);
    if (app) return { browserName: app[1], browserVersion: app[2] };
    return { browserName: 'Electron', browserVersion: electronVersion };
  }

  const rules = [
    ['Samsung Internet', /SamsungBrowser\/(\d+(?:[._]\d+)*)/i],
    ['UC Browser', /UCBrowser\/(\d+(?:[._]\d+)*)/i],
    ['Yandex', /YaBrowser\/(\d+(?:[._]\d+)*)/i],
    ['Vivaldi', /Vivaldi\/(\d+(?:[._]\d+)*)/i],
    ['Opera', /(?:OPR|Opera)\/(\d+(?:[._]\d+)*)/i],
    ['Edge', /Edg(?:e|A|iOS)?\/(\d+(?:[._]\d+)*)/i],
    ['DuckDuckGo', /DuckDuckGo\/(\d+(?:[._]\d+)*)/i]
  ];

  for (const [name, pattern] of rules) {
    const version = firstMatch(ua, pattern);
    if (version || pattern.test(ua)) {
      return { browserName: name, browserVersion: version.replace(/_/g, '.') };
    }
  }

  if (/DuckDuckGo/i.test(ua)) {
    return { browserName: 'DuckDuckGo', browserVersion: firstMatch(ua, /Chrome\/(\d+(?:[._]\d+)*)/i) };
  }

  if (/; wv\)/i.test(ua) || /WebView/i.test(ua)) {
    return {
      browserName: 'Android WebView',
      browserVersion: firstMatch(ua, /Chrome\/(\d+(?:[._]\d+)*)/i)
    };
  }

  const chrome = firstMatch(ua, /(?:CriOS|Chrome)\/(\d+(?:[._]\d+)*)/i);
  if (chrome && !/Edg(?:e|A|iOS)?\//i.test(ua)) {
    return { browserName: 'Chrome', browserVersion: chrome };
  }

  const firefox = firstMatch(ua, /(?:FxiOS|Firefox)\/(\d+(?:[._]\d+)*)/i);
  if (firefox) return { browserName: 'Firefox', browserVersion: firefox };

  if (/Safari/i.test(ua) && !/Chrome|CriOS|Chromium|Android/i.test(ua)) {
    return {
      browserName: 'Safari',
      browserVersion: firstMatch(ua, /Version\/(\d+(?:[._]\d+)*)/i)
    };
  }

  return { browserName: 'Unknown', browserVersion: '' };
}

function detectDevice(ua) {
  if (/iPhone/i.test(ua)) {
    return {
      deviceFamily: 'iphone',
      osVersion: firstMatch(ua, /OS (\d+(?:[_\.]\d+)+)/i),
      isMobileToken: true,
      androidModel: ''
    };
  }

  if (/iPad/i.test(ua)) {
    return {
      deviceFamily: 'ipad',
      osVersion: firstMatch(ua, /OS (\d+(?:[_\.]\d+)+)/i),
      isMobileToken: true,
      androidModel: ''
    };
  }

  if (/Android/i.test(ua)) {
    const modelMatch = ua.match(/Android [^;)]*;\s*([^;)]+?)\s*(?:Build|[);])/i);
    const model = modelMatch ? modelMatch[1].trim() : '';
    return {
      deviceFamily: 'android',
      osVersion: firstMatch(ua, /Android (\d+(?:[.\d]+)?)/i),
      isMobileToken: /Mobile/i.test(ua),
      androidModel: /^(K|Android)$/i.test(model) ? '' : model
    };
  }

  if (/CrOS/i.test(ua)) {
    return { deviceFamily: 'cros', osVersion: firstMatch(ua, /CrOS \S+ ([\d.]+)/i), isMobileToken: false, androidModel: '' };
  }

  if (/Macintosh|Mac OS X/i.test(ua)) {
    return {
      deviceFamily: 'mac',
      osVersion: firstMatch(ua, /Mac OS X (\d+(?:[_\.]\d+)+)/i),
      isMobileToken: false,
      androidModel: ''
    };
  }

  if (/Windows/i.test(ua)) {
    return {
      deviceFamily: 'windows',
      osVersion: firstMatch(ua, /Windows NT (\d+\.\d+)/i),
      isMobileToken: /Windows Phone|IEMobile/i.test(ua),
      androidModel: ''
    };
  }

  if (/Linux/i.test(ua)) {
    return { deviceFamily: 'linux', osVersion: '', isMobileToken: false, androidModel: '' };
  }

  return { deviceFamily: 'unknown', osVersion: '', isMobileToken: false, androidModel: '' };
}

function windowsLabel(platformVersion, ntVersion) {
  const major = parseInt(String(platformVersion || '').split('.')[0], 10);
  if (!Number.isNaN(major)) {
    if (major >= 13) return { name: 'Windows', version: '11', label: 'Windows 11' };
    if (major >= 1) return { name: 'Windows', version: '10', label: 'Windows 10' };
    const minor = parseInt(String(platformVersion).split('.')[1], 10);
    if (minor >= 3) return { name: 'Windows', version: '8.1', label: 'Windows 8.1' };
    if (minor === 2) return { name: 'Windows', version: '8', label: 'Windows 8' };
    if (minor === 1) return { name: 'Windows', version: '7', label: 'Windows 7' };
  }

  if (ntVersion === '6.3') return { name: 'Windows', version: '8.1', label: 'Windows 8.1' };
  if (ntVersion === '6.2') return { name: 'Windows', version: '8', label: 'Windows 8' };
  if (ntVersion === '6.1') return { name: 'Windows', version: '7', label: 'Windows 7' };
  if (ntVersion === '10.0') return { name: 'Windows', version: '', label: 'Windows' };
  return { name: 'Windows', version: '', label: 'Windows' };
}

function vendorFromModel(model) {
  if (!model) return '';
  if (/^SM-|GT-|SCH-|SC-|Samsung/i.test(model)) return 'Samsung';
  if (/^Pixel/i.test(model)) return 'Google';
  if (/^iPhone|^iPad/i.test(model)) return 'Apple';
  if (/Redmi|POCO|^Xiaomi/i.test(model)) return 'Xiaomi';
  if (/^CPH|^OPPO/i.test(model)) return 'OPPO';
  if (/^RMX|^realme/i.test(model)) return 'realme';
  if (/^vivo|^V\d{4}/i.test(model)) return 'vivo';
  if (/^moto|^motorola/i.test(model)) return 'Motorola';
  if (/OnePlus|KB200|LE21|NE221/i.test(model)) return 'OnePlus';
  if (/^Nokia/i.test(model)) return 'Nokia';
  return '';
}

function resolveOs(parsed, hints, client) {
  const platform = hints.platform || '';
  const platformVersion = hints.platformVersion || '';
  const ipadDesktop = parsed.deviceFamily === 'mac' && Number(client.maxTouchPoints) > 1 && !/mac/i.test(platform);

  if (/android/i.test(platform) || parsed.deviceFamily === 'android') {
    const version = majorMinor(platformVersion || parsed.osVersion);
    return { name: 'Android', version, label: version ? `Android ${version}` : 'Android' };
  }

  if (parsed.deviceFamily === 'ipad' || ipadDesktop || /ipad/i.test(platform)) {
    const version = majorMinor(platformVersion || (parsed.deviceFamily === 'ipad' ? parsed.osVersion : parsed.safariVersion));
    return { name: 'iPadOS', version, label: version ? `iPadOS ${version}` : 'iPadOS' };
  }

  if (/ios/i.test(platform) || parsed.deviceFamily === 'iphone') {
    const version = majorMinor(platformVersion || parsed.osVersion);
    return { name: 'iOS', version, label: version ? `iOS ${version}` : 'iOS' };
  }

  if (/mac/i.test(platform) || parsed.deviceFamily === 'mac') {
    const hinted = majorMinor(platformVersion);
    const uaVersion = majorMinor(parsed.osVersion);
    const version = hinted || (uaVersion && uaVersion !== '10.15' ? uaVersion : '');
    return { name: 'macOS', version, label: version ? `macOS ${version}` : 'macOS' };
  }

  if (/windows/i.test(platform) || parsed.deviceFamily === 'windows') {
    return windowsLabel(platformVersion, parsed.osVersion);
  }

  if (/chrome\s?os/i.test(platform) || parsed.deviceFamily === 'cros') {
    const version = majorMinor(platformVersion || parsed.osVersion);
    return { name: 'ChromeOS', version, label: version ? `ChromeOS ${version}` : 'ChromeOS' };
  }

  if (/linux/i.test(platform) || parsed.deviceFamily === 'linux') {
    return { name: 'Linux', version: '', label: 'Linux' };
  }

  return { name: 'Unknown', version: '', label: 'Unknown OS' };
}

function resolveBrowser(parsed, hints, os) {
  const hinted = specificBrand(hints.fullVersionList.length ? hints.fullVersionList : hints.brands);
  let name = parsed.browserName;
  let version = parsed.browserVersion;

  if (hinted) {
    const hintedName = normalizeBrand(hinted.brand);
    const hintedVersion = clip(hinted.version, 32);
    const genericEngine = /^Chromium$/i.test(hinted.brand);
    if (hintedName && !genericEngine) name = hintedName;
    if (!genericEngine && hintedVersion && versionSpecificity(hintedVersion) > versionSpecificity(version)) {
      version = hintedVersion;
    }
  }

  if (name === 'Unknown' && parsed.inApp) name = parsed.inApp;

  let engine = 'Blink';
  if (os.name === 'iOS' || os.name === 'iPadOS' || name === 'Safari') engine = 'WebKit';
  else if (name === 'Firefox') engine = 'Gecko';

  const displayVersion = version || '';
  const baseLabel = displayVersion ? `${name} ${displayVersion}` : name;
  const label = parsed.inApp && !baseLabel.startsWith(parsed.inApp) ? `${parsed.inApp} · ${baseLabel}` : baseLabel;

  return {
    name,
    version: displayVersion,
    major: displayVersion.split('.')[0] || '',
    engine,
    inApp: parsed.inApp,
    label
  };
}

function resolveDevice(parsed, hints, os) {
  const factors = hints.formFactors.map((factor) => String(factor).toLowerCase());
  let type = 'desktop';

  if (factors.includes('tablet') || os.name === 'iPadOS' || parsed.deviceFamily === 'ipad') type = 'tablet';
  else if (factors.includes('mobile') || hints.mobile === true || parsed.deviceFamily === 'iphone') type = 'mobile';
  else if (parsed.deviceFamily === 'android') type = parsed.isMobileToken ? 'mobile' : 'tablet';
  else if (parsed.isMobileToken) type = 'mobile';

  let model = hints.model || parsed.androidModel || '';
  if (/^(K|Android|Linux)$/i.test(model)) model = '';

  let vendor = vendorFromModel(model);
  if (!vendor && (os.name === 'iOS' || os.name === 'iPadOS')) vendor = 'Apple';
  if (!model && os.name === 'iOS') model = 'iPhone';
  if (!model && os.name === 'iPadOS') model = 'iPad';

  const genericApple = model === 'iPhone' || model === 'iPad';
  const prefix = vendor && model && !genericApple && !model.toLowerCase().includes(vendor.toLowerCase()) ? `${vendor} ` : '';
  let label = model ? `${prefix}${model}`.trim() : '';

  if (!label) {
    if (type === 'mobile') label = os.name === 'Android' ? 'Android Phone' : 'Phone';
    else if (type === 'tablet') label = os.name === 'Android' ? 'Android Tablet' : 'Tablet';
    else if (os.name === 'macOS') label = 'Mac';
    else if (os.name === 'Windows') label = 'Windows PC';
    else if (os.name === 'ChromeOS') label = 'Chromebook';
    else if (os.name === 'Linux') label = 'Linux PC';
    else label = 'Desktop';
  }

  return { type, vendor, model, label };
}

function sanitizeConnection(connection) {
  if (!connection || typeof connection !== 'object') return null;
  const effectiveType = ['slow-2g', '2g', '3g', '4g'].includes(connection.effectiveType) ? connection.effectiveType : '';
  const type = ['bluetooth', 'cellular', 'ethernet', 'wifi', 'wimax', 'other', 'none', 'unknown'].includes(connection.type)
    ? connection.type
    : '';
  const downlink = Number(connection.downlink);
  const rtt = Number(connection.rtt);

  return {
    effectiveType,
    type,
    downlinkMbps: Number.isFinite(downlink) && downlink >= 0 ? Math.round(downlink * 10) / 10 : null,
    rttMs: Number.isFinite(rtt) && rtt >= 0 ? Math.round(rtt) : null,
    saveData: Boolean(connection.saveData)
  };
}

function networkLabel(connection) {
  if (!connection) return '';
  const parts = [];
  if (connection.type && connection.type !== 'unknown') parts.push(connection.type);
  if (connection.effectiveType) parts.push(connection.effectiveType);
  if (connection.downlinkMbps != null) parts.push(`${connection.downlinkMbps} Mbps`);
  if (connection.rttMs != null) parts.push(`${connection.rttMs} ms`);
  if (connection.saveData) parts.push('Data Saver');
  return parts.join(' · ');
}

function displaySize(width, height) {
  const w = Number(width);
  const h = Number(height);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return '';
  return `${Math.round(w)} × ${Math.round(h)}`;
}

export function resolveClientEnvironment({ userAgent = '', headers = {}, client = {} } = {}) {
  const source = client && typeof client === 'object' ? client : {};
  const ua = clip(userAgent, 512);
  const hints = mergeHints(headers, source.uaClientHints);
  const parsedUa = {
    ...detectDevice(ua),
    ...detectBrowser(ua),
    safariVersion: firstMatch(ua, /Version\/(\d+(?:[._]\d+)*)/i),
    inApp: detectInApp(ua)
  };

  const os = resolveOs(parsedUa, hints, source);
  const browser = resolveBrowser(parsedUa, hints, os);
  const device = resolveDevice(parsedUa, hints, os);
  const connection = sanitizeConnection(source.connection);

  const screen = source.screen && typeof source.screen === 'object' ? source.screen : {};
  const viewport = source.viewport && typeof source.viewport === 'object' ? source.viewport : {};
  const screenLabel = displaySize(screen.width, screen.height);
  const viewportLabel = displaySize(viewport.width, viewport.height);
  const pixelRatio = Number(source.pixelRatio);
  const language = clip(source.language, 35);
  const timeZone = clip(source.timeZone, 64);

  return {
    browserName: browser.name,
    browserVersion: browser.version,
    browserMajor: browser.major,
    browserEngine: browser.engine,
    inApp: browser.inApp,
    browserLabel: browser.label,
    osName: os.name,
    osVersion: os.version,
    osLabel: os.label,
    deviceType: device.type,
    deviceVendor: device.vendor,
    deviceModel: device.model,
    deviceLabel: device.label,
    language,
    languages: Array.isArray(source.languages) ? source.languages.map((lang) => clip(String(lang), 35)).filter(Boolean).slice(0, 8) : [],
    timeZone,
    architecture: clip(hints.architecture, 20),
    bitness: clip(hints.bitness, 8),
    wow64: hints.wow64,
    screen: screenLabel,
    viewport: viewportLabel,
    pixelRatio: Number.isFinite(pixelRatio) && pixelRatio > 0 ? Math.round(pixelRatio * 100) / 100 : null,
    colorDepth: Number.isFinite(Number(screen.colorDepth)) ? Number(screen.colorDepth) : null,
    orientation: clip(source.orientation, 32),
    touch: Number(source.maxTouchPoints) > 0,
    maxTouchPoints: Number.isFinite(Number(source.maxTouchPoints)) ? Number(source.maxTouchPoints) : 0,
    cores: Number.isFinite(Number(source.cores)) ? Number(source.cores) : null,
    memoryGb: Number.isFinite(Number(source.deviceMemory)) ? Number(source.deviceMemory) : null,
    colorScheme: source.colorScheme === 'dark' ? 'dark' : 'light',
    reducedMotion: Boolean(source.reducedMotion),
    network: connection,
    networkLabel: networkLabel(connection)
  };
}

export const CLIENT_HINT_HEADERS = {
  'Accept-CH': 'Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Sec-CH-UA-Platform-Version, Sec-CH-UA-Full-Version-List, Sec-CH-UA-Model, Sec-CH-UA-Arch, Sec-CH-UA-Bitness',
  'Permissions-Policy': 'ch-ua-full-version-list=(self), ch-ua-model=(self), ch-ua-platform-version=(self), ch-ua-arch=(self), ch-ua-bitness=(self)'
};
