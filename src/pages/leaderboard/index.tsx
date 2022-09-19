import { useWallet } from "@solana/wallet-adapter-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { NextSeo } from "next-seo";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { AddCircleTwoTone } from "../../components/svgIcons";
import { MainPage } from "../../components/Widget";
import { LIVE_URL, POSITION_TABLE_DATA } from "../../config";
import { getRanks, setRegisterLeaderboard } from "../../solana/server";
import { useUserContext } from "../../context/UserProvider";
import { ClipLoader } from "react-spinners";
type TableData = {
  rate: string;
  rateFormat: string;
  userName: string;
  userAddress: string;
  points: string;
}[];
export default function DashboardPage() {
  const wallet = useWallet();
  const userData = useUserContext();
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const [topTab, setTopTab] = useState("soldier");
  const [subTab, setSubTab] = useState("2d");
  const [tableData, setTableData] = useState<TableData>();
  const [isStarted, setIsStarted] = useState(false);

  const getRankList = async () => {
    const data = await getRanks();
    console.log(data);
    if (data) {
      let list: any = [];
      for (let item of data) {
        list.push({
          rate: item.rate,
          rateFormat: item.rate,
          userName: item.name,
          userAddress: item.wallet,
          points: item.points,
        });
      }
      setTableData(list);
    }
  };

  const onRegister = async () => {
    if (!wallet.publicKey) return;
    try {
      setIsRegisterLoading(true);
      await setRegisterLeaderboard(
        userData.userName,
        wallet.publicKey.toBase58()
      );
      setIsRegisterLoading(false);
    } catch (error) {
      setIsRegisterLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getRankList();
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
                height: isStarted ? "calc(100% - 132px)" : "auto",
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
              {isStarted ? (
                <div className="leaderboard-timer">
                  <h2 className="leaderboard-title">
                    Leaderboard starts on the 12 March 2022
                    <br />
                    14:00 UCT
                  </h2>
                  <button className="btn-register" onClick={() => onRegister()}>
                    {isRegisterLoading ? (
                      <ClipLoader size={20} color="#fff" />
                    ) : (
                      <>Register</>
                    )}
                  </button>
                </div>
              ) : (
                <>
                  <p
                    className="dashboard-updated-time"
                    style={{ textAlign: "left" }}
                  >
                    {moment("2022-7-10").fromNow()}
                  </p>
                  <div className="dashboard-list-table scrollbar">
                    <div className="table-header" style={{ paddingBottom: 4 }}>
                      <div className="th"></div>
                      <div className="th">Playername</div>
                      <div className="th">Points</div>
                    </div>
                    <div className="tbody">
                      <div className="table-tbody">
                        {tableData &&
                          tableData.map((item: any, key: number) => (
                            <div
                              className={
                                item.userAddress ===
                                wallet.publicKey?.toBase58()
                                  ? "tr highlight"
                                  : "tr"
                              }
                              key={key}
                            >
                              <div className="td">{item.rateFormat}</div>
                              <div className="td">
                                {item.userAddress ===
                                wallet.publicKey?.toBase58()
                                  ? "You"
                                  : item.userName}
                              </div>
                              <div className="td">{item.points}</div>
                            </div>
                          ))}
                        {/* <div className="you-content">
                          <div className="tr highlight you">
                            <div className="td">{"18th"}</div>
                            <div className="td">{"You"}</div>
                            <div className="td">{848}</div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </>
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
