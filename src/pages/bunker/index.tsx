
import { NextSeo } from "next-seo";
import Header from "../../components/Header";
import { LIVE_URL } from "../../config";
import { MainPage } from "../../components/Widget";
import { AmmoDeplyIcon, RefreshIcon } from "../../components/svgIcons";
import { useState } from "react";
import moment from "moment";
import { AttributeType } from "../../contexts/types";

export default function BunkerPage() {
    const [depositAmount, setDepositAmount] = useState();
    const [withdrawAmount, setWithdrawAmount] = useState();
    const [inventoryTab, setInventoryTab] = useState("yourInventory");

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
            <Header back={{ title: "Bunker", backUrl: "/dashboard" }} />
            <MainPage>
                <div className="bunker">
                    <div className="left">
                        <div className="ammo-control">
                            <div className="content">
                                <div className="head">
                                    <div className="balance">
                                        <AmmoDeplyIcon />
                                        <h5>1,200 $AMMO</h5>
                                    </div>
                                    <div className="btn-icon">
                                        <RefreshIcon />
                                    </div>
                                </div>
                                <div className="input-group">
                                    <div className="input-form">
                                        <input
                                            className="input"
                                            value={depositAmount}
                                            placeholder="Amount"
                                        />
                                        <button className="btn">
                                            deposit
                                        </button>
                                    </div>
                                    <div className="input-form">
                                        <input
                                            className="input"
                                            value={withdrawAmount}
                                            placeholder="Amount"
                                        />
                                        <button className="btn">
                                            withdraw
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="transaction-history">
                            <p>Transaction History</p>
                            <div className="table">
                                <div className="thead">
                                    <div className="tr">
                                        <div className="td">Amount</div>
                                        <div className="td">Type</div>
                                        <div className="td">Label</div>
                                        <div className="td">Date</div>
                                    </div>
                                </div>
                                <div className="tbody">
                                    {[1, 2, 3, 4, 5].map((item, key) => (
                                        <div className="tr">
                                            <div className="td">51000</div>
                                            <div className="td">Purchase</div>
                                            <div className="td">Transaction</div>
                                            <div className="td">{moment().format("DD MMM YYYY")}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="inventory-box">
                            <p>Inventory</p>
                            <div className="dashboard-tabs">
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
                            </div>
                        </div>
                    </div>
                </div>
            </MainPage>
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