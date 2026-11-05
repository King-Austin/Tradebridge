'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  ShieldCheck,
  Building2,
  Wallet,
  ArrowRight,
  Truck,
  Scale,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { openPaystackPayment } from '@/lib/paystack/client';
import { usePrivy } from '@privy-io/react-auth';
import { formatCurrency, formatNaira, shortenAddress } from '@/lib/utils';

export default function TradeControlBoardPage({
  params,
}: {
  params: { id: string };
}) {
  const { authenticated, user, login } = usePrivy();

  // Trade State
  const [fiatMode, setFiatMode] = React.useState<'virtual' | 'paystack'>('virtual');
  const [fiatStatus, setFiatStatus] = React.useState<'pending' | 'received'>('pending');
  const [escrowStatus, setEscrowStatus] = React.useState<'awaiting' | 'locking' | 'locked'>('awaiting');
  const [isCopied, setIsCopied] = React.useState(false);

  // Live Audit Timeline Log
  const [logs, setLogs] = React.useState([
    {
      time: '21:16:40',
      text: 'TradeLockFactory deployed on Base Sepolia (0x3593274775A9812BCa91dA1a6957A520509c5048)',
      tag: 'ON_CHAIN',
    },
    {
      time: '21:10:12',
      text: 'AI Engine verified Customs Duty Schedule (HS: 8708.30.00, SONCAP Mandatory)',
      tag: 'AI_AUDIT',
    },
    {
      time: '20:45:00',
      text: 'Supplier Wei Zhang accepted commercial invoice terms via token link',
      tag: 'CONTRACT',
    },
  ]);

  // Operational Parameters
  const trade = {
    referenceCode: 'TG-2026-0849',
    productTitle: '500 Sets Ceramic Brake Pads for Toyota Hilux',
    counterparty: 'Wei Zhang (Shenzhen Precision Machinery Co.)',
    terms: 'CIF Apapa Port, Lagos',
    amountUSD: 7500,
    rateNGN: 1650,
    get totalNGN() {
      return this.amountUSD * this.rateNGN;
    },
    factoryAddress: '0x3593274775A9812BCa91dA1a6957A520509c5048',
    tokenAddress: '0xca6ACc0da807d2f615861A5d8DB87010B1538ac5',
    escrowInstance: '0xca89920194bc02847291a928473910c82937102a',
    virtualAccount: '9912048591',
    virtualBank: 'Providus Bank / TradeGuard Virtual Rail',
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(trade.virtualAccount);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSimulateFiatDeposit = () => {
    setFiatStatus('received');
    const now = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [
      {
        time: now,
        text: `Providus Virtual Rail inbound ₦${trade.totalNGN.toLocaleString()} confirmed. TradeLock prepared for Privy lock.`,
        tag: 'FIAT_HOOK',
      },
      ...prev,
    ]);
  };

  const handleLaunchPaystack = () => {
    openPaystackPayment({
      email: 'chidi@lagosautoparts.ng',
      amountKobo: Math.round(trade.totalNGN * 100),
      reference: `TG_PAY_${Date.now()}`,
      metadata: {
        tradeId: params.id,
        referenceCode: trade.referenceCode,
        amountUSD: trade.amountUSD,
      },
      onSuccess: (ref) => {
        setFiatStatus('received');
        const now = new Date().toTimeString().split(' ')[0];
        setLogs((prev) => [
          {
            time: now,
            text: `Paystack transaction confirmed (${ref.reference}). 7,500 mUSDC minted to escrow rail.`,
            tag: 'PAYSTACK',
          },
          ...prev,
        ]);
      },
      onClose: () => {},
    });
  };

  const handleTriggerPrivySign = async () => {
    if (!authenticated) {
      login();
      return;
    }

    setEscrowStatus('locking');
    setTimeout(() => {
      setEscrowStatus('locked');
      const now = new Date().toTimeString().split(' ')[0];
      setLogs((prev) => [
        {
          time: now,
          text: `Privy signed TradeLock.fund(). 7,500.00 mUSDC locked on Base Sepolia. Supplier notified to dispatch cargo.`,
          tag: 'ON_CHAIN',
        },
        ...prev,
      ]);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. Cockpit Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-parchment-border bg-white p-4 sm:p-6 rounded-3xl shadow-2xs">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold text-amberGold-text bg-amberGold-tint px-2.5 py-0.5 rounded-full border border-amberGold/30">
              TRADE CONTROL BOARD
            </span>
            <span className="font-mono font-bold text-xs sm:text-sm text-obsidian">
              #{trade.referenceCode}
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <h1 className="font-serif text-base sm:text-lg font-bold text-obsidian">
              {trade.productTitle}
            </h1>
          </div>
          <div className="text-xs text-slate-500 font-sans mt-1.5">
            Supplier: <strong className="text-obsidian font-semibold">{trade.counterparty}</strong> • Port: <strong className="text-obsidian font-semibold">{trade.terms}</strong>
          </div>
        </div>

        {/* Financial Header Numbers & Sub-page Navigation */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 justify-between sm:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-parchment-border">
          <div className="text-left sm:text-right border-r border-parchment-border pr-3 sm:pr-4">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Target Escrow</span>
            <span className="font-mono text-sm sm:text-base font-bold text-obsidian">
              {formatCurrency(trade.amountUSD)} USDC
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/trades/${params.id}/shipment`}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-parchment-border bg-parchment-soft text-xs font-sans font-bold text-obsidian hover:bg-[#E3DDD1] transition-colors"
            >
              <Truck className="h-3.5 w-3.5 text-slate-600" />
              <span>Shipments</span>
            </Link>

            <Link
              href={`/trades/${params.id}/dispute`}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-parchment-border bg-parchment-soft text-xs font-sans font-bold text-obsidian hover:bg-[#E3DDD1] transition-colors"
            >
              <Scale className="h-3.5 w-3.5 text-slate-600" />
              <span>Disputes</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Milestone Stepper Strip */}
      <div className="border border-[#262421] bg-obsidian text-alabaster p-4 rounded-3xl font-mono text-xs overflow-x-auto select-none shadow-sm">
        <div className="flex items-center justify-between min-w-[700px] px-3">
          <div className="flex items-center gap-1.5 text-emeraldSeal font-bold">
            <CheckCircle2 className="h-4 w-4" />
            <span>1. AI Audit</span>
          </div>
          <span className="text-slate-600">==&gt;</span>

          <div className="flex items-center gap-1.5 text-emeraldSeal font-bold">
            <CheckCircle2 className="h-4 w-4" />
            <span>2. Invoice Signed</span>
          </div>
          <span className="text-slate-600">==&gt;</span>

          <div className={`flex items-center gap-2 font-bold ${
            escrowStatus === 'locked' ? 'text-emeraldSeal' : 'text-amberGold animate-pulse'
          }`}>
            <span className="h-2 w-2 rounded-full bg-amberGold" />
            <span>3. Fund Escrow</span>
          </div>
          <span className="text-slate-600">==&gt;</span>

          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <span>[ ] 4. Shipped</span>
          </div>
          <span className="text-slate-600">==&gt;</span>

          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <span>[ ] 5. Inspected</span>
          </div>
          <span className="text-slate-600">==&gt;</span>

          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <span>[ ] 6. Released</span>
          </div>
        </div>
      </div>

      {/* 3. Interactive Split Panel (Left 60% | Right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: 60% Width (Col span 7) — Local Fiat Payment Tracking */}
        <div className="lg:col-span-7 border border-parchment-border bg-white rounded-3xl p-6 md:p-8 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-parchment-border pb-3.5">
            <div className="flex items-center gap-2.5">
              <Building2 className="h-5 w-5 text-amberGold" />
              <div>
                <span className="font-serif text-base font-bold text-obsidian block">
                  Local Fiat Payment Tracking
                </span>
                <span className="font-mono text-[10px] text-slate-400 block uppercase">
                  Nigeria Banking Rail
                </span>
              </div>
            </div>

            {/* Status Chip */}
            {fiatStatus === 'received' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emeraldSeal-tint text-emeraldSeal border border-emeraldSeal/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emeraldSeal" />
                RECEIVED (MOCK)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amberGold-tint text-amberGold-text border border-amberGold/30">
                <span className="h-1.5 w-1.5 rounded-full bg-amberGold animate-pulse" />
                AWAITING FIAT TRANSFER
              </span>
            )}
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 text-xs font-sans">
            <button
              type="button"
              onClick={() => setFiatMode('virtual')}
              className={`py-2 px-4 rounded-full border text-center transition-all ${
                fiatMode === 'virtual'
                  ? 'border-obsidian bg-obsidian text-white font-bold shadow-xs'
                  : 'border-parchment-border bg-parchment-soft text-[#5C5850] hover:bg-[#EAE4D8]'
              }`}
            >
              Virtual Bank Transfer
            </button>
            <button
              type="button"
              onClick={() => setFiatMode('paystack')}
              className={`py-2 px-4 rounded-full border text-center transition-all ${
                fiatMode === 'paystack'
                  ? 'border-obsidian bg-obsidian text-white font-bold shadow-xs'
                  : 'border-parchment-border bg-parchment-soft text-[#5C5850] hover:bg-[#EAE4D8]'
              }`}
            >
              Paystack Popup Gateway
            </button>
          </div>

          {/* Bank Transfer Details Table */}
          <div className="border border-parchment-border rounded-2xl bg-parchment/60 p-4 space-y-2.5 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
              <span className="text-slate-500 font-sans">Method:</span>
              <span className="font-semibold text-obsidian">
                {fiatMode === 'virtual' ? 'Simulated Providus Bank Transfer' : 'Paystack Popup Gateway'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
              <span className="text-slate-500 font-sans">Beneficiary Bank:</span>
              <span className="font-semibold text-obsidian">{trade.virtualBank}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-slate-500 font-sans">Virtual Account No:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-obsidian bg-white px-2.5 py-0.5 rounded-md border border-parchment-border">
                  {trade.virtualAccount}
                </span>
                <button
                  onClick={handleCopyAccount}
                  className="p-1 hover:bg-parchment-soft rounded transition-colors text-slate-500"
                  title="Copy account"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                {isCopied && <span className="text-[10px] text-emeraldSeal font-bold">Copied!</span>}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 border-t border-parchment-border pt-2.5">
              <span className="text-slate-500 font-sans">Payable Deposit:</span>
              <span className="font-bold text-obsidian text-sm">
                {formatNaira(trade.totalNGN)}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 text-[11px] text-slate-400 font-sans">
              <span>Conversion Benchmark:</span>
              <span>₦{trade.rateNGN.toLocaleString()} NGN / USD</span>
            </div>
          </div>

          {/* Operational Action Buttons */}
          <div className="pt-2">
            {fiatMode === 'virtual' ? (
              <button
                type="button"
                onClick={handleSimulateFiatDeposit}
                className="w-full py-3 px-6 rounded-full bg-obsidian hover:bg-black text-white font-sans font-bold text-xs shadow-md transition-all hover:scale-[1.01]"
              >
                SIMULATE NGN DEPOSIT INFLOW →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLaunchPaystack}
                className="w-full py-3 px-6 rounded-full bg-emeraldSeal hover:bg-[#186846] text-white font-sans font-bold text-xs shadow-md transition-all hover:scale-[1.01]"
              >
                LAUNCH PAYSTACK TEST POPUP →
              </button>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: 40% Width (Col span 5) — Deep Obsidian Smart Contract Escrow */}
        <div className="lg:col-span-5 border border-[#262421] bg-obsidian text-alabaster rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-[#2C2A26] pb-3.5">
            <div className="flex items-center gap-2.5">
              <Wallet className="h-5 w-5 text-amberGold" />
              <div>
                <span className="font-serif text-base font-bold text-white block">
                  Base Sepolia Escrow
                </span>
                <span className="font-mono text-[10px] text-slate-400 block uppercase">
                  Contract Lock
                </span>
              </div>
            </div>

            {/* Status Chip */}
            {escrowStatus === 'locked' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emeraldSeal-tint text-emeraldSeal border border-emeraldSeal/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emeraldSeal" />
                LOCKED ON-CHAIN
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#2C2A26] text-amberGold border border-[#3E3A34]">
                <span className="h-1.5 w-1.5 rounded-full bg-amberGold animate-pulse" />
                AWAITING SIGNATURE
              </span>
            )}
          </div>

          {/* Contract Metadata Table */}
          <div className="border border-[#2C2A26] rounded-2xl bg-[#1C1A17] p-4 space-y-2.5 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
              <span className="text-slate-400 font-sans">Factory Contract:</span>
              <a
                href={`https://sepolia.basescan.org/address/${trade.factoryAddress}`}
                target="_blank"
                rel="noreferrer"
                className="text-amberGold font-semibold hover:underline inline-flex items-center gap-1"
              >
                <span>{shortenAddress(trade.factoryAddress)}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
              <span className="text-slate-400 font-sans">Target Value:</span>
              <span className="font-bold text-white">7,500.00 mUSDC</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
              <span className="text-slate-400 font-sans">Allowance Approval:</span>
              <span className="text-emerald-400 font-bold">Approved ✓</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
              <span className="text-slate-400 font-sans">Signing Authority:</span>
              <span className="font-semibold text-slate-300">
                {user?.wallet?.address ? shortenAddress(user.wallet.address) : '0x3Ae...dEc4 (Privy)'}
              </span>
            </div>
          </div>

          {/* Progress Window / Action Button */}
          <div className="space-y-2 pt-2">
            <button
              type="button"
              disabled={escrowStatus === 'locked'}
              onClick={handleTriggerPrivySign}
              className={`w-full py-3 px-6 rounded-full font-sans font-bold text-xs shadow-md transition-all ${
                escrowStatus === 'locked'
                  ? 'bg-emeraldSeal text-white cursor-default'
                  : 'bg-amberGold hover:bg-amberGold-hover text-obsidian hover:scale-[1.01]'
              }`}
            >
              {escrowStatus === 'locking'
                ? 'SIGNING ON BASE SEPOLIA...'
                : escrowStatus === 'locked'
                ? 'ESCROW LOCKED ON-CHAIN ✓'
                : 'TRIGGER PRIVY WALLET SIGN →'}
            </button>
            <p className="text-[11px] font-sans text-slate-400 text-center">
              Requires 1-click Privy signature. Zero gas token required (sponsored).
            </p>
          </div>
        </div>
      </div>

      {/* 4. Bottom Panel: 100% Full Width — Immutable Logs & RealSign Audit Stream */}
      <div className="border border-[#262421] bg-obsidian text-alabaster rounded-3xl p-6 font-mono text-xs shadow-sm">
        <div className="flex items-center justify-between border-b border-[#2C2A26] pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-4 w-4 text-amberGold" />
            <span className="font-bold text-white text-xs uppercase tracking-wider font-sans">
              IMMUTABLE LOGS & REALSIGN AUDIT TIMELINE
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">LIVE WEBSOCKET STREAM</span>
        </div>

        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-2 divide-y divide-[#2C2A26]">
          {logs.map((log, index) => (
            <div key={index} className="pt-2.5 flex items-start gap-3">
              <span className="text-slate-500 shrink-0 font-bold">[{log.time}]</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#24221E] text-amberGold shrink-0 border border-[#38352F]">
                {log.tag}
              </span>
              <span className="text-slate-300 leading-relaxed font-sans text-xs">{log.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
