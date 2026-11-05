import Link from 'next/link';
import { Scale, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function DisputesPage() {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-parchment-border pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-obsidian font-serif">
            Maritime Dispute & Arbitration Register
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            On-chain dispute freeze records, damage evidence lockers, and TradeGuard mediation logs.
          </p>
        </div>
        <Link
          href="/trades/t0000000-0000-0000-0000-000000000001/dispute"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-obsidian hover:bg-black text-white font-sans font-bold text-xs transition-colors"
        >
          <span>Inspection Console →</span>
        </Link>
      </div>

      <div className="bg-white border border-parchment-border rounded-3xl shadow-2xs overflow-hidden">
        <div className="bg-obsidian text-alabaster px-6 py-4 flex items-center justify-between">
          <span className="font-bold uppercase tracking-wider text-amberGold text-xs font-sans">
            ACTIVE ARBITRATION STATUS
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-[#24221E] px-2.5 py-0.5 rounded-full border border-[#38352F]">
            ARBITRATION PROTOCOL: V2.1 (BASE SEPOLIA)
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-4 bg-emeraldSeal-tint border border-emeraldSeal/20 p-5 rounded-2xl">
            <div className="p-2.5 rounded-full bg-emeraldSeal/10 text-emeraldSeal">
              <ShieldCheck className="h-6 w-6 text-emeraldSeal" />
            </div>
            <div>
              <h2 className="text-base font-bold text-obsidian font-serif">
                All Smart Contract Escrows Healthy // Zero Active Disputes
              </h2>
              <p className="text-xs text-slate-700 mt-1 font-sans leading-relaxed">
                All 3 active voyages are currently within normal transit or inspection countdown windows.
                When an importer executes <code className="font-mono bg-white px-1.5 py-0.5 rounded text-emeraldSeal border border-emeraldSeal/20 font-bold">TradeLock.raiseDispute()</code>, escrow auto-release is suspended on-chain and evidence verification begins.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-parchment-soft border border-parchment-border rounded-2xl">
              <span className="font-bold text-obsidian uppercase text-[11px] block mb-1 font-sans">
                1. NON-DELIVERY PROTOCOL
              </span>
              <p className="text-slate-600 font-sans text-xs leading-relaxed">
                If vessel fails to berth or BOL is cancelled, funds remain secured in smart escrow and can be returned via protocol arbitration.
              </p>
            </div>
            <div className="p-4 bg-parchment-soft border border-parchment-border rounded-2xl">
              <span className="font-bold text-obsidian uppercase text-[11px] block mb-1 font-sans">
                2. DAMAGE & SHORTAGE
              </span>
              <p className="text-slate-600 font-sans text-xs leading-relaxed">
                Photographic and customs tally sheet evidence is SHA-256 hashed and anchored directly to the dispute record.
              </p>
            </div>
            <div className="p-4 bg-parchment-soft border border-parchment-border rounded-2xl">
              <span className="font-bold text-obsidian uppercase text-[11px] block mb-1 font-sans">
                3. SEVEN-DAY SAFEGUARD
              </span>
              <p className="text-slate-600 font-sans text-xs leading-relaxed">
                The 7-day post-discharge countdown ensures the Nigerian buyer has sufficient port clearance time before funds transfer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
