'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Anchor,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Lock,
  ArrowRight,
  Clock,
  Wallet,
  ExternalLink,
} from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { formatCurrency, shortenAddress } from '@/lib/utils';

export default function SupplierInvitePage({ params }: { params: { token: string } }) {
  const { authenticated, user, login } = usePrivy();
  const [accepted, setAccepted] = React.useState(false);
  const [isSigning, setIsSigning] = React.useState(false);

  const trade = {
    referenceCode: 'TG-2026-0849',
    buyerName: 'Chidi Okafor (Lagos Auto Parts & Logistics Ltd)',
    buyerLocation: 'Lagos, Nigeria',
    productDescription: '500 Sets of Ceramic Brake Pads (Front & Rear) for Toyota Hilux',
    quantity: 500,
    unit: 'SETS',
    amountUSD: 7500.0,
    deliveryTerms: 'CIF Apapa Port, Lagos',
    shippingMethod: 'Sea Freight (FCL Container)',
    inspectionPeriodDays: 7,
    specialConditions: 'Manufacturer ISO 9001 and SONCAP import certification required.',
    escrowFactory: '0x3593274775A9812BCa91dA1a6957A520509c5048',
    network: 'Base Sepolia (Ethereum L2)',
  };

  const handleSignAgreement = () => {
    if (!authenticated) {
      login();
      return;
    }

    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setAccepted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col justify-center py-12 px-4 sm:px-6 font-sans text-xs text-obsidian selection:bg-amberGold selection:text-obsidian">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        {/* Brand / Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-obsidian text-amberGold shadow-md mb-2">
            <Anchor className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-obsidian font-serif">
            TradeGuard Counterparty Invitation
          </h1>
          <p className="text-xs text-slate-500 font-sans">
            Smart-Contract-Secured Cross-Border Commercial Proforma
          </p>
        </div>

        {/* Commercial Invoice Manifest Card */}
        <div className="bg-white border border-parchment-border rounded-3xl shadow-sm overflow-hidden">
          {/* Header Bar */}
          <div className="bg-obsidian text-alabaster px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amberGold animate-pulse" />
              <span className="font-sans font-bold text-xs uppercase tracking-wider text-amberGold">
                PROFORMA INVOICE: {trade.referenceCode}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              NETWORK: {trade.network}
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Importer / Supplier Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-parchment-soft p-5 rounded-2xl border border-parchment-border text-xs font-sans">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block">
                  ISSUING IMPORTER (NIGERIA)
                </span>
                <span className="font-bold text-obsidian text-sm block mt-0.5">{trade.buyerName}</span>
                <span className="text-slate-500 text-xs block mt-0.5">{trade.buyerLocation}</span>
              </div>
              <div className="md:border-l md:border-parchment-border md:pl-4">
                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider block">
                  ESCROW PROTECTION
                </span>
                <span className="font-bold text-emeraldSeal text-sm block mt-0.5">
                  100% Locked Prior to Factory Dispatch
                </span>
                <span className="text-slate-500 text-xs block mt-0.5">
                  Funds held in smart contract until delivery confirmation
                </span>
              </div>
            </div>

            {/* Cargo Manifest */}
            <div className="border border-parchment-border rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-parchment-soft text-slate-600 font-bold border-b border-parchment-border text-[11px]">
                  <tr>
                    <th className="py-3 px-4">CARGO DESCRIPTION</th>
                    <th className="py-3 px-4">QTY</th>
                    <th className="py-3 px-4">TERMS</th>
                    <th className="py-3 px-4 text-right">TOTAL ESCROW VALUE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-parchment-border">
                  <tr>
                    <td className="py-4 px-4">
                      <span className="font-bold text-obsidian block text-xs">{trade.productDescription}</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{trade.specialConditions}</span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-obsidian">
                      {trade.quantity} {trade.unit}
                    </td>
                    <td className="py-4 px-4 text-slate-700">
                      <span className="block font-semibold">{trade.deliveryTerms}</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{trade.shippingMethod}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold font-mono text-sm text-obsidian block">
                        {formatCurrency(trade.amountUSD)}
                      </span>
                      <span className="text-[10px] text-emeraldSeal font-bold block uppercase tracking-wider">USDC SETTLEMENT</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Terms & Conditions Box */}
            <div className="bg-parchment-soft p-4 rounded-2xl border border-parchment-border text-xs space-y-2">
              <span className="font-bold uppercase text-slate-700 text-[10px] tracking-wider block">
                SMART CONTRACT DISBURSEMENT RULES
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-600 font-sans text-xs leading-relaxed">
                <li>Buyer deposits local NGN converted automatically to <strong>{formatCurrency(trade.amountUSD)} USDC</strong> in contract escrow.</li>
                <li>Supplier receives on-chain notification of locked funds before releasing cargo to freight forwarder.</li>
                <li>Supplier submits Bill of Lading (BOL) hash proof to arm the <strong>{trade.inspectionPeriodDays}-day post-discharge inspection window</strong>.</li>
                <li>Funds automatically release to supplier wallet upon delivery confirmation.</li>
              </ul>
            </div>

            {/* Wallet State / Action Box */}
            {accepted ? (
              <div className="p-5 bg-emeraldSeal-tint border border-emeraldSeal/30 rounded-2xl text-emeraldSeal space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm font-sans">
                  <CheckCircle2 className="h-5 w-5 text-emeraldSeal" />
                  <span>COMMERCIAL INVOICE ACCEPTED & COUNTERSIGNED</span>
                </div>
                <p className="text-xs font-sans text-emeraldSeal/90 leading-relaxed">
                  Your cryptographic signature has been recorded. The buyer (Chidi Okafor) has been notified to deposit NGN into the Providus Virtual Rail. You will receive an alert once $7,500 USDC is locked in the contract.
                </p>
                <div className="pt-1">
                  <Link
                    href={`/trades/t0000000-0000-0000-0000-000000000001`}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emeraldSeal hover:bg-[#186846] text-white font-sans font-bold text-xs rounded-full transition-colors"
                  >
                    <span>ENTER TRADE CONTROL BOARD →</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-obsidian text-alabaster p-6 rounded-2xl space-y-4 border border-[#2C2A26]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2C2A26] pb-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-amberGold" />
                    <span className="font-bold text-xs font-sans">
                      {authenticated ? `AUTHENTICATED: ${shortenAddress(user?.wallet?.address || '0x4a2...1b')}` : 'SUPPLIER EMBEDDED WALLET'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    POWERED BY PRIVY (ZERO SEED PHRASE REQUIRED)
                  </span>
                </div>

                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  By clicking accept, you authenticate via Privy and bind this agreement to your embedded wallet on Base Sepolia.
                </p>

                <div className="flex items-center justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleSignAgreement}
                    disabled={isSigning}
                    className="rounded-full bg-amberGold hover:bg-amberGold-hover text-obsidian font-sans font-bold text-xs px-7 py-3 shadow-md transition-all hover:scale-[1.01]"
                  >
                    {isSigning
                      ? 'SIGNING ON-CHAIN AGREEMENT...'
                      : authenticated
                      ? 'ACCEPT & COUNTERSIGN INVOICE →'
                      : 'CONNECT WALLET & ACCEPT INVOICE →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-slate-400 text-[11px] font-mono">
          TradeGuard Autonomous Escrow Protocol // Base Sepolia Contract Factory 0x3593274775A9812BCa91dA1a6957A520509c5048
        </div>
      </div>
    </div>
  );
}
