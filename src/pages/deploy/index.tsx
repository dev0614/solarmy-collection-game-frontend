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
import { solConnection } from "../../contexts/utils";
import { DeployItemType } from "../../contexts/types";
import { getNftMetaData, getUserPoolInfo } from "../../contexts/transaction_staking";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";

export default function DeployPage() {
    const wallet = useWallet();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [unstakedNfts, setUnstakedNfts] = useState<DeployItemType[]>([]);
    const [stakedNfts, setStakedNfts] = useState<DeployItemType[]>([]);

    const getUnstakedData = async () => {
        if (!wallet.publicKey) return;
        const nftList = await getParsedNftAccountsByOwner({ publicAddress: wallet.publicKey.toBase58(), connection: solConnection });
        if (nftList.length !== 0) {
            let list: DeployItemType[] = [];
            for (let item of nftList) {
                if (item.data?.creators)
                    if (item.data?.creators[0].address === CREATOR_2D_ADDRESS)
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
                const now = new Date().getDate() / 1000;
                list.push({
                    nftMint: data.staking[i].mint,
                    uri: uris[i],
                    status: now > data.staking[i].lockTime ? "complete" : "active",
                    stakedTime: data.staking[i].stakedTime,
                    lockTime: data.staking[i].lockTime,
                    duration: data.staking[i].duration
                })
            }
            setStakedNfts(list);
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
                                {!isLoading &&
                                    <span>
                                        {unstakedNfts &&
                                            <>
                                                {stakedNfts?.length}/{stakedNfts ? (stakedNfts?.length + unstakedNfts?.length) : unstakedNfts?.length}
                                            </>
                                        }
                                    </span>
                                }
                            </p>
                        </div>
                        <div className="content-right">
                            <Link href="https://magiceden.io/marketplace/2d_soldiers">
                                <a target="_blank" title="MagicEden">
                                    Marketplace <MarketplaceIcon />
                                </a>
                            </Link>
                            <div className="view-switch">
                                <button
                                    className={router?.query.view === "normal" ? "active" : ""}
                                    onClick={() => router.push("/deploy?view=normal")}
                                >
                                    normal view
                                </button>
                                <button
                                    className={router?.query.view === "dense" ? "active" : ""}
                                    onClick={() => router.push("/deploy?view=dense")}
                                >
                                    dense view
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={router?.query?.view === "dense" ? "deploy-list deploy-list-dense" : "deploy-list"}>
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
                                    duration={item.duration}
                                    lockTime={item.lockTime}
                                    stakedTime={item.stakedTime}
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
