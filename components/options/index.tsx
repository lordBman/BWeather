import { StyleSheet, View } from "react-native";
import OptionButton from "./button";
import { useState } from "react";

interface OptionsProps{
    onchoose: CallableFunction;
}

const Options: React.FC<OptionsProps> = ({ onchoose }) =>{
    const [active, setActive] = useState<"daily" | "hourly">("daily");

    const chosen = (choice: string) => {
        const init = choice === "left" ? "daily" : "hourly";
        onchoose(init);
        setActive(init);
    }

    return (
        <View style={styles.root}>
            <OptionButton position={"left"} text="Daily" onclick={chosen} active={ active === "daily" } />
            <OptionButton position={"right"} text="Hourly" onclick={chosen} active={ active === "hourly" }/>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {

    }
});

export default Options;