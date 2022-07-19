import axios from "axios";
import { API_URL } from "../config";

export const setUserName = async (
    wallet: string,
    username: string
) => {
    console.log(username, "username")
    await axios.post(`${API_URL}setUserName`, {
        "wallet": wallet,
        "name": username
    })
        .then((res) => {
            console.log(res)
        })
        .catch((error) => {
            console.log(error)
        })
    // return username
}

export const getUsername = async (
    wallet: string
) => {
    let name: string = "";
    await axios.post(`${API_URL}getUserName`, {
        "wallet": wallet,
    })
        .then((res) => {
            console.log(res)
            name = res.data?.name
        })
        .catch((error) => {
            console.log(error)
            name = ""
        })
    return name
}