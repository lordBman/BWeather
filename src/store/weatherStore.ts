// src/store/weatherStore.ts

import { create } from 'zustand';
import { WeatherForecast } from '../api/apiTypes';
import { OpenMeteoApiError } from '../api/apiTypes';
import { fetchWeather, WeatherFetchParams } from '../services/weatherService';

interface WeatherStore {
  forecast: WeatherForecast | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  isStale: boolean;
  lastUpdated: string | null;

  load: (params: WeatherFetchParams) => Promise<void>;
  refresh: (params: WeatherFetchParams) => Promise<void>;
}

function friendlyMessage(err: unknown): string {
  if (err instanceof OpenMeteoApiError) {
    switch (err.code) {
      case 'NETWORK_ERROR':
        return 'Check your internet connection and try again.';
      case 'TIMEOUT':
        return 'The request took too long. Please try again.';
      case 'RATE_LIMIT':
        return 'Too many requests. Please wait a moment and try again.';
      case 'INVALID_COORDINATES':
        return 'That location looks invalid. Try searching again.';
      default:
        return 'Unable to load weather. Please try again.';
    }
  }
  return 'Unable to load weather. Please try again.';
}

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  forecast: null,
  loading: false,
  refreshing: false,
  error: null,
  isStale: false,
  lastUpdated: null,

  load: async (params) => {
    if (get().loading) return; // avoid duplicate concurrent requests
    set({ loading: true, error: null });
    try {
      const { forecast, fromCache } = await fetchWeather(params);
      set({
        forecast,
        isStale: fromCache,
        lastUpdated: forecast.fetchedAt,
        loading: false,
        error: null,
      });
    } catch (err) {
      set({ loading: false, error: friendlyMessage(err) });
    }
  },

  refresh: async (params) => {
    if (get().refreshing) return; // avoid duplicate concurrent requests
    set({ refreshing: true, error: null });
    try {
      const { forecast, fromCache } = await fetchWeather(params);
      set({
        forecast,
        isStale: fromCache,
        lastUpdated: forecast.fetchedAt,
        refreshing: false,
        error: null,
      });
    } catch (err) {
      set({ refreshing: false, error: friendlyMessage(err) });
    }
  },
}));
