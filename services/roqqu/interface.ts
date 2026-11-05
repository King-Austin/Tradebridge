import {
  RoqquWalletBalance,
  RoqquDepositAddressRequest,
  RoqquDepositAddressResponse,
  RoqquFiatDepositRequest,
  RoqquFiatDepositResponse,
  RoqquCryptoTransferRequest,
  RoqquCryptoTransferResponse,
} from './types';

/**
 * Service adapter interface isolating Roqqu crypto infrastructure.
 * Ensures the platform can swap between mock testing and verified production integration seamlessly.
 */
export interface IRoqquService {
  getBalance(currency: string): Promise<RoqquWalletBalance>;
  generateDepositAddress(req: RoqquDepositAddressRequest): Promise<RoqquDepositAddressResponse>;
  initiateFiatOnRamp(req: RoqquFiatDepositRequest): Promise<RoqquFiatDepositResponse>;
  executeTransfer(req: RoqquCryptoTransferRequest): Promise<RoqquCryptoTransferResponse>;
  verifyTransaction(reference: string): Promise<{ confirmed: boolean; status: string; details?: unknown }>;
}

