// src/components/forecast/HourlyForecastList.tsx

import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { HourlyForecast } from '../../types/weather';
import { getWeatherIcon } from '../../utils/weatherCode';
import { formatTemperature } from '../../utils/temperature';
import { formatHourLabel, isSameHour } from '../../utils/dateTime';
import { formatPercentage } from '../../utils/formatting';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import WeatherIcon from '../../icons/weather-icon';

interface HourlyForecastListProps {
  hourly: HourlyForecast[];
  currentTimeIso: string;
  isDay: boolean;
}

export function HourlyForecastList({ hourly, currentTimeIso, isDay }: HourlyForecastListProps) {
  const { colors } = useTheme();

  return (
    <FlatList
      horizontal
      data={hourly}
      keyExtractor={(item) => item.time}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => {
        const isNow = isSameHour(item.time, currentTimeIso);
        return (
          <View
            style={[
              styles.item,
              { backgroundColor: isNow ? colors.primary : colors.surface },
            ]}
            accessible
            accessibilityLabel={`${isNow ? 'Now' : formatHourLabel(item.time)}, ${formatTemperature(
              item.temperature
            )}, ${formatPercentage(item.precipitationProbability)} chance of rain`}
          >
            <Text
              style={[typography.caption, { color: isNow ? colors.onPrimary : colors.secondaryText }]}
            >
              {isNow ? 'Now' : formatHourLabel(item.time)}
            </Text>
            <WeatherIcon
              icon={getWeatherIcon(item.weatherCode, isDay)}
              size={28}
              color={isNow ? colors.onPrimary : colors.text}
            />
            <Text style={[typography.bodyBold, { color: isNow ? colors.onPrimary : colors.text }]}> 
              {formatTemperature(item.temperature)}
            </Text>
            <Text
              style={[typography.small, { color: isNow ? colors.onPrimary : colors.secondaryText }]}
            >
              {formatPercentage(item.precipitationProbability)}
            </Text>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  listContent: { gap: spacing.sm, paddingVertical: spacing.xs },
  item: {
    width: 64,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.medium,
    gap: spacing.xs,
  },
});
