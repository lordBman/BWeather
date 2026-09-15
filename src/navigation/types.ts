// src/navigation/types.ts

import { DailyForecast } from '../types/weather';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  Search: undefined;
  ForecastDetail: { day: DailyForecast };
};

export type TabParamList = {
  Home: undefined;
  Forecast: undefined;
  Favorites: undefined;
  Settings: undefined;
};
