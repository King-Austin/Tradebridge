-- ==============================================================================
-- TradeGuard Core Database Schema
-- Version: 1.0 (MVP)
-- Target: Supabase / PostgreSQL 15+
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES: User and business accounts linked to Supabase Auth
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  business_name TEXT,
  business_type TEXT NOT NULL DEFAULT 'buyer' CHECK (business_type IN ('buyer', 'supplier', 'both')),
  phone TEXT,
  country TEXT NOT NULL DEFAULT 'NG',
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. WALLETS: Connected EVM wallet addresses
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  chain_id INTEGER NOT NULL DEFAULT 84532, -- Base Sepolia default
  is_primary BOOLEAN NOT NULL DEFAULT TRUE,
  label TEXT,
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, address, chain_id)
);

-- 3. TRADE_AGREEMENTS: Master trade agreement header
CREATE TABLE IF NOT EXISTS public.trade_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_code TEXT UNIQUE NOT NULL, -- e.g. TG-2026-0001
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN (
      'draft',
      'pending_supplier',
      'pending_buyer',
      'approved',
      'funded',
      'in_progress',
      'completed',
      'disputed',
      'cancelled'
    )
  ),
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  buyer_id UUID REFERENCES public.profiles(id),
  supplier_id UUID REFERENCES public.profiles(id),
  current_version_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. AGREEMENT_VERSIONS: Immutable version snapshots
CREATE TABLE IF NOT EXISTS public.agreement_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id UUID NOT NULL REFERENCES public.trade_agreements(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  product_description TEXT NOT NULL,
  product_quantity INTEGER NOT NULL CHECK (product_quantity > 0),
  quantity_unit TEXT NOT NULL DEFAULT 'units',
  agreed_price NUMERIC(18, 2) NOT NULL CHECK (agreed_price > 0),
  price_currency TEXT NOT NULL DEFAULT 'USD',
  payment_asset TEXT NOT NULL DEFAULT 'USDC',
  delivery_terms TEXT NOT NULL,
  shipping_method TEXT,
  shipping_origin TEXT,
  shipping_destination TEXT,
  inspection_period_days INTEGER NOT NULL DEFAULT 7 CHECK (inspection_period_days > 0),
  release_conditions JSONB NOT NULL DEFAULT '[]',
  dispute_conditions JSONB NOT NULL DEFAULT '[]',
  additional_terms TEXT,
  buyer_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  buyer_accepted_at TIMESTAMPTZ,
  supplier_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  supplier_accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agreement_id, version_number)
);

-- Add foreign key constraint for current_version_id
ALTER TABLE public.trade_agreements
  DROP CONSTRAINT IF EXISTS fk_trade_current_version,
  ADD CONSTRAINT fk_trade_current_version
  FOREIGN KEY (current_version_id)
  REFERENCES public.agreement_versions(id)
  ON DELETE SET NULL;

-- 5. TRADE_PARTICIPANTS: Role mapping and invitation link tokens
CREATE TABLE IF NOT EXISTS public.trade_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id UUID NOT NULL REFERENCES public.trade_agreements(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'supplier')),
  invited_email TEXT,
  invitation_token TEXT UNIQUE,
  invitation_expires_at TIMESTAMPTZ,
  invitation_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  joined_at TIMESTAMPTZ,
  UNIQUE(agreement_id, role)
);

-- 6. ESCROW_RECORDS: Smart contract instances & state tracking
CREATE TABLE IF NOT EXISTS public.escrow_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id UUID NOT NULL UNIQUE REFERENCES public.trade_agreements(id) ON DELETE CASCADE,
  escrow_address TEXT NOT NULL UNIQUE,
  factory_address TEXT,
  buyer_address TEXT NOT NULL,
  supplier_address TEXT NOT NULL,
  token_address TEXT NOT NULL,
  amount NUMERIC(36, 0) NOT NULL, -- Scaled base units (e.g. 6 decimals)
  token_symbol TEXT NOT NULL DEFAULT 'mUSDC',
  state TEXT NOT NULL DEFAULT 'AwaitingFunding' CHECK (
    state IN (
      'AwaitingFunding',
      'Funded',
      'AwaitingShipment',
      'Shipped',
      'AwaitingInspection',
      'Accepted',
      'Disputed',
      'Released',
      'PendingReview',
      'Cancelled'
    )
  ),
  state_index INTEGER NOT NULL DEFAULT 0,
  agreement_hash TEXT NOT NULL,
  funded_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  inspection_deadline TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  chain_id INTEGER NOT NULL DEFAULT 84532,
  tx_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. FUNDING_TRANSACTIONS: Fiat on-ramp and wallet funding ledger
CREATE TABLE IF NOT EXISTS public.funding_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id UUID NOT NULL REFERENCES public.trade_agreements(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  method TEXT NOT NULL CHECK (method IN ('wallet', 'bank_transfer')),
  fiat_amount NUMERIC(18, 2),
  fiat_currency TEXT DEFAULT 'NGN',
  exchange_rate NUMERIC(18, 6),
  paystack_reference TEXT UNIQUE,
  token_amount NUMERIC(18, 6) NOT NULL,
  token_symbol TEXT NOT NULL DEFAULT 'mUSDC',
  mint_tx_hash TEXT,
  deposit_tx_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN (
      'pending',
      'fiat_confirmed',
      'minting',
      'minted',
      'depositing',
      'deposited',
      'failed'
    )
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. PAYMENT_EVENTS: Idempotent payment webhook logs
CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funding_transaction_id UUID REFERENCES public.funding_transactions(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'paystack',
  event_type TEXT NOT NULL,
  reference TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(provider, reference, event_type)
);

-- 9. SHIPMENT_RECORDS: Supplier logistics tracking
CREATE TABLE IF NOT EXISTS public.shipment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id UUID NOT NULL REFERENCES public.trade_agreements(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'preparing' CHECK (
    status IN ('preparing', 'shipped', 'in_transit', 'delivered')
  ),
  carrier_name TEXT,
  tracking_number TEXT,
  shipping_reference TEXT,
  estimated_delivery DATE,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. DELIVERY_EVIDENCE: Supporting shipping documents
CREATE TABLE IF NOT EXISTS public.delivery_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipment_records(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  description TEXT,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. INSPECTIONS: Importer delivery review
CREATE TABLE IF NOT EXISTS public.inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id UUID NOT NULL REFERENCES public.trade_agreements(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'in_progress', 'accepted', 'rejected')
  ),
  inspection_notes TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. DISPUTES: Disputed transactions
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agreement_id UUID NOT NULL REFERENCES public.trade_agreements(id) ON DELETE CASCADE,
  raised_by UUID NOT NULL REFERENCES public.profiles(id),
  reason TEXT NOT NULL CHECK (
    reason IN (
      'not_delivered',
      'wrong_product',
      'damaged',
      'wrong_quantity',
      'breach_of_terms',
      'other'
    )
  ),
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (
    status IN ('open', 'under_review', 'resolved', 'escalated')
  ),
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. DISPUTE_EVIDENCE: Files submitted for mediation
CREATE TABLE IF NOT EXISTS public.dispute_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES public.disputes(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES public.profiles(id),
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  description TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. IMPORT_ASSESSMENTS: AI intelligence + deterministic rules records
CREATE TABLE IF NOT EXISTS public.import_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  agreement_id UUID REFERENCES public.trade_agreements(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'completed', 'failed')
  ),
  product_description TEXT NOT NULL,
  product_category TEXT NOT NULL CHECK (
    product_category IN (
      'automotive_spare_parts',
      'electronics_electrical',
      'textiles_clothing'
    )
  ),
  quantity INTEGER,
  declared_value NUMERIC(18, 2) NOT NULL,
  value_currency TEXT NOT NULL DEFAULT 'USD',
  freight_estimate NUMERIC(18, 2) DEFAULT 0,
  insurance_estimate NUMERIC(18, 2) DEFAULT 0,
  input_documents JSONB DEFAULT '[]',
  candidate_hs_codes JSONB,
  selected_hs_code TEXT,
  landed_cost_breakdown JSONB,
  regulatory_requirements JSONB,
  ai_notes TEXT,
  confidence_level TEXT CHECK (confidence_level IN ('high', 'medium', 'low')),
  warnings JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 15. ASSESSMENT_SOURCES: Citations and authoritative references
CREATE TABLE IF NOT EXISTS public.assessment_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.import_assessments(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  source_url TEXT,
  source_type TEXT NOT NULL,
  data_point TEXT NOT NULL,
  retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. AUDIT_LOGS: Immutable platform action logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_trade_agreements_buyer ON public.trade_agreements(buyer_id);
CREATE INDEX IF NOT EXISTS idx_trade_agreements_supplier ON public.trade_agreements(supplier_id);
CREATE INDEX IF NOT EXISTS idx_trade_agreements_status ON public.trade_agreements(status);
CREATE INDEX IF NOT EXISTS idx_trade_participants_token ON public.trade_participants(invitation_token);
CREATE INDEX IF NOT EXISTS idx_funding_transactions_ref ON public.funding_transactions(paystack_reference);
CREATE INDEX IF NOT EXISTS idx_escrow_records_address ON public.escrow_records(escrow_address);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);

