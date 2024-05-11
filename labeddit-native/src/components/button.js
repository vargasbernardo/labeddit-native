import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Pressable, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width - 50;
const styles = StyleSheet.create({
  button: {
    width: screenWidth,
    height: 45,
    marginTop: 5,
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  button1: {
    backgroundColor: "red",
  },
  button2: {
    borderWidth: 1,
    borderColor: "#FE7E02",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default function Button({ children, onPress, type }) {
  const buttonStyle = type === "button1" ? [styles.button, styles.button1] : [styles.button, styles.button2];
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={buttonStyle}
        colors={type === 'button1' ?  ["#ff6489", "#f9b24e"] : []}
      >
        {typeof children === "string" ? (
          <Text style={styles.buttonText}>{children}</Text>
        ) : (
          children || <Text style={styles.buttonText}>Button</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}
