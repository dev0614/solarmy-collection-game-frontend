import axios from "axios";
import { AMMO_TOKEN_DECIMAL, API_URL } from "../config";
import { AbleFetchedItem, AttributeFetched, UserTxType } from "./types";

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


export const getPlanBuyResult = async (
    txId: string,
    type: string
) => {
    let data: any = [];

    await axios.post(`${API_URL}buyLootBox`, {
        "txId": txId,
        "type": type
    }
    )
        .then((res) => {
            console.log(res);
            data = res.data;
        })
        .catch((error) => {
            console.log(error);
        })
    return data;
}

export const getAttributeItemData = async (attType: string, attr: string) => {
    let data: AttributeFetched | undefined = undefined;
    await axios.post(`${API_URL}getItemInfo`, {
        "attType": attType,
        "attr": attr
    }
    )
        .then((res) => {
            if (res.data?.length !== 0) {
                data = res.data
            }
        })
        .catch((error) => {
            console.log(error);
        })
    return data;
}

export const getAvailableInventory = async (wallet: string) => {
    let data: AbleFetchedItem[] = [];
    console.log(wallet)
    await axios.post(`${API_URL}getInventoryInfo`, {
        "wallet": wallet,
    }
    )
        .then((res) => {
            if (res.data?.length !== 0) {
                data = res.data
            }
        })
        .catch((error) => {
            console.log(error);
        })
    return data;
}