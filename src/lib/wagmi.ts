import { http, createConfig } from 'wagmi';
import { mantleSepoliaTestnet } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

export const config = createConfig({
  chains: [mantleSepoliaTestnet],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mantleSepoliaTestnet.id]: http(),
  },
});
