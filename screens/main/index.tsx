import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Forcast from "./forcast";
import Settings from "./settings";
import Locations from "./locations";
import { MainBottomParamList, RootScreenProps } from "../../utils/types";

const Main: React.FC<RootScreenProps<"main">> = () =>{
    const Tab = createBottomTabNavigator<MainBottomParamList>();
    return (
        <Tab.Navigator initialRouteName="forcast">
            <Tab.Screen name="forcast" component={Forcast} />
            <Tab.Screen name="locations" component={Locations} />
            <Tab.Screen name="settings" component={Settings} />
        </Tab.Navigator>
    );
}

export default Main;