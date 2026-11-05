import Link from 'next/link';
import {
  Anchor,
  ShieldCheck,
  Calculator,
  ArrowRight,
  Lock,
  FileCheck2,
  AlertCircle,
  Truck,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-parchment text-obsidian flex flex-col justify-between selection:bg-amberGold selection:text-obsidian">
      {/* Top Floating Island Header */}
      <header className="sticky top-0 z-50 w-full bg-parchment/90 backdrop-blur-md border-b border-parchment-border">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-full bg-obsidian flex items-center justify-center text-amberGold shadow-xs">
              <Anchor className="h-4 w-4" />
            </div>
            <span className="font-serif text-lg font-bold tracking-tight text-obsidian">
              TradeGuard
            </span>
          </Link>

          {/* Capsule Island Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-[#EBE6DC] border border-[#DFD8CC] p-1.5 rounded-full shadow-2xs">
            <Link
              href="/"
              className="px-4 py-1.5 rounded-full text-xs font-sans font-bold bg-amberGold text-obsidian shadow-xs"
            >
              Home
            </Link>
            <Link
              href="/trades"
              className="px-4 py-1.5 rounded-full text-xs font-sans font-semibold text-[#4D4942] hover:text-obsidian hover:bg-[#E3DDD1] transition-colors"
            >
              Agreements
            </Link>
            <Link
              href="/trades/t0000000-0000-0000-0000-000000000001"
              className="px-4 py-1.5 rounded-full text-xs font-sans font-semibold text-[#4D4942] hover:text-obsidian hover:bg-[#E3DDD1] transition-colors"
            >
              Escrow Engine
            </Link>
            <Link
              href="/assessments"
              className="px-4 py-1.5 rounded-full text-xs font-sans font-semibold text-[#4D4942] hover:text-obsidian hover:bg-[#E3DDD1] transition-colors"
            >
              Customs Intelligence
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-obsidian hover:bg-black px-5 py-2 text-xs font-sans font-bold text-parchment shadow-xs transition-colors"
            >
              Open Cockpit →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Editorial Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16 flex-1 space-y-10 md:space-y-12 pb-24 md:pb-16">
        {/* Signature Obsidian Monolith Container */}
        <div className="bg-obsidian text-alabaster rounded-3xl p-8 sm:p-12 md:p-16 border border-[#262421] shadow-md relative overflow-hidden">
          {/* Subtle warm accent ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amberGold/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10 space-y-6">
            {/* Eyebrow Tag with Amber Dot */}
            <div className="inline-flex items-center gap-2 rounded-full bg-[#24221E] border border-[#38352F] px-3.5 py-1 text-xs font-sans font-semibold text-amberGold">
              <span className="h-2 w-2 rounded-full bg-amberGold animate-pulse" />
              <span>Base Sepolia Smart Contracts // Providus Virtual NGN Rail</span>
            </div>

            {/* Editorial Serif Display Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal tracking-tight leading-[1.1]">
              Protecting cross-border trade from payment to port.
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-sm sm:text-base md:text-lg text-[#B0ABA1] leading-relaxed max-w-2xl">
              Lock Nigerian Naira or USDC into autonomous smart contract escrows. 
              Verify statutory customs tariffs and release payment only after container inspection at Lagos ports.
            </p>

            {/* Tactile Capsule Action Strip */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl">
              <Link
                href="/trades/new"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amberGold hover:bg-amberGold-hover text-obsidian px-7 py-3 text-sm font-sans font-bold shadow-md transition-all hover:scale-[1.01]"
              >
                <span>Draft Commercial Invoice</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/assessments/new"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#24221E] hover:bg-[#302D28] text-parchment border border-[#38352F] px-6 py-3 text-sm font-sans font-semibold transition-colors"
              >
                <Calculator className="h-4 w-4 text-amberGold" />
                <span>Calculate Import Duty</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Editorial Content Grid (Warm Cards on Parchment) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: TradeLock Escrow */}
          <div className="bg-white border border-parchment-border rounded-3xl p-8 sm:p-10 shadow-2xs space-y-4 hover:border-slate-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-amberGold-text bg-amberGold-tint px-2.5 py-0.5 rounded-full">
                ON-CHAIN SETTLEMENT
              </span>
              <span className="font-mono text-xs text-slate-400">0x3593...5048</span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-obsidian">
              TradeLock™ Smart Escrow
            </h2>

            <p className="font-sans text-sm text-[#5C5850] leading-relaxed">
              Eliminate overseas supplier fraud and payment defaults. Importers fund via local bank transfer; funds are converted to USDC and locked on Base Sepolia.
            </p>

            <div className="pt-4 border-t border-parchment-border space-y-2.5 text-xs text-slate-700 font-sans">
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-emeraldSeal mt-0.5 shrink-0" />
                <span>Dual rails: Providus Bank virtual accounts + USDC smart contracts.</span>
              </div>
              <div className="flex items-start gap-2">
                <Truck className="h-4 w-4 text-emeraldSeal mt-0.5 shrink-0" />
                <span>Verified ocean Bill of Lading cryptographic hash anchoring.</span>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-emeraldSeal mt-0.5 shrink-0" />
                <span>Mandatory 7-day post-arrival inspection hold before disbursement.</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/trades"
                className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-obsidian hover:text-amberGold transition-colors"
              >
                <span>Explore Trade Manifest</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Import Intelligence */}
          <div className="bg-white border border-parchment-border rounded-3xl p-8 sm:p-10 shadow-2xs space-y-4 hover:border-slate-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-rust bg-rust-tint px-2.5 py-0.5 rounded-full">
                STATUTORY COMPLIANCE
              </span>
              <span className="font-mono text-xs text-slate-400">NCS CET 2026</span>
            </div>

            <h2 className="font-serif text-2xl font-bold text-obsidian">
              Nigeria Customs Tariff Engine
            </h2>

            <p className="font-sans text-sm text-[#5C5850] leading-relaxed">
              Calculate exact statutory clearing costs before goods leave the factory. Zero surprises at Apapa or Tin Can Island container terminals.
            </p>

            <div className="pt-4 border-t border-parchment-border space-y-2.5 text-xs text-slate-700 font-sans">
              <div className="flex items-start gap-2">
                <FileCheck2 className="h-4 w-4 text-emeraldSeal mt-0.5 shrink-0" />
                <span>Deterministic statutory duty, 7% surcharge, CISS, ETLS, and VAT.</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck2 className="h-4 w-4 text-emeraldSeal mt-0.5 shrink-0" />
                <span>Live candidate HS Code matcher with official tariff classification.</span>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck2 className="h-4 w-4 text-emeraldSeal mt-0.5 shrink-0" />
                <span>Regulatory checklists for SONCAP, NAFDAC, e-Form M, and PAAR.</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/assessments/new"
                className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-obsidian hover:text-amberGold transition-colors"
              >
                <span>Run Landed Cost Audit</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-parchment-border bg-parchment-soft py-8 px-6 pb-24 md:pb-8 text-xs text-slate-500 font-sans">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-obsidian text-sm">TradeGuard</span>
            <span>— Autonomous Trade Protection on Base Sepolia.</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Factory: 0x3593274775A9812BCa91dA1a6957A520509c5048
          </div>
        </div>
      </footer>

      {/* Floating Bottom Action Pill (Mobile Only) */}
      <div className="fixed bottom-3 inset-x-4 z-50 md:hidden max-w-sm mx-auto">
        <div className="bg-[#141311]/95 backdrop-blur-xl border border-[#2D2A26] rounded-full p-2 px-4 shadow-2xl flex items-center justify-between">
          <Link
            href="/assessments/new"
            className="text-xs font-sans font-bold text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <Calculator className="h-4 w-4 text-amberGold" />
            <span>Duty Calculator</span>
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full bg-amberGold hover:bg-amberGold-hover text-obsidian px-4 py-1.5 text-xs font-sans font-bold shadow-xs transition-colors"
          >
            Open Cockpit →
          </Link>
        </div>
      </div>
    </div>
  );
}
