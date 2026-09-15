// src/components/common/ErrorState.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { spacing, radius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import CloudAlert from '../../icons/cloud-alert';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Unable to load weather', message, onRetry }: ErrorStateProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <CloudAlert width={40} height={40} color={colors.danger} />
      <Text style={[typography.h3, { color: colors.text, marginTop: spacing.sm }]}>{title}</Text>
      <Text
        style={[
          typography.body,
          { color: colors.secondaryText, textAlign: 'center', marginTop: spacing.xs },
        ]}
      >
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Try again"
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
        >
          <Text style={[typography.bodyBold, { color: colors.onPrimary }]}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: radius.large,
  },
  retryButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.medium,
  },
});
