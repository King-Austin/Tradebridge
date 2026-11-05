'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calculator,
  FileText,
  Lock,
  Truck,
  Scale,
  ShieldCheck,
  FilePlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: '1. AI Assessment', href: '/assessments', icon: Calculator },
  { name: '2. Agreements', href: '/trades', icon: FileText },
  { name: '3. Escrow Engine', href: '/trades/t0000000-0000-0000-0000-000000000001', icon: Lock },
  { name: '4. Shipments', href: '/trades/t0000000-0000-0000-0000-000000000001/shipment', icon: Truck },
  { name: '5. Disputes', href: '/trades/t0000000-0000-0000-0000-000000000001/dispute', icon: Scale },
  { name: '6. System Audit', href: '/admin', icon: ShieldCheck },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 shrink-0 border-r border-[#262421] bg-obsidian text-slate-300 min-h-[calc(100vh-64px)] flex-col justify-between p-3 select-none">
      <div className="space-y-5">
        {/* Quick Action Pill Button */}
        <Link
          href="/trades/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-full bg-amberGold hover:bg-amberGold-hover text-obsidian font-bold text-xs shadow-xs transition-all hover:scale-[1.01]"
        >
          <FilePlus className="h-4 w-4" />
          <span>New Commercial Invoice</span>
        </Link>

        {/* Navigation Rail */}
        <nav className="space-y-1">
          <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#6B655C] px-3 py-1.5">
            CONTROL MODULES
          </div>

          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname === item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-sans transition-all duration-150',
                  isActive
                    ? 'bg-[#23211D] text-white font-bold border-l-2 border-amberGold shadow-xs'
                    : 'text-[#969085] hover:bg-[#1C1A17] hover:text-white font-medium'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    isActive
                      ? 'text-amberGold'
                      : 'text-[#6E685F] group-hover:text-slate-300'
                  )}
                  strokeWidth={isActive ? 2.2 : 1.75}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Contract Verification Badge */}
      <div className="rounded-2xl border border-[#2B2925] bg-[#191815] p-3 text-[11px] font-mono text-slate-400 space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-1.5 text-amberGold font-bold text-[10px] uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-amberGold animate-pulse" />
          <span>Contracts Verified</span>
        </div>
        <div className="text-[10px] text-slate-400 truncate" title="0x3593274775A9812BCa91dA1a6957A520509c5048">
          Factory: <span className="text-slate-300">0x3593...5048</span>
        </div>
        <div className="text-[10px] text-slate-400 truncate" title="0xca6ACc0da807d2f615861A5d8DB87010B1538ac5">
          mUSDC: <span className="text-slate-300">0xca6A...8ac5</span>
        </div>
      </div>
    </aside>
  );
}
