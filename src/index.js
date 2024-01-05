import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  ledgerWallet,
  coinbaseWallet,
  metaMaskWallet,
  okxWallet,
  trustWallet,
  tokenPocketWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, sepolia, hardhat, bscTestnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

const { chains, publicClient } = configureChains(
  [sepolia, hardhat],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY }),
    publicProvider(),
  ]
);

const projectId = process.env.REACT_APP_PROJECTID;

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ projectId, chains }),
      ledgerWallet({
        projectId,
        chains,
        infuraId: process.env.REACT_APP_INFURAID,
      }),
      rainbowWallet({ projectId, chains }),
      walletConnectWallet({
        projectId,
        chains,
      }),
      coinbaseWallet({ appName: "My RainbowKit App", chains }),
      okxWallet({ projectId, chains }),
      tokenPocketWallet({
        projectId,
        chains,
      }),
      trustWallet({ projectId, chains }),
    ],
  },
]);

// const { connectors } = getDefaultWallets({
//   appName: "My RainbowKit App",
//   projectId,
//   chains,
// });

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} initialChain={sepolia}>
        <ToastContainer />
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
