// src/screens/SearchScreen.tsx

import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SearchResultItem } from '../components/location/SearchResultItem';
import { useDebounce } from '../hooks/useDebounce';
import { useLocation } from '../hooks/useLocation';
import { useTheme } from '../theme/ThemeProvider';
import { Location } from '../types/location';
import { OpenMeteoApiError } from '../api/apiTypes';
import { MIN_SEARCH_QUERY_LENGTH, SEARCH_DEBOUNCE_MS } from '../constants/config';
import { spacing, radius } from '../constants/spacing';
import { typography } from '../constants/typography';
import Magnify from '../icons/magnify';
import Earth from '../icons/earth';

export function SearchScreen() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { searchLocations, selectLocation } = useLocation();

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);
  const [results, setResults] = useState<Location[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (debouncedQuery.trim().length < MIN_SEARCH_QUERY_LENGTH) {
      setResults([]);
      setError(null);
      return;
    }

    setSearching(true);
    setError(null);

    searchLocations(debouncedQuery)
      .then((found) => {
        if (!cancelled) setResults(found);
      })
      .catch((err) => {
        if (cancelled) return;
        const message =
          err instanceof OpenMeteoApiError
            ? 'Unable to search right now. Please try again.'
            : 'Something went wrong.';
        setError(message);
      })
      .finally(() => {
        if (!cancelled) setSearching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, searchLocations]);

  const handleSelect = (location: Location) => {
    selectLocation(location);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surfaceAlt }]}>
      <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
        <Magnify width={20} height={20} color={colors.secondaryText} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search cities..."
          placeholderTextColor={colors.secondaryText}
          style={[typography.body, styles.input, { color: colors.text }]}
          autoFocus
          returnKeyType="search"
          accessibilityLabel="Search location"
        />
      </View>

      {query.trim().length < MIN_SEARCH_QUERY_LENGTH && !error && (
        <View style={styles.emptyState}>
          <Earth width={40} height={40} color={colors.secondaryText} />
          <Text style={[typography.h3, { color: colors.text, marginTop: spacing.sm }]}>
            Search for a city
          </Text>
          <Text style={[typography.body, { color: colors.secondaryText, marginTop: spacing.xs }]}>
            Find weather anywhere in the world.
          </Text>
        </View>
      )}

      {error && (
        <Text style={[typography.body, { color: colors.danger, padding: spacing.md }]}>{error}</Text>
      )}

      {!error && query.trim().length >= MIN_SEARCH_QUERY_LENGTH && !searching && results.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={[typography.body, { color: colors.secondaryText }]}>
            No locations found for "{query}".
          </Text>
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SearchResultItem location={item} onPress={() => handleSelect(item)} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.medium,
  },
  input: { flex: 1, marginLeft: spacing.sm },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
});
