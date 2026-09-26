function formatDuration(seconds = 0) {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  if (total <= 0) return '0s';
  if (total < 60) return `${total}s`;
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}m ${secs}s`;
}

export function unwrapStored(value, depth = 0) {
  if (value == null || depth > 30) return [];

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed.startsWith('[') && !trimmed.startsWith('{') && !trimmed.startsWith('"')) return [];
    try {
      return unwrapStored(JSON.parse(trimmed), depth + 1);
    } catch {
      return [];
    }
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => unwrapStored(item, depth + 1));
  }

  if (typeof value === 'object') return [value];
  return [];
}

function richness(record) {
  if (!record || typeof record !== 'object') return 0;
  let score = 0;
  for (const value of Object.values(record)) {
    if (value == null || value === '' || value === 'Unknown') continue;
    score += 1;
  }
  if (record.browserVersion) score += 3;
  if (record.environment) score += 3;
  if (record.city) score += 2;
  if (record.mapsUrl) score += 2;
  return score;
}

function fillBlanks(primary, secondary) {
  const merged = { ...primary };
  for (const [key, value] of Object.entries(secondary || {})) {
    if (key === 'actions') continue;
    const current = merged[key];
    if (current == null || current === '' || current === 'Unknown' || current === 'Unknown OS' || current === 'Unknown Browser') {
      if (value != null && value !== '') merged[key] = value;
    }
  }
  return merged;
}

export function dedupeRecords(records, idKey) {
  const byId = new Map();

  records.forEach((record, index) => {
    if (!record || typeof record !== 'object' || Array.isArray(record)) return;
    const id = record[idKey] || `row-${index}-${richness(record)}`;
    const previous = byId.get(id);
    if (!previous) {
      byId.set(id, {
        ...record,
        actions: Array.isArray(record.actions) ? [...record.actions] : record.actions
      });
      return;
    }

    const primary = richness(record) >= richness(previous) ? record : previous;
    const secondary = primary === record ? previous : record;
    const merged = fillBlanks(primary, secondary);
    const actions = [...new Set([...(previous.actions || []), ...(record.actions || [])])];
    if (actions.length) merged.actions = actions;

    const duration = Math.max(Number(previous.durationSeconds) || 0, Number(record.durationSeconds) || 0);
    if (duration) {
      merged.durationSeconds = duration;
      merged.durationFormatted = formatDuration(duration);
    }

    const earlier = [previous, record]
      .filter((item) => item.startTimestamp)
      .sort((a, b) => String(a.startTimestamp).localeCompare(String(b.startTimestamp)))[0];
    if (earlier) {
      merged.startTimestamp = earlier.startTimestamp;
      merged.startTime = earlier.startTime || merged.startTime;
      merged.date = earlier.date || merged.date;
    }

    const later = [previous, record]
      .filter((item) => item.lastActiveTimestamp)
      .sort((a, b) => String(b.lastActiveTimestamp).localeCompare(String(a.lastActiveTimestamp)))[0];
    if (later) {
      merged.lastActiveTimestamp = later.lastActiveTimestamp;
      merged.lastActiveTime = later.lastActiveTime || merged.lastActiveTime;
      if (later.endedAt) merged.endedAt = later.endedAt;
    }

    byId.set(id, merged);
  });

  return [...byId.values()];
}

export function normalizeRecordList(value, idKey) {
  return dedupeRecords(unwrapStored(value), idKey);
}
