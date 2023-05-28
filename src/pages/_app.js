import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { mainnet, polygon, optimism, arbitrum, optimismGoerli } from 'wagmi/chains';

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum,optimismGoerli],
  [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

export default function App({ Component, pageProps }) {
  return (
      <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
      <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
