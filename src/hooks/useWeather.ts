// src/hooks/useWeather.ts

import { useCallback, useEffect } from 'react';
import { useWeatherStore } from '../store/weatherStore';
import { useSettingsStore } from '../store/settingsStore';
import { useLocationStore } from '../store/locationStore';
import { WeatherFetchParams } from '../services/weatherService';

export function useWeather() {
  const forecast = useWeatherStore((s) => s.forecast);
  const loading = useWeatherStore((s) => s.loading);
  const refreshing = useWeatherStore((s) => s.refreshing);
  const error = useWeatherStore((s) => s.error);
  const isStale = useWeatherStore((s) => s.isStale);
  const lastUpdated = useWeatherStore((s) => s.lastUpdated);
  const load = useWeatherStore((s) => s.load);
  const refresh = useWeatherStore((s) => s.refresh);

  const selectedLocation = useLocationStore((s) => s.selectedLocation);
  const temperatureUnit = useSettingsStore((s) => s.temperatureUnit);
  const windSpeedUnit = useSettingsStore((s) => s.windSpeedUnit);

  const params: WeatherFetchParams | null = selectedLocation
    ? {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        temperatureUnit,
        windSpeedUnit,
      }
    : null;

  useEffect(() => {
    if (params) {
      load(params);
    }
    // Re-fetch whenever the location or unit settings change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedLocation?.id,
    temperatureUnit,
    windSpeedUnit,
  ]);

  const refreshWeather = useCallback(() => {
    if (params) return refresh(params);
    return Promise.resolve();
  }, [params, refresh]);

  return { forecast, loading, refreshing, error, isStale, lastUpdated, refreshWeather };
}
