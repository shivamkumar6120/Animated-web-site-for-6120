import { resolveClientEnvironment } from './clientEnvironment.js';

const pixelHeaders = {
  'sec-ch-ua-model': '"Pixel 8"',
  'sec-ch-ua-platform': '"Android"',
  'sec-ch-ua-platform-version': '"14.0.0"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-full-version-list': '"Chromium";v="131.0.6778.139", "Google Chrome";v="131.0.6778.139", "Not_A Brand";v="24.0.0.0"'
};

const cases = [
  {
    name: 'Chrome Win11 client hints',
    input: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      client: {
        uaClientHints: {
          brands: [{ brand: 'Google Chrome', version: '131' }, { brand: 'Chromium', version: '131' }, { brand: 'Not_A Brand', version: '24' }],
          mobile: false,
          platform: 'Windows',
          platformVersion: '15.0.0',
          architecture: 'x86',
          bitness: '64',
          model: '',
          fullVersionList: [
            { brand: 'Google Chrome', version: '131.0.6778.139' },
            { brand: 'Chromium', version: '131.0.6778.139' },
            { brand: 'Not_A Brand', version: '24.0.0.0' }
          ]
        },
        language: 'en-IN',
        timeZone: 'Asia/Kolkata',
        screen: { width: 1920, height: 1080, colorDepth: 24 },
        viewport: { width: 1440, height: 900 },
        pixelRatio: 1.25,
        maxTouchPoints: 0,
        cores: 8,
        deviceMemory: 8,
        connection: { effectiveType: '4g', type: 'wifi', downlink: 10, rtt: 50, saveData: false }
      }
    },
    expect: { browserLabel: 'Chrome 131.0.6778.139', osLabel: 'Windows 11', deviceLabel: 'Windows PC', deviceType: 'desktop', browserEngine: 'Blink', networkLabel: 'wifi · 4g · 10 Mbps · 50 ms' }
  },
  {
    name: 'Edge not labeled Chrome',
    input: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.2903.51'
    },
    expect: { browserName: 'Edge', browserVersion: '131.0.2903.51', osLabel: 'Windows', deviceType: 'desktop' }
  },
  {
    name: 'Brave via hints',
    input: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      client: { uaClientHints: { fullVersionList: [{ brand: 'Brave', version: '131.1.70.117' }, { brand: 'Chromium', version: '131.0.6778.139' }], platform: 'Windows', platformVersion: '10.0.0', mobile: false } }
    },
    expect: { browserName: 'Brave', browserVersion: '131.1.70.117', osLabel: 'Windows 10' }
  },
  {
    name: 'iPhone Safari',
    input: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1' },
    expect: { browserName: 'Safari', browserVersion: '17.4', osLabel: 'iOS 17.4', deviceLabel: 'iPhone', deviceType: 'mobile', browserEngine: 'WebKit' }
  },
  {
    name: 'iPad desktop mode',
    input: {
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
      client: { maxTouchPoints: 5 }
    },
    expect: { browserName: 'Safari', osLabel: 'iPadOS 17.4', deviceLabel: 'iPad', deviceType: 'tablet' }
  },
  {
    name: 'Mac Safari frozen UA',
    input: { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15', client: { maxTouchPoints: 0, uaClientHints: { platform: 'macOS', platformVersion: '14.5.0' } } },
    expect: { osLabel: 'macOS 14.5', deviceLabel: 'Mac', deviceType: 'desktop', browserName: 'Safari' }
  },
  {
    name: 'Samsung model',
    input: { userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36' },
    expect: { browserName: 'Samsung Internet', browserVersion: '26.0', osLabel: 'Android 14', deviceLabel: 'Samsung SM-S918B', deviceType: 'mobile', deviceVendor: 'Samsung' }
  },
  {
    name: 'Pixel hints model',
    input: {
      userAgent: 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
      headers: pixelHeaders
    },
    expect: { browserLabel: 'Chrome 131.0.6778.139', osLabel: 'Android 14', deviceLabel: 'Google Pixel 8', deviceType: 'mobile' }
  },
  {
    name: 'Instagram in-app',
    input: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 320.0.0.24.103' },
    expect: { inApp: 'Instagram', browserLabel: 'Instagram', osLabel: 'iOS 17.4', deviceType: 'mobile', browserEngine: 'WebKit' }
  },
  {
    name: 'Firefox Windows',
    input: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0' },
    expect: { browserName: 'Firefox', browserVersion: '132.0', browserEngine: 'Gecko', osLabel: 'Windows' }
  },
  {
    name: 'Opera not Chrome',
    input: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 OPR/116.0.0.0' },
    expect: { browserName: 'Opera', browserVersion: '116.0.0.0' }
  },
  {
    name: 'ChromeOS',
    input: { userAgent: 'Mozilla/5.0 (X11; CrOS x86_64 14541.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' },
    expect: { osName: 'ChromeOS', deviceLabel: 'Chromebook', browserName: 'Chrome' }
  },
  {
    name: 'Android tablet',
    input: { userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36' },
    expect: { deviceType: 'tablet', deviceLabel: 'Samsung SM-X710', osLabel: 'Android 13' }
  },
  {
    name: 'Cursor Electron keeps app version',
    input: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Cursor/3.21.18 Chrome/148.0.7778.280 Electron/42.10.0 Safari/537.36',
      client: {
        maxTouchPoints: 10,
        uaClientHints: {
          brands: [{ brand: 'Not/A)Brand', version: '99' }, { brand: 'Chromium', version: '148' }],
          fullVersionList: [
            { brand: 'Not/A)Brand', version: '99.0.0.0' },
            { brand: 'Chromium', version: '148.0.7778.280' }
          ],
          mobile: false,
          platform: 'Windows',
          platformVersion: '19.0.0',
          architecture: 'x86',
          bitness: '64',
          formFactors: ['Desktop']
        }
      }
    },
    expect: { browserLabel: 'Cursor 3.21.18', osLabel: 'Windows 11', deviceType: 'desktop', deviceLabel: 'Windows PC', browserEngine: 'Blink', architecture: 'x86' }
  },
  {
    name: 'WhatsApp in-app Android',
    input: { userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36 WhatsApp/2.24' },
    expect: { inApp: 'WhatsApp', browserName: 'Chrome', deviceLabel: 'Google Pixel 7' }
  }
];

let failed = 0;
for (const test of cases) {
  const result = resolveClientEnvironment(test.input);
  const misses = Object.entries(test.expect).filter(([key, value]) => result[key] !== value);
  if (misses.length) {
    failed += 1;
    console.log('FAIL', test.name);
    for (const [key, value] of misses) {
      console.log(' ', key, 'expected', JSON.stringify(value), 'got', JSON.stringify(result[key]));
    }
  } else {
    console.log('ok', test.name);
  }
}

if (failed) {
  console.error(failed + ' failed');
  process.exit(1);
}
console.log('all passed');
