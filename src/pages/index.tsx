import { NextSeo } from "next-seo";
import { LIVE_URL } from "../config";

export default function HomePage(props: {
  startLoading: Function,
  closeLoading: Function,
  pageLoading: boolean
}) {

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
      <main>
      </main>
    </>
  )
}
