import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";


const fetchData = async () => {
    const token = await AsyncStorage.getItem('userToken')
    if(!token) {
        throw new Error('Unauthorized Access')
    }
  const res = await axios.get(
    "https://backend-labeddit-sfwt.onrender.com/posts",
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  return res?.data;
};

export function usePostData() {
  const query = useQuery({
    queryKey: ["posts"],
    queryFn: fetchData,
  });
  return query;
}

