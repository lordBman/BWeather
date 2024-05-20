import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { AppContext, AppContextType } from "../../utils/provider";

const HourlyView = () =>{
    const { data, load} = useContext(AppContext) as AppContextType;
    
    return (
        <View style={style.root}>

        </View>
    );
}

const style = StyleSheet.create({
    root:{
        flexWrap: "wrap"
    }
});

export default HourlyView;
