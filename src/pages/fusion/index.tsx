import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz"
import { useWallet } from "@solana/wallet-adapter-react"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { FusionType } from "../../components/Fusion/FusionWidget"
import Header from "../../components/Header"
import Menu from "../../components/Menu"
import { BuySoliderMarketplaceIcon, CompassIcon, FusionCardEditLg, FusionCardEditMd, FusionEmptyIcon, FusionIconlg } from "../../components/svgIcons"
import { AttributeSetting, MainPage } from "../../components/Widget"
import { CREATOR_3D_ADDRESS } from "../../config"
import { getAvailableInventory } from "../../solana/server"
import { AbleFetchedItem, AttributeFilterTypes, FusionNft, FusionNftDetail } from "../../solana/types"
import { solConnection, titleCamel, titleLowerCase } from "../../solana/utils"

export default function FusionPage() {
    const [pageTab, setPageTab] = useState("collection");
    const wallet = useWallet();
    const router = useRouter();

    const [selectedKind, setSelectedKind] = useState('head');
    const [ableInventories, setAbleInventoris] = useState<AbleFetchedItem[]>();
    const [selectAbled, setSelectAbled] = useState<AbleFetchedItem[]>();

    const [attributeFilter, setAttributeFilter] = useState<AttributeFilterTypes>({
        common: false,
        universal: false,
        rare: false,
        first_class: false,
        transendental: false
    });

    const getAbleInventory = async () => {
        if (!wallet.publicKey) return;
        try {
            const data = await getAvailableInventory(wallet.publicKey?.toBase58());
            if (data.length !== 0) {
                setAbleInventoris(data)
                console.log(data)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAttribute = (e: any) => {
        const attr = e.target.innerText;
        setSelectedKind(titleCamel(attr as string));
        let attrName = '';
        if (attr === 'L Arm') {
            attrName = 'left arm';
        } else if (attr === 'R Arm') {
            attrName = 'right arm';
        } else if (attr === 'Head' && attr !== "Head Accessories") {
            attrName = 'head';
        } else {
            attrName = titleLowerCase(attr);
        }
        const names = ableInventories?.filter((attr) => attr.attribute_type === attrName);
        setSelectAbled(names)
        // eslint-disable-next-line
    };

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
        getAbleInventory();
    }, [wallet.connected, wallet.publicKey, pageTab])
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
                {pageTab === "collection" ?
                    <>
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
                    </>
                    :
                    <>
                        <div className="fusion-edit-page" style={{ margin: 0 }}>
                            <div className="content">
                                <div className="attributes">
                                    <div className="kind">
                                        <h4>Type</h4>
                                        <FusionType
                                            selectedKind={selectedKind}
                                            handleAttribute={handleAttribute}
                                        />
                                    </div>
                                    <div className="options">
                                        <div className="option-header">
                                            <h4>Name</h4>
                                            {attributeFilter &&
                                                <AttributeSetting
                                                    attributeFilter={attributeFilter}
                                                    setAttributeFilter={setAttributeFilter}
                                                />
                                            }
                                        </div>
                                        <div className="option-list">
                                            <ul>
                                                {/* <li className="option-item current">
                                                    <h5 className="title">{selectedName?.attribute}</h5>
                                                    <p className="points"><span className="common">{selectedName?.rarity}</span>{selectedName?.points} Equiped</p>
                                                </li> */}
                                                {selectAbled && selectAbled.length !== 0 && selectAbled.map((item, key) => (
                                                    <li
                                                        className={`option-item`}
                                                        key={key}
                                                        style={{ cursor: "default" }}
                                                    >
                                                        <h5 className="title">{item.attribute}</h5>
                                                        <p className="points">
                                                            <span className="universal">{item.rarity}</span>
                                                            &nbsp;{item.points}&nbsp;
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="fusion-edit-card box-shadow">
                                    <div className="media empty-fusion-media">
                                        <FusionIconlg />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
            <Menu />
        </MainPage >
    )
}
