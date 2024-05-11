import { Dimensions, StyleSheet, View } from "react-native";

const screenWidth = Dimensions.get("window").width - 50;
const styles = StyleSheet.create({
  line: {
    width: screenWidth,
    borderWidth: 1,
    borderColor: "#FE7E02",
    marginVertical: 10,
  },
});

export default function HorizontalLine() {
  return <View style={styles.line}></View>;
}
