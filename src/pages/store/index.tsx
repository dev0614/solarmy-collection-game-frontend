import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import PlanItem from "../../components/Store/PlanItem";
import { MainPage } from "../../components/Widget";
import { LIVE_URL } from "../../config";
import Menu from "../../components/Menu";

export default function StorePage() {
    const router = useRouter();
    const [lastPage, setLastPage] = useState<string | null>("/dashboard");
    useEffect(() => {
        if (typeof window !== "undefined") {
            setLastPage(localStorage.getItem("last-page"))
        }
    }, [router])
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
            <Header back={{ title: "Store", backUrl: lastPage }} />
            <MainPage>
                <div className="store-page">
                    <PlanItem id={1} />
                    <PlanItem id={2} />
                    <PlanItem id={3} />
                </div>
            </MainPage>
            <Menu />
        </>
    )
}