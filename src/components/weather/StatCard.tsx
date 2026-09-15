// src/components/weather/StatCard.tsx

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';

interface StatCardProps extends React.PropsWithChildren {
  label: string;
  value: string;
  subvalue?: string;
}

export function StatCard({ label, value, subvalue, children }: StatCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surface }]}
      accessible
      accessibilityLabel={`${label}: ${value}${subvalue ? `, ${subvalue}` : ''}`}
    >
      <View style={styles.header}>
        {children}
        <Text style={[typography.caption, { color: colors.secondaryText, fontSize: 16, marginLeft: spacing.xs }]}>
          {label}
        </Text>
      </View>
      <Text style={[typography.h3, { color: colors.text, marginTop: spacing.xs }]}>{value}</Text>
      {subvalue && (
        <Text style={[typography.small, { color: colors.secondaryText }]}>{subvalue}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
    borderRadius: radius.medium,
  },
  header: { flexDirection: 'row', alignItems: 'center' },
});
