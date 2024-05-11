import { Dimensions, Pressable, Text, View } from "react-native";
import { Foundation } from "@expo/vector-icons";
import { useLikeDislikePost } from "../hooks/useLikeDislikePost";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../CONSTANTS/constants";
import { useUserData } from "../hooks/useUserData";
import { useCommentData } from "../hooks/useCommentData";

const screenWidth = Dimensions.get("window").width - 50;

export default function PostCard({ item, onPress, disablePress }) {
  const [postLikes, setPostLikes] = useState(item.likes);
  const [postDislikes, setPostDislikes] = useState(item.dislikes)
  const [disabled, setDisabled] = useState(false);
  const {data: commentData, isLoading} = useCommentData()
  const commentsById = commentData?.filter((comment) => comment.postId === item.id)

  const likePost = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        throw new Error("Unauthorized Access");
      }
      const res = await axios.put(
        `${API_URL}/posts/${item.id}/like`,
        { like: true },
        { headers: { Authorization: token } }
      );
      if(postDislikes > 0) setPostDislikes((prevDislikes) => prevDislikes - 1)
      setPostLikes((prevLikes) => prevLikes + 1);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  const dislikePost = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        throw new Error("Unauthorized Access");
      }
      const res = await axios.put(
        `${API_URL}/posts/${item.id}/like`,
        { like: false },
        { headers: { Authorization: token } }
      );
      setPostDislikes((prevDislikes) => prevDislikes + 1)
      setPostLikes((prevLikes) => prevLikes > 0 ? prevLikes - 1 : 0);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable
      style={{
        borderWidth: 1,
        borderColor: "lightgray",
        height: 100,
        width: screenWidth,
        borderRadius: 10,
        justifyContent: "space-around",
        marginTop: 10,
        padding: 5,
      }}
      onPress={() => onPress(item.id)}
      disabled={disablePress}
    >
      <Text style={{ color: "lightgray", fontSize: 10 }}>
        Enviado por: {item?.creator?.name}
      </Text>
      <Text>{item?.content}</Text>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              borderWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              width: 100,
              justifyContent: "space-around",
              borderRadius: 15,
              borderColor: "lightgray",
            }}
          >
            <Text>{postLikes}</Text>
            <Foundation name="like" size={24} color="gray" onPress={likePost} />
            <Foundation
              name="dislike"
              size={24}
              color="gray"
              onPress={dislikePost}
            />
            <Text>{postDislikes}</Text>
          </View>
        </View>
        <View
          style={{
            borderWidth: 1,
            flexDirection: "row",
            borderColor: "lightgray",
            width: 50,
            alignItems: "center",
            justifyContent: "space-evenly",
            borderRadius: 15,
            marginLeft: 10,
          }}
        >
          <Foundation name="comment" size={24} color="gray" />
          <Text>{isLoading ? "" : commentsById.length}</Text>
        </View>
      </View>
    </Pressable>
  );
}
