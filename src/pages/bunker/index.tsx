import { NextSeo } from "next-seo";
import Header from "../../components/Header";
import { AMMO_TOKEN_MINT, API_URL, LIVE_URL } from "../../config";
import { MainPage } from "../../components/Widget";
import { AmmoDeplyIcon, RefreshIcon } from "../../components/svgIcons";
import { useEffect, useState } from "react";
import moment from "moment";
import { AttributeType } from "../../solana/types";
import { depositToAccount, withdrawFromAccount } from "../../solana/transaction_staking";
import { useWallet } from "@solana/wallet-adapter-react";
import { ClipLoader } from "react-spinners";
import socketIOClient from "socket.io-client";
import { useUserContext } from "../../context/UserProvider";
import { useRouter } from "next/router";
import Menu from "../../components/Menu";

const socket = socketIOClient(API_URL);

export default function BunkerPage() {
    const [depositAmount, setDepositAmount] = useState<any>();
    const [withdrawAmount, setWithdrawAmount] = useState<any>();
    const [inventoryTab, setInventoryTab] = useState("yourInventory");
    const [depositLoading, setDepositLoading] = useState(false);
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [lastPage, setLastPage] = useState<string | null>("/dashboard");

    const wallet = useWallet();
    const router = useRouter();
    const userData = useUserContext();
    const { getUserData } = useUserContext();

    const onTokenDeposit = async () => {
        if (wallet.publicKey && depositAmount) {
            try {
                await depositToAccount(wallet, parseFloat(depositAmount), () => setDepositLoading(true), () => setDepositLoading(false), () => getUserData());
            } catch (error) {
                console.log(error)
            }
        }
    }

    const onTokenWithdraw = async () => {
        if (wallet.publicKey && withdrawAmount) {
            try {
                await withdrawFromAccount(wallet, parseFloat(withdrawAmount), () => setWithdrawLoading(true), () => setWithdrawLoading(false), () => getUserData());
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            setLastPage(localStorage.getItem("last-page"))
        }
    }, [router])

    return (
        <>
            <NextSeo
                title="Bunker | Deposit and Withdraw $AMMO"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et massa massa. Ut mollis posuere risus, convallis laoreet felis pulvinar condimentum. Nam ac lectus ex."
                openGraph={{
                    url: `${LIVE_URL}`,
                    title: 'Bunker | Deposit and Withdraw $AMMO',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et massa massa. Ut mollis posuere risus, convallis laoreet felis pulvinar condimentum. Nam ac lectus ex.',
                    images: [
                        {
                            url: `${LIVE_URL}og-cover.jpg`,
                            width: 800,
                            height: 500,
                            alt: 'Solarmy',
                            type: 'image/jpg',
                        }
                    ],
                    site_name: 'Solarmy',
                }}
            />
            <Header back={{ title: "Bunker", backUrl: lastPage }} />
            <MainPage>
                <div className="bunker">
                    <div className="left">
                        <div className="ammo-control">
                            <div className="content">
                                <div className="head">
                                    <div className="balance">
                                        <AmmoDeplyIcon />
                                        <h5>{userData.balance?.toLocaleString()} $AMMO</h5>
                                    </div>
                                    <div className="btn-icon">
                                        {/* <div className="btn-icon" onClick={() => getAllTx()}> */}
                                        <RefreshIcon />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <div className="input-form">
                                        <input
                                            className="input"
                                            value={depositAmount}
                                            onChange={(e: any) => setDepositAmount(e.target.value)}
                                            placeholder="Amount"
                                        />
                                        <button
                                            className="btn"
                                            disabled={depositLoading}
                                            onClick={onTokenDeposit}
                                        >
                                            {depositLoading ?
                                                <ClipLoader size={15} color="#fff" />
                                                :
                                                <>deposit</>
                                            }
                                        </button>
                                    </div>
                                    <div className="input-form">
                                        <input
                                            className="input"
                                            value={withdrawAmount}
                                            onChange={(e: any) => setWithdrawAmount(e.target.value)}
                                            placeholder="Amount"
                                        />
                                        <button
                                            className="btn"
                                            disabled={withdrawLoading}
                                            onClick={onTokenWithdraw}
                                        >
                                            {withdrawLoading ?
                                                <ClipLoader size={15} color="#fff" />
                                                :
                                                <>withdraw</>
                                            }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="transaction-history">
                            <p>Transaction History</p>
                            <div className="table scrollbar" style={{ paddingRight: userData?.userTxs.length > 8 ? 10 : 0 }}>
                                <div className="thead">
                                    <div className="tr">
                                        <div className="td">Amount</div>
                                        <div className="td">Type</div>
                                        <div className="td">Label</div>
                                        <div className="td">Date</div>
                                    </div>
                                </div>
                                <div className="tbody">
                                    {userData.userTxs && userData.userTxs.length !== 0 && userData.userTxs.map((item, key) => (
                                        <div className="tr" key={key}>
                                            <div className="td">{item.amount}</div>
                                            <div className="td">{item.type}</div>
                                            <div className="td">{item.label}</div>
                                            <div className="td">{moment(item.createdAt).format("DD MMM YYYY")}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="inventory-box">
                            <p>Inventory</p>
                            <>
                                {/* <div className="dashboard-tabs">
                                    <button className={inventoryTab === "yourInventory" ? "btn-tab active" : "btn-tab"} onClick={() => setInventoryTab("yourInventory")}>your inventory</button>
                                    <button className={inventoryTab === "fusedParts" ? "btn-tab active" : "btn-tab"} onClick={() => setInventoryTab("fusedParts")}>fused parts</button>
                                </div>
                                <div className="inventory-table">
                                    <div className="table">
                                        <div className="thead">
                                            <div className="tr">
                                                <div className="th">Attribute</div>
                                                <div className="th">Name</div>
                                                <div className="th">Rarity &#38; Points</div>
                                            </div>
                                        </div>
                                        <div className="tbody">
                                            {inventoryData.map((item: AttributeType, key: number) => (
                                                <div className="tr" key={key}>
                                                    <div className="td">{item.attribute}</div>
                                                    <div className="td">{item.name}</div>
                                                    <div className="td">{item.rarityPoints}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div> */}
                            </>
                            <div className="coming-soon-sm">
                                <p>Coming soon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </MainPage>
            <Menu />
        </>
    )
}

let inventoryData: AttributeType[] = [
    {
        attribute: "Head",
        name: "alien jason mask",
        rarityPoints: "Rare 300"
    },
    {
        attribute: "Head Accessories",
        name: "None",
        rarityPoints: "-"
    },
    {
        attribute: "L Arm",
        name: "Squid Game Tat",
        rarityPoints: "Rate 300"
    },
    {
        attribute: "R Arm",
        name: "Robot Bat",
        rarityPoints: "Rare 300"
    },
    {
        attribute: "Torso",
        name: "Mantis",
        rarityPoints: "Common 50"
    },
    {
        attribute: "Legs",
        name: "Alien",
        rarityPoints: "Common 50"
    },
    {
        attribute: "Background",
        name: "Elite Camo",
        rarityPoints: ""
    },
    {
        attribute: "Background",
        name: "Coral",
        rarityPoints: "Common 50"
    }
]