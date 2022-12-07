import axios from "axios";
import { AMMO_TOKEN_DECIMAL, API_URL } from "../config";
import { AbleFetchedItem, AttributeFetched, UserTxType } from "./types";

export const setUserName = async (wallet: string, username: string) => {
  await axios
    .post(`${API_URL}setUserName`, {
      wallet: wallet,
      name: username,
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getUsername = async (wallet: string) => {
  let name: string = "";
  await axios
    .post(`${API_URL}getUserName`, {
      wallet: wallet,
    })
    .then((res) => {
      if (res.data !== -1) name = res.data;
    })
    .catch((error) => {
      console.log(error);
      name = "";
    });
  return name;
};

export const accessUserVault = async (txId: string) => {
  await axios
    .post(`${API_URL}accessUserVault`, {
      txId: txId,
    })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getUserTransactions = async (wallet: string) => {
  const data: UserTxType[] = [];

  await axios
    .post(`${API_URL}getUserTransaction`, {
      wallet: wallet,
    })
    .then((res) => {
      for (let item of res.data) {
        data.push({
          amount: parseFloat(item.amount) / AMMO_TOKEN_DECIMAL,
          createdAt: new Date(item.created_at).getTime(),
          label: item.label,
          name: item.name,
          wallet: item.wallet,
          type: item.type,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  data.sort((a: any, b: any) => b.createdAt - a.createdAt);
  return data;
};

export const getPlanBuyResult = async (txId: string, type: string) => {
  let data: any = [];

  await axios
    .post(`${API_URL}buyLootBox`, {
      txId: txId,
      type: type,
    })
    .then((res) => {
      console.log(res);
      data = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return data;
};

export const getAttributeItemData = async (attType: string, attr: string) => {
  let data = {
    attribute: "",
    attribute_type: "",
    points: "0",
    rarity: "",
    url: "",
    _id: "",
  };
  await axios
    .post(`${API_URL}getItemInfo`, {
      attType: attType,
      attr: attr.replaceAll("_", " "),
    })
    .then((res) => {
      if (res.data?.length !== 0) {
        data = res.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return data;
};

export const getAvailableInventory = async (wallet: string) => {
  let data: AbleFetchedItem[] = [];
  await axios
    .post(`${API_URL}getInventoryInfo`, {
      wallet: wallet,
    })
    .then((res) => {
      if (res.data?.length !== 0) {
        data = res.data;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return data;
};

export const modifyInventory = async (
  wallet: string,
  txId: string,
  post: string,
  newAttr: string
) => {
  let result = null;
  await axios
    .post(`${API_URL}modifyInventory`, {
      wallet: wallet,
      txId: txId,
      post: post,
      new: newAttr,
    })
    .then((res) => {
      console.log(res);
      return true;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
};

export const makeNft = async (
  wallet: string,
  id: string,
  head: string,
  head_accessories: string,
  l_arm: string,
  r_arm: string,
  torso: string,
  legs: string,
  backgroundImage: string
) => {
  let result = null;
  await axios
    .post(`${API_URL}makeNft`, {
      wallet: wallet,
      id: id,
      head: head.replace(" ", "_"),
      head_accessories: head_accessories.replace(" ", "_"),
      l_arm: l_arm.replace(" ", "_"),
      r_arm: r_arm.replace(" ", "_"),
      torso: torso.replace(" ", "_"),
      legs: legs.replace(" ", "_"),
      background_image: backgroundImage.replace(" ", "_"),
    })
    .then((res) => {
      result = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
};

export const getTopSoldiers = async (wallet: string) => {
  let top2D = "";
  let top3D = "";
  await axios
    .post(`${API_URL}getTopPlayers`, {
      wallet: wallet,
    })
    .then((res) => {
      top3D = res.data?.top_3d;
      top2D = res.data?.top_2d;
    })
    .catch((error) => {
      console.log(error);
    });
  return { top2D, top3D };
};

export const getBadge = async (wallet: string) => {
  let badgeNum = 0;
  await axios
    .post(`${API_URL}getBadge`, {
      wallet: wallet,
    })
    .then((res) => {
      res.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return badgeNum;
};

export const get2dCollectionRank = async () => {
  let rankList: any = [];
  await axios
    .post(`${API_URL}get2dCollectionRank`)
    .then((res) => {
      rankList = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return rankList;
};

export const get2dTopRank = async () => {
  let rankList: any = [];
  await axios
    .post(`${API_URL}get2dTopRank`)
    .then((res) => {
      rankList = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return rankList;
};

export const get3dCollectionRank = async () => {
  let rankList: any = [];
  await axios
    .post(`${API_URL}get3dCollectionRank`)
    .then((res) => {
      rankList = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return rankList;
};

export const get3dTopRank = async () => {
  let rankList: any = [];
  await axios
    .post(`${API_URL}get3dTopRank`)
    .then((res) => {
      rankList = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return rankList;
};

export const setRegisterLeaderboard = async (
  username: string,
  wallet: string
) => {
  let result = undefined;
  await axios
    .post(`${API_URL}register`, {
      wallet: wallet,
      name: username,
    })
    .then((res) => {
      result = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
};

export const getUserBadge = async (wallet: string) => {
  let result = undefined;
  await axios
    .post(`${API_URL}getBadge`, {
      wallet: wallet,
    })
    .then((res) => {
      result = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return result;
};
