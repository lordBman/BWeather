// src/utils/weatherCode.ts
//
// Centralized WMO weather-code -> description/icon/category mapping.
// Nothing outside this file should hardcode a weather code's meaning.

export interface WeatherCodeInfo {
  description: string;
  iconDay: string;
  iconNight: string;
}

export type WeatherCategory = 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog' | 'night';

const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0: { description: 'Clear sky', iconDay: 'mdi:weather-sunny', iconNight: 'mdi:weather-night' },
  1: { description: 'Mainly clear', iconDay: 'mdi:weather-sunny', iconNight: 'mdi:weather-night' },
  2: {
    description: 'Partly cloudy',
    iconDay: 'mdi:weather-partly-cloudy',
    iconNight: 'mdi:weather-night-partly-cloudy',
  },
  3: { description: 'Overcast', iconDay: 'mdi:weather-cloudy', iconNight: 'mdi:weather-cloudy' },
  45: { description: 'Fog', iconDay: 'mdi:weather-fog', iconNight: 'mdi:weather-fog' },
  48: { description: 'Depositing rime fog', iconDay: 'mdi:weather-fog', iconNight: 'mdi:weather-fog' },
  51: { description: 'Light drizzle', iconDay: 'mdi:weather-rainy', iconNight: 'mdi:weather-rainy' },
  53: { description: 'Moderate drizzle', iconDay: 'mdi:weather-rainy', iconNight: 'mdi:weather-rainy' },
  55: { description: 'Dense drizzle', iconDay: 'mdi:weather-rainy', iconNight: 'mdi:weather-rainy' },
  56: { description: 'Light freezing drizzle', iconDay: 'mdi:weather-hail', iconNight: 'mdi:weather-hail' },
  57: { description: 'Dense freezing drizzle', iconDay: 'mdi:weather-hail', iconNight: 'mdi:weather-hail' },
  61: { description: 'Slight rain', iconDay: 'mdi:weather-pouring', iconNight: 'mdi:weather-pouring' },
  63: { description: 'Moderate rain', iconDay: 'mdi:weather-pouring', iconNight: 'mdi:weather-pouring' },
  65: { description: 'Heavy rain', iconDay: 'mdi:weather-pouring', iconNight: 'mdi:weather-pouring' },
  66: { description: 'Light freezing rain', iconDay: 'mdi:weather-hail', iconNight: 'mdi:weather-hail' },
  67: { description: 'Heavy freezing rain', iconDay: 'mdi:weather-hail', iconNight: 'mdi:weather-hail' },
  71: { description: 'Slight snow', iconDay: 'mdi:weather-snowy', iconNight: 'mdi:weather-snowy' },
  73: { description: 'Moderate snow', iconDay: 'mdi:weather-snowy', iconNight: 'mdi:weather-snowy' },
  75: { description: 'Heavy snow', iconDay: 'mdi:weather-snowy-heavy', iconNight: 'mdi:weather-snowy-heavy' },
  77: { description: 'Snow grains', iconDay: 'mdi:weather-snowy', iconNight: 'mdi:weather-snowy' },
  80: {
    description: 'Slight rain showers',
    iconDay: 'mdi:weather-partly-rainy',
    iconNight: 'mdi:weather-partly-rainy',
  },
  81: { description: 'Moderate rain showers', iconDay: 'mdi:weather-pouring', iconNight: 'mdi:weather-pouring' },
  82: { description: 'Violent rain showers', iconDay: 'mdi:weather-pouring', iconNight: 'mdi:weather-pouring' },
  85: {
    description: 'Slight snow showers',
    iconDay: 'mdi:weather-partly-snowy',
    iconNight: 'mdi:weather-partly-snowy',
  },
  86: {
    description: 'Heavy snow showers',
    iconDay: 'mdi:weather-snowy-heavy',
    iconNight: 'mdi:weather-snowy-heavy',
  },
  95: { description: 'Thunderstorm', iconDay: 'mdi:weather-lightning', iconNight: 'mdi:weather-lightning' },
  96: {
    description: 'Thunderstorm with slight hail',
    iconDay: 'mdi:weather-lightning-rainy',
    iconNight: 'mdi:weather-lightning-rainy',
  },
  99: {
    description: 'Thunderstorm with heavy hail',
    iconDay: 'mdi:weather-lightning-rainy',
    iconNight: 'mdi:weather-lightning-rainy',
  },
};

const FALLBACK: WeatherCodeInfo = {
  description: 'Unknown',
  iconDay: 'mdi:weather-cloudy',
  iconNight: 'mdi:weather-cloudy',
};

export function getWeatherCodeInfo(code: number): WeatherCodeInfo {
  return WEATHER_CODE_MAP[code] ?? FALLBACK;
}

export function getWeatherDescription(code: number): string {
  return getWeatherCodeInfo(code).description;
}

/** Returns the correct Iconify identifier for a weather code, given day/night. */
export function getWeatherIcon(code: number, isDay: boolean): string {
  const info = getWeatherCodeInfo(code);
  return isDay ? info.iconDay : info.iconNight;
}

/** Broad condition bucket, used to pick the current-weather card's accent gradient. */
export function getWeatherCategory(code: number, isDay: boolean): WeatherCategory {
  if (!isDay) return 'night';
  if (code === 0 || code === 1) return 'clear';
  if (code === 2 || code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  return 'rain';
}
