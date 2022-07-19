import axios from "axios";
import { AMMO_TOKEN_DECIMAL, API_URL } from "../config";
import { UserTxType } from "./types";

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
            if (res.data !== -1)
                name = res.data
        })
        .catch((error) => {
            console.log(error)
            name = ""
        })
    return name
}

export const accessUserVault = async (
    txId: string,
) => {
    await axios.post(`${API_URL}accessUserVault`, {
        "txId": txId
    })
        .then((res) => {
            console.log(res)
        })
        .catch((error) => {
            console.log(error)
        })
}

export const getUserTransactions = async (
    wallet: string
) => {
    const data: UserTxType[] = [];

    await axios.post(`${API_URL}getUserTransaction`, {
        "wallet": wallet
    }
    )
        .then((res) => {
            for (let item of res.data) {
                data.push({
                    amount: parseFloat(item.amount) / AMMO_TOKEN_DECIMAL,
                    createdAt: new Date(item.created_at).getTime(),
                    label: item.label,
                    name: item.name,
                    wallet: item.wallet,
                    type: item.type
                })
            }
        })
        .catch((error) => {
            console.log(error);
        })
    data.sort((a: any, b: any) => b.createdAt - a.createdAt);
    return data;
}