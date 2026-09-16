// src/navigation/AppNavigator.tsx

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useTheme } from '../theme/ThemeProvider';
import { useResponsive } from '../hooks/useResponsive';
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

function CustomSideTabBar({ state, descriptors, navigation }: any) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 90,
        backgroundColor: colors.surface,
        borderRightWidth: 1,
        borderRightColor: colors.border,
        alignItems: 'center',
        paddingTop: 60,
        gap: 24,
        zIndex: 100,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const color = isFocused ? colors.primary : colors.secondaryText;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{ alignItems: 'center', width: '100%', paddingVertical: 8 }}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            <TabIcon icon={TAB_ICONS[route.name as keyof TabParamList]} size={26} color={color} />
            <Text style={{ color, fontSize: 11, marginTop: 4, fontWeight: isFocused ? '600' : '400' }}>
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function Tabs() {
  const { colors } = useTheme();
  const { isTablet } = useResponsive();

  return (
    <Tab.Navigator
      tabBar={isTablet ? (props) => <CustomSideTabBar {...props} /> : undefined}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarStyle: isTablet
          ? { display: 'none' }
          : { backgroundColor: colors.surface, borderTopColor: colors.border },
        sceneStyle: isTablet ? { paddingLeft: 90 } : undefined,
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
  const { colors } = useTheme();

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
