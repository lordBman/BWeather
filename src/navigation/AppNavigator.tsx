// src/navigation/AppNavigator.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useTheme } from '../theme/ThemeProvider';
import { HomeScreen } from '../screens/HomeScreen';
import { ForecastScreen } from '../screens/ForecastScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ForecastDetailScreen } from '../screens/ForecastDetailScreen';
import { RootStackParamList, TabParamList } from './types';
import TabIcon from '../icons/tab-icon';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TAB_ICONS: Record<keyof TabParamList, string> = {
  Home: 'mdi:home',
  Forecast: 'mdi:calendar-text',
  Favorites: 'mdi:heart',
  Settings: 'mdi:cog',
};

function Tabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarIcon: ({ color, size }) => (
          <TabIcon icon={TAB_ICONS[route.name as keyof TabParamList]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Forecast" component={ForecastScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search location' }} />
      <Stack.Screen
        name="ForecastDetail"
        component={ForecastDetailScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}
