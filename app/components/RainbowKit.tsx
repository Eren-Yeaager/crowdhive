"use client";
import "@rainbow-me/rainbowkit/styles.css";
import React, { ReactNode } from "react";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
interface RainbowKitProps {
  children: ReactNode;
}
const projectId = process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID || "";
const queryClient = new QueryClient();
const config = getDefaultConfig({
  appName: "CrowdHive",
  projectId: projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});
export default function RainbowKit({ children }: RainbowKitProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
