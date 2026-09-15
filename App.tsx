// App.tsx

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RNBootSplash from 'react-native-bootsplash';

import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useLocation } from './src/hooks/useLocation';

function Root() {
  const { isDark } = useTheme();
  const { resolveDeviceLocation, permissionStatus } = useLocation();

  useEffect(() => {
    // Resolve on startup so the native prompt appears whenever permission is
    // not granted. Permanently denied permissions are handled by Settings.
    if (permissionStatus !== 'granted' && permissionStatus !== 'permanently_denied') {
      resolveDeviceLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    RNBootSplash.hide({ fade: true });
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <Root />
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
