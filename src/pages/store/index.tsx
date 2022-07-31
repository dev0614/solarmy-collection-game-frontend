import { NextSeo } from "next-seo";
import Header from "../../components/Header";
import { MainPage } from "../../components/Widget";
import { LIVE_URL } from "../../config";

export default function StorePage() {
    return (
        <>
            <NextSeo
                title="Bunker | Deposit and Withdraw $AMMO"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et massa massa. Ut mollis posuere risus, convallis laoreet felis pulvinar condimentum. Nam ac lectus ex."
                openGraph={{
                    url: `${LIVE_URL}`,
                    title: 'Bunker | Deposit and Withdraw $AMMO',
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
            <Header back={{ title: "Store", backUrl: "/dashboard" }} />
            <MainPage>
                <div className="store-page">
                    <div className="plan">
                        <div className="plan-content">
                            <div className="plan-media">
                                {/* eslint-disable-next-line */}
                                <img
                                    src="/img/store/field.jpg"
                                    alt=""
                                />
                            </div>
                            <p className="plan-label">Field Grade Loot Create</p>
                            <p className="plan-description">Regular crate with no chance of a transcendental attribute</p>
                            <div className="plan-ammo">
                                <span>AMMO</span>
                                <span>500</span>
                            </div>
                            <button className="btn-buy">
                                Buy
                            </button>
                        </div>
                    </div>
                    <div className="plan">
                        <div className="plan-content">
                            <div className="plan-media">
                                {/* eslint-disable-next-line */}
                                <img
                                    src="/img/store/company.jpg"
                                    alt=""
                                />
                            </div>
                            <p className="plan-label">Field Grade Loot Create</p>
                            <p className="plan-description">Guaranteed universal attribute and chance of a transcendental attribute.</p>
                            <div className="plan-ammo">
                                <span>AMMO</span>
                                <span>1500</span>
                            </div>
                            <button className="btn-buy">
                                Buy
                            </button>
                        </div>
                    </div>
                    <div className="plan">
                        <div className="plan-content">
                            <div className="plan-media">
                                {/* eslint-disable-next-line */}
                                <img
                                    src="/img/store/elite.jpg"
                                    alt=""
                                />
                            </div>
                            <p className="plan-label">Field Grade Loot Create</p>
                            <p className="plan-description">Guaranteed universal attribute and chance transcendental attribute.</p>
                            <div className="plan-ammo">
                                <span>AMMO</span>
                                <span>3000</span>
                            </div>
                            <button className="btn-buy">
                                Buy
                            </button>
                        </div>
                    </div>
                </div>
            </MainPage>
        </>
    )
}