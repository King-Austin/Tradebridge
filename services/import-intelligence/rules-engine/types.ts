export interface CategoryTariffRule {
  chapter: string;
  category: 'automotive_spare_parts' | 'electronics_electrical' | 'textiles_clothing';
  sampleCodes: {
    code: string;
    description: string;
    dutyRatePercent: number;
    categoryLevyPercent?: number;
    regulations: string[];
  }[];
  statutoryFees: {
    surchargePercentOfDuty: number; // 7%
    cissPercentOfFob: number;       // 1%
    etlsPercentOfCif: number;       // 0.5%
    vatPercentOfTaxableBase: number;// 7.5%
  };
  sources: {
    name: string;
    authority: string;
    url?: string;
    note: string;
  }[];
}

export interface TariffDatabase {
  version: string;
  lastUpdated: string;
  disclaimer: string;
  categories: Record<string, CategoryTariffRule>;
}

