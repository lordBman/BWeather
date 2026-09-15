// src/services/storageService.ts
//
// Thin JSON-aware wrapper around AsyncStorage. Nothing else in the app
// should import AsyncStorage directly.

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    // Corrupt or unreadable entry — treat as absent rather than crashing.
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export async function getAllKeysWithPrefix(prefix: string): Promise<string[]> {
  const keys = await AsyncStorage.getAllKeys();
  return keys.filter((k) => k.startsWith(prefix));
}
