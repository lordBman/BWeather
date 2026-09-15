import {
  dayProgress,
  formatFullDate,
  formatHourLabel,
  isSameHour,
  relativeDayLabel,
} from '../src/utils/dateTime';

describe('dateTime utilities (location-local, naive timestamps)', () => {
  it('formats an hour label without shifting for device timezone', () => {
    expect(formatHourLabel('2026-09-08T13:00')).toMatch(/1\s*PM/i);
    expect(formatHourLabel('2026-09-08T00:00')).toMatch(/12\s*AM/i);
  });

  it('formats a full date', () => {
    expect(formatFullDate('2026-09-08')).toContain('September');
    expect(formatFullDate('2026-09-08')).toContain('8');
  });

  it('detects the same hour regardless of minute', () => {
    expect(isSameHour('2026-09-08T13:00', '2026-09-08T13:45')).toBe(true);
    expect(isSameHour('2026-09-08T13:00', '2026-09-08T14:00')).toBe(false);
  });

  it('labels today/tomorrow relative to a reference date', () => {
    expect(relativeDayLabel('2026-09-08', '2026-09-08')).toBe('Today');
    expect(relativeDayLabel('2026-09-09', '2026-09-08')).toBe('Tomorrow');
    expect(relativeDayLabel('2026-09-12', '2026-09-08')).not.toBe('Today');
  });

  it('computes day progress between sunrise and sunset, clamped to [0,1]', () => {
    const sunrise = '2026-09-08T06:00';
    const sunset = '2026-09-08T18:00';
    expect(dayProgress('2026-09-08T06:00', sunrise, sunset)).toBeCloseTo(0);
    expect(dayProgress('2026-09-08T12:00', sunrise, sunset)).toBeCloseTo(0.5);
    expect(dayProgress('2026-09-08T18:00', sunrise, sunset)).toBeCloseTo(1);
    // Before sunrise / after sunset clamp instead of going negative or >1.
    expect(dayProgress('2026-09-08T00:00', sunrise, sunset)).toBe(0);
    expect(dayProgress('2026-09-08T23:00', sunrise, sunset)).toBe(1);
  });
});
