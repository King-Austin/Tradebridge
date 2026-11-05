'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calculator,
  ArrowLeft,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Info,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateLandedCost } from '../../../../../../services/import-intelligence/rules-engine/engine';
import { AssessmentCategory } from '@tradeguard/shared';
import { formatCurrency, formatNaira } from '@/lib/utils';

export default function NewAssessmentPage() {
  const router = useRouter();
  const [category, setCategory] = React.useState<AssessmentCategory>('automotive_spare_parts');
  const [productDesc, setProductDesc] = React.useState('Ceramic Disc Brake Pads for Toyota Hilux');
  const [productValue, setProductValue] = React.useState(7500);
  const [freight, setFreight] = React.useState(1200);
  const [insurance, setInsurance] = React.useState(150);
  const [selectedHsCode, setSelectedHsCode] = React.useState<string | undefined>(undefined);
  const [exchangeRate] = React.useState(1650);

  const [calculationResult, setCalculationResult] = React.useState<any>(null);

  const runCalculation = (cat: AssessmentCategory, fob: number, frt: number, ins: number, hs?: string) => {
    const result = calculateLandedCost({
      productCategory: cat,
      productValue: fob,
      freight: frt,
      insurance: ins,
      hsCode: hs,
    });
    setCalculationResult(result);
  };

  React.useEffect(() => {
    runCalculation(category, productValue, freight, insurance, selectedHsCode);
  }, [category, productValue, freight, insurance, selectedHsCode]);

  const handleLaunchTrade = () => {
    if (!calculationResult) return;
    const hs = calculationResult.selectedCode.code;
    const url = `/trades/new?desc=${encodeURIComponent(productDesc)}&hs=${encodeURIComponent(hs)}&fob=${productValue}`;
    router.push(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-parchment-border pb-4">
        <div>
          <Link
            href="/assessments"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-obsidian mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Import Manifests</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-obsidian font-serif">
              Customs Clearing & Duty Terminal
            </h1>
            <span className="bg-amberGold-tint text-amberGold-text border border-amberGold/30 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
              NCS CET TARIFF v2026
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="bg-[#EBE6DC] border border-[#DFD8CC] px-3.5 py-1.5 rounded-full text-xs font-mono">
            <span className="text-slate-500 font-sans">OFFICIAL FX: </span>
            <span className="font-bold text-obsidian">$1 = ₦{exchangeRate.toLocaleString()} NGN</span>
          </div>
          {calculationResult && (
            <button
              type="button"
              onClick={handleLaunchTrade}
              className="rounded-full bg-amberGold hover:bg-amberGold-hover text-obsidian font-sans text-xs px-4 sm:px-5 py-2 sm:py-2.5 font-bold shadow-sm transition-all hover:scale-[1.01]"
            >
              <span>ISSUE INVOICE FROM AUDIT →</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Console: Cargo Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-parchment-border rounded-3xl shadow-2xs overflow-hidden">
            <div className="bg-obsidian text-alabaster px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-amberGold">
                1. CONSIGNMENT SPECIFICATIONS
              </span>
              <span className="text-[10px] font-mono text-slate-400">APAPA / TINCAN PORTS</span>
            </div>

            <div className="p-5 space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase text-slate-600 font-bold">
                  Import Tariff Category
                </Label>
                <select
                  value={category}
                  onChange={(e) => {
                    const newCat = e.target.value as AssessmentCategory;
                    setCategory(newCat);
                    setSelectedHsCode(undefined);
                  }}
                  className="w-full rounded-xl border border-parchment-border bg-white px-3 py-2 text-xs font-sans font-medium focus:ring-1 focus:ring-obsidian"
                >
                  <option value="automotive_spare_parts">Automotive Spare Parts & Accessories</option>
                  <option value="electronics_electrical">Electronics, Power & Renewable Systems</option>
                  <option value="textiles_clothing">Textiles, Fabrics & Woven Materials</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] uppercase text-slate-600 font-bold">
                  Commercial Product Description
                </Label>
                <textarea
                  rows={2}
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  className="w-full rounded-xl border border-parchment-border bg-white px-3 py-2 text-xs font-sans"
                  placeholder="Exact description on commercial invoice..."
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-slate-500 font-bold font-mono">FOB ($)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={productValue}
                    onChange={(e) => setProductValue(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="h-8 text-xs font-mono rounded-lg border-parchment-border"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-slate-500 font-bold font-mono">Freight ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={freight}
                    onChange={(e) => setFreight(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="h-8 text-xs font-mono rounded-lg border-parchment-border"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-slate-500 font-bold font-mono">Insurance ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={insurance}
                    onChange={(e) => setInsurance(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="h-8 text-xs font-mono rounded-lg border-parchment-border"
                  />
                </div>
              </div>

              {/* Candidate HS Codes Picker */}
              {calculationResult && calculationResult.candidates && (
                <div className="pt-2 border-t border-parchment-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase text-slate-500">
                      CANDIDATE HS CLASSIFICATIONS
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Click to toggle code</span>
                  </div>
                  <div className="space-y-1.5">
                    {calculationResult.candidates.map((cand: any) => {
                      const isSelected = cand.code === calculationResult.selectedCode.code;
                      return (
                        <button
                          key={cand.code}
                          type="button"
                          onClick={() => setSelectedHsCode(cand.code)}
                          className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start justify-between gap-2 ${
                            isSelected
                              ? 'border-obsidian bg-parchment text-obsidian shadow-xs'
                              : 'border-parchment-border bg-white hover:bg-parchment-soft text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs">{cand.code}</span>
                              <span className="text-[10px] bg-amberGold-tint text-amberGold-text px-2 py-0.2 rounded-full font-mono font-bold">
                                Duty: {cand.duty_rate_percentage}%
                              </span>
                            </div>
                            <p className="text-[11px] font-sans text-slate-600 line-clamp-1 mt-0.5">
                              {cand.description}
                            </p>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-emeraldSeal shrink-0 mt-0.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Statutory Documents Required */}
          {calculationResult && (
            <div className="bg-white border border-parchment-border rounded-3xl p-5 text-xs space-y-3 shadow-2xs">
              <span className="text-[11px] font-bold uppercase text-obsidian block border-b border-parchment-border pb-1.5">
                COMPLIANCE & CLEARING CHECKLIST
              </span>
              <div className="space-y-2">
                {calculationResult.regulatoryRequirements.map((reg: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] bg-parchment-soft p-2.5 rounded-xl border border-parchment-border">
                    <ShieldCheck className="h-4 w-4 text-emeraldSeal shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-obsidian">{reg.agency}: </span>
                      <span className="text-slate-600">{reg.description}</span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-parchment-soft p-2.5 rounded-xl border border-parchment-border">
                  <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Mandatory e-Form M registered on Trade Monitoring System (TRMS)</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-600 bg-parchment-soft p-2.5 rounded-xl border border-parchment-border">
                  <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>Pre-Arrival Assessment Report (PAAR) issuance prior to container discharge</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Console: Statutory NCS Landed Cost Terminal (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {calculationResult && (
            <div className="bg-obsidian text-alabaster border border-[#262421] rounded-3xl shadow-md overflow-hidden font-mono">
              {/* Terminal Title */}
              <div className="bg-[#1C1A17] px-6 py-4 flex items-center justify-between border-b border-[#2C2A26]">
                <div>
                  <span className="text-xs font-sans font-bold uppercase tracking-wider text-amberGold block">
                    NCS STATUTORY DUTY AUDIT SHEET
                  </span>
                  <span className="text-[10px] text-slate-400">
                    HS CODE: {calculationResult.selectedCode.code} // MATCH CONFIDENCE: {(calculationResult.selectedCode.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 block font-bold font-sans">EFFECTIVE TARIFF RATE</span>
                  <span className="text-base font-bold text-white font-mono">
                    {calculationResult.breakdown.effectiveDutyRatePercent}%
                  </span>
                </div>
              </div>

              {/* Assessment Breakdown Table */}
              <div className="p-6 space-y-4">
                <div className="border border-[#2C2A26] rounded-2xl overflow-hidden text-xs">
                  <div className="bg-[#24221E] px-4 py-2.5 border-b border-[#2C2A26] flex justify-between font-bold text-slate-300 font-sans">
                    <span>STATUTORY COST COMPONENT</span>
                    <span>USD VALUE / EQUIVALENT NGN</span>
                  </div>

                  <div className="divide-y divide-[#2C2A26]">
                    <div className="flex justify-between items-center px-4 py-2.5 hover:bg-[#1E1C19]">
                      <div>
                        <span className="font-semibold text-white font-sans">Commercial FOB Value</span>
                        <span className="text-[10px] text-slate-400 block font-sans">Supplier invoiced product amount</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white font-mono">{formatCurrency(calculationResult.breakdown.fobValue)}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{formatNaira(calculationResult.breakdown.fobValue * exchangeRate)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center px-4 py-2.5 hover:bg-[#1E1C19]">
                      <div>
                        <span className="font-semibold text-white font-sans">Freight & Marine Insurance</span>
                        <span className="text-[10px] text-slate-400 block font-sans">Transit carriage to Lagos Ports</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white font-mono">
                          {formatCurrency(calculationResult.breakdown.freight + calculationResult.breakdown.insurance)}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {formatNaira((calculationResult.breakdown.freight + calculationResult.breakdown.insurance) * exchangeRate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center px-4 py-2.5 bg-[#201E1B] font-bold text-white">
                      <div>
                        <span className="font-sans">Customs CIF Valuation</span>
                        <span className="text-[10px] text-slate-400 block font-sans font-normal">Base for statutory duty calculation</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono">{formatCurrency(calculationResult.breakdown.cifValue)}</span>
                        <span className="text-[10px] text-slate-400 block font-normal font-mono">{formatNaira(calculationResult.breakdown.cifValue * exchangeRate)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center px-4 py-2.5 hover:bg-[#1E1C19]">
                      <div>
                        <span className="font-semibold text-white font-sans">
                          Import Duty ({calculationResult.selectedCode.duty_rate_percentage}% of CIF)
                        </span>
                        <span className="text-[10px] text-slate-400 block font-sans">Statutory Nigerian Customs Duty (ID)</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white font-mono">{formatCurrency(calculationResult.breakdown.customsDuty)}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{formatNaira(calculationResult.breakdown.customsDuty * exchangeRate)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center px-4 py-2.5 hover:bg-[#1E1C19]">
                      <div>
                        <span className="font-semibold text-white font-sans">Customs Surcharge (7% of Duty)</span>
                        <span className="text-[10px] text-slate-400 block font-sans">Port development & port surcharge</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white font-mono">{formatCurrency(calculationResult.breakdown.surcharge)}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{formatNaira(calculationResult.breakdown.surcharge * exchangeRate)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center px-4 py-2.5 hover:bg-[#1E1C19]">
                      <div>
                        <span className="font-semibold text-white font-sans">CISS Fee (1% of FOB)</span>
                        <span className="text-[10px] text-slate-400 block font-sans">Comprehensive Import Supervision Scheme</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white font-mono">{formatCurrency(calculationResult.breakdown.ciss)}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{formatNaira(calculationResult.breakdown.ciss * exchangeRate)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center px-4 py-2.5 hover:bg-[#1E1C19]">
                      <div>
                        <span className="font-semibold text-white font-sans">ETLS Scheme (0.5% of CIF)</span>
                        <span className="text-[10px] text-slate-400 block font-sans">ECOWAS Trade Liberalization Scheme</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white font-mono">{formatCurrency(calculationResult.breakdown.etls)}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{formatNaira(calculationResult.breakdown.etls * exchangeRate)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center px-4 py-2.5 hover:bg-[#1E1C19]">
                      <div>
                        <span className="font-semibold text-white font-sans">Value Added Tax (7.5% Taxable Base)</span>
                        <span className="text-[10px] text-slate-400 block font-sans">CIF + ID + Surcharge + CISS + ETLS</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white font-mono">{formatCurrency(calculationResult.breakdown.vat)}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{formatNaira(calculationResult.breakdown.vat * exchangeRate)}</span>
                      </div>
                    </div>

                    {/* Total Landed Cost Grand Banner */}
                    <div className="flex justify-between items-center px-5 py-4 bg-[#141311] border-t border-[#2C2A26]">
                      <div>
                        <span className="text-xs uppercase font-bold text-amberGold font-sans">TOTAL ESTIMATED LANDED COST</span>
                        <span className="text-[10px] text-slate-400 block font-sans">Total Inbound Capital Commitment</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white font-mono">
                          {formatCurrency(calculationResult.breakdown.totalEstimatedLandedCost)}
                        </div>
                        <div className="text-xs font-bold text-amberGold font-mono">
                          {formatNaira(calculationResult.breakdown.totalEstimatedLandedCost * exchangeRate)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="p-4 bg-[#23211D] border border-[#38352F] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white font-sans block">
                      Ready to lock this shipment into smart escrow?
                    </span>
                    <span className="text-[11px] text-slate-400 font-sans block">
                      Transfer these figures directly into an on-chain commercial proforma.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLaunchTrade}
                    className="rounded-full bg-amberGold hover:bg-amberGold-hover text-obsidian font-sans text-xs px-5 py-2.5 shrink-0 font-bold shadow-md transition-all hover:scale-[1.01]"
                  >
                    <span>LAUNCH ESCROW CONTRACT →</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
