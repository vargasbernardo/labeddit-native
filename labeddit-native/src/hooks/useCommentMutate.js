import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../CONSTANTS/constants";

const postComment = async (data, id) => {
    console.log(id);
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    throw new Error("No token found");
  }
  const res = await axios.post(
    `${API_URL}/comments/${id}`,
    {
      content: data.content,
    },
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  return res;
};

export function useCommentMutate(id) {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: (data) => postComment(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
    },
  });
  return mutate;
}
