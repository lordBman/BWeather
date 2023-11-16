import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { MainScreenProps } from "../../utils/types";

const Locations: React.FC<MainScreenProps<"locations">> = () =>{
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

export default Locations;