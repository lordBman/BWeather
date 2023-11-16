import { SafeAreaView, StatusBar, View } from "react-native";
import { MainScreenProps } from "../../utils/types";

const Settings: React.FC<MainScreenProps<"settings">> = () =>{
    return (
        <SafeAreaView>
            <StatusBar translucent={true} backgroundColor={"transpatent"} barStyle={"light-content"}/>
        </SafeAreaView>
    );
}

export default Settings;