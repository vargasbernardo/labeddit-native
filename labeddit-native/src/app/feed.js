import { router } from "expo-router";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Keyboard,
  RefreshControl
} from "react-native";
import Header from "../components/header";
import Button from "../components/button";
import HorizontalLine from "../components/horizontalLine";
import PostCard from "../components/postCard";
import { usePostData } from "../hooks/usePostData";
import LoadingScreen from "../components/loadingScreen";
import { useForm, Controller } from "react-hook-form";
import { usePostMutate } from "../hooks/usePostMutate";
import { useState } from "react";

const screenWidth = Dimensions.get("window").width - 50;
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  postContainer: {
    borderWidth: 1,
    borderColor: "lightgray",
    // height: 100,
    width: screenWidth,
    borderRadius: 10,
    marginTop: 5,
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: "lightgray",
    height: 100,
    width: screenWidth,
    borderRadius: 10,
    marginTop: 15,
    backgroundColor: "lightgray",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 5
  },
});

export default function FeedPage() {
  const { data, isLoading, isError, refetch } = usePostData();
  const [refreshing, setRefreshing] = useState(false)
  const reversedData = data ? [...data].reverse() : [];
  const {mutate} = usePostMutate()
  const {
    control,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: { content: "" },
  });
  

  const navigateToPostDetail = (id) => {
    router.navigate(`/postDetail/${id}`);
  };
  const onRefresh = () => {
    setRefreshing(true)
    refetch()
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }

  const handleSubmit = () => {
    const postData = {
      content: control._formValues.content,
    };
    mutate(postData, {
      onSuccess: () => {
        reset()
      }
    })
  }
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (isError) {
    return <Text>Error</Text>;
  }

  return (
    <View style={styles.container}>
      <Header />
      <View>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textInputContainer}
              placeholder="Escreva algo!"
              multiline
              onChangeText={onChange}
              value={value}
              onBlur={onBlur}
            />
          )}
          name="content"
        />
        {errors.content && <Text>Campo obrigatorio</Text>}
        <Button type="button1" onPress={() => {
          Keyboard.dismiss()
          handleSubmit()
        }}>
          <Text style={{ fontWeight: "bold", color: "white" }}>Postar</Text>
        </Button>
        <HorizontalLine />
        <SafeAreaView style={{ alignItems: "center", height: 310 }}>
          <FlatList
            data={reversedData}
            renderItem={({ item }) => {
              return <PostCard item={item} onPress={navigateToPostDetail} />;
            }}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            ListEmptyComponent={() => <Text>Nenhum post encontrado</Text>}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </SafeAreaView>
      </View>
    </View>
  );
}
