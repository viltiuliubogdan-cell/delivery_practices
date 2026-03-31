# Delivery Practices App — Setup Guide

## 1. Create a Supabase Project
1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to **Project Settings → API** and copy:
   - **Project URL**
   - **anon / public key**

## 2. Configure Environment Variables
Open `.env.local` and replace the placeholders:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Set Up the Database
Go to your Supabase project → **SQL Editor** → **New query** and run the following:

```sql
-- Projects (one per PM user)
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pm_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project config (goals, market value)
CREATE TABLE project_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
  market_added_value TEXT,
  customer_cnps_goal NUMERIC,
  employee_enps_goal NUMERIC,
  employee_attrition_goal NUMERIC,
  employee_participation_goal NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stakeholders
CREATE TABLE stakeholders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  influence TEXT,
  interest TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Health metric selections + objectives
CREATE TABLE health_metric_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  metric_key TEXT NOT NULL,
  metric_label TEXT NOT NULL,
  metric_category TEXT NOT NULL,
  is_selected BOOLEAN DEFAULT false,
  objective TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, metric_key)
);

-- NFR selections + expectations
CREATE TABLE nfr_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  requirement_key TEXT NOT NULL,
  requirement_label TEXT NOT NULL,
  is_selected BOOLEAN DEFAULT false,
  expectation TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, requirement_key)
);

-- Monthly actual metrics
CREATE TABLE monthly_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  customer_cnps NUMERIC,
  employee_enps NUMERIC,
  employee_attrition NUMERIC,
  employee_participation NUMERIC,
  velocity NUMERIC,
  cycle_time NUMERIC,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, month)
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metric_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfr_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_metrics ENABLE ROW LEVEL SECURITY;

-- Owners can write their own data
CREATE POLICY "Owner write projects" ON projects USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owner write config" ON project_config USING (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id)) WITH CHECK (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));
CREATE POLICY "Owner write stakeholders" ON stakeholders USING (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id)) WITH CHECK (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));
CREATE POLICY "Owner write health_metrics" ON health_metric_configs USING (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id)) WITH CHECK (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));
CREATE POLICY "Owner write nfr" ON nfr_configs USING (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id)) WITH CHECK (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));
CREATE POLICY "Owner write monthly" ON monthly_metrics USING (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id)) WITH CHECK (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));

-- Dashboard: everyone can read all project data
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read config" ON project_config FOR SELECT USING (true);
CREATE POLICY "Public read stakeholders" ON stakeholders FOR SELECT USING (true);
CREATE POLICY "Public read health_metrics" ON health_metric_configs FOR SELECT USING (true);
CREATE POLICY "Public read nfr" ON nfr_configs FOR SELECT USING (true);
CREATE POLICY "Public read monthly" ON monthly_metrics FOR SELECT USING (true);
```

## 4. Enable Email Auth in Supabase
Go to **Authentication → Providers → Email** and ensure it is enabled.

Optionally disable "Confirm email" for faster testing:
**Authentication → Settings → Email → Confirm email** → toggle off.

## 5. Run the App
```bash
npm run dev
```
App will be available at http://localhost:5173
