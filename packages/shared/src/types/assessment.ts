export type AssessmentCategory =
  | 'automotive_spare_parts'
  | 'electronics_electrical'
  | 'textiles_clothing';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface HSCodeCandidate {
  code: string;
  description: string;
  confidence: number; // 0 to 1
  duty_rate_percentage: number;
  vat_rate_percentage: number;
  etls_rate_percentage: number;
  ciss_rate_percentage: number;
  surcharge_rate_percentage: number;
  regulatory_notes: string[];
}

export interface LandedCostBreakdown {
  fobValue: number; // Product value
  freight: number;
  insurance: number;
  cifValue: number; // FOB + Freight + Insurance
  customsDuty: number; // CIF * duty_rate
  surcharge: number; // 7% of customs duty
  ciss: number; // 1% of FOB value (Comprehensive Import Supervision Scheme)
  etls: number; // 0.5% of CIF (ECOWAS Trade Liberalization Scheme)
  vat: number; // 7.5% of (CIF + Duty + Surcharge + CISS + ETLS)
  categoryLevies: number;
  totalEstimatedLandedCost: number;
  effectiveDutyRatePercent: number;
  currency: string;
}

export interface RegulatoryRequirement {
  agency: 'SON' | 'NAFDAC' | 'NCS' | 'NESREA';
  title: string;
  mandatory: boolean;
  certificateRequired?: string;
  description: string;
}

export interface AssessmentSource {
  id?: string;
  assessment_id?: string;
  source_name: string;
  source_url?: string;
  source_type: 'official_tariff' | 'trade_portal' | 'regulatory_agency' | 'estimate';
  data_point: string;
  retrieved_at: string;
}

export interface ImportAssessment {
  id: string;
  user_id: string;
  agreement_id?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  product_description: string;
  product_category: AssessmentCategory;
  quantity?: number;
  declared_value?: number;
  value_currency: string;
  freight_estimate?: number;
  insurance_estimate?: number;
  input_documents: string[];
  candidate_hs_codes: HSCodeCandidate[];
  selected_hs_code?: string;
  landed_cost_breakdown?: LandedCostBreakdown;
  regulatory_requirements: RegulatoryRequirement[];
  ai_notes?: string;
  confidence_level: ConfidenceLevel;
  warnings: string[];
  sources?: AssessmentSource[];
  created_at: string;
  completed_at?: string;
}

