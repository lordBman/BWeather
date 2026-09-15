// src/screens/ForecastScreen.tsx

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DailyForecastList } from '../components/forecast/DailyForecastList';
import { ErrorState } from '../components/common/ErrorState';
import { Skeleton } from '../components/common/Skeleton';
import { useWeather } from '../hooks/useWeather';
import { useTheme } from '../theme/ThemeProvider';
import { DailyForecast } from '../types/weather';
import { RootStackParamList } from '../navigation/types';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ForecastScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const { forecast, loading, error, refreshWeather } = useWeather();

  const handleSelectDay = (day: DailyForecast) => {
    navigation.navigate('ForecastDetail', { day });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surfaceAlt }]} edges={['top']}>
      <Text style={[typography.h1, styles.title, { color: colors.text }]}>7-Day Forecast</Text>

      <ScrollView contentContainerStyle={styles.content}>
        {loading && !forecast && (
          <View style={styles.skeletonList}>
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} width="100%" height={56} />
            ))}
          </View>
        )}

        {error && !forecast && <ErrorState message={error} onRetry={refreshWeather} />}

        {forecast && <DailyForecastList daily={forecast.daily} onSelectDay={handleSelectDay} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  skeletonList: { gap: spacing.sm },
});
