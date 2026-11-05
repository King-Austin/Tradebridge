export type DisputeReason =
  | 'not_delivered'
  | 'wrong_product'
  | 'damaged'
  | 'wrong_quantity'
  | 'breach_of_terms'
  | 'other';

export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'escalated';

export interface DisputeRecord {
  id: string;
  agreement_id: string;
  raised_by: string;
  reason: DisputeReason;
  description: string;
  status: DisputeStatus;
  resolution?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DisputeEvidence {
  id: string;
  dispute_id: string;
  submitted_by: string;
  file_path: string;
  file_name: string;
  file_type: string;
  description?: string;
  uploaded_at: string;
}

