import { TradeStatus } from '../types/trade';

export const TRADE_STATUS_LABELS: Record<TradeStatus, string> = {
  draft: 'Draft',
  pending_supplier: 'Pending Supplier Review',
  pending_buyer: 'Pending Buyer Approval',
  approved: 'Terms Approved',
  funded: 'Escrow Funded',
  in_progress: 'In Fulfilment',
  completed: 'Settled & Completed',
  disputed: 'Dispute Raised',
  cancelled: 'Cancelled',
};

export const SUPPORTED_PAYMENT_ASSETS = [
  { symbol: 'USDC', name: 'USD Coin', decimals: 6, network: 'Base Sepolia' },
  { symbol: 'mUSDC', name: 'Mock USDC', decimals: 6, network: 'Base Sepolia' },
] as const;

export const BASE_SEPOLIA_CHAIN_ID = 84532;

