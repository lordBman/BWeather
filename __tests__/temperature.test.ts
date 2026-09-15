import { formatTemperature, unitSymbol } from '../src/utils/temperature';
import { useSettingsStore } from '../src/store/settingsStore';

describe('temperature formatting', () => {
  afterEach(() => {
    useSettingsStore.setState({ temperatureUnit: 'celsius' });
  });

  it('rounds to the nearest whole degree with no decimals', () => {
    useSettingsStore.setState({ temperatureUnit: 'celsius' });
    expect(formatTemperature(28.0)).toBe('28°C');
    expect(formatTemperature(27.6)).toBe('28°C');
    expect(formatTemperature(27.4)).toBe('27°C');
  });

  it('reflects the current settings unit', () => {
    useSettingsStore.setState({ temperatureUnit: 'fahrenheit' });
    expect(formatTemperature(82)).toBe('82°F');
  });

  it('can omit the unit suffix', () => {
    useSettingsStore.setState({ temperatureUnit: 'celsius' });
    expect(formatTemperature(28, false)).toBe('28°');
  });

  it('unitSymbol returns the correct degree symbol', () => {
    expect(unitSymbol('celsius')).toBe('°C');
    expect(unitSymbol('fahrenheit')).toBe('°F');
  });
});
