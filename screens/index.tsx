import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "./splash";
import Info from "./info";
import Main from "./main";
import { RootStackParamList } from "../utils/types";
import { NavigationContainer } from "@react-navigation/native";
import AppProvider from "../utils/provider";
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

const App = () =>{
    const Stack = createNativeStackNavigator<RootStackParamList>();

    return (
        <QueryClientProvider client={queryClient}>
            <AppProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="splash">
                        <Stack.Screen name="splash" component={Splash} options={ { statusBarHidden: true, headerShown: false } } />
                        <Stack.Screen name="main" component={Main} />
                        <Stack.Screen name="info" component={Info} />
                    </Stack.Navigator>
                </NavigationContainer>
            </AppProvider>
        </QueryClientProvider>
    );
}

export default App;