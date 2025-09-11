import { getDefaultWallets, getDefaultConfig } from "@rainbow-me/rainbowkit"
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets"
import {
  arbitrum,
  arbitrumSepolia,
  localhost,
  mainnet,
} from "wagmi/chains"

const { wallets } = getDefaultWallets()

export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "demo-project-id"
export const config = getDefaultConfig({
  appName: "Focus0x",
  projectId: WALLETCONNECT_PROJECT_ID,
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [
    mainnet,
    arbitrumSepolia,
    arbitrum,
    localhost,
  ],
  ssr: true,
})
