// src/api/geocoding.ts
//
// Dedicated Open-Meteo geocoding service: builds the request, validates and
// normalizes the response, and throws controlled OpenMeteoApiError instances.

import { OPEN_METEO_GEOCODING_URL, FORECAST_REQUEST_TIMEOUT_MS } from '../constants/config';
import { GeocodingResult, OpenMeteoApiError, RawGeocodingResponse } from './apiTypes';

export function buildGeocodingUrl(query: string, count = 10): string {
  const params = new URLSearchParams({
    name: query,
    count: String(count),
    language: 'en',
    format: 'json',
  });
  return `${OPEN_METEO_GEOCODING_URL}/search?${params.toString()}`;
}

export function normalizeGeocodingResponse(raw: RawGeocodingResponse): GeocodingResult[] {
  if (!raw.results) return [];
  return raw.results.map((r) => ({
    id: `${r.latitude.toFixed(4)}:${r.longitude.toFixed(4)}`,
    name: r.name,
    administrativeArea: r.admin1 ?? null,
    country: r.country ?? null,
    countryCode: r.country_code ?? null,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone ?? null,
  }));
}

/**
 * Searches for cities/locations by name. Returns an empty array (rather than
 * throwing) when the query is too short, since callers debounce keystrokes
 * and shouldn't need to special-case "not enough characters yet".
 */
export async function searchLocations(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const url = buildGeocodingUrl(trimmed);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FORECAST_REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new OpenMeteoApiError('TIMEOUT', 'The location search timed out.');
    }
    throw new OpenMeteoApiError(
      'NETWORK_ERROR',
      'Unable to reach the location search service.'
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new OpenMeteoApiError('RATE_LIMIT', 'Too many searches. Try again shortly.', response.status);
    }
    throw new OpenMeteoApiError(
      'SERVER_ERROR',
      `Location search failed with status ${response.status}.`,
      response.status
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new OpenMeteoApiError('MALFORMED_RESPONSE', 'Location search response was not valid JSON.');
  }

  if (typeof data !== 'object' || data === null) {
    throw new OpenMeteoApiError('MALFORMED_RESPONSE', 'Location search response was malformed.');
  }

  return normalizeGeocodingResponse(data as RawGeocodingResponse);
}
