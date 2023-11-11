import { SafeAreaView, StatusBar, View } from "react-native";
import { RootScreenProps } from "../utils/types";

const Splash: React.FC<RootScreenProps<"splash">> = () =>{
    return (
        <View>
            <StatusBar barStyle={ 'light-content'} backgroundColor={"transparent"} translucent={true}/>
            <SafeAreaView>
                
            </SafeAreaView>
        </View>
    );
}

export default Splash;