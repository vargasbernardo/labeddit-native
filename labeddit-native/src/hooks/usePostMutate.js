import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const postData = async (data) => {
  const token = await AsyncStorage.getItem("userToken");
  if (!token) {
    throw new Error("Token not found in AsyncStorage");
  }
  const res = await axios.post(
    "https://backend-labeddit-sfwt.onrender.com/posts",
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

export function usePostMutate() {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: postData,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  return mutate;
}
