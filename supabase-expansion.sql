-- Execute this in the Supabase SQL Editor to add Startups functionality

-- 1. STARTUPS Table
CREATE TABLE IF NOT EXISTS startups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Info
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  niche TEXT NOT NULL, -- e.g. Fintech, Edtech
  website_url TEXT,
  logo_url TEXT,
  
  -- Metrics (Optional)
  foundation_year INTEGER,
  team_size INTEGER,
  mrr NUMERIC, -- Monthly Recurring Revenue
  cac NUMERIC, -- Customer Acquisition Cost
  ltv NUMERIC, -- Lifetime Value
  
  -- Deal Info
  type TEXT NOT NULL CHECK (type IN ('sale', 'investment')), -- Venda Total ou Investimento
  ask_price NUMERIC NOT NULL, -- Valor pedido (Valuation ou Preço de Venda)
  equity_percentage NUMERIC, -- Se for investimento, quanto % está à venda
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'delisted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STARTUP INTERESTS (Quem mostrou interesse)
CREATE TABLE IF NOT EXISTS startup_interests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  startup_id UUID REFERENCES startups(id) ON DELETE CASCADE NOT NULL,
  interested_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(startup_id, interested_profile_id)
);

-- RLS POLICIES

-- Enable RLS
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_interests ENABLE ROW LEVEL SECURITY;

-- Startups: Public read, Owner update/delete
DROP POLICY IF EXISTS "Startups are viewable by everyone" ON startups;
CREATE POLICY "Startups are viewable by everyone" ON startups FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert startups" ON startups;
CREATE POLICY "Authenticated users can insert startups" ON startups FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own startups" ON startups;
CREATE POLICY "Users can update own startups" ON startups FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own startups" ON startups;
CREATE POLICY "Users can delete own startups" ON startups FOR DELETE USING (auth.uid() = owner_id);

-- Interests: Owner of startup can view, Interested user can view
DROP POLICY IF EXISTS "Interested users can see their own interest" ON startup_interests;
CREATE POLICY "Interested users can see their own interest" ON startup_interests FOR SELECT USING (auth.uid() = interested_profile_id);

DROP POLICY IF EXISTS "Startup owners can see interests" ON startup_interests;
CREATE POLICY "Startup owners can see interests" ON startup_interests FOR SELECT USING (EXISTS (SELECT 1 FROM startups WHERE startups.id = startup_interests.startup_id AND startups.owner_id = auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can express interest" ON startup_interests;
CREATE POLICY "Authenticated users can express interest" ON startup_interests FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. PROFILES UPDATES (Agency Support)
-- Run this block if you haven't already
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_type TEXT CHECK (profile_type IN ('freelancer', 'agency')) DEFAULT 'freelancer';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cnpj TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS years_experience INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Allow users to update their own profile columns
-- (Assuming there is already a policy for updating own profile, if not:)
-- CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 4. JOBS UPDATES (Plans Support)
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS plans JSONB; -- Stores array of { title, price, ... }

-- 5. JOBS CONSTRAINT UPDATE (Fix for new pricing models)
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_format_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_format_check CHECK (format IN ('project', 'hourly', 'monthly', 'yearly', 'fixed'));

-- 6. JOBS RLS POLICIES (Visibility)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON jobs;
CREATE POLICY "Jobs are viewable by everyone" ON jobs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON jobs;
CREATE POLICY "Authenticated users can insert jobs" ON jobs FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own jobs" ON jobs;
CREATE POLICY "Users can update own jobs" ON jobs FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own jobs" ON jobs;
CREATE POLICY "Users can delete own jobs" ON jobs FOR DELETE USING (auth.uid() = owner_id);

