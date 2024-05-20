import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export interface Weather{
    id: number, main: string, description: string, icon: string
}

export interface Current{
    dt: number, sunrise: number, sunset: number, temp: number, feels_like: number,
    pressure: number, humidity: number, dew_point: number, uvi: number,
    clouds: number, visibility: number, wind_speed: number, wind_deg: number, wind_gust: number,
    weather:Weather[]
}

export interface Hourly{
    dt: number, temp: number, feels_like: number, pressure: number, humidity: number, dew_point: number, uvi: number,
    clouds: number, visibility: number, wind_speed: number, wind_deg:  number, wind_gust: number,
    weather: Weather[],
    pop: number
}

export interface Daily{
    dt: number, sunrise: number, sunset: number, moonrise: number, moonset: number, moon_phase: number,
    summary: string,pressure: number, humidity: number, dew_point: number, wind_speed: number, wind_deg: number, wind_gust: number,
    temp:{ day : number, min: number, max: number, night: number, eve: number, morn: number },
    feels_like:{ day: number, night: number, eve: number, morn: number },
    weather:Weather[],
    clouds: number, pop: number, rain: number, uvi: number
}

export interface Alert{
    sender_name: string, event: string, start: number, end: number,
    description: string,
    tags: any[]
}

export interface Data{
    lat: number, lon: number, timezone: string, timezone_offset: number,
    current: Current,
    hourly: Hourly[],
    daily: Daily[],
    alerts: Alert[],
}

export type MainBottomParamList = {
    forcast: undefined,
    locations: undefined,
    settings: undefined
}

export type RootStackParamList = {
    splash: undefined;
    main: NavigatorScreenParams<MainBottomParamList>;
    info: undefined;
}

export type RootScreenProps<RouteName extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, RouteName>
export type MainScreenProps<RouteName extends keyof MainBottomParamList> = CompositeScreenProps<BottomTabScreenProps<MainBottomParamList, RouteName>, NativeStackScreenProps<RootStackParamList>>;