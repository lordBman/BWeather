// Re-export the normalized weather types so screens/components import from
// `types/weather` rather than reaching into the api layer directly.
export type {
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
  WeatherForecast,
} from '../api/apiTypes';
