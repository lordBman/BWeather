import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface OptionButtonProps{
    text: string,
    position: "left" | "right",
    active: boolean,
    onclick: CallableFunction
}

const OptionButton: React.FC<OptionButtonProps> = ({ text, position, onclick, active }) =>{
    const positionalStyle = StyleSheet.compose(styles.root, position === "left" ? styles.left : styles.right);
    const finalStyle = StyleSheet.compose(positionalStyle, styles.active);

    const activeText = StyleSheet.compose(styles.text, styles.textActive);

    const clicked = () => onclick(position);

    return (
        <TouchableOpacity style={active ? finalStyle : positionalStyle } onPress={ clicked }>
            <Text style={ active ? activeText : styles.text }>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    root: { 
        borderColor: "blue",
        borderWidth: 2,
        flex: 1
    },
    left: {
        borderBottomLeftRadius: 8,
        borderTopLeftRadius: 8
    },
    right: {
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8
    },
    active: {
        backgroundColor: "blue",
    },
    text:{
        color: "blue",
        fontStyle: "normal",
        fontSize: 14,
        fontWeight: "300"
    },
    textActive: {
        color: "white"
    }
});

export default OptionButton;