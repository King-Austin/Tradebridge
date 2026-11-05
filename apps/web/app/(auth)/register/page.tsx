'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Anchor, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = React.useState('');
  const [businessType, setBusinessType] = React.useState('buyer');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
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
            Create TradeGuard Account
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Register your enterprise to create escrow agreements and assess import costs.
          </p>
        </div>

        <div className="bg-white border border-parchment-border rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div className="space-y-1.5">
              <Label htmlFor="businessName" className="text-xs font-bold text-slate-700">Company / Enterprise Name</Label>
              <Input
                id="businessName"
                required
                placeholder="e.g. Lagos Auto Parts Ltd"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="h-10 text-xs rounded-xl border-parchment-border bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="businessType" className="text-xs font-bold text-slate-700">Operational Role</Label>
              <select
                id="businessType"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full h-10 rounded-xl border border-parchment-border bg-white px-3 text-xs font-sans focus:ring-1 focus:ring-obsidian"
              >
                <option value="buyer">Importer / Buyer (Nigeria)</option>
                <option value="supplier">Exporter / Supplier (International)</option>
                <option value="agent">Customs Broker / Freight Forwarder</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-slate-700">Official Work Email</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 text-xs rounded-xl border-parchment-border bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-slate-700">Password</Label>
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
                {isLoading ? 'Creating Account...' : 'Register Enterprise →'}
              </button>
            </div>
          </form>

          <div className="border-t border-parchment-border pt-4 text-center text-xs text-slate-500 font-sans">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-obsidian hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
