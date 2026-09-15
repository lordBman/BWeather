// src/utils/dateTime.ts
//
// Weather timestamps come back in the *location's* local time already
// (Open-Meteo is requested with timezone=auto), as naive "YYYY-MM-DDTHH:mm"
// strings with no offset. We must NOT run these through the device's local
// timezone conversion — we parse the components directly instead, treating
// them as already being in the target location's time, using UTC internally
// purely as a neutral clock (never mixed with real UTC timestamps).

function parseNaiveDateTime(value: string): Date {
  const [datePart, timePart = '00:00'] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour, minute));
}

export function formatHourLabel(isoLike: string): string {
  const date = parseNaiveDateTime(isoLike);
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', timeZone: 'UTC' }).format(date);
}

export function formatClockTime(isoLike: string): string {
  const date = parseNaiveDateTime(isoLike);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(date);
}

export function formatDayName(isoDate: string, opts: { short?: boolean } = {}): string {
  const date = parseNaiveDateTime(isoDate);
  return new Intl.DateTimeFormat('en-US', {
    weekday: opts.short ? 'short' : 'long',
    timeZone: 'UTC',
  }).format(date);
}

export function formatFullDate(isoDate: string): string {
  const date = parseNaiveDateTime(isoDate);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** True when two location-local timestamps fall in the same calendar hour. */
export function isSameHour(a: string, b: string): boolean {
  const da = parseNaiveDateTime(a);
  const db = parseNaiveDateTime(b);
  return (
    da.getUTCFullYear() === db.getUTCFullYear() &&
    da.getUTCMonth() === db.getUTCMonth() &&
    da.getUTCDate() === db.getUTCDate() &&
    da.getUTCHours() === db.getUTCHours()
  );
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

/**
 * Labels a daily-forecast entry as "Today", "Tomorrow", or its short weekday
 * name, relative to another location-local date (usually daily[0].date).
 */
export function relativeDayLabel(isoDate: string, referenceIsoDate?: string): string {
  if (!referenceIsoDate) return formatDayName(isoDate, { short: true });

  const target = parseNaiveDateTime(isoDate);
  const reference = parseNaiveDateTime(referenceIsoDate);

  if (isSameLocalDay(target, reference)) return 'Today';

  const tomorrow = new Date(reference);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  if (isSameLocalDay(target, tomorrow)) return 'Tomorrow';

  return formatDayName(isoDate, { short: true });
}

/**
 * Returns how far through the daylight window `currentTimeIso` is, as a
 * value clamped to [0, 1] — 0 at sunrise, 1 at sunset. Used to position the
 * sun marker on the SunPath track. Times before sunrise or after sunset
 * clamp to the nearest edge rather than extrapolating off the track.
 */
export function dayProgress(currentTimeIso: string, sunriseIso: string, sunsetIso: string): number {
  const current = parseNaiveDateTime(currentTimeIso).getTime();
  const sunrise = parseNaiveDateTime(sunriseIso).getTime();
  const sunset = parseNaiveDateTime(sunsetIso).getTime();

  if (sunset <= sunrise) return 0.5;
  const progress = (current - sunrise) / (sunset - sunrise);
  return Math.min(1, Math.max(0, progress));
}

/** Minutes elapsed since a *real* ISO timestamp with offset (e.g. fetchedAt). */
export function minutesSince(timestampIso: string): number {
  const then = new Date(timestampIso).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - then) / 60000));
}

export function formatLastUpdated(timestampIso: string): string {
  const minutes = minutesSince(timestampIso);
  if (minutes < 1) return 'Just now';
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? '1 day ago' : `${days} days ago`;
}
