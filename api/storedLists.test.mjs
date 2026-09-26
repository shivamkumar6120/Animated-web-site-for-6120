import { normalizeRecordList } from './storedLists.js';

const nested = JSON.stringify([
  JSON.stringify([
    {
      sessionId: 'a',
      browser: 'Chrome',
      os: 'Windows',
      city: 'Pune',
      durationSeconds: 5,
      actions: ['page_view'],
      startTimestamp: '2026-09-26T05:29:55.075Z',
      startTime: '05:29:55 AM'
    },
    JSON.stringify([
      {
        sessionId: 'a',
        browser: 'Chrome 131.0.6778.139',
        os: 'Windows 11',
        city: 'Pune',
        durationSeconds: 16,
        actions: ['tap_to_begin'],
        startTimestamp: '2026-09-26T05:29:41.000Z',
        startTime: '05:29:41 AM',
        lastActiveTimestamp: '2026-09-26T05:30:00.000Z'
      }
    ])
  ])
]);

const sessions = normalizeRecordList([nested], 'sessionId');
if (sessions.length !== 1) {
  console.error('expected 1 session, got', sessions.length);
  process.exit(1);
}
const session = sessions[0];
if (session.browser !== 'Chrome 131.0.6778.139') {
  console.error('expected richer browser, got', session.browser);
  process.exit(1);
}
if (session.durationSeconds !== 16) {
  console.error('expected longest duration, got', session.durationSeconds);
  process.exit(1);
}
if (!session.actions.includes('page_view') || !session.actions.includes('tap_to_begin')) {
  console.error('expected merged actions', session.actions);
  process.exit(1);
}
if (session.startTime !== '05:29:41 AM') {
  console.error('expected earliest start', session.startTime);
  process.exit(1);
}

const whispers = normalizeRecordList(
  [JSON.stringify([{ id: 'w1', text: 'Yup, test one', time: '05:39:55 AM' }])],
  'id'
);
if (whispers.length !== 1 || whispers[0].text !== 'Yup, test one') {
  console.error('whisper unwrap failed', whispers);
  process.exit(1);
}

const clean = normalizeRecordList([{ sessionId: 'b', browser: 'Safari' }], 'sessionId');
if (clean.length !== 1 || clean[0].browser !== 'Safari') {
  console.error('clean list changed', clean);
  process.exit(1);
}

console.log('stored list tests passed');
