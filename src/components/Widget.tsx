import { ClickAwayListener } from "@mui/material";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { MAIN_2D_CEATOR, MAIN_3D_CEATOR } from "../config";
import { TableCollectionData, TableData } from "../pages/leaderboard";
import {
  get2dCollectionRank,
  get2dTopRank,
  get3dCollectionRank,
  get3dTopRank,
} from "../solana/server";

import { AttributeFilterTypes } from "../solana/types";
import { solConnection } from "../solana/utils";
import { ArrowRightTwoTone, InfoTwoTone, SettingIcon } from "./svgIcons";
import { ToggleSwitch } from "./WidgetJs";

export const MainPage = (props: { children: any }) => {
  return (
    <main className="main-page">
      {/* eslint-disable-next-line */}
      <img src="/img/main-bg.png" alt="" className="page-bg" />
      <div className="page-content">{props.children}</div>
    </main>
  );
};

export const Badge = (props: { title: string; image: string }) => {
  return (
    <div className="dashboard-box">
      <div className="dashboard-box-header">
        <p className="title">{props.title} Badge</p>
        <button className="btn-icon">
          <InfoTwoTone />
        </button>
      </div>
      <div className="badge-content">
        {/* eslint-disable-next-line */}
        <img src={props.image} alt="" />
      </div>
    </div>
  );
};

export const TopSoldier = (props: { title: string; image: string }) => {
  return (
    <div className="top-soldier">
      {/* eslint-disable-next-line */}
      <img src={props.image} />
      <span>{props.title}</span>
    </div>
  );
};

export const LeaderboardState = (props: {
  router: NextRouter;
  wallet: WalletContextState;
}) => {
  const [topTab, setTopTab] = useState("soldier");
  const [subTab, setSubTab] = useState("2d");
  const [tableData, setTableData] = useState<TableData[]>();
  const [tableCollectionData, setTableCollectionData] =
    useState<TableCollectionData[]>();

  const getRankList = async () => {
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
    if (data) {
      let list: any = [];
      for (let item of data) {
        list.push({
          rate: item.rate,
          rateFormat: item.rate,
          userName: item.name,
          userAddress: item.wallet,
          points: item.points.toFixed(0),
          mint: item.mint,
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
  };
  useEffect(() => {
    getRankList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topTab, subTab]);

  return (
    <div className="dashboard-box" style={{ boxShadow: "none" }}>
      <div
        className="dashboard-box-header"
        onClick={() => props.router.push("/leaderboard")}
      >
        <p className="title">Mission Leaderboards</p>
        <button className="btn-icon">
          <ArrowRightTwoTone />
        </button>
      </div>
      <div className="dashboard-tabs">
        <button
          className={topTab === "soldier" ? "btn-tab active" : "btn-tab"}
          onClick={() => setTopTab("soldier")}
        >
          top soldier
        </button>
        <button
          className={topTab === "collection" ? "btn-tab active" : "btn-tab"}
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
        <div className="dashboard-list-table">
          <div className="table-header">
            <div className="th" style={{ width: "40%" }}>
              Soldiername
            </div>
            <div className="th" style={{ width: "35%" }}>
              Username
            </div>
            <div className="th" style={{ width: "25%" }}>
              Points
            </div>
          </div>
          <div className="table-tbody">
            {tableData &&
              tableData.length !== 0 &&
              tableData.slice(0, 5).map((item, key) => (
                <div
                  className={
                    item.userAddress === props.wallet.publicKey?.toBase58()
                      ? "tr highlight"
                      : "tr"
                  }
                  key={key}
                >
                  <div className="td" style={{ fontSize: 12, width: "40%" }}>
                    {item.mint}
                  </div>
                  <div className="td" style={{ fontSize: 12, width: "35%" }}>
                    {item.userName.length > 20
                      ? item.userName.slice(0, 4) +
                        "..." +
                        item.userName.slice(-4)
                      : item.userName}
                  </div>
                  <div className="td" style={{ fontSize: 12, width: "25%" }}>
                    {item.points}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      {topTab === "collection" && (
        <div className="dashboard-list-table mini">
          <div className="table-header">
            <div className="th">Wallet</div>
            <div className="th">Count</div>
          </div>
          <div className="table-tbody">
            {tableCollectionData &&
              tableCollectionData.length !== 0 &&
              tableCollectionData.slice(0, 5).map((item, key) => (
                <div
                  className={
                    item.id === props.wallet.publicKey?.toBase58()
                      ? "tr highlight"
                      : "tr"
                  }
                  key={key}
                >
                  <div className="td" style={{ fontSize: 12 }}>
                    {item.name}
                  </div>
                  <div className="td" style={{ fontSize: 12 }}>
                    {item.count.toFixed(1)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const BattalionDashboardBox = (props: {
  router: NextRouter;
  wallet: string;
}) => {
  const [topTab, setTopTab] = useState("all");
  const [nfts, setNfts] = useState<
    {
      image: string;
      collection: string;
    }[]
  >();
  const [selectedCollection, setSelectedCollection] = useState("2d");

  const getWalletNfts = async () => {
    let nfts: {
      image: string;
      collection: string;
    }[] = [];
    const nftList = await getParsedNftAccountsByOwner({
      publicAddress: props.wallet,
      connection: solConnection,
    });

    if (nftList.length !== 0) {
      for (let item of nftList) {
        if (
          item.data?.creators &&
          (item.data?.creators[0]?.address === MAIN_2D_CEATOR ||
            item.data?.creators[0]?.address === MAIN_3D_CEATOR)
        ) {
          const image = await fetch(item.data.uri)
            .then((resp) => resp.json())
            .then((json) => {
              return json.image;
            })
            .catch((error) => {
              console.log(error);
              return "";
            });
          console.log(item.data.name.slice(0, 2));
          nfts.push({
            collection: item.data.name.slice(0, 2),
            image: image,
          });
        }
      }
      if (nfts.length !== 0) {
        setNfts(nfts);
        setSelectedCollection(nfts[0].collection);
      }
    }
  };
  useEffect(() => {
    getWalletNfts();
    //   eslint-disable-next-line
  }, []);
  return (
    <div className="dashboard-box">
      <div
        className="dashboard-box-header"
        onClick={() => props.router.push("/battalion")}
      >
        <p className="title">Battalion</p>
        <button className="btn-icon">
          <ArrowRightTwoTone />
        </button>
      </div>
      <div className="dashboard-tabs">
        <button
          className={topTab === "all" ? "btn-tab active" : "btn-tab"}
          onClick={() => setTopTab("all")}
        >
          all
        </button>
        <button
          className={topTab === "2d" ? "btn-tab active" : "btn-tab"}
          onClick={() => setTopTab("2d")}
        >
          2d
        </button>
        <button
          className={topTab === "3d" ? "btn-tab active" : "btn-tab"}
          onClick={() => setTopTab("3d")}
        >
          3d
        </button>
      </div>
      <div className="battalion-box">
        <div className="battalion-content">
          {nfts &&
            nfts.length !== 0 &&
            nfts.map(
              (item, key) =>
                (topTab === "all" ||
                  topTab === item.collection.toLowerCase()) && (
                  <div className="nft-media" key={key}>
                    {/* eslint-disable-next-line */}
                    <img src={item.image} style={{ width: "100%" }} alt="" />
                  </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export const AttributeSetting = (props: {
  attributeFilter: AttributeFilterTypes | undefined;
  setAttributeFilter: Function;
}) => {
  const [show, setShow] = useState(false);
  const [forceRender, setForseRender] = useState(false);

  const handleChange = (checked: boolean, id: string) => {
    let filtered: any = props.attributeFilter;

    filtered[`${id}`] = checked;
    props.setAttributeFilter(filtered);
    console.log(filtered);
    setForseRender(!forceRender);
  };
  return (
    <ClickAwayListener onClickAway={() => setShow(false)}>
      <div className="attribute-setting">
        <button
          className="btn-icon btn-transparent"
          onClick={() => setShow(!show)}
        >
          <SettingIcon />
        </button>
        {show && (
          <div className="setting-content">
            <ToggleSwitch
              id="common"
              label="Common"
              checked={props.attributeFilter?.common}
              handleChange={(checked: boolean) =>
                handleChange(checked, "common")
              }
            />
            <ToggleSwitch
              id="universal"
              label="Universal"
              checked={props.attributeFilter?.universal}
              handleChange={(checked: boolean) =>
                handleChange(checked, "universal")
              }
            />
            <ToggleSwitch
              id="rare"
              label="Rare"
              checked={props.attributeFilter?.rare}
              handleChange={(checked: boolean) => handleChange(checked, "rare")}
            />
            <ToggleSwitch
              id="first_class"
              label="First Class"
              checked={props.attributeFilter?.first_class}
              handleChange={(checked: boolean) =>
                handleChange(checked, "first_class")
              }
            />
            <ToggleSwitch
              id="transendental"
              label="Transendental"
              checked={props.attributeFilter?.transendental}
              handleChange={(checked: boolean) =>
                handleChange(checked, "transendental")
              }
            />
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};
