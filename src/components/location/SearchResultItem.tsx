// src/components/location/SearchResultItem.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Location } from '../../types/location';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import MapMarkerOutline from '../../icons/map-marker-outline';

interface SearchResultItemProps {
  location: Location;
  onPress: () => void;
}

export function SearchResultItem({ location, onPress }: SearchResultItemProps) {
  const { colors } = useTheme();
  const subtitle = [location.administrativeArea, location.country].filter(Boolean).join(', ');

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${location.name}${subtitle ? `, ${subtitle}` : ''}`}
    >
      <MapMarkerOutline width={20} height={20} color={colors.secondaryText} />
      <View style={styles.textBlock}>
        <Text style={[typography.bodyBold, { color: colors.text }]}>{location.name}</Text>
        {!!subtitle && (
          <Text style={[typography.caption, { color: colors.secondaryText }]}>{subtitle}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  textBlock: { marginLeft: spacing.sm },
});
