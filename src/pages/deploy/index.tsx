import Link from "next/link";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { MarketplaceIcon } from "../../components/svgIcons";
import { MainPage } from "../../components/Widget";

export default function DeployPage() {

    return (
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
            <Menu />
        </MainPage>
    )
}
