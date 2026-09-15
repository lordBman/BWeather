// src/store/locationStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Location, LocationPermissionStatus } from '../types/location';

interface LocationStore {
  currentLocation: Location | null;
  selectedLocation: Location | null;
  favorites: Location[];
  permissionStatus: LocationPermissionStatus;

  setCurrentLocation: (location: Location) => void;
  setSelectedLocation: (location: Location) => void;
  setPermissionStatus: (status: LocationPermissionStatus) => void;

  addFavorite: (location: Location) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  reorderFavorites: (fromIndex: number, toIndex: number) => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set, get) => ({
      currentLocation: null,
      selectedLocation: null,
      favorites: [],
      permissionStatus: 'undetermined',

      setCurrentLocation: (location) => set({ currentLocation: location }),
      setSelectedLocation: (location) => set({ selectedLocation: location }),
      setPermissionStatus: (status) => set({ permissionStatus: status }),

      addFavorite: (location) => {
        const { favorites } = get();
        // Prevent duplicates based on the stable coordinate-derived id.
        if (favorites.some((f) => f.id === location.id)) return;
        set({ favorites: [...favorites, location] });
      },

      removeFavorite: (id) => {
        set({ favorites: get().favorites.filter((f) => f.id !== id) });
      },

      isFavorite: (id) => get().favorites.some((f) => f.id === id),

      reorderFavorites: (fromIndex, toIndex) => {
        const favorites = [...get().favorites];
        if (
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex >= favorites.length ||
          toIndex >= favorites.length
        ) {
          return;
        }
        const [moved] = favorites.splice(fromIndex, 1);
        favorites.splice(toIndex, 0, moved);
        set({ favorites });
      },
    }),
    {
      name: 'bweather:location',
      storage: createJSONStorage(() => AsyncStorage),
      // Don't persist transient runtime state — only favorites and the last
      // selected location should survive an app restart.
      partialize: (state) => ({
        favorites: state.favorites,
        selectedLocation: state.selectedLocation,
      }),
    }
  )
);
