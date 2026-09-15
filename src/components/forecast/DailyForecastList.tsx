// src/components/forecast/DailyForecastList.tsx

import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DailyForecast } from '../../types/weather';
import { getWeatherIcon } from '../../utils/weatherCode';
import { formatTemperature } from '../../utils/temperature';
import { relativeDayLabel } from '../../utils/dateTime';
import { formatPercentage } from '../../utils/formatting';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import WeatherIcon from '../../icons/weather-icon';

interface DailyForecastListProps {
  daily: DailyForecast[];
  onSelectDay?: (day: DailyForecast) => void;
}

/** Range across all days, used so every day's bar is drawn to the same scale. */
function useTemperatureRange(daily: DailyForecast[]) {
  const min = Math.min(...daily.map((d) => d.temperatureMin));
  const max = Math.max(...daily.map((d) => d.temperatureMax));
  return { min, max: max === min ? min + 1 : max };
}

export function DailyForecastList({ daily, onSelectDay }: DailyForecastListProps) {
  const { colors } = useTheme();
  const { min, max } = useTemperatureRange(daily);
  const referenceDate = daily[0]?.date;

  return (
    <FlatList
      data={daily}
      keyExtractor={(item) => item.date}
      scrollEnabled={false}
      ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      renderItem={({ item }) => {
        const startPct = ((item.temperatureMin - min) / (max - min)) * 100;
        const widthPct = ((item.temperatureMax - item.temperatureMin) / (max - min)) * 100;

        return (
          <TouchableOpacity
            style={[styles.row, { backgroundColor: colors.surface }]}
            onPress={() => onSelectDay?.(item)}
            accessibilityRole="button"
            accessibilityLabel={`${relativeDayLabel(item.date, referenceDate)}, low ${formatTemperature(
              item.temperatureMin
            )}, high ${formatTemperature(item.temperatureMax)}, ${formatPercentage(
              item.precipitationProbabilityMax
            )} chance of rain`}
          >
            <Text style={[typography.body, styles.dayLabel, { color: colors.text }]}>
              {relativeDayLabel(item.date, referenceDate)}
            </Text>
            <WeatherIcon icon={getWeatherIcon(item.weatherCode, true)} size={24} color={colors.text} />
            <Text style={[typography.caption, styles.lowLabel, { color: colors.tertiary }]}>
              {formatTemperature(item.temperatureMin)}
            </Text>
            <View style={styles.trackContainer}>
              <View style={[styles.track, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.trackFill,
                    { left: `${startPct}%`, width: `${widthPct}%`, backgroundColor: colors.primary },
                  ]}
                />
              </View>
            </View>
            <Text style={[typography.bodyBold, styles.highLabel, { color: colors.text }]}>
              {formatTemperature(item.temperatureMax)}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.medium,
  },
  dayLabel: { width: 88 },
  lowLabel: { width: 32, textAlign: 'right', marginRight: spacing.sm },
  highLabel: { width: 40, textAlign: 'right' },
  trackContainer: { flex: 1, marginHorizontal: spacing.xs },
  track: { height: 4, borderRadius: 2, overflow: 'hidden' },
  trackFill: { position: 'absolute', height: 4, borderRadius: 2 },
});
