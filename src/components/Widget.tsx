import { ClickAwayListener } from "@mui/material";
import { WalletContextState } from "@solana/wallet-adapter-react";
import moment from "moment";
import { NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { TOPPLAYER2D, TOPPLAYER3D, WALLET_NFTS } from "../config";
import { AttributeFilterTypes } from "../solana/types";
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
  const [tableData, setTableData] = useState(TOPPLAYER2D);
  useEffect(() => {
    if (subTab === "2d") {
      setTableData(TOPPLAYER2D);
    } else {
      setTableData(TOPPLAYER3D);
    }
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
      <div className="dashboard-list-table">
        <div className="table-header">
          <div className="th"></div>
          <div className="th">Playername</div>
          <div className="th">Points</div>
        </div>
        <div className="table-tbody">
          {tableData.slice(0, 5).map((item, key) => (
            <div
              className={
                item.userAddress === props.wallet.publicKey?.toBase58()
                  ? "tr highlight"
                  : "tr"
              }
              key={key}
            >
              <div className="td">{item.rateFormat}</div>
              <div className="td">{item.userName}</div>
              <div className="td">{item.points}</div>
            </div>
          ))}
        </div>
      </div>
      <p className="dashboard-updated-time">{moment("2022-7-10").fromNow()}</p>
    </div>
  );
};

export const BattalionDashboardBox = (props: { router: NextRouter }) => {
  const [topTab, setTopTab] = useState("all");
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
          {WALLET_NFTS.map(
            (item, key) =>
              (topTab === "all" || topTab === item.collection) && (
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
