import { IRoqquService } from './interface';
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
 * Mock Roqqu adapter for local development and testnet MVP demonstration.
 * Simulates wallet and settlement responses cleanly.
 */
export class MockRoqquAdapter implements IRoqquService {
  async getBalance(currency: string): Promise<RoqquWalletBalance> {
    return {
      currency,
      balance: 100_000,
      locked: 0,
      available: 100_000,
    };
  }

  async generateDepositAddress(req: RoqquDepositAddressRequest): Promise<RoqquDepositAddressResponse> {
    return {
      address: `0xMockRoqquAddressFor${req.user_identifier.slice(0, 8)}`,
      network: req.network || 'base-sepolia',
      qr_code_url: 'https://placeholder.tradeguard.ng/qr-demo.png',
    };
  }

  async initiateFiatOnRamp(req: RoqquFiatDepositRequest): Promise<RoqquFiatDepositResponse> {
    return {
      reference: req.reference,
      checkout_url: `https://checkout.roqqu.demo/pay/${req.reference}`,
      status: 'pending',
    };
  }

  async executeTransfer(req: RoqquCryptoTransferRequest): Promise<RoqquCryptoTransferResponse> {
    return {
      tx_hash: `0xmocktxhash${Date.now()}${Math.floor(Math.random() * 10000)}`,
      status: 'confirmed',
      fee: 0.5,
    };
  }

  async verifyTransaction(reference: string): Promise<{ confirmed: boolean; status: string; details?: unknown }> {
    return {
      confirmed: true,
      status: 'success',
      details: { reference, timestamp: new Date().toISOString(), simulated: true },
    };
  }
}

