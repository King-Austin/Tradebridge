export interface RoqquWalletBalance {
  currency: string;
  balance: number;
  locked: number;
  available: number;
}

export interface RoqquDepositAddressRequest {
  currency: string;
  network?: string;
  user_identifier: string;
}

export interface RoqquDepositAddressResponse {
  address: string;
  network: string;
  memo?: string;
  qr_code_url?: string;
}

export interface RoqquFiatDepositRequest {
  amount: number;
  currency: 'NGN';
  email: string;
  reference: string;
}

export interface RoqquFiatDepositResponse {
  reference: string;
  checkout_url?: string;
  status: 'pending' | 'success' | 'failed';
}

export interface RoqquCryptoTransferRequest {
  recipient_address: string;
  amount: number;
  token_symbol: string;
  network: string;
  reference: string;
}

export interface RoqquCryptoTransferResponse {
  tx_hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  fee: number;
}

