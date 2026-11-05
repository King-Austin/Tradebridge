'use client';

import * as React from 'react';
import { Wallet, ShieldCheck, ExternalLink, ArrowDownLeft, ArrowUpRight, Copy, CheckCircle2, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WalletConnectButton } from '@/components/layout/wallet-connect-button';
import { usePrivy } from '@privy-io/react-auth';
import { formatCurrency, formatNaira, shortenAddress } from '@/lib/utils';

export default function WalletPage() {
  const { authenticated, user, login } = usePrivy();
  const isConnected = authenticated && !!user?.wallet?.address;
  const address = user?.wallet?.address || '0x3Ae9212B5B1e309a7C2A437Df9C3EF6ae059dEc4';

  const [copiedContract, setCopiedContract] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedContract(key);
    setTimeout(() => setCopiedContract(null), 2000);
  };

  const factoryAddress = '0x3593274775A9812BCa91dA1a6957A520509c5048';
  const tokenAddress = '0xca6ACc0da807d2f615861A5d8DB87010B1538ac5';

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-parchment-border pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-obsidian font-serif">
            Settlement Wallet & Rails
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Base Sepolia EVM embedded wallets (Privy) and Providus Virtual NGN accounts for escrow operations.
          </p>
        </div>
        <WalletConnectButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Balances (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          {/* Web3 Stablecoin Balance Obsidian Card */}
          <div className="bg-obsidian text-alabaster rounded-3xl p-6 sm:p-7 border border-[#262421] shadow-xs space-y-3">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-sans">
              <span className="uppercase font-bold text-amberGold tracking-wider">BASE SEPOLIA ESCROW BALANCE</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>

            <div>
              <div className="text-3xl font-bold text-white font-mono">
                $25,000.00 <span className="text-xs text-slate-400 font-sans">USDC</span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-1 font-mono">
                ≈ {formatNaira(25000 * 1650)} (@ ₦1,650/$)
              </span>
            </div>

            <div className="bg-[#1C1A17] p-3.5 rounded-2xl border border-[#2C2A26] text-xs space-y-1">
              <span className="text-slate-400 text-[10px] block font-sans uppercase">ACTIVE EVM WALLET:</span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-200 break-all">{address}</span>
              </div>
              <span className="text-[10px] text-amberGold block pt-1 font-sans">
                Embedded Wallet Powered by Privy (EIP-1193 / Base L2)
              </span>
            </div>
          </div>

          {/* Local Fiat Rail Box */}
          <div className="bg-white border border-parchment-border rounded-3xl p-6 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 pb-2.5 border-b border-parchment-border">
              <Building2 className="h-5 w-5 text-amberGold" />
              <span className="font-serif font-bold text-obsidian text-sm">
                Local Fiat Collection Rail (Nigeria)
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-700 font-mono">
              <div className="flex justify-between py-1 border-b border-parchment-border">
                <span className="text-slate-400 font-sans">PARTNER BANK:</span>
                <span className="font-bold text-obsidian">Providus Bank</span>
              </div>
              <div className="flex justify-between py-1 border-b border-parchment-border">
                <span className="text-slate-400 font-sans">VIRTUAL ACCOUNT:</span>
                <span className="font-bold text-obsidian">9912048591</span>
              </div>
              <div className="flex justify-between py-1 border-b border-parchment-border">
                <span className="text-slate-400 font-sans">ACCOUNT NAME:</span>
                <span className="font-bold text-obsidian">TradeGuard / Chidi Okafor</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-sans">CONVERSION PIPELINE:</span>
                <span className="font-bold text-emeraldSeal font-sans">Instant to MockUSDC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Deployed Smart Contracts on Base Sepolia (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white border border-parchment-border rounded-3xl shadow-2xs overflow-hidden">
            <div className="bg-obsidian text-alabaster px-6 py-4 flex items-center justify-between">
              <span className="font-sans font-bold text-xs uppercase tracking-wider text-amberGold">
                VERIFIED BASE SEPOLIA SMART CONTRACTS
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-[#24221E] px-2.5 py-0.5 rounded-full border border-[#38352F]">
                NETWORK ID: 84532
              </span>
            </div>

            <div className="p-6 space-y-4">
              {/* MockUSDC Contract */}
              <div className="border border-parchment-border rounded-2xl p-4 bg-parchment-soft space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-serif font-bold text-obsidian text-sm block">MockUSDC ERC-20 Token</span>
                    <span className="text-[11px] text-slate-500 font-sans">
                      Standard 6 decimals ERC-20 stablecoin for trade settlement
                    </span>
                  </div>
                  <span className="bg-white border border-parchment-border text-obsidian text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                    6 DECIMALS
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-parchment-border">
                  <span className="font-mono text-xs font-bold text-obsidian break-all">{tokenAddress}</span>
                  <button
                    onClick={() => copyToClipboard(tokenAddress, 'token')}
                    className="ml-2 text-slate-400 hover:text-obsidian p-1"
                    title="Copy Address"
                  >
                    {copiedContract === 'token' ? (
                      <CheckCircle2 className="h-4 w-4 text-emeraldSeal" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-0.5 font-sans">
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                  <a
                    href={`https://sepolia.basescan.org/address/${tokenAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-amberGold-text font-semibold"
                  >
                    View on BaseScan Sepolia Explorer ↗
                  </a>
                </div>
              </div>

              {/* TradeLockFactory Contract */}
              <div className="border border-parchment-border rounded-2xl p-4 bg-parchment-soft space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-serif font-bold text-obsidian text-sm block">TradeLockFactory Contract</span>
                    <span className="text-[11px] text-slate-500 font-sans">
                      Autonomous factory deploying individual smart contract escrows per commercial invoice
                    </span>
                  </div>
                  <span className="bg-white border border-parchment-border text-obsidian text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                    FACTORY v1.0
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-parchment-border">
                  <span className="font-mono text-xs font-bold text-obsidian break-all">{factoryAddress}</span>
                  <button
                    onClick={() => copyToClipboard(factoryAddress, 'factory')}
                    className="ml-2 text-slate-400 hover:text-obsidian p-1"
                    title="Copy Address"
                  >
                    {copiedContract === 'factory' ? (
                      <CheckCircle2 className="h-4 w-4 text-emeraldSeal" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-0.5 font-sans">
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                  <a
                    href={`https://sepolia.basescan.org/address/${factoryAddress}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline text-amberGold-text font-semibold"
                  >
                    View on BaseScan Sepolia Explorer ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
