import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "../components/loadingScreen";
import Header from "../components/header";
import Button from "../components/button";

const screenWidth = Dimensions.get("window").width - 50;
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 10,
    width: screenWidth,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
  }
});
const storeData = async (value) => {
  try {
    await AsyncStorage.setItem("userToken", value);
  } catch (e) {
    // saving error
    console.log(e);
  }
  console.log("done");
};

export default function SignUpScreen() {
  const [isChecked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { apelido: "", email: "", senha: "" } });
  const postData = {
    name: control._formValues.apelido,
    email: control._formValues.email,
    password: control._formValues.senha,
  };
  const signup = async () => {
    try {
      setLoading("true");
      const res = await fetch(
        "https://backend-labeddit-sfwt.onrender.com/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );
      if (!res.ok) {
        throw new Error("Erro ao cadastrar usuário");
      }

      const data = await res.json();
      storeData(data.token);
      router.navigate("/feed");
    } catch (error) {
      console.log(error);
    }
  };
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <View style={styles.container}>
      <Header onPress={() => router.navigate("/")} />
      <Text style={{ fontSize: 25, fontWeight: "bold" }}>
        Olá, boas vindas ao LabEddit!
      </Text>
      <View>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              style={styles.input}
              onBlur={onBlur}
              placeholder="Apelido"
              onChangeText={onChange}
              autoCapitalize="none"
            />
          )}
          name="apelido"
        />
        {errors.apelido && <Text>Campo obrigatorio</Text>}
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
      <View style={{ width: screenWidth }}>
        <Text>
          Ao continuar, voce concorda com o nosso{" "}
          <Text style={{ color: "blue" }}>Contrato de usuario</Text> e nossa{" "}
          <Text style={{ color: "blue" }}>Política de Privacidade</Text>
        </Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
        >
          <Checkbox
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? "#4630EB" : undefined}
          />
          <Text style={{ paddingLeft: 10 }}>
            Eu concordo em receber emails sobre coisas legais no Labeddit
          </Text>
        </View>
      </View>
      <Button onPress={signup} type="button1">
        <Text style={{ fontWeight: "bold", color: "white" }}>Cadastrar</Text>
      </Button>
    </View>
  );
}
