import { useWallet } from "@solana/wallet-adapter-react";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getUserBadge,
  getUsername,
  getUserTransactions,
} from "../solana/server";
import { getAmmo } from "../solana/transaction_staking";
import { UserTxType } from "../solana/types";

type userContextType = {
  userName: string;
  balance: number;
  badge: number;
  userTxs: UserTxType[];
  getUserData: Function;
};

const userDefaultValues: userContextType = {
  userName: "Player",
  balance: 0,
  badge: 8,
  userTxs: [],
  getUserData: () => {},
};

const UserContext = createContext<userContextType>(userDefaultValues);

export function UserProvider(props: { children: ReactNode }) {
  const wallet = useWallet();

  const [userData, setUserData] = useState<userContextType>(userDefaultValues);
  const getUserData = async () => {
    if (wallet.publicKey === null) return;
    const name = await getUsername(wallet.publicKey.toBase58());
    const ammo = await getAmmo(wallet.publicKey);
    const txData = await getUserTransactions(wallet.publicKey?.toBase58());
    const badgeNum = await getUserBadge(wallet.publicKey.toBase58());
    setUserData({
      userName: name,
      balance: ammo,
      badge: badgeNum ? parseInt(badgeNum as string) : 8,
      userTxs: txData,
      getUserData: getUserData,
    });
  };

  useEffect(() => {
    getUserData();
    //   eslint-disable-next-line
  }, [wallet.connected, wallet.publicKey]);

  return (
    <UserContext.Provider value={userData}>
      {props.children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
