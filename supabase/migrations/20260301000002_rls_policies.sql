-- ==============================================================================
-- TradeGuard Row Level Security (RLS) Policies
-- Version: 1.0 (MVP)
-- Enforces strict tenant separation between buyers, suppliers, and platform admins.
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agreement_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispute_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PROFILES POLICIES
CREATE POLICY "Users can view own profile or admins can view all"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile upon signup"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. WALLETS POLICIES
CREATE POLICY "Users can manage own wallets"
  ON public.wallets FOR ALL
  USING (auth.uid() = user_id OR public.is_admin());

-- 3. TRADE_AGREEMENTS POLICIES
CREATE POLICY "Participants or admins can view trade agreements"
  ON public.trade_agreements FOR SELECT
  USING (
    auth.uid() = buyer_id OR
    auth.uid() = supplier_id OR
    auth.uid() = created_by OR
    public.is_admin()
  );

CREATE POLICY "Authenticated users can create trade agreements"
  ON public.trade_agreements FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Participants can update their trade agreement"
  ON public.trade_agreements FOR UPDATE
  USING (
    auth.uid() = buyer_id OR
    auth.uid() = supplier_id OR
    auth.uid() = created_by OR
    public.is_admin()
  );

-- 4. AGREEMENT_VERSIONS POLICIES
CREATE POLICY "View agreement versions if participant on parent trade"
  ON public.agreement_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trade_agreements t
      WHERE t.id = agreement_id AND (
        t.buyer_id = auth.uid() OR
        t.supplier_id = auth.uid() OR
        t.created_by = auth.uid() OR
        public.is_admin()
      )
    )
  );

CREATE POLICY "Insert agreement versions if participant on parent trade"
  ON public.agreement_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trade_agreements t
      WHERE t.id = agreement_id AND (
        t.buyer_id = auth.uid() OR
        t.supplier_id = auth.uid() OR
        t.created_by = auth.uid() OR
        public.is_admin()
      )
    )
  );

CREATE POLICY "Update agreement versions if participant"
  ON public.agreement_versions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.trade_agreements t
      WHERE t.id = agreement_id AND (
        t.buyer_id = auth.uid() OR
        t.supplier_id = auth.uid() OR
        t.created_by = auth.uid() OR
        public.is_admin()
      )
    )
  );

-- 5. TRADE_PARTICIPANTS POLICIES
CREATE POLICY "Read participants for trade"
  ON public.trade_participants FOR SELECT
  USING (
    user_id = auth.uid() OR
    invitation_token IS NOT NULL OR -- Allow unauthenticated token verification via function/RLS
    EXISTS (
      SELECT 1 FROM public.trade_agreements t
      WHERE t.id = agreement_id AND (
        t.buyer_id = auth.uid() OR
        t.supplier_id = auth.uid() OR
        t.created_by = auth.uid() OR
        public.is_admin()
      )
    )
  );

CREATE POLICY "Manage participants"
  ON public.trade_participants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.trade_agreements t
      WHERE t.id = agreement_id AND (
        t.created_by = auth.uid() OR
        public.is_admin()
      )
    )
  );

-- 6. ESCROW_RECORDS POLICIES
CREATE POLICY "Read escrow records if participant or admin"
  ON public.escrow_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.trade_agreements t
      WHERE t.id = agreement_id AND (
        t.buyer_id = auth.uid() OR
        t.supplier_id = auth.uid() OR
        public.is_admin()
      )
    )
  );

-- 7. FUNDING_TRANSACTIONS POLICIES
CREATE POLICY "Users can view their own funding transactions"
  ON public.funding_transactions FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can create funding transactions"
  ON public.funding_transactions FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 8. IMPORT_ASSESSMENTS POLICIES
CREATE POLICY "Users can view and manage their own assessments"
  ON public.import_assessments FOR ALL
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can view assessment sources"
  ON public.assessment_sources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.import_assessments a
      WHERE a.id = assessment_id AND (a.user_id = auth.uid() OR public.is_admin())
    )
  );

-- 9. AUDIT_LOGS POLICIES (Admins only for viewing; all users can trigger inserts via functions)
CREATE POLICY "Only admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Authenticated users can create audit log entries"
  ON public.audit_logs FOR INSERT
  WITH CHECK (auth.uid() = actor_id OR public.is_admin());

