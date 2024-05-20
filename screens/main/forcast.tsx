import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { MainScreenProps } from "../../utils/types";
import React, { useContext, useRef } from "react";
import { AppContext, AppContextType } from "../../utils/provider";
import { Others } from "../../components";
import { BallTriangle } from "react-loader-spinner"
import SlidingUpPanel from "rn-sliding-up-panel";

const Forcast: React.FC<MainScreenProps<"forcast">> = () =>{
    const { data, state } = useContext(AppContext) as AppContextType;
    const slidingPanelRef = useRef<SlidingUpPanel>(null);

    if(state.loading){
        return (
            <View>
                <View>
                    <BallTriangle height={60} width={60} radius={5} color="grey" ariaLabel="ball-triangle-loading" visible={true} />
                </View>
                <Text>{ state.message }</Text>
            </View>
        );
    }

    if(state.isError){
        return (
            <Text>{state.message}</Text>
        );
    }

    
    return (
        <SafeAreaView style={styles.root}>
            <StatusBar translucent={true} backgroundColor={"transpatent"} barStyle={"light-content"}/>
            <View style={{ height: "100%", flexDirection: "column" }}>
                <View style={styles.current}>
                    <Text>{data?.timezone}</Text>
                </View>
                <SlidingUpPanel ref={slidingPanelRef} showBackdrop draggableRange={{bottom: 120, top: 720}} allowMomentum>
                    <Others />
                </SlidingUpPanel>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        height: "100%"
    },
    current: {
        flex: 1,
    }
});

export default Forcast;