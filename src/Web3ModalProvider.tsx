import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

// 1. Get projectId from the user
const projectId = 'dabf0edbc26806537e40d981b7aa844a';

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum Mainnet',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
};

// 3. Create a metadata object
const metadata = {
  name: 'Liaison Protocol',
  description: 'Modular Algorithmic Network Protocol',
  url: 'https://liaison.capital', 
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: 'https://cloudflare-eth.com',
  defaultChainId: 1,
  auth: {
    email: false,
    socials: []
  }
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: true,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#7c3aed',
    '--w3m-color-mix': '#0b0b14',
    '--w3m-color-mix-strength': 40,
    '--w3m-border-radius-master': '12px'
  }
});

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  return children;
}
