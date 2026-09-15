// src/screens/SettingsScreen.tsx

import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSettingsStore } from '../store/settingsStore';
import { useLocation } from '../hooks/useLocation';
import { useTheme } from '../theme/ThemeProvider';
import { TemperatureUnit, WindSpeedUnit } from '../api/apiTypes';
import { ColorSchemePreference, ThemePreference } from '../types/settings';
import { colorSchemes } from '../constants/colors';
import { spacing, radius } from '../constants/spacing';
import { typography } from '../constants/typography';
import CogOutline from '../icons/cog-outline';
import CrosshairsGps from '../icons/crosshairs-gps';

const APP_VERSION = '1.0.0';

function OptionRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.optionGroup}>
      <Text style={[typography.bodyBold, { color: colors.text, marginBottom: spacing.xs }]}>
        {label}
      </Text>
      <View style={styles.optionRow}>
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => onChange(opt.value)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[
                styles.pill,
                {
                  backgroundColor: selected ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[typography.body, { color: selected ? colors.onPrimary : colors.text }]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function ColorSchemePicker({
  value,
  onChange,
}: {
  value: ColorSchemePreference;
  onChange: (value: ColorSchemePreference) => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.optionGroup}>
      <Text style={[typography.bodyBold, { color: colors.text, marginBottom: spacing.xs }]}>Color scheme</Text>
      <View style={styles.schemeRow}>
        {(Object.keys(colorSchemes) as ColorSchemePreference[]).map((scheme) => {
          const selected = scheme === value;
          const option = colorSchemes[scheme];

          return (
            <TouchableOpacity
              key={scheme}
              onPress={() => onChange(scheme)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={`${option.label} color scheme`}
              style={[
                styles.schemeOption,
                {
                  backgroundColor: colors.surface,
                  borderColor: selected ? option.primary : colors.border,
                },
              ]}
            >
              <View style={styles.schemeSwatches}>
                <View style={[styles.schemeSwatch, { backgroundColor: option.primary }]} />
                <View style={[styles.schemeSwatch, { backgroundColor: option.secondary }]} />
                <View style={[styles.schemeSwatch, { backgroundColor: option.tertiary }]} />
              </View>
              <Text style={[typography.caption, { color: colors.text, marginTop: spacing.xs }]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export function SettingsScreen() {
  const { colors } = useTheme();
  const temperatureUnit = useSettingsStore((s) => s.temperatureUnit);
  const windSpeedUnit = useSettingsStore((s) => s.windSpeedUnit);
  const theme = useSettingsStore((s) => s.theme);
  const colorScheme = useSettingsStore((s) => s.colorScheme);
  const setTemperatureUnit = useSettingsStore((s) => s.setTemperatureUnit);
  const setWindSpeedUnit = useSettingsStore((s) => s.setWindSpeedUnit);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setColorScheme = useSettingsStore((s) => s.setColorScheme);

  const { permissionStatus, openDeviceSettings, resolveDeviceLocation } = useLocation();

  const permissionLabel: Record<string, string> = {
    undetermined: 'Not requested',
    granted: 'Granted',
    denied: 'Denied',
    permanently_denied: 'Denied (permanently)',
    unavailable: 'Unavailable',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surfaceAlt }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.h1, { color: colors.text, marginBottom: spacing.md }]}>Settings</Text>

        <OptionRow<TemperatureUnit>
          label="Temperature Unit"
          value={temperatureUnit}
          onChange={setTemperatureUnit}
          options={[
            { value: 'celsius', label: 'Celsius' },
            { value: 'fahrenheit', label: 'Fahrenheit' },
          ]}
        />

        <OptionRow<WindSpeedUnit>
          label="Wind Speed Unit"
          value={windSpeedUnit}
          onChange={setWindSpeedUnit}
          options={[
            { value: 'kmh', label: 'km/h' },
            { value: 'mph', label: 'mph' },
            { value: 'ms', label: 'm/s' },
          ]}
        />

        <OptionRow<ThemePreference>
          label="Theme"
          value={theme}
          onChange={setTheme}
          options={[
            { value: 'system', label: 'System' },
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
        />

        <ColorSchemePicker value={colorScheme} onChange={setColorScheme} />

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[typography.bodyBold, { color: colors.text }]}>Location</Text>
          <Text style={[typography.body, { color: colors.secondaryText, marginTop: spacing.xs }]}>
            Permission: {permissionLabel[permissionStatus]}
          </Text>
          {permissionStatus === 'permanently_denied' ? (
            <TouchableOpacity
              style={[styles.linkButton, { borderColor: colors.border }]}
              onPress={openDeviceSettings}
              accessibilityRole="button"
              accessibilityLabel="Open device settings"
            >
              <CogOutline width={16} height={16} color={colors.primary} />
              <Text style={[typography.body, { color: colors.primary, marginLeft: spacing.xs }]}>
                Open Device Settings
              </Text>
            </TouchableOpacity>
          ) : permissionStatus !== 'granted' ? (
            <TouchableOpacity
              style={[styles.linkButton, { borderColor: colors.border }]}
              onPress={resolveDeviceLocation}
              accessibilityRole="button"
              accessibilityLabel="Enable location"
            >
              <CrosshairsGps width={16} height={16} color={colors.primary} />
              <Text style={[typography.body, { color: colors.primary, marginLeft: spacing.xs }]}>
                Enable Location
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[typography.bodyBold, { color: colors.text }]}>About</Text>
          <Text style={[typography.body, { color: colors.text, marginTop: spacing.xs }]}>BWeather</Text>
          <Text style={[typography.caption, { color: colors.secondaryText }]}>
            Version {APP_VERSION}
          </Text>
          <Text style={[typography.caption, { color: colors.secondaryText, marginTop: spacing.xs }]}>
            Weather data provided by Open-Meteo.
          </Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://open-meteo.com')}>
            <Text style={[typography.caption, { color: colors.primary, marginTop: spacing.xs }]}>
              open-meteo.com
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl },
  optionGroup: { marginBottom: spacing.lg },
  optionRow: { flexDirection: 'row', gap: spacing.sm },
  schemeRow: { flexDirection: 'row', gap: spacing.sm },
  schemeOption: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.medium,
    borderWidth: 2,
  },
  schemeSwatches: { flexDirection: 'row', gap: 4 },
  schemeSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.medium,
    borderWidth: 1,
  },
  card: { padding: spacing.md, borderRadius: radius.medium, marginBottom: spacing.md },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
  },
});
