'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Truck,
  ArrowLeft,
  Anchor,
  FileCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ExternalLink,
  MapPin,
  FileText,
  AlertCircle,
  Copy,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, shortenAddress } from '@/lib/utils';

export default function TradeShipmentPage({
  params,
}: {
  params: { id: string };
}) {
  const [shipmentConfirmed, setShipmentConfirmed] = React.useState(true);
  const [carrier] = React.useState('Maersk Ocean Transport');
  const [vessel] = React.useState('CMA CGM RIGOLETTO / V.2601');
  const [containerNumber] = React.useState('MSKU-918274-0');
  const [bolNumber] = React.useState('MSK-APAPA-2026-90241');
  const [bolHash] = React.useState('0x8f2c31e9a4059d648234857b29a1d48c903847562810394857b9c0d1e2f3a4b5');
  const [etaLagos] = React.useState('March 18, 2026 (In Transit)');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [actionMessage, setActionMessage] = React.useState<string | null>(null);

  const trade = {
    referenceCode: 'TG-2026-0849',
    productTitle: '500 Sets Ceramic Brake Pads for Toyota Hilux',
    supplier: 'Wei Zhang (Shenzhen Precision Machinery Co.)',
    buyer: 'Chidi Okafor (Lagos Auto Parts Ltd)',
    escrowContract: '0xca89920194bc02847291a928473910c82937102a',
    factoryAddress: '0x3593274775A9812BCa91dA1a6957A520509c5048',
    amountUSD: 7500,
  };

  const handleConfirmShipment = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShipmentConfirmed(true);
      setActionMessage('Shipment successfully locked on-chain. 7-day post-delivery countdown armed upon port discharge.');
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 font-sans">
      {/* Top Bar */}
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
              Maritime Shipment & Bill of Lading
            </h1>
            <span className="bg-amberGold-tint text-amberGold-text border border-amberGold/30 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
              {trade.referenceCode}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/trades/${params.id}/dispute`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-obsidian hover:bg-black text-white font-sans font-bold text-xs transition-colors"
          >
            <span>INSPECTION & DISPUTE CONSOLE →</span>
          </Link>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 bg-emeraldSeal-tint border border-emeraldSeal/30 text-emeraldSeal rounded-2xl flex items-center gap-2 text-xs font-sans font-bold">
          <CheckCircle2 className="h-4 w-4 text-emeraldSeal shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Telemetry (7 cols) */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white border border-parchment-border rounded-3xl shadow-2xs overflow-hidden">
            <div className="bg-obsidian text-alabaster px-6 py-4 flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-amberGold text-xs font-sans">
                LIVE CARGO TRANSIT TELEMETRY
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-[#24221E] px-2.5 py-0.5 rounded-full border border-[#38352F]">
                STATUS: IN_TRANSIT
              </span>
            </div>

            <div className="p-6 space-y-5">
              {/* Origin -> Destination Banner */}
              <div className="bg-parchment-soft border border-parchment-border rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans font-bold uppercase tracking-wider">
                    PORT OF LOADING (ORIGIN)
                  </span>
                  <span className="font-serif font-bold text-obsidian text-base mt-0.5 block">
                    Ningbo-Zhoushan, CN
                  </span>
                  <span className="text-slate-500 text-xs block font-sans mt-0.5">Departed: March 4, 2026</span>
                </div>
                <div className="border-t sm:border-t-0 sm:border-l border-parchment-border pt-3 sm:pt-0 sm:pl-4">
                  <span className="text-slate-400 text-[10px] block font-sans font-bold uppercase tracking-wider">
                    PORT OF DISCHARGE (DESTINATION)
                  </span>
                  <span className="font-serif font-bold text-obsidian text-base mt-0.5 block">
                    Apapa Port, Lagos, NG
                  </span>
                  <span className="text-emeraldSeal font-bold text-xs block font-sans mt-0.5">ETA: {etaLagos}</span>
                </div>
              </div>

              {/* Voyage Details */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-parchment-soft rounded-2xl border border-parchment-border">
                  <span className="text-slate-400 text-[10px] block font-sans uppercase">OCEAN CARRIER</span>
                  <span className="font-bold text-obsidian font-sans mt-0.5 block">{carrier}</span>
                </div>
                <div className="p-3 bg-parchment-soft rounded-2xl border border-parchment-border">
                  <span className="text-slate-400 text-[10px] block font-sans uppercase">VESSEL / VOYAGE</span>
                  <span className="font-bold text-obsidian font-sans mt-0.5 block">{vessel}</span>
                </div>
                <div className="p-3 bg-parchment-soft rounded-2xl border border-parchment-border">
                  <span className="text-slate-400 text-[10px] block font-sans uppercase">CONTAINER ID (FCL)</span>
                  <span className="font-mono font-bold text-obsidian mt-0.5 block">{containerNumber}</span>
                </div>
                <div className="p-3 bg-parchment-soft rounded-2xl border border-parchment-border">
                  <span className="text-slate-400 text-[10px] block font-sans uppercase">BILL OF LADING (BOL)</span>
                  <span className="font-mono font-bold text-obsidian mt-0.5 block">{bolNumber}</span>
                </div>
              </div>

              {/* Waybill / BOL Cryptographic Hash Proof */}
              <div className="p-4 bg-obsidian text-alabaster rounded-2xl space-y-2 border border-[#2C2A26]">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-amberGold font-bold font-sans">CRYPTO BILL OF LADING ANCHOR (SHA-256)</span>
                  <span className="text-emerald-400 font-mono text-[10px]">VERIFIED ON BASE SEPOLIA</span>
                </div>
                <div className="font-mono text-[11px] text-slate-300 break-all bg-[#1A1916] p-2.5 rounded-xl border border-[#302D28]">
                  {bolHash}
                </div>
                <span className="text-[11px] text-slate-400 block font-sans leading-relaxed">
                  The original shipping manifest is hashed and stamped into the smart contract escrow instance. Any document modification voids delivery release.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Verification & Actions (5 cols) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white border border-parchment-border rounded-3xl p-6 shadow-2xs space-y-4">
            <span className="font-serif font-bold text-obsidian text-base block border-b border-parchment-border pb-2">
              Escrow Shipping Confirmation
            </span>

            <div className="space-y-2.5 text-slate-600 font-sans text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emeraldSeal shrink-0 mt-0.5" />
                <span>Providus / Paystack fiat funding confirmed and converted to $7,500 USDC.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emeraldSeal shrink-0 mt-0.5" />
                <span>
                  Escrow locked in contract instance <strong className="font-mono text-obsidian">{shortenAddress(trade.escrowContract)}</strong>.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-rust shrink-0 mt-0.5" />
                <span>Supplier Wei Zhang dispatches cargo and locks the verified BOL on-chain.</span>
              </div>
            </div>

            {shipmentConfirmed ? (
              <div className="bg-emeraldSeal-tint border border-emeraldSeal/20 p-4 rounded-2xl text-emeraldSeal space-y-3">
                <div className="flex items-center gap-2 font-bold font-sans text-xs">
                  <ShieldCheck className="h-4 w-4 text-emeraldSeal" />
                  <span>ON-CHAIN SHIPMENT CONFIRMED</span>
                </div>
                <p className="text-[11px] font-sans text-emeraldSeal/90 leading-relaxed">
                  The supplier has confirmed cargo dispatch. Escrow is securely locked. Once the container lands at Apapa Port, the 7-day inspection window activates.
                </p>
                <Link
                  href={`/trades/${params.id}/dispute`}
                  className="block text-center w-full py-2.5 bg-emeraldSeal hover:bg-[#186846] text-white rounded-full font-sans font-bold text-xs transition-colors"
                >
                  GO TO INSPECTION & RELEASE →
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConfirmShipment}
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-full bg-amberGold hover:bg-amberGold-hover text-obsidian font-sans font-bold text-xs shadow-md transition-all hover:scale-[1.01]"
              >
                {isSubmitting ? 'BROADCASTING TO BASE SEPOLIA...' : 'SUPPLIER: CONFIRM SHIPMENT ON-CHAIN →'}
              </button>
            )}
          </div>

          {/* Attached Clearing Documents */}
          <div className="bg-white border border-parchment-border rounded-3xl p-6 shadow-2xs space-y-3">
            <span className="font-sans font-bold uppercase text-obsidian text-[11px] tracking-wider block border-b border-parchment-border pb-2">
              ATTACHED CLEARING DOCUMENTS
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between bg-parchment-soft p-3 rounded-xl border border-parchment-border">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-500" />
                  <span className="font-sans font-semibold text-obsidian">Ocean Bill of Lading (PDF)</span>
                </div>
                <span className="text-[10px] text-emeraldSeal font-bold font-mono">VERIFIED</span>
              </div>
              <div className="flex items-center justify-between bg-parchment-soft p-3 rounded-xl border border-parchment-border">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-500" />
                  <span className="font-sans font-semibold text-obsidian">SONCAP Product Certificate</span>
                </div>
                <span className="text-[10px] text-emeraldSeal font-bold font-mono">VERIFIED</span>
              </div>
              <div className="flex items-center justify-between bg-parchment-soft p-3 rounded-xl border border-parchment-border">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-500" />
                  <span className="font-sans font-semibold text-obsidian">Commercial Packing List</span>
                </div>
                <span className="text-[10px] text-emeraldSeal font-bold font-mono">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
