import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { useWallet } from "@solana/wallet-adapter-react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BattlaionFilter } from "../../components/Battalion/BattalionFilter";
import CopyAddress from "../../components/Battalion/CopyAddress";
import Soldier2DAttributeTable from "../../components/Battalion/Soldier2DAttributeTable";
import Soldier3DAttributeTable from "../../components/Battalion/Soldier3DAttributeTable";
import BattalionDetailLoading from "../../components/BattalionDetailLoading";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import {
  CommonIcon,
  FirstClassIcon,
  RareIcon,
  TranscendentalIcon,
  UniversalIcon,
} from "../../components/svgIcons";
import { MainPage } from "../../components/Widget";
import { LIVE_URL, MAIN_2D_CEATOR, MAIN_3D_CEATOR } from "../../config";
import { getAttributeItemData } from "../../solana/server";
import {
  AttributeFilterTypes,
  Default3dData,
  SoldierItem,
  TableFirstData2D,
} from "../../solana/types";
import { getSum, solConnection } from "../../solana/utils";
import { Soldier2DRarity } from "../../soldier2d_rarity";

export default function BattalionPage() {
  const [filterAttr, setFilterAttr] = useState<AttributeFilterTypes>({
    common: false,
    universal: false,
    rare: false,
    first_class: false,
    transendental: false,
  });
  const wallet = useWallet();
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedId, setSelectedId] = useState("1");
  const [collection, setCollection] = useState("2d");
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [rank, setRank] = useState(99999);
  const [filterTab, setFilterTab] = useState("all");
  const [tableData2D, setTableData2D] = useState(TableFirstData2D);
  const [tableData3D, setTableData3D] = useState(Default3dData);
  const [soldiers, setSoldiers] = useState<SoldierItem[]>();
  const [selectedCollection, setSelectedCollection] = useState("2d");
  const [detailLoading, setDetailLoading] = useState(false);
  const [rarity3d, setRarity3d] = useState<any>();

  const handleAttr = (
    mint: string,
    id: string,
    collection: string,
    image: string,
    uri: string
  ) => {
    setCollection(collection);
    setSelectedId(id);
    setSelectedImage(image);
    setSelectedCollection(collection);
    // get nft fill data
    getNftDetail(collection, id, mint, uri);
  };

  const getNftDetail = async (
    collection: string,
    id: string,
    mint: string,
    uri: string
  ) => {
    setDetailLoading(true);
    // For 2D Collection
    if (collection.toLowerCase() === "2d") {
      const alldata = Soldier2DRarity.result.data.items;
      const data: any = alldata.find((item) => item.id === parseInt(id));
      if (data) {
        const sum = getSum(data?.attributes, "rarity");
        console.log(sum);
        setRank(data.rank);

        let table2d = {
          hat: {
            name: data.attributes?.find((item: any) => item.name === "Head")
              .value,
            rarity: data.attributes?.find((item: any) => item.name === "Head")
              .rarity,
          },
          head: {
            name: data.attributes?.find((item: any) => item.name === "Hat")
              .value,
            rarity: data.attributes?.find((item: any) => item.name === "Hat")
              .rarity,
          },
          torso_accessories: {
            name: data.attributes?.find(
              (item: any) => item.name === "Torso Accessories"
            ).value,
            rarity: data.attributes?.find(
              (item: any) => item.name === "Torso Accessories"
            ).rarity,
          },
          l_arm: {
            name: data.attributes?.find((item: any) => item.name === "Left Arm")
              .value,
            rarity: data.attributes?.find(
              (item: any) => item.name === "Left Arm"
            ).rarity,
          },
          r_arm: {
            name: data.attributes?.find(
              (item: any) => item.name === "Right Arm"
            ).value,
            rarity: data.attributes?.find(
              (item: any) => item.name === "Right Arm"
            ).rarity,
          },
          legs: {
            name: data.attributes?.find((item: any) => item.name === "Legs")
              .value,
            rarity: data.attributes?.find((item: any) => item.name === "Legs")
              .rarity,
          },
          torso: {
            name: data.attributes?.find((item: any) => item.name === "Torso")
              .value,
            rarity: data.attributes?.find((item: any) => item.name === "Torso")
              .rarity,
          },
          background: {
            name: data.attributes?.find(
              (item: any) => item.name === "Background"
            ).value,
            rarity: data.attributes?.find(
              (item: any) => item.name === "Background"
            ).rarity,
          },
          companion: {
            name: data.attributes?.find(
              (item: any) => item.name === "Companion"
            ).value,
            rarity: data.attributes?.find(
              (item: any) => item.name === "Companion"
            ).rarity,
          },
          shoes: {
            name: data.attributes?.find((item: any) => item.name === "Shoes")
              .value,
            rarity: data.attributes?.find((item: any) => item.name === "Shoes")
              .rarity,
          },
        };
        setTableData2D(table2d);
      }
    }
    // For 3D Collection
    if (collection.toLowerCase() === "3d") {
      const data = await fetch(uri)
        .then((resp) => resp.json())
        .then((json) => {
          return json;
        })
        .catch((error) => {
          console.log(error);
          return "";
        });
      let table3d = Default3dData;
      let totalPointsValue = 0;
      for (let item of data?.attributes) {
        let data;
        switch (item.trait_type) {
          case "Right Arm":
            data = await getAttributeItemData("right arm", item.value);
            table3d.r_arm.value = item.value;
            table3d.r_arm.rarity = data.rarity;
            table3d.r_arm.points = data.points;
            totalPointsValue = +parseFloat(data.points);
            break;
          case "Head":
            data = await getAttributeItemData("head", item.value);
            table3d.head.value = item.value;
            table3d.head.rarity = data.rarity;
            table3d.head.points = data.points;
            totalPointsValue = +parseFloat(data.points);
            break;
          case "Head Accessories":
            data = await getAttributeItemData("head accessories", item.value);
            table3d.head_accessories.value = item.value;
            table3d.head_accessories.rarity = data.rarity;
            table3d.head_accessories.points = data.points;
            totalPointsValue = +parseFloat(data.points);
            break;
          case "Torso":
            data = await getAttributeItemData("torso", item.value);
            table3d.torso.value = item.value;
            table3d.torso.rarity = data.rarity;
            table3d.torso.points = data.points;
            totalPointsValue = +parseFloat(data.points);
            break;
          case "Left Arm":
            data = await getAttributeItemData("left arm", item.value);
            table3d.l_arm.value = item.value;
            table3d.l_arm.rarity = data.rarity;
            table3d.l_arm.points = data.points;
            totalPointsValue = +parseFloat(data.points);
            break;
          case "Legs":
            data = await getAttributeItemData("legs", item.value);
            table3d.legs.value = item.value;
            table3d.legs.rarity = data.rarity;
            table3d.legs.points = data.points;
            totalPointsValue = +parseFloat(data.points);
            break;
          case "Background":
            data = await getAttributeItemData("background", item.value);
            table3d.background.value = item.value;
            table3d.background.rarity = data.rarity;
            table3d.background.points = data.points;
            totalPointsValue = +parseFloat(data.points);
            break;

          default:
            break;
        }
      }
      setTotalPoints(totalPointsValue);
      setTableData3D(table3d);
      const rarityElement = getSodier3dRarity(table3d);
      if (rarityElement) {
        setRarity3d(rarityElement);
      }
    }
    setDetailLoading(false);
  };

  const getSodier3dRarity = (data: any) => {
    let commonCnt = Object.values(data).filter(
      (item: any) => item.rarity === "common"
    ).length;
    let rareCnt = Object.values(data).filter(
      (item: any) => item.rarity === "rare"
    ).length;
    let universalCnt = Object.values(data).filter(
      (item: any) => item.rarity === "universal"
    ).length;
    let firstClassCnt = Object.values(data).filter(
      (item: any) => item.rarity === "1st class"
    ).length;
    let transcendentalCnt = Object.values(data).filter(
      (item: any) => item.rarity === "transcendental"
    ).length;
    if (commonCnt >= 6) {
      return (
        <>
          <CommonIcon /> Common
        </>
      );
    }
    if (universalCnt >= 5) {
      return (
        <>
          <UniversalIcon /> Universal
        </>
      );
    }
    if (rareCnt >= 5) {
      return (
        <>
          <RareIcon /> Rare
        </>
      );
    }
    if (firstClassCnt >= 5) {
      return (
        <>
          <FirstClassIcon /> 1st Class
        </>
      );
    }
    if (transcendentalCnt >= 5) {
      return (
        <>
          <TranscendentalIcon /> Legendary
        </>
      );
    }
  };

  const getUserNfts = async () => {
    if (!wallet.publicKey) return;
    let nfts: SoldierItem[] = [];
    const nftList = await getParsedNftAccountsByOwner({
      publicAddress: wallet.publicKey.toBase58(),
      connection: solConnection,
    });
    if (nftList.length !== 0) {
      for (let item of nftList) {
        if (item.data?.creators)
          if (
            item.data?.creators[0]?.address === MAIN_2D_CEATOR ||
            item.data?.creators[0]?.address === MAIN_3D_CEATOR
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
            nfts.push({
              collection: item.data.name.slice(0, 2),
              mint: item.mint,
              name: item.data.name,
              uri: item.data.uri,
              image: image,
              selected: false,
              id: item.data.name.split("#")[1],
            });
            nfts.sort((a, b) =>
              (a.name + a.id).toLowerCase() < (b.name + b.id).toLowerCase()
                ? -1
                : (a.name + a.id).toLowerCase() > (b.name + b.id).toLowerCase()
                ? 1
                : 0
            );
          }
      }
      if (nfts.length !== 0) {
        setSoldiers(nfts);
        setSelectedImage(nfts[0].image);
        setSelectedId(nfts[0].id);
        setSelectedCollection(nfts[0].collection);
        getNftDetail(
          nfts[0].collection.toLowerCase(),
          nfts[0].id,
          nfts[0].mint,
          nfts[0].uri
        );
      }
    }
  };

  useEffect(() => {
    getUserNfts();
    // eslint-disable-next-line
  }, [wallet.connected, wallet.publicKey]);
  return (
    <>
      <NextSeo
        title="Battalion | 2D Solarmy NFT Staking"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et massa massa. Ut mollis posuere risus, convallis laoreet felis pulvinar condimentum. Nam ac lectus ex."
        openGraph={{
          url: `${LIVE_URL}`,
          title: "Battalion | 2D Solarmy NFT Staking",
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
      <MainPage>
        <Header />
        {wallet.publicKey && (
          <div className="battalion-page">
            {soldiers && (
              <>
                <BattlaionFilter
                  attributes={filterAttr}
                  onSelect={handleAttr}
                  selectedId={selectedId}
                  currentTab={filterTab}
                  soldiers={soldiers}
                  setTab={setFilterTab}
                />
                <div className="soldier-detail">
                  <div className="soldier-media">
                    {/* eslint-disable-next-line */}
                    <img src={selectedImage} alt="" />
                  </div>
                  <div className="attribute-list">
                    {detailLoading ? (
                      <div className="component-loading">
                        <BattalionDetailLoading />
                      </div>
                    ) : (
                      <>
                        <div className="list-head">
                          <div className="id-line">
                            <h3>#{selectedId}</h3>
                            <p>{selectedCollection}</p>
                          </div>
                          <div className="score-line">
                            <h3>
                              {selectedCollection === "2D" ? "Score" : "Points"}
                            </h3>
                            <p>
                              {selectedCollection === "2D"
                                ? score
                                : totalPoints}
                            </p>
                          </div>
                          <div className="rank-line">
                            <h3>
                              {selectedCollection === "2D" ? "Rank" : "Rarity"}
                            </h3>
                            <p>
                              {selectedCollection === "2D"
                                ? rank
                                : rarity3d
                                ? rarity3d
                                : ""}
                            </p>
                          </div>
                        </div>
                        {selectedCollection.toLowerCase() === "2d" && (
                          <Soldier2DAttributeTable
                            hat={tableData2D.hat}
                            head={tableData2D.head}
                            torso={tableData2D.torso}
                            torso_accessories={tableData2D.torso_accessories}
                            legs={tableData2D.legs}
                            l_arm={tableData2D.l_arm}
                            r_arm={tableData2D.r_arm}
                            companion={tableData2D.companion}
                            shoes={tableData2D.shoes}
                            background={tableData2D.background}
                          />
                        )}
                        {selectedCollection.toLowerCase() === "3d" && (
                          <Soldier3DAttributeTable
                            head={tableData3D.head}
                            torso={tableData3D.torso}
                            head_accessories={tableData3D.head_accessories}
                            legs={tableData3D.legs}
                            l_arm={tableData3D.l_arm}
                            r_arm={tableData3D.r_arm}
                            background={tableData3D.background}
                          />
                        )}
                        {selectedCollection.toLowerCase() === "2d" && (
                          <>
                            <Link
                              href={`https://howrare.is/solarmy${selectedCollection.toLowerCase()}/${selectedId}/`}
                            >
                              <a className="no-underline" target="_blank">
                                <div className="howrare-button">
                                  howrare score
                                </div>
                              </a>
                            </Link>
                            <CopyAddress
                              address={`https://howrare.is/solarmy${selectedCollection.toLowerCase()}/${selectedId}/`}
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        <Menu />
      </MainPage>
    </>
  );
}
