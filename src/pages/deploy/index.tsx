import { useEffect, useState } from "react";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { Dialog } from "@mui/material";
import { ClipLoader } from "react-spinners";
import DeployItem from "../../components/Deploy/DeployItem";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import {
  CloseTwoTone,
  DeployIcon,
  HiveIcon,
  MarketplaceIcon,
} from "../../components/svgIcons";
import { MainPage } from "../../components/Widget";
import { MAIN_2D_CEATOR, DEPLOY_LEVEL, LIVE_URL } from "../../config";
import { solConnection } from "../../solana/utils";
import { DeployItemType } from "../../solana/types";
import {
  claimAllNFT,
  getNftMetaData,
  getUserPoolInfo,
  stakeAllNFT,
} from "../../solana/transaction_staking";
import { PublicKey } from "@solana/web3.js";
import { useRouter } from "next/router";
import { DeployItemSkeleton } from "../../components/SkeletonComponents/DeploySkeletons";
import { useUserContext } from "../../context/UserProvider";

export default function DeployPage() {
  const wallet = useWallet();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [unstakedNfts, setUnstakedNfts] = useState<DeployItemType[]>([]);
  const [stakedNfts, setStakedNfts] = useState<DeployItemType[]>([]);
  const [isModal, setIsModal] = useState(false);
  const [isClaimAllLoading, setIsClaimAllLoading] = useState(false);
  const { getUserData } = useUserContext();
  const getUnstakedData = async () => {
    if (!wallet.publicKey) return;
    const nftList = await getParsedNftAccountsByOwner({
      publicAddress: wallet.publicKey.toBase58(),
      connection: solConnection,
    });
    if (nftList.length !== 0) {
      let list: DeployItemType[] = [];
      for (let item of nftList) {
        if (item.data?.creators)
          if (item.data?.creators[0].address === MAIN_2D_CEATOR)
            list.push({
              nftMint: item?.mint,
              uri: item?.data?.uri,
              status: "reverse",
              stakedTime: new Date().getTime(),
              lockTime: new Date().getTime(),
              duration: 0,
            });
      }
      setUnstakedNfts(list);
    } else {
      setUnstakedNfts([]);
    }
  };

  const onClaimAll = async () => {
    let nfts = stakedNfts;
    let completedNfts: PublicKey[] = [];
    for (let nft of nfts) {
      if (nft.status === "complete") {
        completedNfts.push(new PublicKey(nft.nftMint));
      }
    }
    if (completedNfts.length !== 0) {
      try {
        await claimAllNFT(
          wallet,
          completedNfts,
          () => setIsClaimAllLoading(true),
          () => setIsClaimAllLoading(false),
          () => updatePage()
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

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
        const now = new Date().getTime() / 1000;
        list.push({
          nftMint: data.staking[i].mint,
          uri: uris[i],
          status: now > data.staking[i].lockTime ? "complete" : "active",
          stakedTime: data.staking[i].stakedTime,
          lockTime: data.staking[i].lockTime,
          duration: data.staking[i].duration,
        });
      }
      setStakedNfts(list);
      console.log(list);
    } else {
      setStakedNfts([]);
    }
  };

  const updatePage = async () => {
    setIsLoading(true);
    await getUnstakedData();
    await getStakedData();
    getUserData();
    setIsLoading(false);
  };

  useEffect(() => {
    if (wallet.publicKey) {
      updatePage();
    } else {
      setStakedNfts([]);
      setUnstakedNfts([]);
    }
    // eslint-disable-next-line
  }, [wallet.connected, wallet.publicKey]);
  return (
    <>
      <NextSeo
        title="Deploy | 2D Solarmy NFT Staking"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et massa massa. Ut mollis posuere risus, convallis laoreet felis pulvinar condimentum. Nam ac lectus ex."
        openGraph={{
          url: `${LIVE_URL}`,
          title: "Deploy | 2D Solarmy NFT Staking",
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
        <div className="deploy-header">
          <div className="content">
            <div className="content-left">
              {/* eslint-disable-next-line */}
              <img
                src="/img/deploy-symbol-shadow.png"
                alt=""
                className="symbol"
              />
              <p>
                Soldiers Deployed&nbsp;
                {!isLoading && (
                  <span>
                    {unstakedNfts && (
                      <>
                        {stakedNfts?.length}/
                        {stakedNfts
                          ? stakedNfts?.length + unstakedNfts?.length
                          : unstakedNfts?.length}
                      </>
                    )}
                  </span>
                )}
              </p>
              <button
                className="deploy-all"
                onClick={() => setIsModal(true)}
                disabled={unstakedNfts.length === 0}
              >
                deploy all
              </button>
              <button
                className="claim-all"
                onClick={() => onClaimAll()}
                disabled={isClaimAllLoading}
              >
                {isClaimAllLoading ? (
                  <ClipLoader size={20} color="#fff" />
                ) : (
                  <>claim all</>
                )}
              </button>
            </div>
            <div className="content-right">
              <Link href="https://magiceden.io/marketplace/2d_soldiers">
                <a target="_blank" title="MagicEden">
                  Marketplace <MarketplaceIcon />
                </a>
              </Link>
              <div className="view-switch">
                <button
                  className={router?.query.view === "dense" ? "" : "active"}
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
        <div
          className={
            router?.query?.view === "dense"
              ? "deploy-list deploy-list-dense"
              : "deploy-list"
          }
        >
          {isLoading ? (
            <>
              <DeployItemSkeleton />
              <DeployItemSkeleton />
              <DeployItemSkeleton />
              <DeployItemSkeleton />
            </>
          ) : (
            // <h1 style={{ color: "#fff" }}>Loding...</h1>
            <>
              {stakedNfts &&
                stakedNfts.length !== 0 &&
                stakedNfts.map((item, key) => (
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
              {unstakedNfts &&
                unstakedNfts.length !== 0 &&
                unstakedNfts.map((item, key) => (
                  <DeployItem
                    key={key}
                    nftMint={item.nftMint}
                    uri={item.uri}
                    update={() => updatePage()}
                    status={item.status}
                  />
                ))}
            </>
          )}
        </div>
        <DeployAllModal
          wallet={wallet}
          unstakedNfts={unstakedNfts}
          updatePage={updatePage}
          opened={isModal}
          close={() => setIsModal(false)}
        />
        <Menu />
      </MainPage>
    </>
  );
}

const DeployAllModal = (props: {
  wallet: WalletContextState;
  unstakedNfts: DeployItemType[];
  updatePage: Function;
  opened: boolean;
  close: Function;
}) => {
  const { wallet, unstakedNfts, updatePage } = props;
  const [isAllLoading, setIsAllLoading] = useState(false);
  const [levelId, setLevelId] = useState(0);
  const [showStake, setShowStake] = useState(false);

  const [level, setLevel] = useState(1);

  const handleLevel = (level: number, id: number) => {
    setLevel(level);
    setLevelId(id);
  };
  const update = () => {
    props.updatePage();
    props.close();
  };
  const onDeployAll = async () => {
    try {
      await stakeAllNFT(
        wallet,
        unstakedNfts,
        level,
        () => setIsAllLoading(true),
        () => setIsAllLoading(false),
        () => update()
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowStake = (level: number, id: number) => {
    setLevel(level);
    setLevelId(id);
    setShowStake(true);
  };

  return (
    <Dialog open={props.opened} onClose={() => props.close()}>
      <div className="deploy-all-modal">
        <button className="close-modal" onClick={() => props.close()}>
          <CloseTwoTone />
        </button>
        <div className="item-content">
          <div className="media">
            {/* eslint-disable-next-line */}
            <img
              src="https://img-cdn.magiceden.dev/rs:fill:170:170:0:0/plain/https://dl.airtable.com/.attachmentThumbnails/ddd168539ea9d10a77a9c921639ca3d7/f9862567"
              alt=""
            />
            <div className="media-overlay">
              {/* eslint-disable-next-line */}
              <img
                src="/img/deploy-item-pattern.svg"
                className="pattern"
                alt=""
              />
              <span className="deploy-icon">
                <span
                  style={{
                    transform: showStake ? "rotate(90deg)" : "rotate(0)",
                  }}
                >
                  <DeployIcon />
                </span>
              </span>
            </div>
          </div>
          <div className="set-deploy-item">
            <h5>Stake all Soldiers</h5>
            {!showStake ? (
              <div className="stepper">
                <div className="stepper-option">
                  {DEPLOY_LEVEL.map((item, key) => (
                    <button
                      className={`btn-step ${
                        item.value === level ? "hovered" : ""
                      }`}
                      onClick={() => handleShowStake(item.value, item.id)}
                      onMouseEnter={() => handleLevel(item.value, item.id)}
                      style={{ left: key * 72 }}
                      key={key}
                    >
                      {item.value}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="stepper-action">
                <button
                  className="btn-item-deploy"
                  disabled={isAllLoading}
                  onClick={onDeployAll}
                >
                  {isAllLoading ? (
                    <ClipLoader size={30} color="#fff" />
                  ) : (
                    <>deploy all</>
                  )}
                </button>
                <button
                  className="btn-item-cancel"
                  onClick={() => setShowStake(false)}
                  disabled={isAllLoading}
                >
                  cancel
                </button>
              </div>
            )}
            <p className="option-dec">
              {DEPLOY_LEVEL[levelId].title} ={" "}
              <span>
                <HiveIcon /> {DEPLOY_LEVEL[levelId].option}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
