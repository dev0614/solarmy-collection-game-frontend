import { useWallet } from "@solana/wallet-adapter-react";
import moment from "moment";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { Badge, BattalionDashboardBox, LeaderboardState, MainPage, TopSolider } from "../../components/Widget";
import { LIVE_URL, TOPPLAYER2D, TOPPLAYER3D } from "../../config";

export default function DashboardPage() {
    const router = useRouter();
    const wallet = useWallet();

    const [topTab, setTopTab] = useState("soldier");
    const [subTab, setSubTab] = useState("2d");
    const [tableData, setTableData] = useState(TOPPLAYER2D);
    useEffect(() => {
        if (subTab === "2d") {
            setTableData(TOPPLAYER2D);
        } else {
            setTableData(TOPPLAYER3D);
        }
    }, [topTab, subTab])

    return (
        <>
            <NextSeo
                title="Solarmy | 2D, 3D Solider"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et massa massa. Ut mollis posuere risus, convallis laoreet felis pulvinar condimentum. Nam ac lectus ex."
                openGraph={{
                    url: `${LIVE_URL}`,
                    title: 'Deploy | 2D Solarmy NFT Staking',
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
            <Header />
            <MainPage>
                <div className="leaderboard">
                    <div className="col-full">
                        <div className="dashboard-box">
                            <div className="dashboard-tabs">
                                <button className={topTab === "soldier" ? "btn-tab active" : "btn-tab"} onClick={() => setTopTab("soldier")}>top solider</button>
                                <button className={topTab === "collection" ? "btn-tab active" : "btn-tab"} onClick={() => setTopTab("collection")}>top collection</button>
                            </div>
                            <div className="dashboard-tabs">
                                <button className={subTab === "2d" ? "btn-tab active" : "btn-tab"} onClick={() => setSubTab("2d")}>2d</button>
                                <button className={subTab === "3d" ? "btn-tab active" : "btn-tab"} onClick={() => setSubTab("3d")}>3d</button>
                            </div>
                            <p className="dashboard-updated-time" style={{ textAlign: "left" }}>{moment("2022-7-10").fromNow()}</p>
                            <div className="dashboard-list-table">
                                <div className="table-header">
                                    <div className="th"></div>
                                    <div className="th">Playername</div>
                                    <div className="th">Points</div>
                                </div>
                                <div className="table-tbody">
                                    {tableData.map((item, key) => (
                                        <div className={item.userAddress === wallet.publicKey?.toBase58() ? "tr highlight" : "tr"} key={key}>
                                            <div className="td">{item.rateFormat}</div>
                                            <div className="td">{item.userName}</div>
                                            <div className="td">{item.points}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </MainPage>
            <Menu />
        </>
    )
}