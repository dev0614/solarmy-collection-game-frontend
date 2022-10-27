import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import Badge from "../../components/Me/Badge";
import MeHeader from "../../components/Me/MeHeader";
import DetailDialog from "../../components/Me/DetailDialog";
import {
  CommonIcon,
  FirstClassIcon,
  RareIcon,
  TranscendentalIcon,
  UniversalIcon,
} from "../../components/svgIcons";
import { MAIN_2D_CEATOR, MAIN_3D_CEATOR } from "../../config";
import { getAttributeItemData, getTopSoldiers } from "../../solana/server";
import {
  AttributeFilterTypes,
  Default3dData,
  SoldierItem,
  TableFirstData2D,
} from "../../solana/types";
import { getSum, solConnection } from "../../solana/utils";
import { Soldier2DRarity } from "../../soldier2d_rarity";
import { BattalionView } from "../../components/Me/BattalionView";
import { useUserContext } from "../../context/UserProvider";

export default function MePage() {
  const wallet = useWallet();
  const [lastPage, setLastPage] = useState<string | null>("/dashboard");
  const userData = useUserContext();

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
  const [soldiers, setSoldiers] = useState<SoldierItem[]>();
  const [filterAttr, setFilterAttr] = useState<AttributeFilterTypes>({
    common: false,
    universal: false,
    rare: false,
    first_class: false,
    transendental: false,
  });
  const [selectedId, setSelectedId] = useState("1");
  const [filterTab, setFilterTab] = useState("all");
  const [collection, setCollection] = useState("2d");
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("2d");
  const [detailLoading, setDetailLoading] = useState(false);
  const [rank, setRank] = useState(99999);
  const [tableData2D, setTableData2D] = useState(TableFirstData2D);
  const [totalPoints, setTotalPoints] = useState(0);
  const [tableData3D, setTableData3D] = useState(Default3dData);
  const [rarity3d, setRarity3d] = useState<any>();
  const [score, setScore] = useState(0);
  const [isModal, setIsModal] = useState(false);

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

  const [topLoading, setTopLoading] = useState(false);
  const [top2dNft, setTop2dNft] = useState("");
  const [top3dNft, setTop3dNft] = useState("");
  const getTopNfts = async () => {
    if (!wallet.publicKey) return;
    setTopLoading(true);
    const { top2D, top3D } = await getTopSoldiers(wallet.publicKey.toBase58());
    setTop2dNft(top2D);
    setTop3dNft(top3D);
    setTopLoading(false);
  };

  useEffect(() => {
    getUserNfts();
    getTopNfts();
    // eslint-disable-next-line
  }, [wallet.connected, wallet.publicKey]);

  return (
    <main className="main-page">
      {/* eslint-disable-next-line */}
      <img src="/img/main-bg.png" className="page-bg" alt="" />
      <div className="page-content non-padding">
        <MeHeader back={{ title: "Store", backUrl: lastPage }} />
        {wallet.publicKey && (
          <div className="me-page">
            {soldiers && (
              <div className="container">
                <div className="me-content">
                  <BattalionView
                    attributes={filterAttr}
                    onSelect={handleAttr}
                    selectedId={selectedId}
                    currentTab={filterTab}
                    soldiers={soldiers}
                    setTab={setFilterTab}
                  />
                  <div className="soldier-me-detail">
                    <div className="soldier-me-media">
                      <a
                        onClick={() => {
                          setIsModal(true);
                          console.log(selectedId);
                        }}
                      >
                        {/* eslint-disable-next-line */}
                        <img src={selectedImage} alt="" />
                      </a>
                    </div>
                  </div>
                  <DetailDialog
                    opened={isModal}
                    close={() => setIsModal(false)}
                    id={selectedId}
                    collection={selectedCollection}
                    score={score}
                    totalPoints={totalPoints}
                    rank={rank}
                    rarity3d={rarity3d}
                    tableData2D={tableData2D}
                    tableData3D={tableData3D}
                  />
                  <Badge
                    topLoading={topLoading}
                    top2dNft={top2dNft}
                    badgeNum={userData.badge}
                    top3dNft={top3dNft}
                    me
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
