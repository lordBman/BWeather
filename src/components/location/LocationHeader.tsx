// src/components/location/LocationHeader.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import MapMarker from '../../icons/map-marker';
import HeartOutline from '../../icons/heart-outline';
import Heart from '../../icons/heart';
import Magnify from '../../icons/magnify';

interface LocationHeaderProps {
  locationName: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSearchPress: () => void;
}

export function LocationHeader({
  locationName,
  isFavorite,
  onToggleFavorite,
  onSearchPress,
}: LocationHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <MapMarker width={32} height={32} color={colors.primary} />
        <Text style={[typography.h2, { color: colors.text, marginLeft: spacing.xs }]} numberOfLines={1}>
          {locationName}
        </Text>
      </View>
      <View style={styles.right}>
        <TouchableOpacity
          onPress={onToggleFavorite}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          style={styles.iconButton}
        >
        {
            isFavorite ? <Heart width={32} height={32} color={colors.danger} /> : <HeartOutline width={32} height={32} color={colors.text} />
        }
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSearchPress}
          accessibilityRole="button"
          accessibilityLabel="Search for a location"
          style={styles.iconButton}
        >
          <Magnify width={32} height={32} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  left: { flexDirection: 'row', alignItems: 'center', flexShrink: 1 },
  right: { flexDirection: 'row' },
  iconButton: { padding: spacing.xs, marginLeft: spacing.xs },
});
