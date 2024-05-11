import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  FlatList,
  TextInput,
  Keyboard,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import LoadingScreen from "../../components/loadingScreen";
import PostCard from "../../components/postCard";
import Header from "../../components/header";
import HorizontalLine from "../../components/horizontalLine";
import Button from "../../components/button";
import { useCommentData } from "../../hooks/useCommentData";
import { useForm, Controller } from "react-hook-form";
import { usePostDetailData } from "../../hooks/usePostDetailData";
import { useCommentMutate } from "../../hooks/useCommentMutate";
import CommentCard from "../../components/commentCard";
import { useState } from "react";

const screenWidth = Dimensions.get("window").width - 50;
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    marginTop: 20,
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
    padding: 5,
  },
});

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams();
  const { data: commentData, isLoading, isError, refetch } = useCommentData();
  const [refreshing, setRefreshing] = useState(false);
  const commentById = commentData?.filter((comment) => comment.postId === id);
  const reversedCommentData = commentById ? [...commentById].reverse() : [];
  const { mutate } = useCommentMutate(id);
  const {
    control,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { content: "" } });

  const {
    data: postDetailData,
    isLoading: isLoadingPostDetail,
    isError: isErrorPostDetail,
  } = usePostDetailData(id);

  const handleSubmit = () => {
    const postData = {
      content: control._formValues.content,
    };
    mutate(postData, {
      onSuccess: () => {
        reset();
      },
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  if (isLoading || isLoadingPostDetail) {
    return <LoadingScreen />;
  }
  return (
    <View style={styles.container}>
      <Header id={id} />
      <PostCard item={postDetailData} disablePress={true} />
      <View>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              style={styles.textInputContainer}
              onBlur={onBlur}
              placeholder="Escreva algo!"
              onChangeText={onChange}
              multiline
            />
          )}
          name="content"
        />
        <Button
          type="button1"
          onPress={() => {
            Keyboard.dismiss();
            handleSubmit();
          }}
        >
          <Text style={{ color: "#ffffff", fontWeight: "bold" }}>Postar</Text>
        </Button>
        <HorizontalLine />
      </View>
      <SafeAreaView style={{ alignItems: "center", height: 310 }}>
        <FlatList
          data={reversedCommentData}
          renderItem={(item) => {
            return <CommentCard item={item?.item} />;
          }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </SafeAreaView>
    </View>
  );
}
