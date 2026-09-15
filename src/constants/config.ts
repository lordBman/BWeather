// src/constants/config.ts

export const OPEN_METEO_BASE_URL =
  process.env.OPEN_METEO_BASE_URL ?? 'https://api.open-meteo.com/v1';

export const OPEN_METEO_GEOCODING_URL =
  process.env.OPEN_METEO_GEOCODING_URL ?? 'https://geocoding-api.open-meteo.com/v1';

/** Abort the forecast request if it hasn't resolved within this window. */
export const FORECAST_REQUEST_TIMEOUT_MS = 10_000;

/** Minimum characters before triggering a geocoding search request. */
export const MIN_SEARCH_QUERY_LENGTH = 2;

/** Debounce delay for search input, in ms. */
export const SEARCH_DEBOUNCE_MS = 350;

/** How old cached weather can be before we consider it worth a silent background refresh. */
export const WEATHER_STALE_AFTER_MS = 15 * 60 * 1000; // 15 minutes
