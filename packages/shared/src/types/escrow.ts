export type EscrowStateString =
  | 'AwaitingFunding'
  | 'Funded'
  | 'AwaitingShipment'
  | 'Shipped'
  | 'AwaitingInspection'
  | 'Accepted'
  | 'Disputed'
  | 'Released'
  | 'PendingReview'
  | 'Cancelled';

export enum EscrowStateEnum {
  AwaitingFunding = 0,
  Funded = 1,
  AwaitingShipment = 2,
  Shipped = 3,
  AwaitingInspection = 4,
  Accepted = 5,
  Disputed = 6,
  Released = 7,
  PendingReview = 8,
  Cancelled = 9,
}

export interface EscrowRecord {
  id: string;
  agreement_id: string;
  escrow_address: string;
  factory_address?: string;
  buyer_address: string;
  supplier_address: string;
  token_address: string;
  amount: string; // BigInt serialized as string (in base units, e.g., 6 decimals for USDC)
  token_symbol: string;
  state: EscrowStateString;
  state_index: number;
  agreement_hash: string;
  funded_at?: string;
  shipped_at?: string;
  inspection_deadline?: string;
  released_at?: string;
  chain_id: number;
  tx_hash?: string;
  created_at: string;
  updated_at: string;
}

export type FundingMethod = 'wallet' | 'bank_transfer';

export type FundingStatus =
  | 'pending'
  | 'fiat_confirmed'
  | 'minting'
  | 'minted'
  | 'depositing'
  | 'deposited'
  | 'failed';

export interface FundingTransaction {
  id: string;
  agreement_id: string;
  user_id: string;
  method: FundingMethod;
  fiat_amount?: number;
  fiat_currency?: string;
  exchange_rate?: number;
  paystack_reference?: string;
  token_amount: number;
  token_symbol: string;
  mint_tx_hash?: string;
  deposit_tx_hash?: string;
  status: FundingStatus;
  created_at: string;
  updated_at: string;
}

export interface PaymentEvent {
  id: string;
  funding_transaction_id?: string;
  provider: 'paystack';
  event_type: string;
  reference: string;
  payload: Record<string, unknown>;
  processed: boolean;
  created_at: string;
}

