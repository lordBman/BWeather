import { WindSpeedUnit } from '../api/apiTypes';

const COMPASS_POINTS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
];

/** Converts a wind direction in degrees (0-360) to a 16-point compass label. */
export function degreesToCompass(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return COMPASS_POINTS[index];
}

const UNIT_LABEL: Record<WindSpeedUnit, string> = {
  kmh: 'km/h',
  mph: 'mph',
  ms: 'm/s',
};

export function formatWindSpeed(speed: number, unit: WindSpeedUnit): string {
  return `${Math.round(speed)} ${UNIT_LABEL[unit]}`;
}

export function formatWind(speed: number, direction: number, unit: WindSpeedUnit): string {
  return `${formatWindSpeed(speed, unit)} ${degreesToCompass(direction)}`;
}
