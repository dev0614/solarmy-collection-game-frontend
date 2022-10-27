import { useWallet } from "@solana/wallet-adapter-react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Badge from "../../components/Me/Badge";
import Menu from "../../components/Menu";
import {
  BattalionDashboardBox,
  LeaderboardState,
  MainPage,
  TopSoldier,
} from "../../components/Widget";
import { LIVE_URL, NETWORK } from "../../config";
import { useUserContext } from "../../context/UserProvider";
import { getTopSoldiers } from "../../solana/server";
import { getBadgeInfo } from "../../solana/utils";

export default function DashboardPage() {
  const router = useRouter();
  const wallet = useWallet();
  const userData = useUserContext();
  const [badgeImage, setBadgeImage] = useState("");
  const getPageData = async () => {
    const { image } = getBadgeInfo(userData.badge);
    setBadgeImage(image);
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
    getTopNfts();
    // eslint-disable-next-line
  }, [wallet.connected, wallet.publicKey]);

  useEffect(() => {
    if (wallet.publicKey) getPageData();
    //   eslint-disable-next-line
  }, [wallet.publicKey, wallet.connected]);
  return (
    <>
      <NextSeo
        title="Solarmy | 2D, 3D Soldier"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et massa massa. Ut mollis posuere risus, convallis laoreet felis pulvinar condimentum. Nam ac lectus ex."
        openGraph={{
          url: `${LIVE_URL}`,
          title: "Solarmy | 2D, 3D Soldier",
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
      <Header />
      <MainPage>
        <div className="dashboard">
          <div className="col-4">
            <Badge
              topLoading={topLoading}
              top2dNft={top2dNft}
              badgeNum={userData.badge}
              top3dNft={top3dNft}
            />
          </div>
          <div className="col-4">
            <LeaderboardState router={router} wallet={wallet} />
          </div>
          <div className="col-4">
            {wallet.publicKey && (
              <BattalionDashboardBox
                router={router}
                wallet={wallet.publicKey.toBase58()}
              />
            )}
          </div>
        </div>
      </MainPage>
      <Menu />
    </>
  );
}
