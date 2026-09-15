// src/services/weatherService.ts
//
// Adds location-keyed caching on top of the raw Open-Meteo API service.
// Screens/hooks should call this, never src/api/openMeteo.ts directly.

import { getWeatherForecast as fetchFromApi } from '../api/openMeteo';
import { ForecastRequestParams, WeatherForecast } from '../api/apiTypes';
import { weatherCacheKey } from '../utils/formatting';
import { getItem, setItem } from './storageService';

interface CachedForecast {
  data: WeatherForecast;
  cachedAt: string;
}

export async function getCachedForecast(
  params: ForecastRequestParams
): Promise<WeatherForecast | null> {
  const key = weatherCacheKey(
    params.latitude,
    params.longitude,
    params.temperatureUnit ?? 'celsius',
    params.windSpeedUnit ?? 'kmh'
  );
  const cached = await getItem<CachedForecast>(key);
  return cached?.data ?? null;
}

async function cacheForecast(params: ForecastRequestParams, data: WeatherForecast): Promise<void> {
  const key = weatherCacheKey(
    params.latitude,
    params.longitude,
    params.temperatureUnit ?? 'celsius',
    params.windSpeedUnit ?? 'kmh'
  );
  await setItem<CachedForecast>(key, { data, cachedAt: new Date().toISOString() });
}

/**
 * Fetches fresh weather and updates the cache. Throws OpenMeteoApiError on
 * failure.
 */
export async function fetchAndCacheForecast(
  params: ForecastRequestParams
): Promise<WeatherForecast> {
  const data = await fetchFromApi(params);
  await cacheForecast(params, data);
  return data;
}

export type WeatherFetchParams = ForecastRequestParams;

export interface WeatherFetchResult {
  forecast: WeatherForecast;
  /** True when this result came from cache because the live request failed (offline/error). */
  fromCache: boolean;
}

/**
 * Fetches live weather and updates the cache. If the live request fails
 * (offline, timeout, server error, etc.) and a cached forecast for this
 * exact location/unit combination exists, falls back to it and marks the
 * result as stale rather than surfacing the error. Only rethrows when there
 * is no live data *and* no cache to fall back on.
 */
export async function fetchWeather(params: WeatherFetchParams): Promise<WeatherFetchResult> {
  try {
    const forecast = await fetchAndCacheForecast(params);
    return { forecast, fromCache: false };
  } catch (err) {
    const cached = await getCachedForecast(params);
    if (cached) {
      return { forecast: cached, fromCache: true };
    }
    throw err;
  }
}
