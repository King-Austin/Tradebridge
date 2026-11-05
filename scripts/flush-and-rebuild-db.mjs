import fs from 'fs';

const projectRef = process.env.SUPABASE_PROJECT_REF || 'drmbnxuycnjqxulvhpgy';
const token = process.env.SUPABASE_ACCESS_TOKEN || '';
const apiUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

async function executeSql(query, description) {
  const trimmed = query.trim();
  if (!trimmed) return true;

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: trimmed }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`[FAILED] ${description}:`, errText);
    throw new Error(errText);
  }
  console.log(`[SUCCESS] ${description}`);
  return true;
}

function cleanStatements(rawSql) {
  return rawSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => {
      const withoutComments = s.replace(/--.*$/gm, '').trim();
      return withoutComments.length > 5;
    });
}

async function run() {
  console.log('=== Step 1: Flushing and Wiping Public Schema ===');
  await executeSql(`
    DROP SCHEMA IF EXISTS public CASCADE;
    CREATE SCHEMA public;
    GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
    GRANT ALL ON SCHEMA public TO postgres, anon, authenticated, service_role;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
  `, 'Drop and recreate public schema');

  console.log('\n=== Step 2: Applying Core TradeGuard Tables ===');
  const schemaSql = fs.readFileSync('supabase/migrations/20260301000001_core_schema.sql', 'utf8');
  const statements = cleanStatements(schemaSql);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => !l.startsWith('--'))[0] || 'statement';
    await executeSql(stmt, `Table/Index ${i + 1}/${statements.length}: ${preview.substring(0, 50)}`);
  }

  console.log('\n=== Step 3: Installing is_admin() Function ===');
  await executeSql(`
    CREATE OR REPLACE FUNCTION public.is_admin()
    RETURNS BOOLEAN AS $$
    BEGIN
      RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
      );
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `, 'public.is_admin() function');

  console.log('\n=== Step 4: Applying Row Level Security (RLS) Policies ===');
  const policies = [
    `CREATE POLICY "Users can view own profile or admins can view all" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());`,
    `CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);`,
    `CREATE POLICY "Users can insert own profile upon signup" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);`,
    `CREATE POLICY "Users can manage own wallets" ON public.wallets FOR ALL USING (auth.uid() = user_id OR public.is_admin());`,
    `CREATE POLICY "Participants or admins can view trade agreements" ON public.trade_agreements FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = supplier_id OR auth.uid() = created_by OR public.is_admin());`,
    `CREATE POLICY "Authenticated users can create trade agreements" ON public.trade_agreements FOR INSERT WITH CHECK (auth.uid() = created_by);`,
    `CREATE POLICY "Participants can update their trade agreement" ON public.trade_agreements FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = supplier_id OR auth.uid() = created_by OR public.is_admin());`,
    `CREATE POLICY "View agreement versions if participant on parent trade" ON public.agreement_versions FOR SELECT USING (EXISTS (SELECT 1 FROM public.trade_agreements t WHERE t.id = agreement_id AND (t.buyer_id = auth.uid() OR t.supplier_id = auth.uid() OR t.created_by = auth.uid() OR public.is_admin())));`,
    `CREATE POLICY "Insert agreement versions if participant on parent trade" ON public.agreement_versions FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.trade_agreements t WHERE t.id = agreement_id AND (t.buyer_id = auth.uid() OR t.supplier_id = auth.uid() OR t.created_by = auth.uid() OR public.is_admin())));`,
    `CREATE POLICY "Update agreement versions if participant" ON public.agreement_versions FOR UPDATE USING (EXISTS (SELECT 1 FROM public.trade_agreements t WHERE t.id = agreement_id AND (t.buyer_id = auth.uid() OR t.supplier_id = auth.uid() OR t.created_by = auth.uid() OR public.is_admin())));`,
    `CREATE POLICY "Read participants for trade" ON public.trade_participants FOR SELECT USING (user_id = auth.uid() OR invitation_token IS NOT NULL OR EXISTS (SELECT 1 FROM public.trade_agreements t WHERE t.id = agreement_id AND (t.buyer_id = auth.uid() OR t.supplier_id = auth.uid() OR t.created_by = auth.uid() OR public.is_admin())));`,
    `CREATE POLICY "Manage participants" ON public.trade_participants FOR ALL USING (EXISTS (SELECT 1 FROM public.trade_agreements t WHERE t.id = agreement_id AND (t.created_by = auth.uid() OR public.is_admin())));`,
    `CREATE POLICY "Read escrow records if participant or admin" ON public.escrow_records FOR SELECT USING (EXISTS (SELECT 1 FROM public.trade_agreements t WHERE t.id = agreement_id AND (t.buyer_id = auth.uid() OR t.supplier_id = auth.uid() OR public.is_admin())));`,
    `CREATE POLICY "Users can view their own funding transactions" ON public.funding_transactions FOR SELECT USING (user_id = auth.uid() OR public.is_admin());`,
    `CREATE POLICY "Users can view and manage their own assessments" ON public.import_assessments FOR ALL USING (user_id = auth.uid() OR public.is_admin());`,
    `CREATE POLICY "Users can view assessment sources" ON public.assessment_sources FOR SELECT USING (EXISTS (SELECT 1 FROM public.import_assessments a WHERE a.id = assessment_id AND (a.user_id = auth.uid() OR public.is_admin())));`,
    `CREATE POLICY "Only admins can view audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin());`,
    `CREATE POLICY "Authenticated users can create audit log entries" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() = actor_id OR public.is_admin());`,
  ];

  for (let i = 0; i < policies.length; i++) {
    await executeSql(policies[i], `Policy ${i + 1}/${policies.length}`);
  }

  console.log('\n=== Step 5: Verification of Clean Public Schema ===');
  const verifyRes = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `,
    }),
  });

  const tables = await verifyRes.json();
  console.log('\n--- Final Public Tables in Supabase ---');
  console.log(tables);
  console.log(`Total tables: ${tables.length}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

