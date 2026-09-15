import { TemperatureUnit, WindSpeedUnit } from '../api/apiTypes';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ColorSchemePreference = 'ocean' | 'forest' | 'sunset';

export interface SettingsState {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  theme: ThemePreference;
  colorScheme: ColorSchemePreference;
}
