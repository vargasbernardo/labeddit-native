import { Dimensions, Pressable, Text, View } from "react-native";
import { Foundation } from "@expo/vector-icons";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../CONSTANTS/constants";
import { useUserData } from "../hooks/useUserData";

const screenWidth = Dimensions.get("window").width - 50;

export default function CommentCard({ item, onPress }) {
  const [commentLikes, setCommentLikes] = useState(item.likes);
  const [commentDislikes, setCommentDislikes] = useState(item.dislikes);
  const { data, isLoading } = useUserData();
  const usersFilter = data?.filter((user) => user.id === item.creatorId);
  const likeComment = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        throw new Error("Unauthorized Access");
      }
      const res = await axios.put(
        `${API_URL}/comments/${item.id}/like`,
        { like: true },
        { headers: { Authorization: token } }
      );
      if (commentDislikes > 0)
        setCommentDislikes((prevDislikes) => prevDislikes - 1);
      setCommentLikes((prevLikes) => prevLikes + 1);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  const dislikeComment = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        throw new Error("Unauthorized Access");
      }
      const res = await axios.put(
        `${API_URL}/comments/${item.id}/like`,
        { like: false },
        { headers: { Authorization: token } }
      );
      setCommentDislikes((prevDislikes) => prevDislikes + 1);
      setCommentLikes((prevLikes) => (prevLikes > 0 ? prevLikes - 1 : 0));
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View
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
    >
      <Text style={{ color: "lightgray", fontSize: 10 }}>
        Enviado por: {isLoading ? "" : usersFilter[0].name}
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
            <Text>{commentLikes}</Text>
            <Foundation
              name="like"
              size={24}
              color="gray"
              onPress={likeComment}
            />
            <Foundation
              name="dislike"
              size={24}
              color="gray"
              onPress={dislikeComment}
            />
            <Text>{commentDislikes}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
