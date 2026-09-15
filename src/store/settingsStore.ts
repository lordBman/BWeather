// src/store/settingsStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TemperatureUnit, WindSpeedUnit } from '../api/apiTypes';
import { ColorSchemePreference, ThemePreference } from '../types/settings';

interface SettingsStore {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  theme: ThemePreference;
  colorScheme: ColorSchemePreference;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;
  setTheme: (theme: ThemePreference) => void;
  setColorScheme: (colorScheme: ColorSchemePreference) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      temperatureUnit: 'celsius',
      windSpeedUnit: 'kmh',
      theme: 'system',
      colorScheme: 'ocean',
      setTemperatureUnit: (temperatureUnit) => set({ temperatureUnit }),
      setWindSpeedUnit: (windSpeedUnit) => set({ windSpeedUnit }),
      setTheme: (theme) => set({ theme }),
      setColorScheme: (colorScheme) => set({ colorScheme }),
    }),
    {
      name: 'bweather:settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
