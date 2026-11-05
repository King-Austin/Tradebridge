import Link from 'next/link';
import { PlusCircle, FileText, ArrowRight, ShieldCheck, Anchor, Truck, Scale, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNaira } from '@/lib/utils';

const allTrades = [
  {
    id: 't0000000-0000-0000-0000-000000000001',
    referenceCode: 'TG-2026-0849',
    productDescription: '500 Sets Ceramic Brake Pads for Toyota Hilux',
    supplierName: 'Shenzhen Precision Machinery Co.',
    buyerName: 'Lagos Auto Parts Ltd',
    amountUSD: 7500.0,
    status: 'LOCKED_IN_ESCROW',
    inspectionDays: 7,
    port: 'Apapa, Lagos',
    carrier: 'Maersk Ocean',
    createdAt: 'March 1, 2026',
  },
  {
    id: 't0000000-0000-0000-0000-000000000002',
    referenceCode: 'TG-2026-0850',
    productDescription: '100 Units Pure Sine Wave Hybrid Solar Inverters (5kW)',
    supplierName: 'Guangdong SunVolt Energy',
    buyerName: 'Lagos Solar Works',
    amountUSD: 14200.0,
    status: 'IN_TRANSIT',
    inspectionDays: 10,
    port: 'Tin Can Island',
    carrier: 'CMA CGM',
    createdAt: 'March 2, 2026',
  },
  {
    id: 't0000000-0000-0000-0000-000000000003',
    referenceCode: 'TG-2026-0851',
    productDescription: '1,200 Rolls Unbleached Cotton Woven Fabric (150cm)',
    supplierName: 'Zhejiang Weaving Mills',
    buyerName: 'Kano Textile Merchants',
    amountUSD: 9800.0,
    status: 'AWAITING_SUPPLIER_SIGNATURE',
    inspectionDays: 7,
    port: 'Apapa, Lagos',
    carrier: 'MSC Mediterranean',
    createdAt: 'March 3, 2026',
  },
];

export default function TradesListPage() {
  const fxRate = 1650;

  return (
    <div className="space-y-6 font-sans">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-parchment-border pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-obsidian font-serif">
            Trade Agreement Manifest
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Active cross-border trade transactions locked on Base Sepolia with dual Providus/Paystack rails.
          </p>
        </div>
        <Link
          href="/trades/new"
          className="inline-flex items-center gap-2 rounded-full bg-amberGold hover:bg-amberGold-hover px-5 py-2.5 text-xs font-sans font-bold text-obsidian shadow-sm transition-all hover:scale-[1.01]"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Commercial Invoice</span>
        </Link>
      </div>

      {/* Manifest Table Card */}
      <div className="bg-white border border-parchment-border rounded-3xl shadow-2xs overflow-hidden">
        <div className="bg-obsidian text-alabaster px-6 py-4 flex items-center justify-between">
          <span className="font-sans font-bold text-xs uppercase tracking-wider text-amberGold">
            TRADE CONTROL RECORDS
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            FX BENCHMARK: $1 = ₦{fxRate.toLocaleString()} NGN
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="bg-parchment-soft text-slate-600 font-bold text-[11px] border-b border-parchment-border font-sans">
              <tr>
                <th className="py-3 px-5">REFERENCE</th>
                <th className="py-3 px-5">CARGO MANIFEST</th>
                <th className="py-3 px-5">SUPPLIER / COUNTERPARTY</th>
                <th className="py-3 px-5">VALUATION (USD / NGN)</th>
                <th className="py-3 px-5">ESCROW STATUS</th>
                <th className="py-3 px-5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment-border">
              {allTrades.map((trade) => {
                const totalNGN = trade.amountUSD * fxRate;
                return (
                  <tr key={trade.id} className="hover:bg-parchment/60 transition-colors">
                    <td className="py-4 px-5">
                      <Link
                        href={`/trades/${trade.id}`}
                        className="font-mono font-bold text-obsidian hover:text-amberGold hover:underline text-xs"
                      >
                        {trade.referenceCode}
                      </Link>
                      <span className="text-[11px] text-slate-400 block font-sans">{trade.port}</span>
                    </td>
                    <td className="py-4 px-5 max-w-xs">
                      <span className="font-serif font-bold text-obsidian text-sm line-clamp-1">
                        {trade.productDescription}
                      </span>
                      <span className="text-[11px] text-slate-500 block font-sans">
                        Carrier: {trade.carrier} // {trade.inspectionDays}d Inspection
                      </span>
                    </td>
                    <td className="py-4 px-5 font-sans">
                      <span className="font-semibold text-obsidian block">
                        {trade.supplierName}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        Buyer: {trade.buyerName}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-mono">
                      <span className="font-bold text-obsidian block">
                        {formatCurrency(trade.amountUSD)}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {formatNaira(totalNGN)}
                      </span>
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
                          AWAITING SUPPLIER
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link
                        href={`/trades/${trade.id}`}
                        className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full bg-obsidian text-white hover:bg-black font-sans font-bold text-[11px] transition-colors"
                      >
                        <span>COCKPIT</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
