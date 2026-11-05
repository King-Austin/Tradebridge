import { baseSepolia } from 'viem/chains';

export const CHAIN_CONFIG = {
  chain: baseSepolia,
  chainId: 84532,
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'https://sepolia.base.org',
  privyAppId: process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'client-demo-app-id',
};
