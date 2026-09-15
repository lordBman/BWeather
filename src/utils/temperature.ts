// src/utils/temperature.ts
//
// formatTemperature is called from many components with just a raw value —
// the temperature unit is a global setting, not something every call site
// should have to plumb through. We read it directly from the settings store
// via getState(), which is safe to call outside of React (no subscription,
// just a snapshot read at format time).

import { useSettingsStore } from '../store/settingsStore';
import { TemperatureUnit } from '../api/apiTypes';

const UNIT_SYMBOL: Record<TemperatureUnit, string> = {
  celsius: '°C',
  fahrenheit: '°F',
};

/** Rounds to the nearest whole degree — weather UIs should never show decimals. */
export function formatTemperature(value: number, withUnit = true): string {
  const unit = useSettingsStore.getState().temperatureUnit;
  const rounded = Math.round(value);
  return withUnit ? `${rounded}${UNIT_SYMBOL[unit]}` : `${rounded}°`;
}

export function unitSymbol(unit: TemperatureUnit): string {
  return UNIT_SYMBOL[unit];
}
