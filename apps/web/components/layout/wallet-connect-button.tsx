'use client';

import { usePrivy } from '@privy-io/react-auth';
import { shortenAddress } from '@/lib/utils';
import { LogOut, Wallet } from 'lucide-react';

export function WalletConnectButton() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  if (!ready) {
    return (
      <div className="h-9 w-28 animate-pulse rounded-full bg-parchment-border" />
    );
  }

  if (!authenticated) {
    return (
      <button
        onClick={login}
        type="button"
        className="inline-flex items-center justify-center rounded-full bg-obsidian hover:bg-black px-3.5 sm:px-5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-sans font-bold text-parchment shadow-xs transition-colors shrink-0"
      >
        <span>Connect</span>
      </button>
    );
  }

  const primaryWallet = user?.wallet?.address;
  const userIdentifier = user?.email?.address || (primaryWallet ? shortenAddress(primaryWallet) : 'Account');

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-parchment-border bg-white px-2.5 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-sans font-medium text-obsidian shadow-2xs">
        <span className="h-2 w-2 rounded-full bg-emeraldSeal animate-pulse shrink-0" />
        <span className="font-semibold max-w-[85px] sm:max-w-[140px] truncate">{userIdentifier}</span>
        {primaryWallet && (
          <span className="hidden sm:inline-block font-mono text-[10px] text-slate-500 bg-parchment-soft px-2 py-0.5 rounded-full">
            {shortenAddress(primaryWallet)}
          </span>
        )}
      </div>

      <button
        onClick={logout}
        type="button"
        className="p-1.5 text-slate-400 hover:text-rust hover:bg-parchment-soft rounded-full transition-colors"
        title="Sign Out"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
