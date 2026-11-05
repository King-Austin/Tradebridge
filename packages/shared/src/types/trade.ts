export type TradeStatus =
  | 'draft'
  | 'pending_supplier'
  | 'pending_buyer'
  | 'approved'
  | 'funded'
  | 'in_progress'
  | 'completed'
  | 'disputed'
  | 'cancelled';

export type ParticipantRole = 'buyer' | 'supplier';

export interface ReleaseCondition {
  id: string;
  description: string;
  type: 'shipment_proof' | 'inspection_passed' | 'custom_milestone';
  satisfied: boolean;
  satisfied_at?: string;
}

export interface DisputeCondition {
  id: string;
  clause: string;
  allowed_remedies: string[];
}

export interface AgreementVersion {
  id: string;
  agreement_id: string;
  version_number: number;
  product_description: string;
  product_quantity: number;
  quantity_unit: string;
  agreed_price: number;
  price_currency: string;
  payment_asset: string;
  delivery_terms: string;
  shipping_method?: string;
  shipping_origin?: string;
  shipping_destination?: string;
  inspection_period_days: number;
  release_conditions: ReleaseCondition[];
  dispute_conditions: DisputeCondition[];
  additional_terms?: string;
  buyer_accepted: boolean;
  buyer_accepted_at?: string;
  supplier_accepted: boolean;
  supplier_accepted_at?: string;
  created_at: string;
}

export interface TradeAgreement {
  id: string;
  reference_code: string;
  status: TradeStatus;
  created_by: string;
  buyer_id?: string;
  supplier_id?: string;
  current_version_id?: string;
  current_version?: AgreementVersion;
  versions?: AgreementVersion[];
  buyer?: {
    id: string;
    email: string;
    full_name?: string;
    business_name?: string;
  };
  supplier?: {
    id: string;
    email: string;
    full_name?: string;
    business_name?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface TradeParticipant {
  id: string;
  agreement_id: string;
  user_id?: string;
  role: ParticipantRole;
  invited_email?: string;
  invitation_token?: string;
  invitation_expires_at?: string;
  invitation_accepted: boolean;
  joined_at?: string;
}

