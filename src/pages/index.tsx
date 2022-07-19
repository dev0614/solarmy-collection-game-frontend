import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { DeveloperIcon } from "../components/svgIcons";
import { LIVE_URL } from "../config";

export default function HomePage(props: {
  startLoading: Function,
  closeLoading: Function,
  pageLoading: boolean
}) {
  const router = useRouter();
  useEffect(() => {
    router.push("/deploy");
    // eslint-disable-next-line
  }, [])
  return (
    <>
      <NextSeo
        title="Solarmy | NFT Collection Game"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus et massa massa. Ut mollis posuere risus, convallis laoreet felis pulvinar condimentum. Nam ac lectus ex."
        openGraph={{
          url: `${LIVE_URL}`,
          title: 'Solarmy | NFT Collection Game',
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
      <main className="login-page">
        {/* eslint-disable-next-line */}
        <img
          src="/img/login-bg.jpg"
          alt=""
          className="login-bg"
        />
        {/* eslint-disable-next-line */}
        <img
          src="/img/login-guys.png"
          alt=""
          className="login-guys"
        />
        <div className="login-box">
          {/* eslint-disable-next-line */}
          <img
            src="/img/login-logo.svg"
            className="login-logo"
            alt=""
          />
          <div className="logo-text">
            {/* eslint-disable-next-line */}
            <img
              src="/img/logo-wordmark.svg"
              alt=""
            />
          </div>
          <div className="wallet-connect">
            <button className="btn-wallet">
              <DeveloperIcon />
              <span>connect wallet</span>
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
