import { StyleSheet, View } from "react-native";
import Options from "../options";
import { useState } from "react";
import DailyView from "./daily";
import HourlyView from "./hourly";

const Others = () =>{
    const [active, setActive] = useState<"daily" |  "hourly">("daily");

    const choose = (choice: "daily" |  "hourly") => setActive(choice);

    return (
        <View style={style.root}>
            <Options onchoose={choose}/>
            { active === "daily" && <DailyView /> }
            { active === "hourly" && <HourlyView /> }
        </View>
    );
}

const style = StyleSheet.create({
    root:{

    },
});

export default Others;