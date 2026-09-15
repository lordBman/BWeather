export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  /** Muted surface used for skeleton loaders and subtle dividers. */
  surfaceAlt: string;
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  secondary: string;
  secondaryContainer: string;
  tertiary: string;
  tertiaryContainer: string;
  text: string;
  secondaryText: string;
  border: string;
  danger: string;
  success: string;
}

export function blendColors(base: string, tint: string, amount: number): string {
  const baseRgb = base.slice(1).match(/.{2}/g)?.map((value) => parseInt(value, 16));
  const tintRgb = tint.slice(1).match(/.{2}/g)?.map((value) => parseInt(value, 16));

  if (!baseRgb || !tintRgb || baseRgb.length !== 3 || tintRgb.length !== 3) {
    return base;
  }

  return `#${baseRgb
    .map((value, index) => Math.round(value + (tintRgb[index] - value) * amount).toString(16).padStart(2, '0'))
    .join('')}`;
}

export const colorSchemes = {
  ocean: {
    label: 'Ocean',
    primary: '#1976D2',
    primaryContainer: '#D1E4FF',
    onPrimary: '#FFFFFF',
    secondary: '#00897B',
    secondaryContainer: '#B2DFDB',
    tertiary: '#F9A825',
    tertiaryContainer: '#FFF0C2',
    darkPrimary: '#64B5F6',
    darkPrimaryContainer: '#004A77',
    darkOnPrimary: '#071A2B',
    darkSecondary: '#4DB6AC',
    darkSecondaryContainer: '#005047',
    darkTertiary: '#FFD54F',
    darkTertiaryContainer: '#5A4700',
  },
  forest: {
    label: 'Forest',
    primary: '#2E7D32',
    primaryContainer: '#C8E6C9',
    onPrimary: '#FFFFFF',
    secondary: '#1565C0',
    secondaryContainer: '#C5CAE9',
    tertiary: '#EF6C00',
    tertiaryContainer: '#FFE0B2',
    darkPrimary: '#81C784',
    darkPrimaryContainer: '#1B5E20',
    darkOnPrimary: '#071A2B',
    darkSecondary: '#64B5F6',
    darkSecondaryContainer: '#283593',
    darkTertiary: '#FFB74D',
    darkTertiaryContainer: '#7A4100',
  },
  sunset: {
    label: 'Sunset',
    primary: '#C45A24',
    primaryContainer: '#FFDBCB',
    onPrimary: '#FFFFFF',
    secondary: '#7B1FA2',
    secondaryContainer: '#F3D5F5',
    tertiary: '#00838F',
    tertiaryContainer: '#B2EBF2',
    darkPrimary: '#FF8A65',
    darkPrimaryContainer: '#7F2700',
    darkOnPrimary: '#071A2B',
    darkSecondary: '#CE93D8',
    darkSecondaryContainer: '#4A148C',
    darkTertiary: '#4DD0E1',
    darkTertiaryContainer: '#004D40',
  },
} as const;

export const lightTheme: ThemeColors = {
  background: '#F4F8FC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceAlt: '#E3EAF2',
  primary: '#1976D2',
  primaryContainer: '#D1E4FF',
  onPrimary: '#FFFFFF',
  secondary: '#00897B',
  secondaryContainer: '#B2DFDB',
  tertiary: '#F9A825',
  tertiaryContainer: '#FFF0C2',
  text: '#102A43',
  secondaryText: '#627D98',
  border: '#D9E2EC',
  danger: '#D64545',
  success: '#2E7D32',
};

export const darkTheme: ThemeColors = {
  background: '#071A2B',
  surface: '#102B43',
  surfaceElevated: '#16344F',
  surfaceAlt: '#1F3F5C',
  primary: '#64B5F6',
  primaryContainer: '#004A77',
  onPrimary: '#071A2B',
  secondary: '#4DB6AC',
  secondaryContainer: '#005047',
  tertiary: '#FFD54F',
  tertiaryContainer: '#5A4700',
  text: '#FFFFFF',
  secondaryText: '#B8C7D9',
  border: '#1F3A54',
  danger: '#FF6B6B',
  success: '#66BB6A',
};

/** Gradient-ish accent pairs keyed by broad weather condition, used on the current-weather card. */
export const weatherGradients: Record<
  'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog' | 'night',
  [string, string]
> = {
  clear: ['#4FA9E8', '#F2C94C'],
  cloudy: ['#7C93A6', '#A9BCC9'],
  rain: ['#33587A', '#4A6D8C'],
  storm: ['#2E2A4A', '#4B3F72'],
  snow: ['#A9C6D8', '#E4EEF3'],
  fog: ['#8A97A0', '#B8C2C9'],
  night: ['#0B1E3A', '#1C3355'],
};
