import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, usePathname } from "expo-router";
import { Foundation } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width - 50;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "lightgray",
    width: screenWidth + 50,
    height: 40,
    justifyContent: "center",
  },
  logo: {
    height: 30,
    width: 30,
  },
  textContainer: {
    position: "absolute",
    right: 20,
  },
  closeButton: {
    position: "absolute",
    left: 20,
  },
});

export default function Header({ children, onPress, id }) {
  const removeToken = async () => {
    await AsyncStorage.removeItem("userToken");
  };
  const pathname = usePathname();
  return (
    <View style={styles.container}>
      {pathname === `/postDetail/${id}` ? (
        <Foundation
          style={styles.closeButton}
          name="x"
          size={24}
          color="gray"
          onPress={() => router.back()}
        />
      ) : null}
      <Image
        style={styles.logo}
        source={require("../../assets/LogoWnowords.png")}
      />
      <Pressable onPress={onPress} style={styles.textContainer}>
        {pathname === "/feed" || `/postDetail/${id}` ? (
          <Text
            onPress={() => {
              router.push("/");
              removeToken();
            }}
            style={{ color: "blue" }}
          >
            Logout
          </Text>
        ) : (
          <Text
            onPress={() => {
              router.navigate("/");
            }}
            style={{ color: "blue" }}
          >
            Entrar
          </Text>
        )}
      </Pressable>
    </View>
  );
}
