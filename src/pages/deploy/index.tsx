import { useEffect, useState } from "react";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { useWallet } from "@solana/wallet-adapter-react";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import DeployItem from "../../components/Deploy/DeployItem";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { MarketplaceIcon } from "../../components/svgIcons";
import { MainPage } from "../../components/Widget";
import { CREATOR_2D_ADDRESS, LIVE_URL } from "../../config";
import { getMetadata, solConnection } from "../../contexts/utils";
import { DeployItemType } from "../../contexts/types";
import { getNftMetaData, getUserPoolInfo } from "../../contexts/transaction_staking";
import { PublicKey } from "@solana/web3.js";

export default function DeployPage() {
    const wallet = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [unstakedNfts, setUnstakedNfts] = useState<DeployItemType[]>();
    const [stakedNfts, setStakedNfts] = useState<DeployItemType[]>();

    const getUnstakedData = async () => {
        if (!wallet.publicKey) return;
        const nftList = await getParsedNftAccountsByOwner({ publicAddress: wallet.publicKey.toBase58(), connection: solConnection });
        if (nftList.length !== 0) {
            let list: DeployItemType[] = [];
            for (let item of nftList) {
                if (item.data.creators[0].address === CREATOR_2D_ADDRESS)
                    list.push({
                        nftMint: item?.mint,
                        uri: item?.data?.uri,
                        status: "reverse",
                        stakedTime: new Date().getTime(),
                        lockTime: new Date().getTime(),
                        duration: 0
                    })
            }
            setUnstakedNfts(list);
        }
    }
    const getStakedData = async () => {
        if (!wallet.publicKey) return;
        const data = await getUserPoolInfo(wallet);
        if (data) {
            const count = data.stakedCount;
            let list: DeployItemType[] = [];
            let promiseData: any = [];
            for (let i = 0; i < count; i++) {
                const promise = getNftMetaData(new PublicKey(data.staking[i].mint));
                promiseData.push(promise);
            }
            const uris = await Promise.all(promiseData);

            for (let i = 0; i < count; i++) {
                list.push({
                    nftMint: data.staking[i].mint,
                    uri: uris[i],
                    status: "active",
                    stakedTime: new Date().getTime(),
                    lockTime: new Date().getTime(),
                    duration: data.staking[i].duration
                })
            }
            setStakedNfts(list);
            // console.log(data, "===> staked data")
        }
    }

    const updatePage = async () => {
        setIsLoading(true);
        await getUnstakedData();
        await getStakedData();
        setIsLoading(false);
    }

    useEffect(() => {
        if (wallet.publicKey) {
            updatePage();
        }
    }, [wallet.connected, wallet.publicKey])
    return (
        <>
            <NextSeo
                title="Deploy | 2D Solarmy NFT Staking"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et massa massa. Ut mollis posuere risus, convallis laoreet felis pulvinar condimentum. Nam ac lectus ex."
                openGraph={{
                    url: `${LIVE_URL}`,
                    title: 'Deploy | 2D Solarmy NFT Staking',
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
                <div className="deploy-header">
                    <div className="content">
                        <div className="content-left">
                            {/* eslint-disable-next-line */}
                            <img
                                src="/img/deploy-symbol-shadow.png"
                                alt=""
                                className="symbol"
                            />
                            <p>Soldiers Deployed&nbsp;
                                <span>
                                    {unstakedNfts &&
                                        <>
                                            {stakedNfts?.length}/{stakedNfts ? (stakedNfts?.length + unstakedNfts?.length) : unstakedNfts?.length}
                                        </>
                                    }
                                </span>
                            </p>
                        </div>
                        <div className="content-right">
                            <Link href="/marketplace">
                                <a>
                                    Marketplace <MarketplaceIcon />
                                </a>
                            </Link>
                            <div className="view-switch">
                                <button className="active">normal view</button>
                                <button className="">dense view</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="deploy-list">
                    {isLoading ?
                        <h1 style={{ color: "#fff" }}>Loding...</h1>
                        :
                        <>
                            {stakedNfts && stakedNfts.length !== 0 && stakedNfts.map((item, key) => (
                                <DeployItem
                                    key={key}
                                    nftMint={item.nftMint}
                                    uri={item.uri}
                                    update={() => updatePage()}
                                    status={item.status}
                                />
                            ))}
                            {unstakedNfts && unstakedNfts.length !== 0 && unstakedNfts.map((item, key) => (
                                <DeployItem
                                    key={key}
                                    nftMint={item.nftMint}
                                    uri={item.uri}
                                    update={() => updatePage()}
                                    status={item.status}
                                />
                            ))}
                        </>
                    }
                </div>
                <Menu />
            </MainPage>
        </>
    )
}

// <DeployItem
//     id={877}
//     status="complete"
// />
// <DeployItem
//     id={877}
//     status="active"
// />
// <DeployItem
//     id={877}
//     status="reverse"
// />