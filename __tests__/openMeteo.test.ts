// __tests__/openMeteo.test.ts
//
// Unit tests for src/api/openMeteo.ts. `fetch` is mocked so these tests
// never make real network calls.

import {
  assertValidCoordinates,
  buildForecastUrl,
  getWeatherForecast,
  normalizeForecastResponse,
  validateForecastResponse,
} from '../src/api/openMeteo';
import { OpenMeteoApiError, RawForecastResponse } from '../src/api/apiTypes';
import { OPEN_METEO_BASE_URL } from '../src/constants/config';

function buildRawResponse(
  overrides: Partial<RawForecastResponse> = {}
): RawForecastResponse {
  return {
    latitude: 6.5244,
    longitude: 3.3792,
    timezone: 'Africa/Lagos',
    current: {
      time: '2026-09-08T12:00',
      temperature_2m: 28,
      apparent_temperature: 31,
      relative_humidity_2m: 74,
      precipitation: 0,
      rain: 0,
      showers: 0,
      snowfall: 0,
      weather_code: 1,
      cloud_cover: 20,
      surface_pressure: 1012,
      wind_speed_10m: 12,
      wind_direction_10m: 200,
      wind_gusts_10m: 18,
      uv_index: 7,
      is_day: 1,
    },
    hourly: {
      time: ['2026-09-08T12:00', '2026-09-08T13:00'],
      temperature_2m: [28, 29],
      apparent_temperature: [31, 32],
      precipitation_probability: [10, 20],
      precipitation: [0, 0.1],
      rain: [0, 0.1],
      showers: [0, 0],
      snowfall: [0, 0],
      weather_code: [1, 2],
      cloud_cover: [20, 40],
      relative_humidity_2m: [74, 70],
      wind_speed_10m: [12, 14],
      wind_direction_10m: [200, 210],
      uv_index: [7, 6],
    },
    daily: {
      time: ['2026-09-08', '2026-09-09'],
      weather_code: [1, 61],
      temperature_2m_max: [31, 28],
      temperature_2m_min: [24, 23],
      apparent_temperature_max: [34, 30],
      apparent_temperature_min: [26, 25],
      sunrise: ['2026-09-08T06:18', '2026-09-09T06:18'],
      sunset: ['2026-09-08T18:32', '2026-09-09T18:32'],
      precipitation_sum: [0, 4.2],
      precipitation_probability_max: [10, 65],
      rain_sum: [0, 4.2],
      showers_sum: [0, 0],
      snowfall_sum: [0, 0],
      wind_speed_10m_max: [18, 22],
      wind_gusts_10m_max: [25, 30],
      wind_direction_10m_dominant: [200, 190],
      uv_index_max: [8, 5],
    },
    ...overrides,
  };
}

describe('assertValidCoordinates', () => {
  it('accepts valid coordinates', () => {
    expect(() => assertValidCoordinates(6.5244, 3.3792)).not.toThrow();
    expect(() => assertValidCoordinates(-90, -180)).not.toThrow();
    expect(() => assertValidCoordinates(90, 180)).not.toThrow();
  });

  it.each([
    [91, 0],
    [-91, 0],
    [0, 181],
    [0, -181],
    [NaN, 0],
    [0, Infinity],
  ])('rejects invalid coordinates (%p, %p)', (lat, lon) => {
    expect(() => assertValidCoordinates(lat, lon)).toThrow(OpenMeteoApiError);
  });

  it('throws an INVALID_COORDINATES error code', () => {
    try {
      assertValidCoordinates(999, 0);
      throw new Error('expected assertValidCoordinates to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(OpenMeteoApiError);
      expect((err as OpenMeteoApiError).code).toBe('INVALID_COORDINATES');
    }
  });
});

describe('buildForecastUrl', () => {
  it('points at the Open-Meteo forecast endpoint', () => {
    const url = buildForecastUrl({ latitude: 6.5244, longitude: 3.3792 });
    expect(url.startsWith(`${OPEN_METEO_BASE_URL}/forecast?`)).toBe(true);
  });

  it('includes latitude and longitude', () => {
    const url = new URL(buildForecastUrl({ latitude: 6.5244, longitude: 3.3792 }));
    expect(url.searchParams.get('latitude')).toBe('6.5244');
    expect(url.searchParams.get('longitude')).toBe('3.3792');
  });

  it('always requests timezone=auto', () => {
    const url = new URL(buildForecastUrl({ latitude: 0, longitude: 0 }));
    expect(url.searchParams.get('timezone')).toBe('auto');
  });

  it('defaults to celsius and kmh when units are not specified', () => {
    const url = new URL(buildForecastUrl({ latitude: 0, longitude: 0 }));
    expect(url.searchParams.get('temperature_unit')).toBe('celsius');
    expect(url.searchParams.get('wind_speed_unit')).toBe('kmh');
  });

  it('forwards fahrenheit and mph when requested', () => {
    const url = new URL(
      buildForecastUrl({
        latitude: 0,
        longitude: 0,
        temperatureUnit: 'fahrenheit',
        windSpeedUnit: 'mph',
      })
    );
    expect(url.searchParams.get('temperature_unit')).toBe('fahrenheit');
    expect(url.searchParams.get('wind_speed_unit')).toBe('mph');
  });

  it('requests current, hourly, and daily variable sets', () => {
    const url = new URL(buildForecastUrl({ latitude: 0, longitude: 0 }));
    const current = url.searchParams.get('current') ?? '';
    const hourly = url.searchParams.get('hourly') ?? '';
    const daily = url.searchParams.get('daily') ?? '';

    expect(current).toContain('temperature_2m');
    expect(current).toContain('weather_code');
    expect(current).toContain('uv_index');

    expect(hourly).toContain('precipitation_probability');
    expect(hourly).toContain('weather_code');

    expect(daily).toContain('sunrise');
    expect(daily).toContain('sunset');
    expect(daily).toContain('uv_index_max');
  });

  it('throws for out-of-range coordinates instead of building a bad URL', () => {
    expect(() => buildForecastUrl({ latitude: 200, longitude: 0 })).toThrow(
      OpenMeteoApiError
    );
  });
});

describe('validateForecastResponse', () => {
  it('accepts a well-formed response', () => {
    expect(() => validateForecastResponse(buildRawResponse())).not.toThrow();
  });

  it('rejects non-object responses', () => {
    expect(() => validateForecastResponse(null)).toThrow(OpenMeteoApiError);
    expect(() => validateForecastResponse('oops')).toThrow(OpenMeteoApiError);
    expect(() => validateForecastResponse(42)).toThrow(OpenMeteoApiError);
  });

  it('rejects a response missing "current"', () => {
    const raw = buildRawResponse();
    delete (raw as Partial<RawForecastResponse>).current;
    expect(() => validateForecastResponse(raw)).toThrow(/current weather/i);
  });

  it('rejects a response missing "hourly"', () => {
    const raw = buildRawResponse();
    delete (raw as Partial<RawForecastResponse>).hourly;
    expect(() => validateForecastResponse(raw)).toThrow(/hourly forecast/i);
  });

  it('rejects a response missing "daily"', () => {
    const raw = buildRawResponse();
    delete (raw as Partial<RawForecastResponse>).daily;
    expect(() => validateForecastResponse(raw)).toThrow(/daily forecast/i);
  });

  it('rejects hourly series whose length does not match hourly.time', () => {
    const raw = buildRawResponse();
    raw.hourly!.temperature_2m = [28]; // time has 2 entries, this has 1
    expect(() => validateForecastResponse(raw)).toThrow(OpenMeteoApiError);
  });

  it('rejects daily series whose length does not match daily.time', () => {
    const raw = buildRawResponse();
    raw.daily!.temperature_2m_max = [31]; // time has 2 entries, this has 1
    expect(() => validateForecastResponse(raw)).toThrow(OpenMeteoApiError);
  });

  it('tags all validation failures with MALFORMED_RESPONSE', () => {
    try {
      validateForecastResponse({});
      throw new Error('expected validateForecastResponse to throw');
    } catch (err) {
      expect(err).toBeInstanceOf(OpenMeteoApiError);
      expect((err as OpenMeteoApiError).code).toBe('MALFORMED_RESPONSE');
    }
  });
});

describe('normalizeForecastResponse', () => {
  it('maps current weather fields to app-facing names', () => {
    const normalized = normalizeForecastResponse(buildRawResponse());
    expect(normalized.current).toMatchObject({
      temperature: 28,
      feelsLike: 31,
      humidity: 74,
      pressure: 1012,
      windSpeed: 12,
      uvIndex: 7,
      isDay: true,
    });
  });

  it('treats is_day === 0 as nighttime', () => {
    const raw = buildRawResponse();
    raw.current!.is_day = 0;
    const normalized = normalizeForecastResponse(raw);
    expect(normalized.current.isDay).toBe(false);
  });

  it('zips hourly arrays into one object per timestamp, in order', () => {
    const normalized = normalizeForecastResponse(buildRawResponse());
    expect(normalized.hourly).toHaveLength(2);
    expect(normalized.hourly[0]).toMatchObject({
      time: '2026-09-08T12:00',
      temperature: 28,
      precipitationProbability: 10,
    });
    expect(normalized.hourly[1]).toMatchObject({
      time: '2026-09-08T13:00',
      temperature: 29,
      precipitationProbability: 20,
    });
  });

  it('zips daily arrays into one object per date, in order', () => {
    const normalized = normalizeForecastResponse(buildRawResponse());
    expect(normalized.daily).toHaveLength(2);
    expect(normalized.daily[0]).toMatchObject({
      date: '2026-09-08',
      temperatureMax: 31,
      temperatureMin: 24,
      sunrise: '2026-09-08T06:18',
      sunset: '2026-09-08T18:32',
    });
    expect(normalized.daily[1]).toMatchObject({
      date: '2026-09-09',
      weatherCode: 61,
      precipitationSum: 4.2,
    });
  });

  it('stamps the normalized forecast with a fetchedAt timestamp', () => {
    const before = Date.now();
    const normalized = normalizeForecastResponse(buildRawResponse());
    const fetchedAt = new Date(normalized.fetchedAt).getTime();
    expect(fetchedAt).toBeGreaterThanOrEqual(before);
    expect(fetchedAt).toBeLessThanOrEqual(Date.now());
  });

  it('defaults a missing current.uv_index to 0 rather than throwing', () => {
    const raw = buildRawResponse();
    delete (raw.current as Record<string, unknown>).uv_index;
    const normalized = normalizeForecastResponse(raw);
    expect(normalized.current.uvIndex).toBe(0);
  });
});

describe('getWeatherForecast', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('returns a fully normalized forecast on success', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(buildRawResponse()),
    } as unknown as Response;
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const forecast = await getWeatherForecast({ latitude: 6.5244, longitude: 3.3792 });

    expect(forecast.latitude).toBe(6.5244);
    expect(forecast.current.temperature).toBe(28);
    expect(forecast.hourly).toHaveLength(2);
    expect(forecast.daily).toHaveLength(2);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('calls fetch with a URL built by buildForecastUrl', async () => {
    const mockResponse = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(buildRawResponse()),
    } as unknown as Response;
    const fetchMock = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = fetchMock;

    await getWeatherForecast({ latitude: 6.5244, longitude: 3.3792 });

    const calledUrl = (fetchMock.mock.calls[0][0] as string).toString();
    expect(calledUrl).toContain('latitude=6.5244');
    expect(calledUrl).toContain('longitude=3.3792');
  });

  it('rejects with INVALID_COORDINATES before ever calling fetch', async () => {
    global.fetch = jest.fn();

    await expect(
      getWeatherForecast({ latitude: 999, longitude: 0 })
    ).rejects.toMatchObject({ code: 'INVALID_COORDINATES' });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('throws a NETWORK_ERROR when fetch rejects', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(
      getWeatherForecast({ latitude: 6.5244, longitude: 3.3792 })
    ).rejects.toMatchObject({ code: 'NETWORK_ERROR' });
  });

  it('throws a TIMEOUT error when the request is aborted', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    global.fetch = jest.fn().mockRejectedValue(abortError);

    await expect(
      getWeatherForecast({ latitude: 6.5244, longitude: 3.3792 })
    ).rejects.toMatchObject({ code: 'TIMEOUT' });
  });

  it('throws a RATE_LIMIT error on HTTP 429', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 429,
      json: jest.fn(),
    } as unknown as Response);

    await expect(
      getWeatherForecast({ latitude: 6.5244, longitude: 3.3792 })
    ).rejects.toMatchObject({ code: 'RATE_LIMIT', status: 429 });
  });

  it('throws a SERVER_ERROR on HTTP 500', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: jest.fn(),
    } as unknown as Response);

    await expect(
      getWeatherForecast({ latitude: 6.5244, longitude: 3.3792 })
    ).rejects.toMatchObject({ code: 'SERVER_ERROR', status: 500 });
  });

  it('throws a SERVER_ERROR on other non-OK statuses (e.g. 400)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: jest.fn(),
    } as unknown as Response);

    await expect(
      getWeatherForecast({ latitude: 6.5244, longitude: 3.3792 })
    ).rejects.toMatchObject({ code: 'SERVER_ERROR', status: 400 });
  });

  it('throws MALFORMED_RESPONSE when the body is not valid JSON', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockRejectedValue(new SyntaxError('Unexpected token')),
    } as unknown as Response);

    await expect(
      getWeatherForecast({ latitude: 6.5244, longitude: 3.3792 })
    ).rejects.toMatchObject({ code: 'MALFORMED_RESPONSE' });
  });

  it('throws MALFORMED_RESPONSE when required fields are missing', async () => {
    const incomplete = buildRawResponse();
    delete (incomplete as Partial<RawForecastResponse>).daily;

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(incomplete),
    } as unknown as Response);

    await expect(
      getWeatherForecast({ latitude: 6.5244, longitude: 3.3792 })
    ).rejects.toMatchObject({ code: 'MALFORMED_RESPONSE' });
  });

  it('never throws a raw Error — only OpenMeteoApiError instances', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('boom'));

    try {
      await getWeatherForecast({ latitude: 6.5244, longitude: 3.3792 });
      throw new Error('expected getWeatherForecast to reject');
    } catch (err) {
      expect(err).toBeInstanceOf(OpenMeteoApiError);
    }
  });
});
