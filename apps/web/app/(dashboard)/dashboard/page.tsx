import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  FileText,
  Calculator,
  ArrowRight,
  TrendingUp,
  Clock,
  PlusCircle,
  ExternalLink,
  Truck,
  Anchor,
  ArrowUpRight,
} from 'lucide-react';
import { formatCurrency, formatNaira } from '@/lib/utils';

const recentTrades = [
  {
    id: 't0000000-0000-0000-0000-000000000001',
    referenceCode: 'TG-2026-0849',
    productDescription: '500 Sets Ceramic Brake Pads for Toyota Hilux',
    supplierName: 'Shenzhen Precision Machinery Co.',
    amountUSD: 7500.0,
    status: 'LOCKED_IN_ESCROW',
    inspectionDays: 7,
    port: 'Apapa Port, Lagos',
  },
  {
    id: 't0000000-0000-0000-0000-000000000002',
    referenceCode: 'TG-2026-0850',
    productDescription: '100 Units Pure Sine Wave Hybrid Solar Inverters (5kW)',
    supplierName: 'Guangdong SunVolt Energy',
    amountUSD: 14200.0,
    status: 'IN_TRANSIT',
    inspectionDays: 10,
    port: 'Tin Can Island',
  },
  {
    id: 't0000000-0000-0000-0000-000000000003',
    referenceCode: 'TG-2026-0851',
    productDescription: '1,200 Rolls Unbleached Cotton Woven Fabric (Width 150cm)',
    supplierName: 'Zhejiang Weaving Mills',
    amountUSD: 9800.0,
    status: 'AWAITING_SUPPLIER_SIGNATURE',
    inspectionDays: 7,
    port: 'Apapa Port, Lagos',
  },
];

export default function DashboardPage() {
  const fxRate = 1650;
  const totalLockedUSD = 21700;

  return (
    <div className="space-y-8 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-parchment-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amberGold animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-obsidian font-serif">
              Trade Operations Cockpit
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Cross-Border Escrow Engine // Nigeria Import Settlement on Base Sepolia
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/assessments/new"
            className="inline-flex items-center gap-1.5 rounded-full border border-parchment-border bg-white px-4 py-2 text-xs font-sans font-bold text-obsidian shadow-2xs hover:bg-parchment-soft transition-colors"
          >
            <Calculator className="h-3.5 w-3.5 text-slate-500" />
            <span>Duty Calculator</span>
          </Link>
          <Link
            href="/trades/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-amberGold hover:bg-amberGold-hover px-5 py-2 text-xs font-sans font-bold text-obsidian shadow-xs transition-all hover:scale-[1.01]"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Invoice</span>
          </Link>
        </div>
      </div>

      {/* Terminal Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-obsidian text-alabaster rounded-3xl p-6 border border-[#262421] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-sans">
            <span className="uppercase font-bold text-amberGold tracking-wider">VALUE IN ESCROW</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            {formatCurrency(totalLockedUSD)}
          </div>
          <span className="text-[11px] text-slate-400 block font-mono">
            {formatNaira(totalLockedUSD * fxRate)} (Base Sepolia L2)
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-parchment-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-sans">
            <span className="uppercase font-bold tracking-wider">ACTIVE VOYAGES</span>
            <Anchor className="h-4 w-4 text-amberGold" />
          </div>
          <div className="text-2xl font-bold text-obsidian font-serif">
            3 Contracts
          </div>
          <span className="text-[11px] text-slate-500 block font-sans">
            1 Locked in Escrow, 1 In Transit, 1 Draft
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-parchment-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-sans">
            <span className="uppercase font-bold tracking-wider">INSPECTION WINDOW</span>
            <Clock className="h-4 w-4 text-rust" />
          </div>
          <div className="text-2xl font-bold text-obsidian font-mono">
            5d 14h Left
          </div>
          <span className="text-[11px] text-slate-500 block font-sans">
            Container MSKU-918274-0 at Apapa
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-parchment-border shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-sans">
            <span className="uppercase font-bold tracking-wider">ARBITRATION RATIO</span>
            <ShieldAlert className="h-4 w-4 text-emeraldSeal" />
          </div>
          <div className="text-2xl font-bold text-emeraldSeal font-serif">
            0 Disputes
          </div>
          <span className="text-[11px] text-slate-500 block font-sans">
            100% On-chain Release Success Rate
          </span>
        </div>
      </div>

      {/* Control Board Manifest Quick List */}
      <div className="bg-white border border-parchment-border rounded-3xl shadow-2xs overflow-hidden">
        <div className="bg-obsidian text-alabaster px-6 py-4 flex items-center justify-between">
          <span className="font-bold text-xs uppercase tracking-wider text-amberGold font-sans">
            ACTIVE TRADE AGILITY PIPELINE
          </span>
          <Link
            href="/trades"
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-sans font-bold"
          >
            <span>FULL MANIFEST</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="bg-parchment-soft text-slate-600 font-bold text-[11px] border-b border-parchment-border font-sans">
              <tr>
                <th className="py-3 px-5">REF CODE</th>
                <th className="py-3 px-5">PRODUCT CARGO</th>
                <th className="py-3 px-5">SUPPLIER</th>
                <th className="py-3 px-5">ESCROW COMMITMENT</th>
                <th className="py-3 px-5">STAGE</th>
                <th className="py-3 px-5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment-border">
              {recentTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-parchment/60 transition-colors">
                  <td className="py-4 px-5">
                    <Link href={`/trades/${trade.id}`} className="font-mono font-bold text-obsidian hover:text-amberGold text-xs">
                      {trade.referenceCode}
                    </Link>
                    <span className="text-[11px] text-slate-400 block font-sans">{trade.port}</span>
                  </td>
                  <td className="py-4 px-5 max-w-xs">
                    <span className="font-serif font-bold text-obsidian text-sm line-clamp-1">
                      {trade.productDescription}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-sans text-slate-700">
                    {trade.supplierName}
                  </td>
                  <td className="py-4 px-5 font-mono">
                    <span className="font-bold text-obsidian block">{formatCurrency(trade.amountUSD)}</span>
                    <span className="text-[11px] text-slate-400 block">{formatNaira(trade.amountUSD * fxRate)}</span>
                  </td>
                  <td className="py-4 px-5">
                    {trade.status === 'LOCKED_IN_ESCROW' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emeraldSeal-tint text-emeraldSeal border border-emeraldSeal/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emeraldSeal animate-pulse" />
                        LOCKED IN ESCROW
                      </span>
                    )}
                    {trade.status === 'IN_TRANSIT' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        <Truck className="h-3 w-3 text-blue-700" />
                        IN TRANSIT
                      </span>
                    )}
                    {trade.status === 'AWAITING_SUPPLIER_SIGNATURE' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amberGold-tint text-amberGold-text border border-amberGold/30">
                        AWAITING SIGNATURE
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <Link
                      href={`/trades/${trade.id}`}
                      className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-obsidian text-white hover:bg-black font-sans font-bold text-[11px] transition-colors"
                    >
                      <span>CONTROL BOARD</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
