// src/screens/FavoritesScreen.tsx

import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useFavorites } from '../hooks/useFavorites';
import { useLocation } from '../hooks/useLocation';
import { useTheme } from '../theme/ThemeProvider';
import { Location } from '../types/location';
import { RootStackParamList } from '../navigation/types';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';
import HeartOutline from '../icons/heart-outline';
import MapMarker from '../icons/map-marker';
import Close from '../icons/close';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const { colors } = useTheme();
  const { favorites, removeFavorite } = useFavorites();
  const { selectLocation } = useLocation();

  const handleSelect = (location: Location) => {
    selectLocation(location);
    navigation.navigate('Tabs', { screen: 'Home' });
  };

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.surfaceAlt }]} edges={['top']}>
        <View style={styles.emptyState}>
          <HeartOutline width={40} height={40} color={colors.secondaryText} />
          <Text style={[typography.h3, { color: colors.text, marginTop: spacing.sm }]}>
            No favorite locations
          </Text>
          <Text style={[typography.body, { color: colors.secondaryText, marginTop: spacing.xs, textAlign: 'center' }]}>
            Save locations you frequently check for quick access.
          </Text>
          <TouchableOpacity
            style={[styles.searchButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Search')}
            accessibilityRole="button"
            accessibilityLabel="Search for a location"
          >
            <Text style={[typography.bodyBold, { color: colors.onPrimary }]}>Search for a location</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surfaceAlt }]} edges={['top']}>
      <Text style={[typography.h1, styles.title, { color: colors.text }]}>Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
              style={styles.rowMain}
              onPress={() => handleSelect(item)}
              accessibilityRole="button"
              accessibilityLabel={`Show weather for ${item.name}`}
            >
              <MapMarker width={18} height={18} color={colors.primary} />
              <View style={styles.textBlock}>
                <Text style={[typography.bodyBold, { color: colors.text }]}>{item.name}</Text>
                {!!item.country && (
                  <Text style={[typography.caption, { color: colors.secondaryText }]}>
                    {item.country}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => removeFavorite(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Remove ${item.name} from favorites`}
              style={styles.removeButton}
            >
              <Close width={18} height={18} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  list: { padding: spacing.md, gap: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: 12,
  },
  rowMain: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  textBlock: { marginLeft: spacing.sm },
  removeButton: { padding: spacing.xs },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  searchButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
});
