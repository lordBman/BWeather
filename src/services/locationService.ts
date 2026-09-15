// src/services/locationService.ts
//
// Wraps device location permission + position retrieval behind a small,
// platform-agnostic API so the rest of the app never touches
// react-native-permissions / @react-native-community/geolocation directly.

import { Platform } from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  check,
  request,
  openSettings,
} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import { LocationPermissionStatus } from '../types/location';

const PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
});

function mapResult(result: string): LocationPermissionStatus {
  switch (result) {
    case RESULTS.GRANTED:
    case RESULTS.LIMITED:
      return 'granted';
    case RESULTS.DENIED:
      return 'denied';
    case RESULTS.BLOCKED:
      return 'permanently_denied';
    case RESULTS.UNAVAILABLE:
      return 'unavailable';
    default:
      return 'undetermined';
  }
}

export async function checkLocationPermission(): Promise<LocationPermissionStatus> {
  if (!PERMISSION) return 'unavailable';
  const result = await check(PERMISSION);
  return mapResult(result);
}

/**
 * Requests location permission exactly once. Callers must not call this
 * repeatedly after a denial — check the returned status and, if
 * 'permanently_denied', offer openDeviceSettings() instead of re-requesting.
 */
export async function requestLocationPermission(): Promise<LocationPermissionStatus> {
  if (!PERMISSION) return 'unavailable';
  const result = await request(PERMISSION);
  return mapResult(result);
}

export async function openDeviceSettings(): Promise<void> {
  await openSettings();
}

export interface DeviceCoordinates {
  latitude: number;
  longitude: number;
}

export function getCurrentPosition(): Promise<DeviceCoordinates> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => reject(error),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10 * 60 * 1000 }
    );
  });
}
