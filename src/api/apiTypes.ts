// src/api/apiTypes.ts
//
// Shared types for the Open-Meteo forecast API integration.
// Raw* types describe the exact shape returned by api.open-meteo.com.
// The non-Raw types are BWeather's normalized, app-facing shapes.

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms';

export interface ForecastRequestParams {
  latitude: number;
  longitude: number;
  temperatureUnit?: TemperatureUnit;
  windSpeedUnit?: WindSpeedUnit;
  timezone?: string; // defaults to 'auto'
}

/** Raw shape of the Open-Meteo /v1/forecast JSON response (fields we rely on). */
export interface RawForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation?: string;
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weather_code: number;
    cloud_cover: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    uv_index?: number;
    is_day: number; // 1 = day, 0 = night
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    precipitation: number[];
    rain: number[];
    showers: number[];
    snowfall: number[];
    weather_code: number[];
    cloud_cover: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    uv_index: number[];
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    rain_sum: number[];
    showers_sum: number[];
    snowfall_sum: number[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];
    wind_direction_10m_dominant: number[];
    uv_index_max: number[];
  };
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number;
  isDay: boolean;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  feelsLike: number;
  precipitationProbability: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  feelsLikeMax: number;
  feelsLikeMin: number;
  sunrise: string;
  sunset: string;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  rainSum: number;
  showersSum: number;
  snowfallSum: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirectionDominant: number;
  uvIndexMax: number;
}

export interface WeatherForecast {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  fetchedAt: string; // ISO timestamp, set client-side when the response was normalized
}

export type OpenMeteoErrorCode =
  | 'INVALID_COORDINATES'
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'RATE_LIMIT'
  | 'SERVER_ERROR'
  | 'MALFORMED_RESPONSE'
  | 'UNKNOWN_ERROR';

export class OpenMeteoApiError extends Error {
  code: OpenMeteoErrorCode;
  status?: number;

  constructor(code: OpenMeteoErrorCode, message: string, status?: number) {
    super(message);
    this.name = 'OpenMeteoApiError';
    this.code = code;
    this.status = status;
  }
}

// --- Geocoding ---

export interface RawGeocodingResult {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

export interface RawGeocodingResponse {
  results?: RawGeocodingResult[];
}

/** A single, app-facing geocoding search result. Also the shape used for favorites. */
export interface GeocodingResult {
  /** Stable id derived from coordinates, used to dedupe favorites. */
  id: string;
  name: string;
  administrativeArea: string | null;
  country: string | null;
  countryCode: string | null;
  latitude: number;
  longitude: number;
  timezone: string | null;
}
