// src/screens/ForecastDetailScreen.tsx

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatCard } from '../components/weather/StatCard';
import { SunPath } from '../components/weather/SunPath';
import { HourlyForecastList } from '../components/forecast/HourlyForecastList';
import { useWeather } from '../hooks/useWeather';
import { useSettingsStore } from '../store/settingsStore';
import { useTheme } from '../theme/ThemeProvider';
import { RootStackParamList } from '../navigation/types';
import { getWeatherDescription, getWeatherIcon } from '../utils/weatherCode';
import { formatTemperature } from '../utils/temperature';
import { formatFullDate } from '../utils/dateTime';
import { formatPercentage, uvCategory } from '../utils/formatting';
import { formatWindSpeed } from '../utils/wind';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import WeatherIcon from '../icons/weather-icon';
import WaterPercent from '../icons/water-percent';
import WeatherSunnyAlert from '../icons/weather-sunny-alert';
import Thermometer from '../icons/thermometer';

type DetailRoute = RouteProp<RootStackParamList, 'ForecastDetail'>;

export function ForecastDetailScreen() {
  const { colors } = useTheme();
  const { params } = useRoute<DetailRoute>();
  const { day } = params;
  const { forecast } = useWeather();
  const windSpeedUnit = useSettingsStore((s) => s.windSpeedUnit);

  // Hourly entries for this specific day only (dates match on the date portion).
  const dayHourly = forecast?.hourly.filter((h) => h.time.startsWith(day.date)) ?? [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surfaceAlt }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h1, { color: colors.text }]}>{formatFullDate(day.date)}</Text>

        <View style={styles.headerRow}>
          <WeatherIcon icon={getWeatherIcon(day.weatherCode, true)} size={56} color={colors.primary} />
          <View style={styles.headerText}>
            <Text style={[typography.h2, { color: colors.text }]}>
              {getWeatherDescription(day.weatherCode)}
            </Text>
            <Text style={[typography.body, { color: colors.secondaryText }]}>
              H {formatTemperature(day.temperatureMax)} · L {formatTemperature(day.temperatureMin)}
            </Text>
          </View>
        </View>

        {dayHourly.length > 0 && (
          <>
            <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>
              Hourly
            </Text>
            <HourlyForecastList hourly={dayHourly} currentTimeIso={dayHourly[0].time} isDay />
          </>
        )}

        <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>
          Details
        </Text>
        <View style={styles.statsGrid}>
          <StatCard
            label="Precipitation"
            value={formatPercentage(day.precipitationProbabilityMax)}
            subvalue={`${day.precipitationSum} mm`}>
            <WaterPercent width={18} height={18} color={colors.secondary} />
          </StatCard>
          <StatCard
            label="Wind"
            value={formatWindSpeed(day.windSpeedMax, windSpeedUnit)}>
            <WeatherIcon icon="mdi:weather-windy" size={18} color={colors.secondary} />
          </StatCard>
          <StatCard
            label="UV Index"
            value={String(Math.round(day.uvIndexMax))}
            subvalue={uvCategory(day.uvIndexMax)}>
            <WeatherSunnyAlert width={18} height={18} color={colors.tertiary} />
          </StatCard>
          <StatCard
            label="Feels like"
            value={`${formatTemperature(day.feelsLikeMin)} – ${formatTemperature(day.feelsLikeMax)}`}>
            <Thermometer width={18} height={18} color={colors.tertiary} />
          </StatCard>
        </View>

        <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>
          Sun
        </Text>
        <SunPath currentTimeIso={day.sunrise} sunriseIso={day.sunrise} sunsetIso={day.sunset} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  headerText: { marginLeft: spacing.md },
  sectionTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
