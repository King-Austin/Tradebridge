'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Anchor, RefreshCw } from 'lucide-react';
import { WalletConnectButton } from './wallet-connect-button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [rate, setRate] = React.useState('1,650.00');
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefreshRate = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRate('1,650.00');
      setIsRefreshing(false);
    }, 400);
  };

  const navLinks = [
    { name: 'Home', href: '/dashboard' },
    { name: 'Agreements', href: '/trades' },
    { name: 'Escrow Cockpit', href: '/trades/t0000000-0000-0000-0000-000000000001' },
    { name: 'Customs Duty', href: '/assessments' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-parchment/95 backdrop-blur-md border-b border-parchment-border select-none transition-colors">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Terminal Tag */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-full bg-obsidian flex items-center justify-center text-amberGold shadow-xs">
              <Anchor className="h-4 w-4" />
            </div>
            <div>
              <span className="font-serif text-base font-bold tracking-tight text-obsidian block leading-none">
                TradeGuard
              </span>
              <span className="font-sans text-[10px] uppercase font-bold tracking-wider text-slate-500 block mt-0.5">
                Nigeria Escrow
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Floating Capsule Island Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#EBE6DC] border border-[#DFD8CC] p-1.5 rounded-full shadow-2xs">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/dashboard' && pathname?.startsWith(link.href));

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-sans transition-all duration-200',
                  isActive
                    ? 'bg-amberGold text-obsidian font-bold shadow-xs'
                    : 'text-[#4D4942] hover:text-obsidian hover:bg-[#E3DDD1] font-semibold'
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: FX Ticker & Privy Account Pill */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* FX Benchmark Ticker Pill */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono bg-[#EBE6DC] border border-[#DFD8CC] px-3 py-1.5 rounded-full text-[#4D4942]">
            <span className="text-slate-500 font-sans font-medium">FX:</span>
            <span className="font-bold text-obsidian">$1 = ₦{rate}</span>
            <button
              onClick={handleRefreshRate}
              className="text-slate-400 hover:text-amberGold transition-colors ml-0.5"
              title="Refresh Rate"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Network Indicator Pill */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono bg-[#EBE6DC] border border-[#DFD8CC] px-2.5 py-1.5 rounded-full text-[#4D4942]">
            <span className="h-2 w-2 rounded-full bg-emeraldSeal animate-pulse" />
            <span className="font-semibold text-obsidian">Base Sepolia</span>
          </div>

          {/* Privy Wallet Connector */}
          <WalletConnectButton />
        </div>
      </div>
    </header>
  );
}
