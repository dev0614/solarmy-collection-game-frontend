import '../styles/style.scss'
import Wallet from '../components/wallet/Wallet'
import { ToastContainer } from 'react-toastify'
import { useEffect, useState } from 'react'
import { UserProvider } from '../context/UserProvider';
import { useRouter } from 'next/router';
import PageLoading from '../components/PageLoading';

function RaffleApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && router.pathname !== "/bunker") {
      localStorage.setItem("last-page", router.asPath)
    }
  }, [router])
  return (
    <Wallet>
      <UserProvider>
        <Component
          {...pageProps}
          pageLoading={loading}
          loadingLabel={loadingLabel}
          startLoading={() => setLoading(true)}
          closeLoading={() => setLoading(false)}
          setLoadingLoabel={(e) => setLoadingLabel(e)}
        />
        <ToastContainer
          style={{ fontSize: 15 }}
          pauseOnFocusLoss={false}
        />
        <PageLoading loading={loading} label={loadingLabel} />
      </UserProvider>
    </Wallet>
  )
}

export default RaffleApp
