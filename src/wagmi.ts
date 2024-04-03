import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import {
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { arbitrum, polygon, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { getParticleOptions, ParticleAuthConnector } from "@/particleConnector";

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string;
const walletConnectProjectId = "38fd2c2ab67071c96266c66680145e74";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygon],
  [
    alchemyProvider({
      apiKey: alchemyKey,
    }),
    publicProvider(),
  ],
);

const { wallets } = getDefaultWallets({
  appName: "Account Center",
  chains,
  projectId: walletConnectProjectId,
});

const walletListConnectors = connectorsForWallets([...wallets]);

const _injectedConnector = new InjectedConnector({
  chains: chains,
  options: {
    name: "Injected",
  },
});

const _metaMaskConnector = new MetaMaskConnector({ chains: chains });

let _userInfo = null;
let _particleConnector: ParticleAuthConnector = new ParticleAuthConnector({
  options: getParticleOptions(),
});
if (typeof window !== "undefined") {
  _particleConnector = new ParticleAuthConnector({
    options: getParticleOptions(),
    loginOptions: {
      preferredAuthType: "jwt",
      account:
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImFtYnJ1c19hY2NvdW50X2NlbnRlciJ9.eyJzdWIiOiI5YjA4Yjg4Zi1mYzdlLTQ5NTctYjQ3Mi1mNGI4ZWRmNTY5ZmMiLCJpYXQiOjE3MTIwNDA5NDUsImV4cCI6MTcxMjY0NTc0NX0.KL-X_Y3sQArLB6LmCkkKXepQf-vcUD_rSHCamq5fhHpK3Cjg3iUfeB4R-ZnUK-AV7GzImBv7GE3zPlgxy8y3S4AI4G67-fKeYvzJtE0X_taTLtcKpQTF2Cm_K7z--V0Ts5wXTD-HFV7ug-PBlhlQCWTwNGzb5Yx4mbsvB9qCVNb_Tp3oYpTBE0gQGb-5UHxy8szauSUjLLlLeG5INg5Kx3DEgpH9s_lofaFvEIzJf3SeTf-7HitqwyidY0JpLPiBn-vLh6Bo5vG3OFAqiDoRlmUGEUcVjwMncC6PyMpR9WvNSp2gGrjZVnwEzuArxclNl03OeNEMF_Ty2XBDOenzHA",
    },
  });
  debugger;
}

const connectors = () => [
  ...walletListConnectors(),
  _injectedConnector,
  _particleConnector,
  _metaMaskConnector,
];

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains };
