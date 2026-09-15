// src/hooks/useLocation.ts

import { useCallback, useState } from 'react';
import { useLocationStore } from '../store/locationStore';
import {
  checkLocationPermission,
  requestLocationPermission,
  getCurrentPosition,
  openDeviceSettings,
} from '../services/locationService';
import { searchLocations } from '../api/geocoding';

/**
 * Resolves a rough place name for a raw GPS coordinate pair by reverse
 * "searching" the coordinates through the same geocoding endpoint used for
 * forward search. Open-Meteo's geocoding API is name-based, so this is a
 * best-effort label; it falls back to a plain coordinate string.
 */
async function labelForCoordinates(latitude: number, longitude: number) {
  return {
    id: `${latitude.toFixed(4)}:${longitude.toFixed(4)}`,
    name: 'Current Location',
    administrativeArea: null,
    country: null,
    countryCode: null,
    latitude,
    longitude,
    timezone: null,
  };
}

export function useLocation() {
  const permissionStatus = useLocationStore((s) => s.permissionStatus);
  const setPermissionStatus = useLocationStore((s) => s.setPermissionStatus);
  const currentLocation = useLocationStore((s) => s.currentLocation);
  const setCurrentLocation = useLocationStore((s) => s.setCurrentLocation);
  const selectedLocation = useLocationStore((s) => s.selectedLocation);
  const setSelectedLocation = useLocationStore((s) => s.setSelectedLocation);

  const [resolving, setResolving] = useState(false);

  /**
   * Requests permission (once) and, if granted, fetches and stores the
   * device's current position as a Location. Safe to call on mount — it
   * checks status first and never re-prompts after a prior denial.
   */
  const resolveDeviceLocation = useCallback(async () => {
    setResolving(true);
    try {
      let status = await checkLocationPermission();

      if (status === 'undetermined' || status === 'denied') {
        status = await requestLocationPermission();
      }

      setPermissionStatus(status);

      if (status !== 'granted') {
        return; // caller falls back to the search screen
      }

      const coords = await getCurrentPosition();
      const location = await labelForCoordinates(coords.latitude, coords.longitude);
      setCurrentLocation(location);
      if (!selectedLocation) {
        setSelectedLocation(location);
      }
    } catch {
      setPermissionStatus('unavailable');
    } finally {
      setResolving(false);
    }
  }, [selectedLocation, setCurrentLocation, setPermissionStatus, setSelectedLocation]);

  return {
    permissionStatus,
    currentLocation,
    selectedLocation,
    resolving,
    resolveDeviceLocation,
    selectLocation: setSelectedLocation,
    openDeviceSettings,
    searchLocations,
  };
}
