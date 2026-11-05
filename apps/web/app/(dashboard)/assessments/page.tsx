import Link from 'next/link';
import { Calculator, PlusCircle, ArrowRight, ShieldCheck, FileText, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatNaira } from '@/lib/utils';

const mockAssessments = [
  {
    id: 'i0000000-0000-0000-0000-000000000001',
    productDescription: '500 Sets Ceramic Brake Pads for Toyota Hilux',
    category: 'Automotive Spare Parts',
    hsCode: '8708.30.00',
    fobValue: 7500.0,
    landedCost: 11677.89,
    effectiveDuty: 31.95,
    agency: 'SONCAP (SON)',
    date: 'Yesterday',
    tradeLinked: 'TG-2026-0849',
  },
  {
    id: 'i0000000-0000-0000-0000-000000000002',
    productDescription: '100 Units Pure Sine Wave Hybrid Solar Inverters (5kW)',
    category: 'Electronics & Electrical',
    hsCode: '8504.40.00',
    fobValue: 14200.0,
    landedCost: 17850.5,
    effectiveDuty: 19.8,
    agency: 'SONCAP & NESREA',
    date: '3 days ago',
    tradeLinked: null,
  },
];

export default function AssessmentsListPage() {
  const fxRate = 1650;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-parchment-border pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-obsidian font-serif">
            Import Intelligence & Duty Audits
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Pre-shipment statutory tariff assessments and Nigerian Customs Service (NCS) compliance profiles.
          </p>
        </div>
        <Link
          href="/assessments/new"
          className="inline-flex items-center gap-2 rounded-full bg-amberGold hover:bg-amberGold-hover px-5 py-2.5 text-xs font-sans font-bold text-obsidian shadow-sm transition-all hover:scale-[1.01]"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Duty Audit</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockAssessments.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-parchment-border rounded-3xl shadow-2xs hover:border-slate-400 transition-colors overflow-hidden"
          >
            <div className="bg-obsidian text-alabaster px-5 py-3.5 flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-amberGold">
                HS CODE: {item.hsCode}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-[#24221E] px-2.5 py-0.5 rounded-full border border-[#38352F]">
                DUTY: {item.effectiveDuty}%
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-[11px] text-amberGold-text font-bold uppercase tracking-wider block">
                  {item.category}
                </span>
                <h3 className="font-serif font-bold text-obsidian text-lg mt-0.5">
                  {item.productDescription}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-parchment-soft p-3.5 rounded-2xl border border-parchment-border text-xs font-mono">
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">DECLARED FOB:</span>
                  <span className="font-bold text-obsidian">{formatCurrency(item.fobValue)}</span>
                  <span className="text-[10px] text-slate-400 block">{formatNaira(item.fobValue * fxRate)}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-sans">EST. LANDED COST:</span>
                  <span className="font-bold text-obsidian">{formatCurrency(item.landedCost)}</span>
                  <span className="text-[10px] text-slate-400 block">{formatNaira(item.landedCost * fxRate)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-parchment-border text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 font-sans">
                  <ShieldCheck className="h-4 w-4 text-emeraldSeal" />
                  <span>{item.agency}</span>
                </div>

                {item.tradeLinked ? (
                  <Link
                    href={`/trades/t0000000-0000-0000-0000-000000000001`}
                    className="inline-flex items-center gap-1 text-emeraldSeal font-bold hover:underline font-mono"
                  >
                    <span>LOCKED IN {item.tradeLinked}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <Link
                    href={`/trades/new?desc=${encodeURIComponent(item.productDescription)}&hs=${item.hsCode}&fob=${item.fobValue}`}
                    className="inline-flex items-center gap-1 text-obsidian font-bold hover:text-amberGold transition-colors font-sans"
                  >
                    <span>CREATE ESCROW →</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
