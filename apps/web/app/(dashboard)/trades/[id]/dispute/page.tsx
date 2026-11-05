'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileText,
  Lock,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, shortenAddress } from '@/lib/utils';

export default function TradeInspectionDisputePage({
  params,
}: {
  params: { id: string };
}) {
  const [releaseStatus, setReleaseStatus] = React.useState<'idle' | 'releasing' | 'released'>('idle');
  const [disputeStatus, setDisputeStatus] = React.useState<'idle' | 'opening' | 'frozen'>('idle');
  const [disputeReason, setDisputeReason] = React.useState('damaged_goods');
  const [disputeDetails, setDisputeDetails] = React.useState('');
  const [daysRemaining] = React.useState(5);
  const [hoursRemaining] = React.useState(14);

  const trade = {
    referenceCode: 'TG-2026-0849',
    productTitle: '500 Sets Ceramic Brake Pads for Toyota Hilux',
    supplierName: 'Wei Zhang (Shenzhen Precision Machinery Co.)',
    supplierWallet: '0x9b3f029148bc8274a102948192a83749102948b1',
    buyerName: 'Chidi Okafor (Lagos Auto Parts Ltd)',
    escrowContract: '0xca89920194bc02847291a928473910c82937102a',
    amountUSD: 7500,
  };

  const handleReleaseEscrow = () => {
    setReleaseStatus('releasing');
    setTimeout(() => {
      setReleaseStatus('released');
    }, 1200);
  };

  const handleFreezeDispute = (e: React.FormEvent) => {
    e.preventDefault();
    setDisputeStatus('opening');
    setTimeout(() => {
      setDisputeStatus('frozen');
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-parchment-border pb-4">
        <div>
          <Link
            href={`/trades/${params.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-obsidian mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Trade Control Board</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-obsidian font-serif">
              Inspection Protocol & Dispute Console
            </h1>
            <span className="bg-amberGold-tint text-amberGold-text border border-amberGold/30 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
              {trade.referenceCode}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#EBE6DC] border border-[#DFD8CC] px-3.5 py-1.5 rounded-full text-xs font-mono">
            <span className="text-slate-500 font-sans">ESCROW LOCK: </span>
            <span className="font-bold text-obsidian">{formatCurrency(trade.amountUSD)} USDC</span>
          </div>
        </div>
      </div>

      {/* Countdown Timer Obsidian Monolith */}
      <div className="bg-obsidian text-alabaster rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-[#262421] shadow-md">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-amberGold font-bold text-xs uppercase tracking-wider">
            <Clock className="h-4 w-4 animate-spin text-amberGold" />
            <span>POST-ARRIVAL INSPECTION WINDOW ACTIVE</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl text-white font-bold">
            Cargo Discharged at Apapa Port Terminal
          </h2>
          <p className="text-[#A8A39A] text-xs sm:text-sm leading-relaxed">
            Buyer Chidi Okafor has a 7-day statutory window to physically verify container contents against commercial specs before funds automatically disburse.
          </p>
        </div>

        {/* High-Contrast Dials */}
        <div className="flex items-center justify-center gap-3 bg-[#1D1C19] px-5 py-3 rounded-2xl border border-[#2E2C28] shadow-2xs w-full md:w-auto">
          <div className="text-center">
            <span className="text-2xl font-bold text-white font-mono block">{daysRemaining}</span>
            <span className="text-[10px] text-slate-400 font-sans uppercase font-bold">DAYS</span>
          </div>
          <span className="text-slate-600 font-bold">:</span>
          <div className="text-center">
            <span className="text-2xl font-bold text-white font-mono block">{hoursRemaining}</span>
            <span className="text-[10px] text-slate-400 font-sans uppercase font-bold">HOURS</span>
          </div>
          <span className="text-slate-600 font-bold">:</span>
          <div className="text-center">
            <span className="text-2xl font-bold text-amberGold font-mono block">42</span>
            <span className="text-[10px] text-slate-400 font-sans uppercase font-bold">MINS</span>
          </div>
        </div>
      </div>

      {/* Status Alerts if released or frozen */}
      {releaseStatus === 'released' && (
        <div className="p-5 bg-emeraldSeal-tint border border-emeraldSeal/30 rounded-3xl text-emeraldSeal space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm font-sans">
            <CheckCircle2 className="h-5 w-5 text-emeraldSeal" />
            <span>ESCROW SUCCESSFULLY RELEASED TO SUPPLIER</span>
          </div>
          <p className="text-xs text-emeraldSeal/90 font-sans leading-relaxed">
            $7,500 USDC has been unlocked and transferred from escrow contract <span className="font-mono font-bold">{trade.escrowContract}</span> to supplier Wei Zhang ({shortenAddress(trade.supplierWallet)}). This trade is now complete.
          </p>
        </div>
      )}

      {disputeStatus === 'frozen' && (
        <div className="p-5 bg-rust-tint border border-rust/30 rounded-3xl text-rust space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm font-sans">
            <ShieldAlert className="h-5 w-5 text-rust" />
            <span>SMART CONTRACT ESCROW FROZEN // DISPUTE REGISTERED</span>
          </div>
          <p className="text-xs text-rust/90 font-sans leading-relaxed">
            Automatic release timer suspended. Funds locked in contract <span className="font-mono font-bold">{trade.escrowContract}</span>. Case #DISP-9024 assigned to TradeGuard Maritime Arbitration Council.
          </p>
        </div>
      )}

      {/* Two Column Console: Release (Left) vs Dispute (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Positive Path: Accept & Release */}
        <div className="bg-white border border-parchment-border rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-parchment-border">
            <span className="p-2 rounded-full bg-emeraldSeal-tint text-emeraldSeal">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <span className="font-serif font-bold text-obsidian block text-base">
                Path A: Satisfactory Delivery
              </span>
              <span className="text-[11px] text-slate-500 block font-sans">
                Release Escrow Funds to Supplier
              </span>
            </div>
          </div>

          <div className="space-y-3 font-sans text-xs text-slate-600">
            <p className="leading-relaxed">
              Confirm that the 500 sets of ceramic brake pads have been unloaded at Apapa, physically verified against the commercial invoice, and meet all SONCAP specifications.
            </p>
            <div className="bg-parchment-soft p-4 rounded-2xl border border-parchment-border font-mono text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">BENEFICIARY:</span>
                <span className="font-bold text-obsidian">{trade.supplierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">PAYOUT AMOUNT:</span>
                <span className="font-bold text-emeraldSeal">{formatCurrency(trade.amountUSD)} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">SETTLEMENT NETWORK:</span>
                <span className="font-bold text-obsidian">Base Sepolia (L2)</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReleaseEscrow}
            disabled={releaseStatus === 'released' || disputeStatus === 'frozen' || releaseStatus === 'releasing'}
            className="w-full py-3.5 px-6 rounded-full bg-emeraldSeal hover:bg-[#186846] text-white font-sans font-bold text-xs shadow-md transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {releaseStatus === 'releasing'
              ? 'CALLING TRADE_LOCK.RELEASE()...'
              : releaseStatus === 'released'
              ? 'ESCROW RELEASED ✓'
              : 'ACCEPT DELIVERY & RELEASE $7,500 USDC →'}
          </button>
        </div>

        {/* Protective Path: Raise Dispute & Freeze */}
        <div className="bg-white border border-parchment-border rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">
          <div className="flex items-center gap-2.5 pb-2 border-b border-parchment-border">
            <span className="p-2 rounded-full bg-rust-tint text-rust">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div>
              <span className="font-serif font-bold text-obsidian block text-base">
                Path B: Cargo Discrepancy
              </span>
              <span className="text-[11px] text-slate-500 block font-sans">
                Immediate On-Chain Escrow Freeze
              </span>
            </div>
          </div>

          <form onSubmit={handleFreezeDispute} className="space-y-4 font-sans text-xs">
            <div>
              <Label className="text-[11px] uppercase font-bold text-slate-600">
                Discrepancy Category
              </Label>
              <select
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                className="w-full rounded-xl border border-parchment-border bg-white px-3 py-2 text-xs font-sans mt-1.5 focus:ring-1 focus:ring-obsidian"
                disabled={disputeStatus === 'frozen'}
              >
                <option value="damaged_goods">Damaged or Broken Cargo in Transit</option>
                <option value="quantity_shortage">Shortage in Quantity vs Invoiced</option>
                <option value="specification_mismatch">Specification or Brand Mismatch</option>
                <option value="regulatory_rejection">Customs / SONCAP Regulatory Rejection</option>
              </select>
            </div>

            <div>
              <Label className="text-[11px] uppercase font-bold text-slate-600">
                Evidence Details & Claim
              </Label>
              <textarea
                rows={2}
                value={disputeDetails}
                onChange={(e) => setDisputeDetails(e.target.value)}
                placeholder="Describe container condition, damaged box numbers, or customs tally sheet..."
                className="w-full rounded-xl border border-parchment-border bg-white px-3 py-2 text-xs font-sans mt-1.5"
                required
                disabled={disputeStatus === 'frozen'}
              />
            </div>

            <button
              type="submit"
              disabled={disputeStatus === 'frozen' || releaseStatus === 'released' || disputeStatus === 'opening'}
              className="w-full py-3.5 px-6 rounded-full bg-rust hover:bg-[#B04420] text-white font-sans font-bold text-xs shadow-md transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {disputeStatus === 'opening'
                ? 'FREEZING SMART CONTRACT...'
                : disputeStatus === 'frozen'
                ? 'ESCROW FROZEN ON-CHAIN'
                : 'FREEZE ESCROW & OPEN DISPUTE ⚠️'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
