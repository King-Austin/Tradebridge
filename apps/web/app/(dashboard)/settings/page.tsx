'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [profile, setProfile] = React.useState({
    fullName: 'Chidi Okafor',
    businessName: 'Lagos Auto Parts & Logistics Ltd',
    email: 'chidi@lagosautoparts.ng',
    phone: '+234 803 333 4444',
    country: 'Nigeria (NG)',
    businessType: 'Importer / Buyer',
    cacRcNumber: 'RC-1849204',
    taxId: 'TIN-992019482',
  });
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans text-xs">
      <div className="border-b border-parchment-border pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-obsidian font-serif">
          Enterprise Profile & Compliance
        </h1>
        <p className="text-xs text-slate-500 font-sans mt-0.5">
          Verified importer identity, Corporate Affairs Commission (CAC) credentials, and settlement configuration.
        </p>
      </div>

      {saved && (
        <div className="p-4 bg-emeraldSeal-tint border border-emeraldSeal/30 text-emeraldSeal rounded-2xl flex items-center gap-2 font-bold font-sans">
          <CheckCircle2 className="h-4 w-4 text-emeraldSeal" />
          <span>Enterprise profile successfully updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-parchment-border rounded-3xl shadow-2xs overflow-hidden">
        <div className="bg-obsidian text-alabaster px-6 py-4 flex items-center justify-between">
          <span className="font-sans font-bold text-xs uppercase tracking-wider text-amberGold">
            BUSINESS IDENTITY & VERIFICATION RECORD
          </span>
          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 font-sans">
            <ShieldCheck className="h-3.5 w-3.5" />
            KYC VERIFIED
          </span>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase font-bold text-slate-600">Registered Corporate Name</Label>
            <Input
              value={profile.businessName}
              onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
              className="h-9 text-xs font-sans font-medium rounded-xl border-parchment-border bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase font-bold text-slate-600">CAC Registration (RC No.)</Label>
              <Input
                value={profile.cacRcNumber}
                onChange={(e) => setProfile({ ...profile, cacRcNumber: e.target.value })}
                className="h-9 text-xs font-mono rounded-xl border-parchment-border bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase font-bold text-slate-600">Federal Tax ID (TIN)</Label>
              <Input
                value={profile.taxId}
                onChange={(e) => setProfile({ ...profile, taxId: e.target.value })}
                className="h-9 text-xs font-mono rounded-xl border-parchment-border bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase font-bold text-slate-600">Managing Director / Contact</Label>
              <Input
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="h-9 text-xs font-sans rounded-xl border-parchment-border bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase font-bold text-slate-600">Operational Role</Label>
              <Input disabled value={profile.businessType} className="h-9 text-xs font-sans bg-parchment-soft text-slate-500 rounded-xl border-parchment-border" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase font-bold text-slate-600">Notification Email</Label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="h-9 text-xs font-mono rounded-xl border-parchment-border bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] uppercase font-bold text-slate-600">Phone Number (SMS Alert)</Label>
              <Input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="h-9 text-xs font-mono rounded-xl border-parchment-border bg-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="rounded-full bg-amberGold hover:bg-amberGold-hover text-obsidian font-sans font-bold text-xs px-6 py-2.5 shadow-sm transition-all hover:scale-[1.01]"
            >
              Update Profile Records
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
