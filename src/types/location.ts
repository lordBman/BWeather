import { GeocodingResult } from '../api/apiTypes';

/** A location the app can show weather for — either found via search or the device GPS. */
export type Location = GeocodingResult;

export type LocationPermissionStatus =
  | 'undetermined'
  | 'granted'
  | 'denied'
  | 'permanently_denied'
  | 'unavailable';
