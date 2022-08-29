import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { useWallet } from "@solana/wallet-adapter-react";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { BattlaionFilter } from "../../components/Battalion/BattalionFilter";
import Soldier2DAttributeTable from "../../components/Battalion/Soldier2DAttributeTable";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { MainPage } from "../../components/Widget";
import { LIVE_URL, MAIN_2D_CEATOR, MAIN_3D_CEATOR } from "../../config";
import { AttributeFilterTypes, SoldierItem, TableFirstData } from "../../solana/types";
import { solConnection } from "../../solana/utils";

export default function BattalionPage() {
    const [filterAttr, setFilterAttr] = useState<AttributeFilterTypes>({
        common: false,
        universal: false,
        rare: false,
        first_class: false,
        transendental: false
    });
    const wallet = useWallet();
    const [selectedImage, setSelectedImage] = useState("https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https%3A%2F%2Fwww.arweave.net%2FwtKHIgJSO3vo0St6wceL4FWP3Y25e5DEWNj4YgHSuH8%3Fext%3Dpng");
    const [selectedId, setSelectedId] = useState("1");
    const [collection, setCollection] = useState("2d");
    const [score, setScore] = useState(0);
    const [rank, setRank] = useState(99999);
    const [filterTab, setFilterTab] = useState("all");
    const [tableData, setTableData] = useState(TableFirstData);

    const [soldiers, setSoldiers] = useState<SoldierItem[]>();
    const handleAttr = () => {

    };

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
            setSoldiers(nfts)

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
                    {filterAttr && soldiers &&
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
                            <div className="list-head">
                                <div className="id-line">
                                    <h3>#2345</h3>
                                    <p>{collection}</p>
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
                            <Soldier2DAttributeTable
                                head={tableData.head}
                                head_accessories={tableData.head_accessories}
                                l_arm={tableData.l_arm}
                                r_arm={tableData.r_arm}
                                torso={tableData.torso}
                                legs={tableData.legs}
                                background={tableData.background}
                            />
                        </div>
                    </div>
                </div>
                <Menu />
            </MainPage>
        </>
    )
}