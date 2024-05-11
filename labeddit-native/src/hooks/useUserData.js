import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import axios from 'axios'
import { API_URL } from "../CONSTANTS/constants";

const fetchUsers = async () => {
    const token = await AsyncStorage.getItem("userToken")
    if(!token) {
        throw new Error("token not found")
    }
    const res = await axios.get(`${API_URL}/users`, {
        headers: {
            Authorization: token
        }
    })

    return res?.data
}

export function useUserData() {
    const query = useQuery({
        queryKey: ["users"],
        queryFn: fetchUsers,

    })
    return query
}