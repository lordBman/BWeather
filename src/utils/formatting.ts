export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatPressure(hPa: number): string {
  return `${Math.round(hPa)} hPa`;
}

export function formatPrecipitation(mm: number): string {
  if (mm <= 0) return '0 mm';
  return `${mm.toFixed(mm < 1 ? 1 : 0)} mm`;
}

export function uvCategory(uvIndex: number): string {
  if (uvIndex < 3) return 'Low';
  if (uvIndex < 6) return 'Moderate';
  if (uvIndex < 8) return 'High';
  if (uvIndex < 11) return 'Very High';
  return 'Extreme';
}

/** Alias used by screens showing "Last updated / Offline" banners. */
export { formatLastUpdated as formatRelativeTime } from './dateTime';

/** Builds a stable AsyncStorage cache key for a location + unit combination. */
export function weatherCacheKey(
  latitude: number,
  longitude: number,
  temperatureUnit: string,
  windSpeedUnit: string
): string {
  return `weather:${latitude.toFixed(4)}:${longitude.toFixed(4)}:${temperatureUnit}:${windSpeedUnit}`;
}
