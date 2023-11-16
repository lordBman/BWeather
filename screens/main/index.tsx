import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Forcast from "./forcast";
import Settings from "./settings";
import Locations from "./locations";
import { MainBottomParamList, RootScreenProps } from "../../utils/types";
import Icon from "react-native-vector-icons/FontAwesome";

const Main: React.FC<RootScreenProps<"main">> = () =>{
    const Tab = createBottomTabNavigator<MainBottomParamList>();
    return (
        <Tab.Navigator initialRouteName="forcast" screenOptions={{ headerShown: false }}>
            <Tab.Screen name="forcast" component={Forcast} options={{ tabBarIcon: (props) =>(<Icon name="cloud" size={props.size} color={props.color} />) }} />
            <Tab.Screen name="locations" component={Locations} options={{ tabBarIcon: (props) =>(<Icon name="map-marker" size={props.size} color={props.color} />) }} />
            <Tab.Screen name="settings" component={Settings} options={{ tabBarIcon: (props) =>(<Icon name="cogs" size={props.size} color={props.color} />) }} />
        </Tab.Navigator>
    );
}

export default Main;