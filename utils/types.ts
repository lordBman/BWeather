import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppSettings } from "./settings";

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

export interface Main{
    temp: number, feels_like: number, temp_min: number, temp_max: number, pressure: number, sea_level: number, grnd_level: number, humidity: number, temp_kf: number
}

export interface Weather{
    id: number, main: string, description: string, icon: string
}

export interface Clouds{
    all: number,
}

export interface Wind{
    speed: number, deg: number, gust: number
}

export interface Forecast{
    dt: number, main: Main, weather: Weather[], clouds: Clouds, wind: Wind, visibility: number, pop: number,

}

export interface Result{
    cod: string, message: string, cnt: number, list: Forecast[]
}

export type AppContextType = {
    result?: Result;
    settings: AppSettings,
    loading: boolean;
    isError: boolean;
    error: any;
    load: (city: string) => void;
    toggleTheme:() => void;
    toggleUnits: () => void;
};