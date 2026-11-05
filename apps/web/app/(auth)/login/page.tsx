'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Anchor, ShieldCheck, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('buyer@lagosauto.ng');
  const [password, setPassword] = React.useState('password123');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col justify-center py-12 px-6 font-sans selection:bg-amberGold selection:text-obsidian">
      <div className="max-w-md mx-auto w-full space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-obsidian text-amberGold shadow-md mb-3">
            <Anchor className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-obsidian font-serif">
            Sign in to TradeGuard
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Access your cross-border trade agreements, escrows, and import assessments.
          </p>
        </div>

        <div className="bg-white border border-parchment-border rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 text-xs rounded-xl border-parchment-border bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-bold text-slate-700">Password</Label>
                <a href="#" className="text-[11px] text-amberGold-text hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 text-xs rounded-xl border-parchment-border bg-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 rounded-full bg-amberGold hover:bg-amberGold-hover text-obsidian font-sans font-bold text-xs shadow-md transition-all hover:scale-[1.01]"
              >
                {isLoading ? 'Authenticating...' : 'Sign In to Portal →'}
              </button>
            </div>
          </form>

          <div className="border-t border-parchment-border pt-4 text-center text-xs text-slate-500 font-sans">
            Need an account?{' '}
            <Link href="/register" className="font-bold text-obsidian hover:underline">
              Create Enterprise Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
