import type { NextPage } from 'next'
import Head from 'next/head'
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>NFT Christmas Tree</title>
      </Head>

      <main>
        <h1>
          Welcome to NFT Christmas Tree
        </h1>

        <WalletMultiButton />
        <WalletDisconnectButton />
      </main>
    </div>
  )
}

export default Home
