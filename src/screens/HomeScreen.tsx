// src/screens/HomeScreen.tsx

import React, { useRef } from 'react';
import { ActivityIndicator, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LocationHeader } from '../components/location/LocationHeader';
import { CurrentWeatherCard } from '../components/weather/CurrentWeatherCard';
import { StatCard } from '../components/weather/StatCard';
import { SunPath } from '../components/weather/SunPath';
import { HourlyForecastList } from '../components/forecast/HourlyForecastList';
import { ErrorState } from '../components/common/ErrorState';
import { CurrentWeatherCardSkeleton, Skeleton } from '../components/common/Skeleton';

import { useWeather } from '../hooks/useWeather';
import { useLocation } from '../hooks/useLocation';
import { useFavorites } from '../hooks/useFavorites';
import { useSettingsStore } from '../store/settingsStore';
import { useTheme } from '../theme/ThemeProvider';
import { useResponsive } from '../hooks/useResponsive';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import { formatPercentage, formatPressure, formatRelativeTime, uvCategory } from '../utils/formatting';
import { formatWind } from '../utils/wind';
import { RootStackParamList } from '../navigation/types';
import WeatherIcon from '../icons/weather-icon';
import WaterPercent from '../icons/water-percent';
import WeatherSunnyAlert from '../icons/weather-sunny-alert';
import Gauge from '../icons/gauge';
import CrosshairsGps from '../icons/crosshairs-gps';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const { isTablet, isLandscape } = useResponsive();
  const windSpeedUnit = useSettingsStore((s) => s.windSpeedUnit);
  const scrollOffset = useRef(0);
  const touchStartY = useRef<number | null>(null);
  const pullToRefreshArmed = useRef(false);

  const {
    permissionStatus,
    currentLocation,
    selectedLocation,
    selectLocation,
  } = useLocation();

  const { forecast, loading, refreshing, error, isStale, lastUpdated, refreshWeather } = useWeather();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffset.current = event.nativeEvent.contentOffset.y;
  };

  const handleTouchStart = (event: { nativeEvent: { pageY: number } }) => {
    touchStartY.current = event.nativeEvent.pageY;
    pullToRefreshArmed.current = false;
  };

  const handleTouchMove = (event: { nativeEvent: { pageY: number } }) => {
    if (touchStartY.current === null || scrollOffset.current > 1 || refreshing) return;

    if (event.nativeEvent.pageY - touchStartY.current >= 48) {
      pullToRefreshArmed.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (pullToRefreshArmed.current && forecast && !loading) {
      refreshWeather();
    }
    touchStartY.current = null;
    pullToRefreshArmed.current = false;
  };

  const locationLabel = selectedLocation?.name ?? 'Select a location';

  // Determine whether the current view is NOT pointing to device location
  const isViewingCurrentLocation = selectedLocation && currentLocation && selectedLocation.id === currentLocation.id;
  const showCurrentLocationShortcut = permissionStatus === 'granted' && currentLocation && !isViewingCurrentLocation;

  const renderContent = () => {
    if (!forecast) return null;

    if (isTablet && isLandscape) {
      return (
        <View style={{ gap: spacing.lg }}>
          <View style={styles.tabletLandscapeContainer}>
            <View style={styles.leftColumn}>
              <CurrentWeatherCard current={forecast.current} today={forecast.daily[0]} />

              {isStale && lastUpdated && (
                <Text style={[typography.small, styles.staleBanner, { color: colors.secondaryText }]}>
                  Offline · Showing last available data · Last updated {formatRelativeTime(lastUpdated)}
                </Text>
              )}
            </View>

            <View style={styles.rightColumn}>
              <Text style={[typography.h3, { color: colors.text, marginBottom: spacing.sm }]}>
                Today's conditions
              </Text>
              <View style={styles.statsGrid}>
                <StatCard
                  label="Humidity"
                  value={formatPercentage(forecast.current.humidity)}>
                    <WaterPercent width={30} height={30} color={colors.secondaryText} />
                  </StatCard>
                <StatCard
                  label="Wind"
                  value={formatWind(forecast.current.windSpeed, forecast.current.windDirection, windSpeedUnit)}>
                      <WeatherIcon icon="mdi:weather-windy" size={24} color={colors.secondary} />
                  </StatCard>
                <StatCard
                  label="Pressure"
                  value={formatPressure(forecast.current.pressure)}>
                    <Gauge width={24} height={24} color={colors.tertiary} />
                  </StatCard>
                <StatCard
                  label="UV Index"
                  value={String(Math.round(forecast.current.uvIndex))}
                  subvalue={uvCategory(forecast.current.uvIndex)}>
                      <WeatherSunnyAlert width={30} height={30} color={colors.tertiary} />
                  </StatCard>
              </View>

              <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>
                Sun
              </Text>
              <SunPath
                currentTimeIso={forecast.current.time}
                sunriseIso={forecast.daily[0].sunrise}
                sunsetIso={forecast.daily[0].sunset}
              />
            </View>
          </View>

          <View style={{ width: '100%' }}>
            <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>
              Hourly forecast
            </Text>
            <HourlyForecastList
              hourly={forecast.hourly}
              currentTimeIso={forecast.current.time}
              isDay={forecast.current.isDay}
            />
          </View>
        </View>
      );
    }

    return (
      <>
        <CurrentWeatherCard current={forecast.current} today={forecast.daily[0]} />

        {isStale && lastUpdated && (
          <Text style={[typography.small, styles.staleBanner, { color: colors.secondaryText }]}>
            Offline · Showing last available data · Last updated {formatRelativeTime(lastUpdated)}
          </Text>
        )}

        <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>
          Today's conditions
        </Text>
        <View style={styles.statsGrid}>
          <StatCard
            label="Humidity"
            value={formatPercentage(forecast.current.humidity)}>
              <WaterPercent width={30} height={30} color={colors.secondaryText} />
            </StatCard>
          <StatCard
            label="Wind"
            value={formatWind(forecast.current.windSpeed, forecast.current.windDirection, windSpeedUnit)}>
                <WeatherIcon icon="mdi:weather-windy" size={24} color={colors.secondary} />
            </StatCard>
          <StatCard
            label="Pressure"
            value={formatPressure(forecast.current.pressure)}>
                <Gauge width={24} height={24} color={colors.tertiary} />
            </StatCard>
          <StatCard
            label="UV Index"
            value={String(Math.round(forecast.current.uvIndex))}
            subvalue={uvCategory(forecast.current.uvIndex)}>
                <WeatherSunnyAlert width={30} height={30} color={colors.tertiary} />
            </StatCard>
        </View>

        <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>
          Sun
        </Text>
        <SunPath
          currentTimeIso={forecast.current.time}
          sunriseIso={forecast.daily[0].sunrise}
          sunsetIso={forecast.daily[0].sunset}
        />

        <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>
          Hourly forecast
        </Text>
        <HourlyForecastList
          hourly={forecast.hourly}
          currentTimeIso={forecast.current.time}
          isDay={forecast.current.isDay}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surfaceAlt }]} edges={['top']}>
      <LocationHeader
        locationName={locationLabel}
        isFavorite={selectedLocation ? isFavorite(selectedLocation.id) : false}
        onToggleFavorite={() => selectedLocation && toggleFavorite(selectedLocation)}
        onSearchPress={() => navigation.navigate('Search')}
      />

      {showCurrentLocationShortcut && (
        <TouchableOpacity
          onPress={() => selectLocation(currentLocation)}
          style={[styles.shortcutBanner, { backgroundColor: colors.surface, borderColor: colors.border }]}
          accessibilityRole="button"
          accessibilityLabel="Switch to current location"
        >
          <CrosshairsGps width={16} height={16} color={colors.secondary} />
          <Text style={[typography.smallBold, { color: colors.secondary, marginLeft: spacing.xs }]}>
            Switch to your current location
          </Text>
        </TouchableOpacity>
      )}

      {!selectedLocation && permissionStatus !== 'undetermined' ? (
        <View style={styles.emptyState}>
          <Text style={[typography.h3, { color: colors.text }]}>Search for a city</Text>
          <Text style={[typography.body, { color: colors.secondaryText, marginTop: spacing.xs }]}>
            Find weather anywhere in the world.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          onScroll={handleScroll}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          scrollEventThrottle={16}
        >
          {refreshing && <ActivityIndicator color={colors.primary} style={styles.refreshIndicator} />}
          {loading && !forecast && <CurrentWeatherCardSkeleton />}

          {error && !forecast && <ErrorState message={error} onRetry={refreshWeather} />}

          {renderContent()}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  refreshIndicator: { marginBottom: spacing.sm },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  sectionTitle: { marginTop: spacing.lg, marginBottom: spacing.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  staleBanner: { textAlign: 'center', marginTop: spacing.sm },
  tabletLandscapeContainer: { flexDirection: 'row', gap: spacing.lg },
  leftColumn: { flex: 1 },
  rightColumn: { flex: 1 },
  shortcutBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
  },
});
