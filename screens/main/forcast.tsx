import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { MainScreenProps, WeatherContextType } from "../../utils/types";
import { useContext } from "react";
import { WeatherContext } from "../../utils/Provider";

const Forcast: React.FC<MainScreenProps<"forcast">> = () =>{
    const { result, load, pick} = useContext(WeatherContext) as WeatherContextType;
    
    return (
        <SafeAreaView style={styles.root}>
            <StatusBar translucent={true} backgroundColor={"transpatent"} barStyle={"light-content"}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        
    }
});

export default Forcast;