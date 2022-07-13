import { useWallet } from "@solana/wallet-adapter-react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { Badge, BattalionDashboardBox, LeaderboardState, MainPage, TopSoldier } from "../../components/Widget";
import { LIVE_URL } from "../../config";

export default function DashboardPage() {
    const router = useRouter();
    const wallet = useWallet();
    return (
        <>
            <NextSeo
                title="Solarmy | 2D, 3D Soldier"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et massa massa. Ut mollis posuere risus, convallis laoreet felis pulvinar condimentum. Nam ac lectus ex."
                openGraph={{
                    url: `${LIVE_URL}`,
                    title: 'Solarmy | 2D, 3D Soldier',
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
            <Header />
            <MainPage>
                <div className="dashboard">
                    <div className="col-4">
                        <Badge title="Sergeant" />
                        <TopSoldier
                            title="Top 2D soldier"
                            image="https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://www.arweave.net/k_sNcVnVUhZOpdLzcwllVKH2uUlz8U90AaiM-86W_Lg?ext=png"
                        />
                        <TopSoldier
                            title="Top 3D soldier"
                            image="https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://www.arweave.net/vjOPZwRMR-NNavdQFaAHBzsH7fs4nMGi3rAYupugozA?ext=png"
                        />
                    </div>
                    <div className="col-4">
                        <LeaderboardState router={router} wallet={wallet} />

                    </div>
                    <div className="col-4">
                        <BattalionDashboardBox router={router} />

                    </div>
                </div>
            </MainPage>
            <Menu />
        </>
    )
}