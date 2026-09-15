// src/components/weather/SunPath.tsx

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

const TRACK_WIDTH = 260;

export function SunPath({ currentTimeIso, sunriseIso, sunsetIso }: SunPathProps) {
  const { colors } = useTheme();
  const progress = dayProgress(currentTimeIso, sunriseIso, sunsetIso);
  const sunX = 10 + progress * (TRACK_WIDTH - 20);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.labelsRow}>
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

      <Svg width={TRACK_WIDTH} height={24} style={styles.svg}>
        <Line
          x1={10}
          y1={12}
          x2={TRACK_WIDTH - 10}
          y2={12}
          stroke={colors.border}
          strokeWidth={2}
        />
        <Circle cx={sunX} cy={12} r={7} fill={colors.primary} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: radius.medium,
    alignItems: 'center',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: TRACK_WIDTH,
    marginBottom: spacing.xs,
  },
  labelBlock: { alignItems: 'center' },
  svg: { marginTop: spacing.xs },
});
