import { useForm, Controller, set } from "react-hook-form";
import {
  TextInput,
  View,
  Text,
  Image,
  StyleSheet,
    Dimensions,
  
} from "react-native";
import {  useState } from "react";
import {  router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../components/loadingScreen";
import Button from "../components/button";
import HorizontalLine from "../components/horizontalLine";

const screenWidth = Dimensions.get("window").width - 50;

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  input: {
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 10,
    width: screenWidth,
    marginBottom: 10,
  },
  logo: {
    resizeMode: "stretch",
    height: 150,
    width: 150,
  },
});
export default function HomeScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", senha: "" } });
  const [loading, setLoading] = useState(false);
  const onSubmit = (data) => console.log(data);
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('userToken', value);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('userToken');
      if (value !== null) {
        // value previously stored
        console.log(value);
      }
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };


  const login = async () => {
    setLoading("true");
    try {
      const res = await fetch(
        "https://backend-labeddit-sfwt.onrender.com/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: `${control._formValues.email}`,
            password: `${control._formValues.senha}`,
          }),
        } 
      );

      const data = await res.json();
      storeData(data.token);
      setLoading("false");     
      router.navigate('/feed')
    } catch (error) {
      console.log(error);
    }
  };

  if(loading === "true"){
    return <LoadingScreen />
    
  }

  return (
    <View style={styles.homeContainer}>
      <View style={{ alignItems: "center" }}>
        <Image
          style={styles.logo}
          source={require("../../assets/labedditlogo.png")}
        />
        <Text>O projeto de rede social da Labenu</Text>
      </View>
      <View>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              style={styles.input}
              onBlur={onBlur}
              placeholder="Email"
              onChangeText={onChange}
              autoCapitalize="none"
            />
          )}
          name="email"
        />
        {errors.email && <Text>Campo obrigatorio</Text>}

        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              secureTextEntry={true}
              value={value}
              style={styles.input}
              onBlur={onBlur}
              placeholder="Senha"
              onChangeText={onChange}
            />
          )}
          name="senha"
        />
        {errors.senha && <Text>Campo obrigatorio</Text>}
      </View>
      <View>
        <Button onPress={login} type="button1"><Text>Login</Text></Button>
        <HorizontalLine />
        <Button onPress={() => router.navigate("/signup")} type="button2"><Text>Crie uma conta!</Text></Button>
      </View>
    </View>
  );
}
