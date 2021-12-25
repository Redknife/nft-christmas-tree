import { FC, ReactNode } from 'react';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// Use require instead of import, and order matters
require('../styles/globals.css');
require('@solana/wallet-adapter-react-ui/styles.css');

const WalletConnectionProvider = dynamic<{ children: ReactNode }>(
  () =>
    import('../components/WalletConnectionProvider').then(
      ({ WalletConnectionProvider }) => WalletConnectionProvider
    ),
  {
    ssr: false,
  }
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletConnectionProvider>
      <WalletModalProvider>
        <Component {...pageProps} />
      </WalletModalProvider>
    </WalletConnectionProvider>
  );
}

export default MyApp;
