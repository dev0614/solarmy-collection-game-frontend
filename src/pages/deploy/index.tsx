import { NextSeo } from "next-seo";
import Link from "next/link";
import DeployItem from "../../components/Deploy/DeployItem";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { MarketplaceIcon } from "../../components/svgIcons";
import { MainPage } from "../../components/Widget";
import { LIVE_URL } from "../../config";

export default function DeployPage() {

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
                            <p>Soldiers Deployed <span>1/3</span></p>
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
                    <DeployItem
                        id={877}
                        status="complete"
                    />
                    <DeployItem
                        id={877}
                        status="active"
                    />
                    <DeployItem
                        id={877}
                        status="reverse"
                    />
                </div>
                <Menu />
            </MainPage>
        </>
    )
}
