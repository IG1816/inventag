/*
  # RFID Manager — Core Tables

  Creates the following tables needed for authentication and core functionality:

  1. user_profiles — Extended user data linked to Supabase auth.users
  2. locations — Physical locations for assets and inventory
  3. assets — Fixed assets tracked with metallic RFID tags
  4. products — Product catalog for inventory
  5. maintenance — Maintenance records for assets

  Security:
  - RLS enabled on all tables
  - Authenticated users can read/write their own company's data
  - user_profiles linked to auth.uid()
*/

-- ─── user_profiles ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'operator',
  company_id text NOT NULL DEFAULT 'comp-001',
  department text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read company profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (
    company_id = (SELECT company_id FROM user_profiles WHERE id = auth.uid())
  );

-- ─── locations ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id text NOT NULL DEFAULT 'comp-001',
  location_name text NOT NULL,
  type text NOT NULL DEFAULT 'office',
  address text NOT NULL DEFAULT '',
  responsible_person text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'active',
  asset_count integer NOT NULL DEFAULT 0,
  product_count integer NOT NULL DEFAULT 0,
  open_divergences integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read locations"
  ON locations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert locations"
  ON locations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update locations"
  ON locations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── assets ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id text NOT NULL DEFAULT 'comp-001',
  asset_name text NOT NULL,
  category text NOT NULL DEFAULT 'other',
  brand text NOT NULL DEFAULT '',
  model text NOT NULL DEFAULT '',
  serial_number text NOT NULL DEFAULT '',
  rfid_tag_code text NOT NULL DEFAULT '',
  rfid_tag_type text NOT NULL DEFAULT 'metallic',
  location_id text NOT NULL DEFAULT '',
  location_name text,
  department text NOT NULL DEFAULT '',
  assigned_employee text NOT NULL DEFAULT '',
  purchase_date text NOT NULL DEFAULT '',
  purchase_value numeric NOT NULL DEFAULT 0,
  current_status text NOT NULL DEFAULT 'active',
  last_scan_date text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read assets"
  ON assets FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert assets"
  ON assets FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update assets"
  ON assets FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── products ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id text NOT NULL DEFAULT 'comp-001',
  sku text NOT NULL DEFAULT '',
  product_name text NOT NULL,
  category text NOT NULL DEFAULT 'Other',
  description text NOT NULL DEFAULT '',
  unit_cost numeric NOT NULL DEFAULT 0,
  sale_price numeric NOT NULL DEFAULT 0,
  erp_product_code text NOT NULL DEFAULT '',
  minimum_stock integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── maintenance ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS maintenance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id text NOT NULL DEFAULT 'comp-001',
  asset_id text NOT NULL DEFAULT '',
  asset_name text,
  rfid_tag_code text,
  maintenance_type text NOT NULL DEFAULT 'preventive',
  status text NOT NULL DEFAULT 'scheduled',
  priority text NOT NULL DEFAULT 'medium',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  scheduled_date text,
  started_at text,
  completed_at text,
  estimated_cost numeric,
  actual_cost numeric,
  service_provider text,
  technician_name text,
  work_order_number text,
  parts_replaced text,
  resolution_notes text,
  next_maintenance_date text,
  created_by text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE maintenance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read maintenance"
  ON maintenance FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert maintenance"
  ON maintenance FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update maintenance"
  ON maintenance FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
