import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { NextSeo } from "next-seo";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { AddCircleTwoTone } from "../../components/svgIcons";
import { MainPage } from "../../components/Widget";
import { LIVE_URL, POSITION_TABLE_DATA } from "../../config";
import {
  setRegisterLeaderboard,
  get2dCollectionRank,
  get2dTopRank,
  get3dCollectionRank,
  get3dTopRank,
} from "../../solana/server";
import { useUserContext } from "../../context/UserProvider";
import { ClipLoader } from "react-spinners";
import { successAlert } from "../../components/toastGroup";
import { Skeleton } from "@mui/material";

export type TableData = {
  rate: string;
  userName: string;
  userAddress: string;
  points: string;
  mint: string;
};

export type TableCollectionData = {
  id: string;
  name: string;
  count: number;
};

export default function DashboardPage() {
  const wallet = useWallet();
  const userData = useUserContext();
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const [topTab, setTopTab] = useState("soldier");
  const [subTab, setSubTab] = useState("2d");
  const [tableData, setTableData] = useState<TableData[]>();
  const [tableCollectionData, setTableCollectionData] =
    useState<TableCollectionData[]>();

  const getRankList = async (topTab: string, subTab: string) => {
    setTableLoading(true);
    let data: any[] = [];
    let dataCollection: any[] = [];
    if (topTab === "soldier" && subTab === "2d") {
      data = await get2dTopRank();
    } else if (topTab === "collection" && subTab === "2d") {
      dataCollection = await get2dCollectionRank();
    } else if (topTab === "soldier" && subTab === "3d") {
      data = await get3dTopRank();
    } else if (topTab === "collection" && subTab === "3d") {
      dataCollection = await get3dCollectionRank();
    }
    console.log(data, "==> daata");
    console.log(dataCollection, "==> dataCollection");
    if (data) {
      let list: any = [];
      for (let item of data) {
        list.push({
          rate: item.rate,
          userName: item.name,
          userAddress: item.wallet,
          mint: item.mint,
          points: item.points.toFixed(0),
        });
      }
      setTableData(list);
    }
    if (dataCollection) {
      let list: any = [];
      for (let item of dataCollection) {
        list.push({
          id: item._id,
          name:
            item.name.length > 30
              ? item.name.slice(0, 4) + ".." + item.name.slice(-4)
              : item.name,
          count: item.count.toFixed(0),
        });
      }
      setTableCollectionData(list);
    }
    setTableLoading(false);
  };

  const onRegister = async () => {
    if (!wallet.publicKey) return;
    try {
      setIsRegisterLoading(true);
      const res = await setRegisterLeaderboard(
        userData.userName !== ""
          ? userData.userName
          : wallet.publicKey.toBase58(),
        wallet.publicKey.toBase58()
      );
      if (res) {
        successAlert("Leaderboard registration successful!");
      }
      setIsRegisterLoading(false);
    } catch (error) {
      setIsRegisterLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getRankList(topTab, subTab);
  }, [topTab, subTab]);

  return (
    <>
      <NextSeo
        title="Leaderboard | 2D, 3D Soldier"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et massa massa. Ut mollis posuere risus, convallis laoreet felis pulvinar condimentum. Nam ac lectus ex."
        openGraph={{
          url: `${LIVE_URL}`,
          title: "Leaderboard | 2D Solarmy NFT Staking",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et massa massa. Ut mollis posuere risus, convallis laoreet felis pulvinar condimentum. Nam ac lectus ex.",
          images: [
            {
              url: `${LIVE_URL}og-cover.jpg`,
              width: 800,
              height: 500,
              alt: "Solarmy",
              type: "image/jpg",
            },
          ],
          site_name: "Solarmy",
        }}
      />
      <Header />
      <MainPage>
        <div className="leaderboard">
          <div className="left">
            <div
              className="dashboard-box"
              style={{
                boxShadow: "none",
              }}
            >
              <div className="dashboard-tabs">
                <button
                  className={
                    topTab === "soldier" ? "btn-tab active" : "btn-tab"
                  }
                  onClick={() => setTopTab("soldier")}
                >
                  top soldier
                </button>
                <button
                  className={
                    topTab === "collection" ? "btn-tab active" : "btn-tab"
                  }
                  onClick={() => setTopTab("collection")}
                >
                  top collection
                </button>
              </div>
              <div className="dashboard-tabs">
                <button
                  className={subTab === "2d" ? "btn-tab active" : "btn-tab"}
                  onClick={() => setSubTab("2d")}
                >
                  2d
                </button>
                <button
                  className={subTab === "3d" ? "btn-tab active" : "btn-tab"}
                  onClick={() => setSubTab("3d")}
                >
                  3d
                </button>
              </div>
              {topTab === "soldier" && (
                <div className="dashboard-list-table scrollbar">
                  <div className="table-header" style={{ paddingBottom: 4 }}>
                    <div className="th">Soldiername</div>
                    <div className="th">Username</div>
                    <div className="th">Points</div>
                  </div>
                  <div className="tbody">
                    {!tableLoading ? (
                      <div className="table-tbody">
                        {tableData &&
                          tableData.map((item: TableData, key: number) => (
                            <div
                              className={
                                item.userAddress ===
                                wallet.publicKey?.toBase58()
                                  ? "tr highlight"
                                  : "tr"
                              }
                              key={key}
                            >
                              <div className="td">{item.mint}</div>
                              <div className="td">
                                {item.userName.length > 20
                                  ? item.userName.slice(0, 5) +
                                    "..." +
                                    item.userName.slice(-5)
                                  : item.userName}
                              </div>
                              <div className="td">{item.points}</div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="table-tbody">
                        {[1, 2, 3, 4, 5, 6].map((item, key: number) => (
                          <div className="tr" key={key}>
                            <div className="td">
                              <Skeleton
                                variant="rectangular"
                                sx={{
                                  height: "23.7px",
                                  width: "70%",
                                  borderRadius: "6px",
                                }}
                              />
                            </div>
                            <div className="td">
                              <Skeleton
                                variant="rectangular"
                                sx={{
                                  height: "23.7px",
                                  width: "70%",
                                  marginRight: "auto",
                                  marginLeft: "auto",
                                  borderRadius: "6px",
                                }}
                              />
                            </div>
                            <div className="td">
                              <Skeleton
                                variant="rectangular"
                                sx={{
                                  height: "23.7px",
                                  marginLeft: "auto",
                                  width: "70%",
                                  borderRadius: "6px",
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {topTab === "collection" && (
                <div className="dashboard-list-table scrollbar">
                  <div className="table-header" style={{ paddingBottom: 4 }}>
                    <div className="th">Wallet</div>
                    <div className="th">Count</div>
                  </div>
                  <div className="tbody">
                    {!tableLoading ? (
                      <div className="table-tbody">
                        {tableCollectionData &&
                          tableCollectionData.map((item: any, key: number) => (
                            <div
                              className={
                                item.userAddress ===
                                wallet.publicKey?.toBase58()
                                  ? "tr highlight"
                                  : "tr"
                              }
                              key={key}
                            >
                              <div className="td">
                                {item.id === wallet.publicKey?.toBase58()
                                  ? "You"
                                  : item.name}
                              </div>
                              <div className="td">{item.count}</div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="table-tbody">
                        {[1, 2, 3, 4, 5, 6].map((item, key: number) => (
                          <div className="tr" key={key}>
                            <div className="td">
                              <Skeleton
                                variant="rectangular"
                                sx={{
                                  height: "23.7px",
                                  width: "70%",
                                  borderRadius: "6px",
                                }}
                              />
                            </div>
                            <div className="td">
                              <Skeleton
                                variant="rectangular"
                                sx={{
                                  height: "23.7px",
                                  marginLeft: "auto",
                                  width: "70%",
                                  borderRadius: "6px",
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="right">
            {/* Top Soldier 2D/3D Box */}
            <div className="top-soldier-box">
              <div className="title-header">
                <h2>
                  Top Soldier{" "}
                  <span>
                    <button className="btn-icon">
                      <AddCircleTwoTone />
                    </button>
                  </span>{" "}
                  {subTab === "2d" ? "2D" : "3D"}
                </h2>
              </div>
              <div className="banner">
                {/* eslint-disable-next-line */}
                <img
                  src={
                    subTab === "2d"
                      ? "/img/leaderboard-banner-2d.png"
                      : "/img/leaderboard-banner-3d.png"
                  }
                  alt=""
                />
              </div>
              <p className="banner-description">
                {subTab === "2d" && (
                  <>
                    By toggling between leaderboards, this widget will change to
                    show players the rules of the leaderboards, the reward list
                    and what they will earn for each sub category. Lastly when
                    the leaderboard ends.
                  </>
                )}
                {subTab === "3d" && (
                  <>
                    By toggling between leaderboards, this widget will change to
                    show players the rules of the leaderboards, the reward list
                    and what they will earn for each sub category. Lastly when
                    the leaderboard ends.
                  </>
                )}
              </p>
              <button className="btn-register" onClick={onRegister}>
                {isRegisterLoading ? (
                  <ClipLoader size={20} color="#fff" />
                ) : (
                  <>register for this season</>
                )}
              </button>

              <div className="position-table">
                <div className="tr">
                  <div className="td">Position</div>
                  <div className="td">Ammo + Rewards</div>
                </div>
                {POSITION_TABLE_DATA.map((item, key) => (
                  <div className="tr" key={key}>
                    <div className="td">{item.label}</div>
                    <div className="td">{item.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MainPage>
      <Menu />
    </>
  );
}
