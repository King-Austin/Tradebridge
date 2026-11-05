import ratesData from './rates.json' with { type: 'json' };
import type { TariffDatabase } from './types.ts';
import type {
  AssessmentCategory,
  LandedCostBreakdown,
  HSCodeCandidate,
  AssessmentSource,
  RegulatoryRequirement,
} from '../../../packages/shared/src/types/assessment.ts';

const database = ratesData as unknown as TariffDatabase;

export interface LandedCostInput {
  productValue: number;      // FOB in USD
  freight: number;           // USD
  insurance: number;         // USD
  productCategory: AssessmentCategory;
  hsCode?: string;
}

export interface LandedCostCalculationResult {
  breakdown: LandedCostBreakdown;
  selectedCode: HSCodeCandidate;
  candidates: HSCodeCandidate[];
  regulatoryRequirements: RegulatoryRequirement[];
  sources: AssessmentSource[];
  warnings: string[];
}

/**
 * Deterministic calculation engine for Nigerian import duty and landed cost.
 * Strictly computational with ZERO reliance on LLM hallucination for financial metrics.
 */
export function calculateLandedCost(input: LandedCostInput): LandedCostCalculationResult {
  const categoryConfig = database.categories[input.productCategory];
  if (!categoryConfig) {
    throw new Error(`Unsupported category for rules engine: ${input.productCategory}`);
  }

  // 1. Locate or match HS code candidate
  const candidateList: HSCodeCandidate[] = categoryConfig.sampleCodes.map((item, idx) => ({
    code: item.code,
    description: item.description,
    confidence: idx === 0 ? 0.92 : 0.85 - idx * 0.1,
    duty_rate_percentage: item.dutyRatePercent,
    vat_rate_percentage: categoryConfig.statutoryFees.vatPercentOfTaxableBase,
    etls_rate_percentage: categoryConfig.statutoryFees.etlsPercentOfCif,
    ciss_rate_percentage: categoryConfig.statutoryFees.cissPercentOfFob,
    surcharge_rate_percentage: categoryConfig.statutoryFees.surchargePercentOfDuty,
    regulatory_notes: item.regulations,
  }));

  const selectedCandidate =
    candidateList.find((c) => c.code === input.hsCode) || candidateList[0];

  // 2. NCS Statutory Import Cost Formulas
  const fob = Math.max(0, input.productValue);
  const freight = Math.max(0, input.freight || 0);
  const insurance = Math.max(0, input.insurance || 0);

  // CIF = FOB + Freight + Insurance
  const cif = fob + freight + insurance;

  // Import Duty (ID) = CIF * Duty Rate %
  const customsDuty = Number(((cif * selectedCandidate.duty_rate_percentage) / 100).toFixed(2));

  // Surcharge = 7% of Import Duty
  const surcharge = Number(((customsDuty * categoryConfig.statutoryFees.surchargePercentOfDuty) / 100).toFixed(2));

  // CISS = 1% of FOB value
  const ciss = Number(((fob * categoryConfig.statutoryFees.cissPercentOfFob) / 100).toFixed(2));

  // ETLS = 0.5% of CIF value
  const etls = Number(((cif * categoryConfig.statutoryFees.etlsPercentOfCif) / 100).toFixed(2));

  // Optional category levy
  const matchedSample = categoryConfig.sampleCodes.find((s) => s.code === selectedCandidate.code);
  const levyPercent = matchedSample?.categoryLevyPercent || 0;
  const categoryLevies = Number(((cif * levyPercent) / 100).toFixed(2));

  // Taxable Base for VAT = CIF + Duty + Surcharge + CISS + ETLS + Levies
  const vatTaxableBase = cif + customsDuty + surcharge + ciss + etls + categoryLevies;

  // VAT = 7.5% of Taxable Base
  const vat = Number(((vatTaxableBase * categoryConfig.statutoryFees.vatPercentOfTaxableBase) / 100).toFixed(2));

  // Total Estimated Landed Cost
  const totalLanded = Number((cif + customsDuty + surcharge + ciss + etls + vat + categoryLevies).toFixed(2));

  const effectiveDutyRatePercent = Number(
    cif > 0 ? (((totalLanded - cif) / cif) * 100).toFixed(2) : '0'
  );

  const breakdown: LandedCostBreakdown = {
    fobValue: fob,
    freight,
    insurance,
    cifValue: Number(cif.toFixed(2)),
    customsDuty,
    surcharge,
    ciss,
    etls,
    vat,
    categoryLevies,
    totalEstimatedLandedCost: totalLanded,
    effectiveDutyRatePercent,
    currency: 'USD',
  };

  const regulatoryRequirements: RegulatoryRequirement[] = selectedCandidate.regulatory_notes.map((note) => ({
    agency: note.includes('SON') ? 'SON' : note.includes('NESREA') ? 'NESREA' : 'NCS',
    title: note.split(' ')[0] || 'Compliance Requirement',
    mandatory: true,
    certificateRequired: note.includes('SONCAP') ? 'SONCAP' : undefined,
    description: note,
  }));

  const sources: AssessmentSource[] = categoryConfig.sources.map((s) => ({
    source_name: s.name,
    source_url: s.url,
    source_type: 'official_tariff',
    data_point: `${s.authority} - ${s.note}`,
    retrieved_at: new Date().toISOString(),
  }));

  const warnings: string[] = [
    database.disclaimer,
    'Ensure all documentation bears the Form M reference and e-Invoicing ID before cargo dispatch.',
  ];

  return {
    breakdown,
    selectedCode: selectedCandidate,
    candidates: candidateList,
    regulatoryRequirements,
    sources,
    warnings,
  };
}

