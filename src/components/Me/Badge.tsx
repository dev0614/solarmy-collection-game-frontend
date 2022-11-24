import { Skeleton } from "@mui/material";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { getBadgeInfo, getNftMetaData } from "../../solana/utils";
import { InfoTwoTone } from "../svgIcons";

export default function Badge(props: {
  topLoading: boolean;
  top2dNft: string;
  badgeNum: number;
  top3dNft: string;
  me?: boolean;
}) {
  const { topLoading, top2dNft, top3dNft } = props;
  const [loading, setLoading] = useState(false);
  const [top2dData, setTop2dData] = useState({
    image: "",
    nftMint: "",
  });
  const [top3dData, setTop3dData] = useState({
    image: "",
    nftMint: "",
  });
  const [badgeImage, setBadgeImage] = useState("");
  const [badgeNmae, setBadgeName] = useState("");

  const getDetail = async (mint: string, setData: Function) => {
    setLoading(true);
    if(mint) {
      const metadata = await getNftMetaData(new PublicKey(mint));
      const { image, name } = getBadgeInfo(props.badgeNum);
      if (image) setBadgeImage(image);
      if (name) setBadgeName(name);
      await fetch(metadata)
        .then((resp) => resp.json())
        .then((json) => {
          console.log(json);
          setData({
            image: json.image,
            nftMint: mint,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
    
    setLoading(false);
  };

  useEffect(() => {
    console.log(top3dNft);
    if (top2dNft !== "") getDetail(top2dNft, setTop2dData);
    if (top3dNft !== "") getDetail(top3dNft, setTop3dData);
    // eslint-disable-next-line
  }, [top2dNft, top3dNft]);

  return (
    <>
      <div className="badge-me" style={{ width: props.me ? 330 : "auto" }}>
        <div className="badge-header">
          <div className="badge-title">
            <p className="badge-text">{badgeNmae} Badge</p>
            <InfoTwoTone />
          </div>
          {badgeImage === "" ? (
            <Skeleton
              style={{
                width: props.me ? 306 : "100%",
                height: 306,
                borderRadius: "24px",
                background: "#413f3f6b",
              }}
              variant="rectangular"
            />
          ) : (
            <>
              {/* eslint-disable-next-line */}
              <img
                src={badgeImage}
                alt=""
                className="slider-img"
                style={{
                  width: props.me ? 306 : "100%",
                }}
              />
            </>
          )}
        </div>
        {topLoading ? (
          <>
            <Skeleton
              variant="rectangular"
              animation="wave"
              style={{
                width: "100%",
                height: 80,
                borderRadius: 100,
                marginTop: 12,
                background: "#413f3f6b",
              }}
            />
            <Skeleton
              variant="rectangular"
              animation="wave"
              style={{
                width: "100%",
                height: 80,
                borderRadius: 100,
                marginTop: 12,
                background: "#413f3f6b",
              }}
            />
          </>
        ) : (
          <div className="leaderboard-me">
            {top2dData.nftMint !== "" && (
              <div className="rank">
                <div className="rank-img">
                  {/* eslint-disable-next-line */}
                  <img src={top2dData.image} alt="" />
                </div>
                <div className="rank-text">Top 2D Soldier</div>
              </div>
            )}
            {top3dData.nftMint !== "" && (
              <div className="rank">
                <div className="rank-img">
                  {/* eslint-disable-next-line */}
                  <img src={top3dData.image} alt="" />
                </div>
                <div className="rank-text">Top 3D Soldier</div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
