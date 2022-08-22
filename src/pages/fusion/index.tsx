import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz"
import { useWallet } from "@solana/wallet-adapter-react"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import Header from "../../components/Header"
import Menu from "../../components/Menu"
import { BuySoliderMarketplaceIcon, CompassIcon, FusionCardEditLg, FusionCardEditMd, FusionEmptyIcon } from "../../components/svgIcons"
import { MainPage } from "../../components/Widget"
import { CREATOR_3D_ADDRESS } from "../../config"
import { DeployItemType, FusionNft, FusionNftDetail } from "../../solana/types"
import { solConnection } from "../../solana/utils"

export default function FusionPage() {
    const [pageTab, setPageTab] = useState("collection");
    const wallet = useWallet();
    const router = useRouter();

    const [postNfts, setPostNfts] = useState<FusionNftDetail[]>();
    const getPostNfts = async () => {
        if (!wallet.publicKey) return;
        const nftList = await getParsedNftAccountsByOwner({ publicAddress: wallet.publicKey.toBase58(), connection: solConnection });
        if (nftList.length !== 0) {
            let list: FusionNft[] = [];
            let feched: FusionNftDetail[] = [];
            for (let item of nftList) {
                if (item.data?.creators)
                    if (item.data?.creators[0].address === CREATOR_3D_ADDRESS)
                        list.push({
                            nftMint: item?.mint,
                            uri: item?.data?.uri,
                        })
            }
            if (list.length !== 0) {
                let promise = [];
                for (let item of list) {
                    const metadata = fetch(item.uri)
                        .then(resp =>
                            resp.json()
                        ).then((json) => {
                            return json
                        })
                        .catch((error) => {
                            console.log(error);
                            return null;
                        })
                    promise.push(metadata)
                }
                let data = await Promise.all(promise);
                for (let i = 0; i < data.length; i++) {
                    data[i].nftMint = list[i].nftMint
                }
                for (let item of data) {
                    feched.push({
                        nftMint: item.nftMint,
                        image: item.image,
                        name: item.name
                    })
                }
            }
            setPostNfts(feched);
        } else {
            setPostNfts([]);
        }
    }
    useEffect(() => {
        getPostNfts();
    }, [wallet.connected, wallet.publicKey])
    return (
        <MainPage>
            <Header
                back={{
                    backUrl: "/dashboard",
                    title: "Fusion"
                }} />
            <div className="fusion-page">
                <div className="dashboard-tabs">
                    <button className={pageTab === "collection" ? "btn-tab active" : "btn-tab"} onClick={() => setPageTab("collection")}>your collection</button>
                    <button className={pageTab === "attributes" ? "btn-tab active" : "btn-tab"} onClick={() => setPageTab("attributes")}>all attributes</button>
                </div>
                <div className="collection-main-box">
                    <div className="fusion-nft-card box-shadow">
                        {postNfts && postNfts?.length !== 0 ?
                            <>
                                <div className="card-media">
                                    {/* eslint-disable-next-line */}
                                    <img
                                        src={postNfts[0].image}
                                        alt=""
                                    />
                                </div>
                                <div className="fusion-card-overview">
                                    <Link href={`/fusion/1?mint=${postNfts[0].nftMint}`}>
                                        <a>
                                            <FusionCardEditLg />
                                        </a>
                                    </Link>
                                </div>
                            </>
                            :
                            <></>
                        }
                    </div>
                    <div className="collection-placeholder">
                        <Link href="https://magiceden.io/marketplace/3d_soldiers">
                            <a className="placeholder-icon" target="_blank">
                                <CompassIcon />
                                <span>buy 3d soldiers</span>
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="nft-linst-box box-shadow">
                    <h3>your soliders</h3>
                    <div className="content">
                        {postNfts && postNfts.length !== 0 &&
                            <>
                                {
                                    postNfts.map((item, key) => (
                                        <div className="empty-fusion-card" key={key} onClick={() => router.push(`/fusion/${key + 1}?mint=${item.nftMint}`)}>
                                            {/* eslint-disable-next-line */}
                                            <img
                                                src={item.image}
                                                alt=""
                                            />
                                            <div className="card-overview image">
                                                <FusionCardEditMd />
                                            </div>
                                        </div>
                                    ))
                                }
                                {
                                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((item, key) => (
                                        postNfts.length < key + 1 &&
                                        <div className="empty-fusion-card" key={key}>
                                            <FusionEmptyIcon />
                                            <div className="card-overview">
                                                <Link href="https://magiceden.io/marketplace/3d_soldiers">
                                                    <a target="_blank">
                                                        <BuySoliderMarketplaceIcon />
                                                        <span>Buy Soldiers</span>
                                                    </a>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                }
                            </>
                        }
                    </div>
                </div>
            </div>
            <Menu />
        </MainPage >
    )
}
