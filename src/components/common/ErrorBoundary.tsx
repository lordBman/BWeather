// src/components/common/ErrorBoundary.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches unexpected render errors anywhere below it and shows a friendly
 * recovery screen instead of a blank/crashed app. Never exposes the stack
 * trace to the user (it's logged via console.error for developers only).
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('BWeather crashed:', error, info);
  }

  handleRestart = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Something went wrong.</Text>
          <Text style={styles.message}>BWeather encountered an unexpected problem.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleRestart}
            accessibilityRole="button"
            accessibilityLabel="Restart"
          >
            <Text style={styles.buttonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F4F8FC',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#102A43', marginBottom: 8 },
  message: { fontSize: 15, color: '#627D98', textAlign: 'center', marginBottom: 24 },
  button: { backgroundColor: '#1976D2', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  buttonText: { color: '#FFFFFF', fontWeight: '600' },
});
