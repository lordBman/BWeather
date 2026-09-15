import { getWeatherCategory, getWeatherDescription, getWeatherIcon } from '../src/utils/weatherCode';

describe('weatherCode mapping', () => {
  it('maps known codes to descriptions', () => {
    expect(getWeatherDescription(0)).toBe('Clear sky');
    expect(getWeatherDescription(61)).toBe('Slight rain');
    expect(getWeatherDescription(95)).toBe('Thunderstorm');
  });

  it('falls back gracefully for unknown codes', () => {
    expect(getWeatherDescription(9999)).toBe('Unknown');
  });

  it('picks day vs night icons', () => {
    expect(getWeatherIcon(0, true)).toBe('mdi:weather-sunny');
    expect(getWeatherIcon(0, false)).toBe('mdi:weather-night');
  });

  it('categorizes clear/cloudy/rain/storm/snow/fog correctly during the day', () => {
    expect(getWeatherCategory(0, true)).toBe('clear');
    expect(getWeatherCategory(3, true)).toBe('cloudy');
    expect(getWeatherCategory(61, true)).toBe('rain');
    expect(getWeatherCategory(95, true)).toBe('storm');
    expect(getWeatherCategory(75, true)).toBe('snow');
    expect(getWeatherCategory(45, true)).toBe('fog');
  });

  it('always categorizes as night regardless of weather code when isDay is false', () => {
    expect(getWeatherCategory(0, false)).toBe('night');
    expect(getWeatherCategory(95, false)).toBe('night');
  });
});
