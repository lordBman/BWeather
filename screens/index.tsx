import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "./splash";
import Info from "./info";
import Main from "./main";
import { RootStackParamList } from "../utils/types";
import { NavigationContainer } from "@react-navigation/native";

const App = () =>{
    const Stack = createNativeStackNavigator<RootStackParamList>();

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="splash">
                <Stack.Screen name="splash" component={Splash} options={ { statusBarHidden: true, headerShown: false } } />
                <Stack.Screen name="main" component={Main} />
                <Stack.Screen name="info" component={Info} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}