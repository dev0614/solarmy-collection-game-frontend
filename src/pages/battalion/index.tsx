import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { useWallet } from "@solana/wallet-adapter-react";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BattlaionFilter } from "../../components/Battalion/BattalionFilter";
import CopyAddress from "../../components/Battalion/CopyAddress";
import Soldier2DAttributeTable from "../../components/Battalion/Soldier2DAttributeTable";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { MainPage } from "../../components/Widget";
import { COLLECTION_RARITY_API, LIVE_URL, MAIN_2D_CEATOR, MAIN_3D_CEATOR } from "../../config";
import { AttributeFilterTypes, SoldierItem, TableFirstData2D } from "../../solana/types";
import { getSum, solConnection } from "../../solana/utils";
import { Soldier2DRarity } from "../../soldier2d_rarity";

export default function BattalionPage() {
    const [filterAttr, setFilterAttr] = useState<AttributeFilterTypes>({
        common: false,
        universal: false,
        rare: false,
        first_class: false,
        transendental: false
    });
    const wallet = useWallet();
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedId, setSelectedId] = useState("1");
    const [collection, setCollection] = useState("2d");
    const [score, setScore] = useState(0);
    const [rank, setRank] = useState(99999);
    const [filterTab, setFilterTab] = useState("all");
    const [tableData2D, setTableData2D] = useState(TableFirstData2D);
    const [soldiers, setSoldiers] = useState<SoldierItem[]>();
    const [selectedCollection, setSelectedCollection] = useState("2d");
    const [detailLoading, setDetailLoading] = useState(false);

    const handleAttr = (mint: string, id: string, collection: string, image: string) => {
        setCollection(collection);
        setSelectedId(id);
        setSelectedImage(image);
        getNftDetail(collection, id, mint);
        setSelectedCollection(collection);
    };

    const getNftDetail = async (collection: string, id: string, mint: string) => {
        setDetailLoading(true);
        if (collection.toLowerCase() === "2d") {
            const alldata = Soldier2DRarity.result.data.items;
            const data: any = alldata.find((item) => item.id === parseInt(id));
            console.log(data);
            if (data) {
                const sum = getSum(data?.attributes, "rarity");
                console.log(sum);
                setRank(data.rank);

                let table2d = {
                    hat: {
                        name: data.attributes?.find((item: any) => item.name === "Head").value,
                        rarity: data.attributes?.find((item: any) => item.name === "Head").rarity
                    },
                    head: {
                        name: data.attributes?.find((item: any) => item.name === "Hat").value,
                        rarity: data.attributes?.find((item: any) => item.name === "Hat").rarity
                    },
                    torso_accessories: {
                        name: data.attributes?.find((item: any) => item.name === "Torso Accessories").value,
                        rarity: data.attributes?.find((item: any) => item.name === "Torso Accessories").rarity
                    },
                    l_arm: {
                        name: data.attributes?.find((item: any) => item.name === "Left Arm").value,
                        rarity: data.attributes?.find((item: any) => item.name === "Left Arm").rarity
                    },
                    r_arm: {
                        name: data.attributes?.find((item: any) => item.name === "Right Arm").value,
                        rarity: data.attributes?.find((item: any) => item.name === "Right Arm").rarity
                    },
                    legs: {
                        name: data.attributes?.find((item: any) => item.name === "Legs").value,
                        rarity: data.attributes?.find((item: any) => item.name === "Legs").rarity
                    },
                    torso: {
                        name: data.attributes?.find((item: any) => item.name === "Torso").value,
                        rarity: data.attributes?.find((item: any) => item.name === "Torso").rarity
                    },
                    background: {
                        name: data.attributes?.find((item: any) => item.name === "Background").value,
                        rarity: data.attributes?.find((item: any) => item.name === "Background").rarity
                    },
                    companion: {
                        name: data.attributes?.find((item: any) => item.name === "Companion").value,
                        rarity: data.attributes?.find((item: any) => item.name === "Companion").rarity
                    },
                    shoes: {
                        name: data.attributes?.find((item: any) => item.name === "Shoes").value,
                        rarity: data.attributes?.find((item: any) => item.name === "Shoes").rarity
                    },
                }
                setTableData2D(table2d);
            }

        }
        setDetailLoading(false);
    }

    const getUserNfts = async () => {
        if (!wallet.publicKey) return;
        let nfts: SoldierItem[] = [];
        const nftList = await getParsedNftAccountsByOwner({ publicAddress: wallet.publicKey.toBase58(), connection: solConnection });
        if (nftList.length !== 0) {
            for (let item of nftList) {
                if (item.data?.creators[0]?.address === MAIN_2D_CEATOR || item.data?.creators[0]?.address === MAIN_3D_CEATOR) {
                    const image = await fetch(item.data.uri)
                        .then(resp =>
                            resp.json()
                        ).then((json) => {
                            return json.image;
                        })
                        .catch((error) => {
                            console.log(error);
                            return ""
                        })
                    nfts.push({
                        collection: item.data.name.slice(0, 2),
                        mint: item.mint,
                        name: item.data.name,
                        uri: item.data.uri,
                        image: image,
                        selected: false,
                        id: item.data.name.split("#")[1]
                    })
                    nfts.sort((a, b) => ((a.name + a.id).toLowerCase() < (b.name + b.id).toLowerCase()) ? -1 : ((a.name + a.id).toLowerCase() > (b.name + b.id).toLowerCase()) ? 1 : 0);
                }
            }
            if (nfts.length !== 0) {
                setSoldiers(nfts);
                setSelectedImage(nfts[0].image);
                setSelectedId(nfts[0].id);
                setSelectedCollection(nfts[0].collection);
                getNftDetail(nfts[0].collection.toLowerCase(), nfts[0].id, nfts[0].mint);
            }

        } else {

        }
    }

    useEffect(() => {
        getUserNfts();
    }, [wallet.connected, wallet.publicKey])
    return (
        <>
            <NextSeo
                title="Battalion | 2D Solarmy NFT Staking"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et massa massa. Ut mollis posuere risus, convallis laoreet felis pulvinar condimentum. Nam ac lectus ex."
                openGraph={{
                    url: `${LIVE_URL}`,
                    title: 'Battalion | 2D Solarmy NFT Staking',
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
            <MainPage>
                <Header />
                <div className="battalion-page">
                    {soldiers &&
                        <BattlaionFilter
                            attributes={filterAttr}
                            onSelect={handleAttr}
                            selectedId={selectedId}
                            currentTab={filterTab}
                            soldiers={soldiers}
                            setTab={setFilterTab}
                        />
                    }
                    <div className="soldier-detail">
                        <div className="soldier-media">
                            {/* eslint-disable-next-line */}
                            <img
                                src={selectedImage}
                                alt=""
                            />
                        </div>
                        <div className="attribute-list">
                            {detailLoading ?
                                <>
                                    Loading...
                                </>
                                :
                                <>
                                </>
                            }
                            <div className="list-head">
                                <div className="id-line">
                                    <h3>#{selectedId}</h3>
                                    <p>{selectedCollection}</p>
                                </div>
                                <div className="score-line">
                                    <h3>Score</h3>
                                    <p>{score}</p>
                                </div>
                                <div className="rank-line">
                                    <h3>Rank</h3>
                                    <p>{rank}</p>
                                </div>
                            </div>
                            {selectedCollection.toLowerCase() === "2d" &&
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
                            }
                            {selectedCollection.toLowerCase() === "2d" &&
                                <>
                                    <Link href={`https://howrare.is/solarmy${selectedCollection.toLowerCase()}/${selectedId}/`} >
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
                            }
                        </div>
                    </div>
                </div>
                <Menu />
            </MainPage>
        </>
    )
}