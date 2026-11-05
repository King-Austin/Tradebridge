'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FileText,
  ArrowLeft,
  CheckCircle2,
  Building2,
  Truck,
  DollarSign,
  ShieldCheck,
  Plus,
  Trash2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNaira } from '@/lib/utils';

interface LineItem {
  id: string;
  description: string;
  hsCode: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

function CommercialInvoiceForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Prepopulate from assessment if passed via query params
  const initialDesc = searchParams?.get('desc') || 'Ceramic Disc Brake Pads for Toyota Hilux';
  const initialHs = searchParams?.get('hs') || '8708.30.00';
  const initialVal = searchParams?.get('fob') ? parseFloat(searchParams.get('fob')!) : 7500;

  const [referenceCode] = React.useState(() => `TG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [exchangeRate] = React.useState(1650);

  // Buyer Details
  const [buyerName, setBuyerName] = React.useState('Chidi Okafor');
  const [buyerCompany, setBuyerCompany] = React.useState('Lagos Auto Parts & Logistics Ltd');
  const [buyerEmail, setBuyerEmail] = React.useState('chidi@lagosautoparts.ng');
  const [buyerLocation, setBuyerLocation] = React.useState('Lagos, Nigeria');

  // Supplier Details
  const [supplierName, setSupplierName] = React.useState('Wei Zhang');
  const [supplierCompany, setSupplierCompany] = React.useState('Shenzhen Precision Machinery Co., Ltd');
  const [supplierEmail, setSupplierEmail] = React.useState('zhang.wei@sz-precision.cn');
  const [supplierLocation, setSupplierLocation] = React.useState('Guangdong, China');

  // Cargo Items
  const [items, setItems] = React.useState<LineItem[]>([
    {
      id: '1',
      description: initialDesc,
      hsCode: initialHs,
      quantity: 500,
      unit: 'SETS',
      unitPrice: initialVal / 500,
    },
  ]);

  // Delivery & Settlement Terms
  const [deliveryTerms, setDeliveryTerms] = React.useState('CIF Apapa Port, Lagos');
  const [shippingMethod, setShippingMethod] = React.useState('Sea Freight (FCL Container)');
  const [inspectionDays, setInspectionDays] = React.useState(7);
  const [specialConditions, setSpecialConditions] = React.useState(
    'Cargo must include genuine SONCAP inspection certificate and manufacturer ISO 9001 quality audit.'
  );

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Totals
  const subtotalUSD = items.reduce((acc, it) => acc + (it.quantity * it.unitPrice || 0), 0);
  const totalNGN = subtotalUSD * exchangeRate;

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        description: '',
        hsCode: '',
        quantity: 1,
        unit: 'UNITS',
        unitPrice: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/trades/t0000000-0000-0000-0000-000000000001');
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 font-sans">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-parchment-border pb-4">
        <div>
          <Link
            href="/trades"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-obsidian mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Trade Manifest</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-obsidian font-serif">
              Commercial Invoice & Trade Draft
            </h1>
            <span className="bg-amberGold-tint text-amberGold-text border border-amberGold/30 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
              {referenceCode}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-[#EBE6DC] border border-[#DFD8CC] px-3.5 py-1.5 rounded-full text-xs font-mono">
            <span className="text-slate-500">BENCHMARK: </span>
            <span className="font-bold text-obsidian">$1 = ₦{exchangeRate.toLocaleString()} NGN</span>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || subtotalUSD <= 0}
            className="rounded-full bg-amberGold hover:bg-amberGold-hover text-obsidian font-sans font-bold text-xs px-5 sm:px-6 py-2.5 shadow-sm transition-all hover:scale-[1.01]"
          >
            {isSubmitting ? 'ISSUING ON-CHAIN CONTRACT...' : 'LOCK & ISSUE INVOICE →'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Terminal Header Sheet */}
        <div className="bg-white border border-parchment-border rounded-3xl shadow-2xs overflow-hidden">
          {/* Top Bar */}
          <div className="bg-obsidian text-alabaster px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amberGold animate-pulse" />
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-amberGold">
                PROFORMA COMMERCIAL CONTRACT // BASE SEPOLIA ESCROW
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              JURISDICTION: NIGERIAN CUSTOMS & SMART ESCROW
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Parties: Importer vs Supplier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-parchment-soft p-5 rounded-2xl border border-parchment-border">
              {/* Buyer / Importer */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-parchment-border">
                  <span className="bg-obsidian text-white text-[10px] font-sans px-2.5 py-0.5 rounded-full font-bold">
                    IMPORTER (BUYER)
                  </span>
                  <span className="text-xs text-slate-500 font-sans">Nigeria Registered Rail</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <Label className="text-[11px] font-sans uppercase font-bold text-slate-600">Company Name</Label>
                    <Input
                      value={buyerCompany}
                      onChange={(e) => setBuyerCompany(e.target.value)}
                      className="h-8 text-xs font-medium bg-white rounded-lg border-parchment-border"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[11px] font-sans uppercase font-bold text-slate-600">Contact Person</Label>
                      <Input
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="h-8 text-xs bg-white rounded-lg border-parchment-border"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] font-sans uppercase font-bold text-slate-600">Email Address</Label>
                      <Input
                        type="email"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        className="h-8 text-xs font-mono bg-white rounded-lg border-parchment-border"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Supplier / Exporter */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-parchment-border">
                  <span className="bg-[#2C2A26] text-amberGold text-[10px] font-sans px-2.5 py-0.5 rounded-full font-bold border border-[#3E3A34]">
                    EXPORTER (SUPPLIER)
                  </span>
                  <span className="text-xs text-slate-500 font-sans">Overseas Counterparty</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <Label className="text-[11px] font-sans uppercase font-bold text-slate-600">Beneficiary / Company</Label>
                    <Input
                      value={supplierCompany}
                      onChange={(e) => setSupplierCompany(e.target.value)}
                      className="h-8 text-xs font-medium bg-white rounded-lg border-parchment-border"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-[11px] font-sans uppercase font-bold text-slate-600">Contact Person</Label>
                      <Input
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        className="h-8 text-xs bg-white rounded-lg border-parchment-border"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] font-sans uppercase font-bold text-slate-600">Supplier Email (Privy Invite)</Label>
                      <Input
                        type="email"
                        value={supplierEmail}
                        onChange={(e) => setSupplierEmail(e.target.value)}
                        className="h-8 text-xs font-mono bg-white rounded-lg border-parchment-border"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cargo Line Items Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-sans font-bold text-obsidian uppercase tracking-wider">
                  CARGO MANIFEST & LINE ITEMS
                </span>
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-obsidian bg-parchment-soft hover:bg-[#EAE4D8] px-3 py-1.5 rounded-full border border-parchment-border transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 text-amberGold" />
                  <span>ADD LINE ITEM</span>
                </button>
              </div>

              <div className="border border-parchment-border rounded-2xl overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-xs">
                  <thead className="bg-parchment-soft text-slate-600 font-sans font-bold text-[11px] border-b border-parchment-border">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">#</th>
                      <th className="py-2.5 px-3">Cargo Description</th>
                      <th className="py-2.5 px-3 w-32">HS Code</th>
                      <th className="py-2.5 px-3 w-24">Quantity</th>
                      <th className="py-2.5 px-3 w-24">Unit</th>
                      <th className="py-2.5 px-3 w-32">Unit Price (USD)</th>
                      <th className="py-2.5 px-3 w-32 text-right">Total (USD)</th>
                      <th className="py-2.5 px-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-parchment-border font-mono">
                    {items.map((item, idx) => {
                      const lineTotal = (item.quantity || 0) * (item.unitPrice || 0);
                      return (
                        <tr key={item.id} className="hover:bg-parchment/50">
                          <td className="py-2.5 px-3 text-center text-slate-400 font-bold">{idx + 1}</td>
                          <td className="py-2.5 px-3">
                            <Input
                              value={item.description}
                              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                              placeholder="e.g. Pure Sine Wave Inverter 5kW"
                              className="h-8 text-xs font-sans bg-transparent rounded-lg border-parchment-border"
                              required
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <Input
                              value={item.hsCode}
                              onChange={(e) => updateItem(item.id, 'hsCode', e.target.value)}
                              placeholder="8504.40.00"
                              className="h-8 text-xs font-mono bg-transparent rounded-lg border-parchment-border"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                              className="h-8 text-xs font-mono bg-transparent rounded-lg border-parchment-border"
                              required
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <select
                              value={item.unit}
                              onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                              className="h-8 w-full rounded-lg border border-parchment-border bg-transparent px-2 text-xs font-mono"
                            >
                              <option value="SETS">SETS</option>
                              <option value="UNITS">UNITS</option>
                              <option value="PCS">PCS</option>
                              <option value="ROLLS">ROLLS</option>
                              <option value="KG">KG</option>
                              <option value="TONS">TONS</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3">
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="h-8 text-xs font-mono bg-transparent rounded-lg border-parchment-border"
                              required
                            />
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-obsidian">
                            {formatCurrency(lineTotal)}
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            {items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeItem(item.id)}
                                className="text-slate-400 hover:text-rust p-1"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Logistics & Delivery Terms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-parchment-soft p-5 rounded-2xl border border-parchment-border">
              <div>
                <Label className="text-[11px] font-sans uppercase text-slate-600 font-bold">
                  Incoterms & Port of Discharge
                </Label>
                <Input
                  value={deliveryTerms}
                  onChange={(e) => setDeliveryTerms(e.target.value)}
                  placeholder="e.g. CIF Apapa Port, Lagos"
                  className="h-8 text-xs mt-1 bg-white rounded-lg border-parchment-border"
                  required
                />
              </div>

              <div>
                <Label className="text-[11px] font-sans uppercase text-slate-600 font-bold">
                  Freight & Shipping Method
                </Label>
                <Input
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  placeholder="e.g. Sea Freight (FCL Container)"
                  className="h-8 text-xs mt-1 bg-white rounded-lg border-parchment-border"
                  required
                />
              </div>

              <div>
                <Label className="text-[11px] font-sans uppercase text-slate-600 font-bold">
                  Post-Arrival Inspection Window
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    value={inspectionDays}
                    onChange={(e) => setInspectionDays(parseInt(e.target.value) || 7)}
                    className="h-8 text-xs font-mono bg-white w-24 rounded-lg border-parchment-border"
                    required
                  />
                  <span className="text-xs text-slate-500 font-sans">Days to inspect & confirm cargo</span>
                </div>
              </div>

              <div className="md:col-span-3">
                <Label className="text-[11px] font-sans uppercase text-slate-600 font-bold">
                  Statutory & Quality Requirements
                </Label>
                <Input
                  value={specialConditions}
                  onChange={(e) => setSpecialConditions(e.target.value)}
                  placeholder="e.g. Manufacturer ISO 9001 and SONCAP import certification mandatory"
                  className="h-8 text-xs mt-1 bg-white rounded-lg border-parchment-border"
                />
              </div>
            </div>

            {/* Financial Summary & Escrow Rail */}
            <div className="border-t border-parchment-border pt-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="text-xs text-slate-500 space-y-1.5 font-sans max-w-md">
                <div className="flex items-center gap-2 text-obsidian font-bold">
                  <ShieldCheck className="h-4 w-4 text-emeraldSeal" />
                  <span>SMART CONTRACT ESCROW PROTOCOL (BASE SEPOLIA)</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Upon issuance, a unique TradeLock contract instance is prepared. Importer deposits funds via Providus Virtual Rail or Paystack. Escrow funds stay locked until post-arrival inspection is confirmed.
                </p>
              </div>

              {/* Obsidian Financial Summary Monolith */}
              <div className="w-full md:w-84 bg-obsidian text-alabaster p-5 rounded-2xl font-mono space-y-2 border border-[#2C2A26] shadow-sm">
                <div className="flex justify-between text-xs text-slate-400 font-sans">
                  <span>INVOICE SUBTOTAL (USD):</span>
                  <span className="text-white font-mono font-bold">{formatCurrency(subtotalUSD)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 font-sans">
                  <span>FX CONVERSION RATE:</span>
                  <span>₦{exchangeRate.toLocaleString()} / $1</span>
                </div>
                <div className="border-t border-[#2C2A26] pt-2.5 flex justify-between items-baseline">
                  <span className="text-xs text-amberGold font-bold font-sans">FIAT DEPOSIT TARGET:</span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-amberGold font-mono">
                      {formatNaira(totalNGN)}
                    </div>
                    <span className="text-[10px] text-slate-400 block font-sans">
                      (Equivalent to {formatCurrency(subtotalUSD)})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-parchment-soft px-8 py-4 border-t border-parchment-border flex items-center justify-between">
            <Link
              href="/trades"
              className="text-xs font-sans font-medium text-slate-500 hover:text-obsidian"
            >
              Cancel Draft
            </Link>

            <button
              type="submit"
              disabled={isSubmitting || subtotalUSD <= 0}
              className="rounded-full bg-amberGold hover:bg-amberGold-hover text-obsidian font-sans font-bold text-xs px-7 py-3 shadow-md transition-all hover:scale-[1.01]"
            >
              {isSubmitting ? 'GENERATING SMART CONTRACT ESCROW...' : 'SIGN & LAUNCH TRADE COCKPIT →'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function NewTradeCommercialInvoicePage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-5xl mx-auto p-12 text-center font-sans text-xs text-slate-500">
          INITIALIZING COMMERCIAL INVOICE TERMINAL...
        </div>
      }
    >
      <CommercialInvoiceForm />
    </React.Suspense>
  );
}
