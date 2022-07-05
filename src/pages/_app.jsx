import '../styles/style.scss'
import Wallet from '../components/wallet/Wallet'
import { ToastContainer } from 'react-toastify'
import { useState } from 'react'

function RaffleApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  return (
    <Wallet>
      <Component
        {...pageProps}
        pageLoading={loading}
        startLoading={() => setLoading(true)}
        closeLoading={() => setLoading(false)}
      />
      <ToastContainer
        style={{ fontSize: 15 }}
        pauseOnFocusLoss={false}
      />
    </Wallet>
  )
}

export default RaffleApp
