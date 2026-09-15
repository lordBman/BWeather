// src/components/weather/CurrentWeatherCard.tsx

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CurrentWeather, DailyForecast } from '../../types/weather';
import { getWeatherDescription, getWeatherIcon } from '../../utils/weatherCode';
import { formatTemperature } from '../../utils/temperature';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import WeatherIcon from '../../icons/weather-icon';
import { useTheme } from '../../theme/ThemeProvider';

interface CurrentWeatherCardProps {
  current: CurrentWeather;
  today?: DailyForecast;
}

export function CurrentWeatherCard({ current, today }: CurrentWeatherCardProps) {
  const { colors } = useTheme();
  const description = getWeatherDescription(current.weatherCode);
  const icon = getWeatherIcon(current.weatherCode, current.isDay);

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surfaceElevated }]}
      accessible
      accessibilityLabel={`${description}, ${formatTemperature(current.temperature)}, feels like ${formatTemperature(
        current.feelsLike
      )}`}
    >
      <WeatherIcon icon={icon} size={90} color={colors.primary} />
      <Text style={[typography.display, styles.temperature, { color: colors.primary }]}>
        {formatTemperature(current.temperature)}
      </Text>
      <Text style={[typography.h1, styles.condition, { color: colors.secondaryText }]}>{description}</Text>
      <Text style={[typography.body, styles.feelsLike, { color: colors.secondaryText }]}>
        Feels like {formatTemperature(current.feelsLike)}
      </Text>

      {today && (
        <View style={styles.highLowRow}>
          <Text style={[typography.bodyBold, styles.highLowText, { color: colors.secondaryText }]}>
            H {formatTemperature(today.temperatureMax)}
          </Text>
          <Text style={[typography.bodyBold, styles.highLowText, { color: colors.secondaryText }]}>
            L {formatTemperature(today.temperatureMin)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: radius.extraLarge,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  temperature: { marginTop: spacing.sm },
  condition: { fontWeight: '300', marginTop: spacing.xs },
  feelsLike: { opacity: 0.8 },
  highLowRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  highLowText: { fontWeight: 'bold' },
});
