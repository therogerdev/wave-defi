"use client";
import { defineChain } from "viem";
import { WagmiProvider, createConfig, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

export const localhost = defineChain({
  id: 31337, // Hardhat Localhost ChainID
  name: "Hardhat Localhost",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
});

export const config = createConfig(
  getDefaultConfig({
    chains: [localhost, sepolia],
    transports: {
      [localhost.id]: http("http://127.0.0.1:8545/"),
      [sepolia.id]: http(),
    },
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",

    appName: "WaveDeFi",
    appDescription: "WaveDeFi",
    appUrl: "https://wavedefi.xyz",
    appIcon: "/wavedefi-logo-nobg.png",
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-font-family": "var(--font-noto-sans)",
            "--ck-font-family-mono": "var(--font-noto-sans-mono)",
            "--ck-overlay-background": "rgba(255, 255, 255, 0.8)",
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
