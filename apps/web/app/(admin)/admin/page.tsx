import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  FileText,
  Users,
  Scale,
  Activity,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminDashboardPage() {
  const auditLogs = [
    {
      id: '1',
      actor: 'Chidi Okafor (buyer)',
      action: 'ESCROW_FUNDED',
      details: 'Funded 7,500 USDC on Base Sepolia (tx: 0x4a9...b12)',
      time: '15 mins ago',
    },
    {
      id: '2',
      actor: 'Wei Zhang (supplier)',
      action: 'INVITATION_ACCEPTED',
      details: 'Accepted terms for trade TG-2026-0849',
      time: '2 hours ago',
    },
    {
      id: '3',
      actor: 'Paystack Webhook',
      action: 'FIAT_CHARGE_CONFIRMED',
      details: '₦12,375,000 verified. Minted mock USDC to 0x709...9C8',
      time: '4 hours ago',
    },
  ];

  return (
    <div className="min-h-screen bg-parchment p-6 md:p-10 font-sans selection:bg-amberGold selection:text-obsidian">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-parchment-border pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amberGold-tint border border-amberGold/30 px-3 py-1 text-xs font-semibold text-amberGold-text mb-2">
              <ShieldCheck className="h-3.5 w-3.5 text-amberGold" />
              <span>Platform Administrator Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-obsidian font-serif">
              TradeGuard System Monitoring & Mediation
            </h1>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Audit trails, escrow locks, flagged disputes, and settlement verifications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-parchment-border bg-white px-5 py-2 text-xs font-sans font-bold text-obsidian shadow-2xs hover:bg-parchment-soft transition-colors"
            >
              Exit to User Cockpit
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-obsidian text-alabaster rounded-3xl p-6 border border-[#262421] shadow-xs space-y-2">
            <span className="text-[11px] font-sans font-bold uppercase text-amberGold tracking-wider block">
              TOTAL ESCROW VOLUME
            </span>
            <div className="text-2xl font-bold text-white font-mono">$1.48M</div>
            <p className="text-[11px] text-slate-400 font-sans">Settled via Base Sepolia</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-parchment-border shadow-2xs space-y-2">
            <span className="text-[11px] font-sans font-bold uppercase text-slate-500 tracking-wider block">
              ACTIVE TRADES
            </span>
            <div className="text-2xl font-bold text-obsidian font-serif">24 Contracts</div>
            <p className="text-[11px] text-slate-500 font-sans">18 funded, 6 awaiting supplier</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-parchment-border shadow-2xs space-y-2">
            <span className="text-[11px] font-sans font-bold uppercase text-slate-500 tracking-wider block">
              OPEN DISPUTES
            </span>
            <div className="text-2xl font-bold text-emeraldSeal font-serif">0 Pending</div>
            <p className="text-[11px] text-slate-500 font-sans">0% dispute rate this quarter</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-parchment-border shadow-2xs space-y-2">
            <span className="text-[11px] font-sans font-bold uppercase text-slate-500 tracking-wider block">
              REGISTERED ENTITIES
            </span>
            <div className="text-2xl font-bold text-obsidian font-serif">142 Companies</div>
            <p className="text-[11px] text-slate-500 font-sans">Nigeria, China, UAE, India</p>
          </div>
        </div>

        {/* Live System Audit Stream */}
        <div className="bg-white border border-parchment-border rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-parchment-border pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-amberGold" />
              <h2 className="font-serif font-bold text-obsidian text-lg">
                Real-Time Settlement & Contract Events
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">AUDIT LOG // IMMUTABLE</span>
          </div>

          <div className="divide-y divide-parchment-border">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold bg-amberGold-tint text-amberGold-text px-2 py-0.5 rounded-full border border-amberGold/30">
                      {log.action}
                    </span>
                    <span className="font-bold text-obsidian font-sans">{log.actor}</span>
                  </div>
                  <p className="text-slate-600 font-sans mt-0.5">{log.details}</p>
                </div>
                <span className="text-slate-400 font-mono text-[11px] shrink-0">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
