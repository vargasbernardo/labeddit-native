import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchComments = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if(!token){
        throw new Error("Token not found");
    }
    const res = await axios.get("https://backend-labeddit-sfwt.onrender.com/comments", {
        headers: {
            Authorization: `${token}`,
        }
    })
    return res?.data
}

export function useCommentData() {
    const query = useQuery({
        queryKey: ["comments"],
        queryFn: fetchComments,
    })
    return query
}