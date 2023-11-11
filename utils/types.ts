import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

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