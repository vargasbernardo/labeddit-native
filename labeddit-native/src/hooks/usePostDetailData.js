import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import axios from 'axios'
import { API_URL } from "../CONSTANTS/constants";


const fetchDetailedPost = async (id) => {
    const token = await AsyncStorage.getItem("userToken")
    if(!token) {
        throw new Error("No token found")
    }
    const res = await axios.get(`${API_URL}/posts/${id}`, {
        headers: {
            Authorization: `${token}`,
        },
    })
    return res?.data
}

export function usePostDetailData(id) {
    const query = useQuery({
        queryKey: ["postDetail", id],
        queryFn: () => fetchDetailedPost(id),
    });
    return query
}