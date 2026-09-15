// src/components/common/Skeleton.tsx
//
// Lightweight animated placeholder used while weather data loads.

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { radius } from '../../constants/spacing';

interface SkeletonProps {
  width: number | `${number}%`;
  height: number;
  style?: ViewStyle;
}

export function Skeleton({ width, height, style }: SkeletonProps) {
  const { colors } = useTheme();
  const shimmerPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmerPosition, {
        toValue: 1,
        duration: 1100,
        useNativeDriver: false,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerPosition]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: colors.surfaceAlt,
          borderRadius: radius.small,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.shimmer,
          {
            backgroundColor: colors.surface,
            left: shimmerPosition.interpolate({
              inputRange: [0, 1],
              outputRange: ['-35%', '100%'],
            }),
          },
        ]}
      />
    </Animated.View>
  );
}

export function CurrentWeatherCardSkeleton() {
  return (
    <Animated.View style={styles.cardSkeleton}>
      <Skeleton width={80} height={80} style={styles.circle} />
      <Skeleton width={100} height={48} style={styles.centerItem} />
      <Skeleton width={140} height={16} style={styles.centerItem} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardSkeleton: {
    alignItems: 'center',
    padding: 24,
    borderRadius: radius.extraLarge,
  },
  circle: { borderRadius: 40, marginBottom: 12 },
  centerItem: { marginTop: 8 },
  shimmer: { position: 'absolute', top: 0, bottom: 0, width: '35%', opacity: 0.45 },
});
