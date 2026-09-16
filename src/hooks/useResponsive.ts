// src/hooks/useResponsive.ts

import { useWindowDimensions } from 'react-native';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  // Standard heuristic for tablet: smallest side is at least 600px
  const isTablet = Math.min(width, height) >= 600;
  const isLandscape = width > height;

  return {
    width,
    height,
    isTablet,
    isLandscape,
  };
}
