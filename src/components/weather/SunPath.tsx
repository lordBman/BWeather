// src/components/weather/SunPath.tsx

import React, { useState } from 'react';
import { StyleSheet, Text, View, LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { useTheme } from '../../theme/ThemeProvider';
import { formatClockTime, dayProgress } from '../../utils/dateTime';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import WeatherSunsetUp from '../../icons/weather-sunset-up';
import WeatherSunsetDown from '../../icons/weather-sunset-down';

interface SunPathProps {
  currentTimeIso: string;
  sunriseIso: string;
  sunsetIso: string;
}

export function SunPath({ currentTimeIso, sunriseIso, sunsetIso }: SunPathProps) {
  const { colors } = useTheme();
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const progress = dayProgress(currentTimeIso, sunriseIso, sunsetIso);

  // Accounting for the parent component padding (spacing.md is usually 16, so horizontal padding is 32)
  const trackWidth = containerWidth > 0 ? containerWidth - spacing.md * 2 : 260;
  const sunX = 10 + progress * (trackWidth - 20);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]} onLayout={handleLayout}>
      <View style={[styles.labelsRow, { width: containerWidth > 0 ? trackWidth : '100%' }]}>
        <View style={styles.labelBlock}>
          <WeatherSunsetUp width={32} height={32} color={colors.secondary} />
          <Text style={[typography.caption, { color: colors.secondaryText }]}>Sunrise</Text>
          <Text style={[typography.bodyBold, { color: colors.text }]}>
            {formatClockTime(sunriseIso)}
          </Text>
        </View>
        <View style={styles.labelBlock}>
          <WeatherSunsetDown width={32} height={32} color={colors.tertiary} />
          <Text style={[typography.caption, { color: colors.secondaryText }]}>Sunset</Text>
          <Text style={[typography.bodyBold, { color: colors.text }]}>
            {formatClockTime(sunsetIso)}
          </Text>
        </View>
      </View>

      {containerWidth > 0 && (
        <Svg width={trackWidth} height={24} style={styles.svg}>
          <Line
            x1={10}
            y1={12}
            x2={trackWidth - 10}
            y2={12}
            stroke={colors.border}
            strokeWidth={2}
          />
          <Circle cx={sunX} cy={12} r={7} fill={colors.primary} />
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: radius.medium,
    alignItems: 'center',
    width: '100%',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  labelBlock: { alignItems: 'center' },
  svg: { marginTop: spacing.xs },
});
