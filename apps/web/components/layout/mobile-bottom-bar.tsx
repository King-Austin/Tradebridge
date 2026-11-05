'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Plus,
  Lock,
  Layers,
  X,
  Calculator,
  Truck,
  Scale,
  ShieldCheck,
  RefreshCw,
  Anchor,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrivy } from '@privy-io/react-auth';
import { shortenAddress } from '@/lib/utils';

export function MobileBottomBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { authenticated, user, login, logout } = usePrivy();

  // Close sheet on route change
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const controlModules = [
    { name: '1. AI Assessment', href: '/assessments', icon: Calculator, desc: 'HS Codes & CET Tariffs' },
    { name: '2. Agreements', href: '/trades', icon: FileText, desc: 'Proforma & Invoices' },
    { name: '3. Escrow Engine', href: '/trades/t0000000-0000-0000-0000-000000000001', icon: Lock, desc: 'Dual-rail Settlement' },
    { name: '4. Shipments', href: '/trades/t0000000-0000-0000-0000-000000000001/shipment', icon: Truck, desc: 'Waybill & Port Tracker' },
    { name: '5. Disputes', href: '/trades/t0000000-0000-0000-0000-000000000001/dispute', icon: Scale, desc: '7-Day Inspection Hold' },
    { name: '6. System Audit', href: '/admin', icon: ShieldCheck, desc: 'RealSign Verification' },
  ];

  const primaryWallet = user?.wallet?.address;

  return (
    <>
      {/* 1. Floating Bottom Capsule Island Pill (Mobile only) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-3 inset-x-3 sm:inset-x-8 z-50 md:hidden max-w-md mx-auto"
      >
        <div className="bg-[#141311]/95 backdrop-blur-xl border border-[#2D2A26] rounded-full p-1.5 px-3 shadow-2xl flex items-center justify-between text-slate-300">
          {/* Item 1: Dashboard */}
          <Link
            href="/dashboard"
            className={cn(
              'flex flex-col items-center justify-center py-1 px-2.5 rounded-full text-[10px] font-sans font-semibold transition-all',
              pathname === '/dashboard'
                ? 'text-amberGold font-bold'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <LayoutDashboard className="h-4 w-4 mb-0.5" />
            <span>Home</span>
          </Link>

          {/* Item 2: Agreements */}
          <Link
            href="/trades"
            className={cn(
              'flex flex-col items-center justify-center py-1 px-2.5 rounded-full text-[10px] font-sans font-semibold transition-all',
              pathname === '/trades'
                ? 'text-amberGold font-bold'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <FileText className="h-4 w-4 mb-0.5" />
            <span>Trades</span>
          </Link>

          {/* Item 3: Center Elevated Honey Amber Action Pill */}
          <Link
            href="/trades/new"
            aria-label="New Commercial Invoice"
            className="flex items-center justify-center h-11 w-11 rounded-full bg-amberGold hover:bg-amberGold-hover text-obsidian shadow-lg -mt-3.5 border-2 border-[#141311] transition-transform active:scale-95"
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
          </Link>

          {/* Item 4: Escrow Cockpit */}
          <Link
            href="/trades/t0000000-0000-0000-0000-000000000001"
            className={cn(
              'flex flex-col items-center justify-center py-1 px-2.5 rounded-full text-[10px] font-sans font-semibold transition-all',
              pathname?.startsWith('/trades/t0000000') && !isMenuOpen
                ? 'text-amberGold font-bold'
                : 'text-slate-400 hover:text-white'
            )}
          >
            <Lock className="h-4 w-4 mb-0.5" />
            <span>Escrow</span>
          </Link>

          {/* Item 5: All Modules Drawer Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className={cn(
              'flex flex-col items-center justify-center py-1 px-2.5 rounded-full text-[10px] font-sans font-semibold transition-all',
              isMenuOpen ? 'text-amberGold font-bold' : 'text-slate-400 hover:text-white'
            )}
          >
            <Layers className="h-4 w-4 mb-0.5" />
            <span>Modules</span>
          </button>
        </div>
      </nav>

      {/* 2. Slide-up Mobile Drawer / Sheet */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative z-50 bg-[#141311] border-t border-[#2D2A26] rounded-t-3xl p-5 pb-24 text-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-[#262421] pb-3">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-[#23211D] flex items-center justify-center text-amberGold">
                  <Anchor className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-serif text-sm font-bold text-white block leading-none">
                    TradeGuard Modules
                  </span>
                  <span className="font-mono text-[10px] text-amberGold mt-0.5 block">
                    $1 = ₦1,650 NGN // Base Sepolia
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="h-8 w-8 rounded-full bg-[#23211D] hover:bg-[#2F2C27] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {controlModules.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-2xl border transition-all',
                      isActive
                        ? 'bg-[#23211D] border-amberGold text-white shadow-xs'
                        : 'bg-[#1A1815] border-[#2A2723] text-slate-300 hover:bg-[#23211D]'
                    )}
                  >
                    <div
                      className={cn(
                        'h-9 w-9 rounded-xl flex items-center justify-center shrink-0',
                        isActive
                          ? 'bg-amberGold text-obsidian'
                          : 'bg-[#262421] text-amberGold'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-sans text-xs font-bold truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Quick Auth / Account Bar in Mobile Drawer */}
            <div className="border-t border-[#262421] pt-3 flex items-center justify-between text-xs font-sans">
              {authenticated ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emeraldSeal animate-pulse" />
                    <span className="text-slate-300 font-mono text-[11px]">
                      {primaryWallet ? shortenAddress(primaryWallet) : 'Connected'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-rust hover:underline text-[11px] font-semibold"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    login();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-full bg-amberGold text-obsidian font-bold text-xs shadow-xs text-center"
                >
                  Sign In / Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

