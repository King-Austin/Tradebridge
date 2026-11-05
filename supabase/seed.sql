-- ==============================================================================
-- TradeGuard Database Seed Data (Local Development / Testing)
-- ==============================================================================

-- 1. Insert Mock Profiles (matching UUIDs from Auth)
INSERT INTO public.profiles (id, email, full_name, business_name, business_type, phone, country, role, onboarding_completed)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin@tradeguard.ng', 'Platform Administrator', 'TradeGuard Operations', 'both', '+2348011112222', 'NG', 'admin', true),
  ('b0000000-0000-0000-0000-000000000002', 'buyer@lagosauto.ng', 'Chidi Okafor', 'Lagos Auto Parts Ltd', 'buyer', '+2348033334444', 'NG', 'user', true),
  ('c0000000-0000-0000-0000-000000000003', 'supplier@shenzhentrade.cn', 'Wei Zhang', 'Shenzhen Precision Machinery Co.', 'supplier', '+8613900001111', 'CN', 'user', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Primary Wallets
INSERT INTO public.wallets (id, user_id, address, chain_id, is_primary, label)
VALUES
  ('w0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 84532, true, 'Buyer Base Sepolia Wallet'),
  ('w0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003', '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 84532, true, 'Supplier Settlement Wallet')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Demo Trade Agreement
INSERT INTO public.trade_agreements (id, reference_code, status, created_by, buyer_id, supplier_id)
VALUES
  ('t0000000-0000-0000-0000-000000000001', 'TG-2026-0849', 'approved', 'b0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Agreement Version 1
INSERT INTO public.agreement_versions (
  id,
  agreement_id,
  version_number,
  product_description,
  product_quantity,
  quantity_unit,
  agreed_price,
  price_currency,
  payment_asset,
  delivery_terms,
  shipping_method,
  shipping_origin,
  shipping_destination,
  inspection_period_days,
  release_conditions,
  dispute_conditions,
  additional_terms,
  buyer_accepted,
  buyer_accepted_at,
  supplier_accepted,
  supplier_accepted_at
)
VALUES (
  'v0000000-0000-0000-0000-000000000001',
  't0000000-0000-0000-0000-000000000001',
  1,
  '500 Sets of Ceramic Brake Pads (Front & Rear) for Toyota Hilux 2018-2023',
  500,
  'sets',
  7500.00,
  'USD',
  'mUSDC',
  'CIF Apapa Port, Lagos',
  'Sea Freight (FCL Container)',
  'Shenzhen Port, China',
  'Apapa Port, Lagos, Nigeria',
  7,
  '[{"id": "rc-1", "description": "Clean Bill of Lading with commercial invoice uploaded", "type": "shipment_proof", "satisfied": false}, {"id": "rc-2", "description": "Customs clearance and warehouse physical check completed within 7 days", "type": "inspection_passed", "satisfied": false}]'::jsonb,
  '[{"clause": "Damaged goods in excess of 2% tolerance entitle buyer to pro-rata escrow deduction", "allowed_remedies": ["partial_refund", "replacement"]}]'::jsonb,
  'Supplier guarantees all brake pads bear ISO 9001 and SONCAP certification markings.',
  true,
  NOW() - INTERVAL '2 days',
  true,
  NOW() - INTERVAL '1 day'
)
ON CONFLICT (id) DO NOTHING;

-- Link current version back to trade
UPDATE public.trade_agreements
SET current_version_id = 'v0000000-0000-0000-0000-000000000001'
WHERE id = 't0000000-0000-0000-0000-000000000001';

-- 5. Insert Trade Participants
INSERT INTO public.trade_participants (id, agreement_id, user_id, role, invited_email, invitation_accepted, joined_at)
VALUES
  ('p0000000-0000-0000-0000-000000000001', 't0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'buyer', 'buyer@lagosauto.ng', true, NOW() - INTERVAL '3 days'),
  ('p0000000-0000-0000-0000-000000000002', 't0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'supplier', 'supplier@shenzhentrade.cn', true, NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Sample Import Assessment
INSERT INTO public.import_assessments (
  id,
  user_id,
  agreement_id,
  status,
  product_description,
  product_category,
  quantity,
  declared_value,
  value_currency,
  freight_estimate,
  insurance_estimate,
  selected_hs_code,
  landed_cost_breakdown,
  regulatory_requirements,
  confidence_level,
  completed_at
)
VALUES (
  'i0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000002',
  't0000000-0000-0000-0000-000000000001',
  'completed',
  '500 Sets Ceramic Brake Pads for Toyota Hilux',
  'automotive_spare_parts',
  500,
  7500.00,
  'USD',
  1200.00,
  150.00,
  '8708.30.00',
  '{"fobValue": 7500, "freight": 1200, "insurance": 150, "cifValue": 8850, "customsDuty": 1770, "surcharge": 123.9, "ciss": 75, "etls": 44.25, "vat": 814.74, "categoryLevies": 0, "totalEstimatedLandedCost": 11677.89, "effectiveDutyRatePercent": 31.95, "currency": "USD"}'::jsonb,
  '[{"agency": "SON", "title": "SONCAP", "mandatory": true, "certificateRequired": "SONCAP", "description": "SONCAP certificate of conformity mandatory prior to shipment"}]'::jsonb,
  'high',
  NOW() - INTERVAL '1 day'
)
ON CONFLICT (id) DO NOTHING;

