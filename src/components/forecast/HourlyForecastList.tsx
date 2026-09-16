// src/components/forecast/HourlyForecastList.tsx

import React, { useEffect, useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { HourlyForecast } from '../../types/weather';
import { getWeatherIcon } from '../../utils/weatherCode';
import { formatTemperature } from '../../utils/temperature';
import { formatHourLabel, isSameHour } from '../../utils/dateTime';
import { formatPercentage } from '../../utils/formatting';
import { useTheme } from '../../theme/ThemeProvider';
import { useResponsive } from '../../hooks/useResponsive';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import WeatherIcon from '../../icons/weather-icon';

interface HourlyForecastListProps {
  hourly: HourlyForecast[];
  currentTimeIso: string;
  isDay: boolean;
}

const ITEM_GAP = 8; // corresponds to spacing.sm

export function HourlyForecastList({ hourly, currentTimeIso, isDay }: HourlyForecastListProps) {
  const { colors } = useTheme();
  const { isTablet } = useResponsive();
  const listRef = useRef<FlatList<HourlyForecast>>(null);

  const currentItemWidth = isTablet ? 84 : 64;

  useEffect(() => {
    if (!hourly || hourly.length === 0) return;

    // Find the index matching the current hour
    const currentIndex = hourly.findIndex((item) => isSameHour(item.time, currentTimeIso));

    if (currentIndex !== -1 && listRef.current) {
      // Scroll to that index so that it appears as the first element if possible
      // Using a short timeout ensures the FlatList layout is completely ready before scrolling
      const timer = setTimeout(() => {
        listRef.current?.scrollToIndex({
          index: currentIndex,
          animated: true,
          viewPosition: 0, // 0 aligns the element to the left/start of the view
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [hourly, currentTimeIso, currentItemWidth]);

  return (
    <FlatList
      ref={listRef}
      horizontal
      data={hourly}
      keyExtractor={(item) => item.time}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      getItemLayout={(_, index) => ({
        length: currentItemWidth,
        offset: (currentItemWidth + ITEM_GAP) * index,
        index,
      })}
      renderItem={({ item }) => {
        const isNow = isSameHour(item.time, currentTimeIso);
        return (
          <View
            style={[
              styles.item,
              {
                backgroundColor: isNow ? colors.primary : colors.surface,
                width: currentItemWidth,
                paddingVertical: isTablet ? spacing.md : spacing.sm,
              },
            ]}
            accessible
            accessibilityLabel={`${isNow ? 'Now' : formatHourLabel(item.time)}, ${formatTemperature(
              item.temperature
            )}, ${formatPercentage(item.precipitationProbability)} chance of rain`}
          >
            <Text
              style={[
                isTablet ? typography.body : typography.caption,
                { color: isNow ? colors.onPrimary : colors.secondaryText },
              ]}
            >
              {isNow ? 'Now' : formatHourLabel(item.time)}
            </Text>
            <WeatherIcon
              icon={getWeatherIcon(item.weatherCode, isDay)}
              size={isTablet ? 36 : 28}
              color={isNow ? colors.onPrimary : colors.text}
            />
            <Text style={[isTablet ? typography.h3 : typography.bodyBold, { color: isNow ? colors.onPrimary : colors.text }]}>
              {formatTemperature(item.temperature)}
            </Text>
            <Text
              style={[isTablet ? typography.body : typography.small, { color: isNow ? colors.onPrimary : colors.secondaryText }]}
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
    alignItems: 'center',
    borderRadius: radius.medium,
    gap: spacing.xs,
  },
});
