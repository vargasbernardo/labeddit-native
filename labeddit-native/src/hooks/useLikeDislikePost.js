import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../CONSTANTS/constants";

const likeDislikePost = async (id, like) => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    throw new Error("User is not logged in");
  }
  const res = await axios.put(
    `${API_URL}/comments/${id}/like`,
    {
      like,
    },
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  return res.data
};

export function useLikeDislikePost() {
    const likeDislikeQuery = useQuery("likeDislikePost", likeDislikePost)
    return likeDislikeQuery
}
