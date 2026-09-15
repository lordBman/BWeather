// src/api/openMeteo.ts
//
// Dedicated Open-Meteo forecast service.
// Responsibilities: build the request, execute it, validate the response,
// normalize it into app-facing types, and throw controlled OpenMeteoApiError
// instances on failure. No raw Open-Meteo shapes should leak past this file.

import { OPEN_METEO_BASE_URL, FORECAST_REQUEST_TIMEOUT_MS } from '../constants/config';
import {
  CurrentWeather,
  DailyForecast,
  ForecastRequestParams,
  HourlyForecast,
  OpenMeteoApiError,
  RawForecastResponse,
  WeatherForecast,
} from './apiTypes';

const CURRENT_VARS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation',
  'rain',
  'showers',
  'snowfall',
  'weather_code',
  'cloud_cover',
  'surface_pressure',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
  'uv_index',
  'is_day',
].join(',');

const HOURLY_VARS = [
  'temperature_2m',
  'apparent_temperature',
  'precipitation_probability',
  'precipitation',
  'rain',
  'showers',
  'snowfall',
  'weather_code',
  'cloud_cover',
  'relative_humidity_2m',
  'wind_speed_10m',
  'wind_direction_10m',
  'uv_index',
].join(',');

const DAILY_VARS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'apparent_temperature_max',
  'apparent_temperature_min',
  'sunrise',
  'sunset',
  'precipitation_sum',
  'precipitation_probability_max',
  'rain_sum',
  'showers_sum',
  'snowfall_sum',
  'wind_speed_10m_max',
  'wind_gusts_10m_max',
  'wind_direction_10m_dominant',
  'uv_index_max',
].join(',');

/** Validates latitude/longitude are real, finite coordinates. */
export function assertValidCoordinates(latitude: number, longitude: number): void {
  const isFiniteNumber = (n: number) => typeof n === 'number' && Number.isFinite(n);

  if (
    !isFiniteNumber(latitude) ||
    !isFiniteNumber(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new OpenMeteoApiError(
      'INVALID_COORDINATES',
      `Invalid coordinates: latitude=${latitude}, longitude=${longitude}`
    );
  }
}

/** Builds the fully-qualified Open-Meteo forecast request URL. */
export function buildForecastUrl(params: ForecastRequestParams): string {
  const {
    latitude,
    longitude,
    temperatureUnit = 'celsius',
    windSpeedUnit = 'kmh',
    timezone = 'auto',
  } = params;

  assertValidCoordinates(latitude, longitude);

  const query = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: CURRENT_VARS,
    hourly: HOURLY_VARS,
    daily: DAILY_VARS,
    temperature_unit: temperatureUnit,
    wind_speed_unit: windSpeedUnit,
    timezone,
  });

  return `${OPEN_METEO_BASE_URL}/forecast?${query.toString()}`;
}

/** Confirms the parsed JSON has the minimum shape BWeather depends on. */
export function validateForecastResponse(
  data: unknown
): asserts data is RawForecastResponse {
  if (typeof data !== 'object' || data === null) {
    throw new OpenMeteoApiError('MALFORMED_RESPONSE', 'Response is not a JSON object.');
  }

  const candidate = data as Record<string, unknown>;

  if (typeof candidate.latitude !== 'number' || typeof candidate.longitude !== 'number') {
    throw new OpenMeteoApiError('MALFORMED_RESPONSE', 'Response is missing coordinates.');
  }

  if (!candidate.current || typeof candidate.current !== 'object') {
    throw new OpenMeteoApiError('MALFORMED_RESPONSE', 'Response is missing current weather.');
  }

  if (!candidate.hourly || typeof candidate.hourly !== 'object') {
    throw new OpenMeteoApiError('MALFORMED_RESPONSE', 'Response is missing hourly forecast.');
  }

  if (!candidate.daily || typeof candidate.daily !== 'object') {
    throw new OpenMeteoApiError('MALFORMED_RESPONSE', 'Response is missing daily forecast.');
  }

  const hourly = candidate.hourly as Record<string, unknown>;
  const daily = candidate.daily as Record<string, unknown>;

  if (!Array.isArray(hourly.time) || !Array.isArray(hourly.temperature_2m)) {
    throw new OpenMeteoApiError('MALFORMED_RESPONSE', 'Hourly forecast arrays are malformed.');
  }

  if (!Array.isArray(daily.time) || !Array.isArray(daily.temperature_2m_max)) {
    throw new OpenMeteoApiError('MALFORMED_RESPONSE', 'Daily forecast arrays are malformed.');
  }

  // All hourly/daily series must be the same length as their `time` array,
  // otherwise zipping them together would silently misalign data.
  const hourlyLength = hourly.time.length;
  for (const key of Object.keys(hourly)) {
    const series = hourly[key];
    if (Array.isArray(series) && series.length !== hourlyLength) {
      throw new OpenMeteoApiError(
        'MALFORMED_RESPONSE',
        `Hourly series "${key}" length does not match hourly.time length.`
      );
    }
  }

  const dailyLength = daily.time.length;
  for (const key of Object.keys(daily)) {
    const series = daily[key];
    if (Array.isArray(series) && series.length !== dailyLength) {
      throw new OpenMeteoApiError(
        'MALFORMED_RESPONSE',
        `Daily series "${key}" length does not match daily.time length.`
      );
    }
  }
}

function normalizeCurrent(raw: RawForecastResponse['current']): CurrentWeather {
  // validateForecastResponse guarantees this is present before we get here.
  const c = raw as NonNullable<RawForecastResponse['current']>;
  return {
    time: c.time,
    temperature: c.temperature_2m,
    feelsLike: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    precipitation: c.precipitation,
    rain: c.rain,
    showers: c.showers,
    snowfall: c.snowfall,
    weatherCode: c.weather_code,
    cloudCover: c.cloud_cover,
    pressure: c.surface_pressure,
    windSpeed: c.wind_speed_10m,
    windDirection: c.wind_direction_10m,
    windGusts: c.wind_gusts_10m,
    uvIndex: c.uv_index ?? 0,
    isDay: c.is_day === 1,
  };
}

function normalizeHourly(raw: RawForecastResponse['hourly']): HourlyForecast[] {
  const h = raw as NonNullable<RawForecastResponse['hourly']>;
  return h.time.map((time, i) => ({
    time,
    temperature: h.temperature_2m[i],
    feelsLike: h.apparent_temperature[i],
    precipitationProbability: h.precipitation_probability[i],
    precipitation: h.precipitation[i],
    rain: h.rain[i],
    showers: h.showers[i],
    snowfall: h.snowfall[i],
    weatherCode: h.weather_code[i],
    cloudCover: h.cloud_cover[i],
    humidity: h.relative_humidity_2m[i],
    windSpeed: h.wind_speed_10m[i],
    windDirection: h.wind_direction_10m[i],
    uvIndex: h.uv_index[i],
  }));
}

function normalizeDaily(raw: RawForecastResponse['daily']): DailyForecast[] {
  const d = raw as NonNullable<RawForecastResponse['daily']>;
  return d.time.map((date, i) => ({
    date,
    weatherCode: d.weather_code[i],
    temperatureMax: d.temperature_2m_max[i],
    temperatureMin: d.temperature_2m_min[i],
    feelsLikeMax: d.apparent_temperature_max[i],
    feelsLikeMin: d.apparent_temperature_min[i],
    sunrise: d.sunrise[i],
    sunset: d.sunset[i],
    precipitationSum: d.precipitation_sum[i],
    precipitationProbabilityMax: d.precipitation_probability_max[i],
    rainSum: d.rain_sum[i],
    showersSum: d.showers_sum[i],
    snowfallSum: d.snowfall_sum[i],
    windSpeedMax: d.wind_speed_10m_max[i],
    windGustsMax: d.wind_gusts_10m_max[i],
    windDirectionDominant: d.wind_direction_10m_dominant[i],
    uvIndexMax: d.uv_index_max[i],
  }));
}

/** Normalizes a validated raw Open-Meteo response into BWeather's app types. */
export function normalizeForecastResponse(raw: RawForecastResponse): WeatherForecast {
  return {
    latitude: raw.latitude,
    longitude: raw.longitude,
    timezone: raw.timezone,
    current: normalizeCurrent(raw.current),
    hourly: normalizeHourly(raw.hourly),
    daily: normalizeDaily(raw.daily),
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Fetches, validates, and normalizes the Open-Meteo forecast for a location.
 * Never throws a raw network/HTTP error — always throws OpenMeteoApiError.
 */
export async function getWeatherForecast(
  params: ForecastRequestParams
): Promise<WeatherForecast> {
  const url = buildForecastUrl(params);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FORECAST_REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new OpenMeteoApiError('TIMEOUT', 'The weather request timed out.');
    }
    throw new OpenMeteoApiError(
      'NETWORK_ERROR',
      'Unable to reach the weather service. Check your internet connection.'
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new OpenMeteoApiError(
        'RATE_LIMIT',
        'Too many weather requests. Please try again shortly.',
        response.status
      );
    }
    if (response.status >= 500) {
      throw new OpenMeteoApiError(
        'SERVER_ERROR',
        'The weather service is temporarily unavailable.',
        response.status
      );
    }
    throw new OpenMeteoApiError(
      'SERVER_ERROR',
      `Weather request failed with status ${response.status}.`,
      response.status
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new OpenMeteoApiError('MALFORMED_RESPONSE', 'Weather response was not valid JSON.');
  }

  validateForecastResponse(data);
  return normalizeForecastResponse(data);
}
