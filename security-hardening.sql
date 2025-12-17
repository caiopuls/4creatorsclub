-- SECURITY HARDENING & RLS POLICIES
-- Run this script in the Supabase SQL Editor

-- 1. JOBS POLICIES
-- Ensure RLS is enabled
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Allow INSERT only if the authenticated user is the owner
DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON jobs;
CREATE POLICY "Users can only insert their own jobs" ON jobs 
FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    auth.uid() = owner_id
);

-- Allow UPDATE only if the user owns the job
DROP POLICY IF EXISTS "Users can update own jobs" ON jobs;
CREATE POLICY "Users can update own jobs" ON jobs 
FOR UPDATE USING (
    auth.uid() = owner_id
);

-- Allow DELETE only if the user owns the job
DROP POLICY IF EXISTS "Users can delete own jobs" ON jobs;
CREATE POLICY "Users can delete own jobs" ON jobs 
FOR DELETE USING (
    auth.uid() = owner_id
);

-- Allow SELECT for everyone (Public Marketplace)
DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON jobs;
CREATE POLICY "Jobs are viewable by everyone" ON jobs 
FOR SELECT USING (true);


-- 2. STARTUPS POLICIES
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;

-- Insert own only
DROP POLICY IF EXISTS "Authenticated users can insert startups" ON startups;
CREATE POLICY "Users can only insert their own startups" ON startups 
FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND 
    auth.uid() = owner_id
);

-- Update own only
DROP POLICY IF EXISTS "Users can update own startups" ON startups;
CREATE POLICY "Users can update own startups" ON startups 
FOR UPDATE USING (
    auth.uid() = owner_id
);

-- Delete own only
DROP POLICY IF EXISTS "Users can delete own startups" ON startups;
CREATE POLICY "Users can delete own startups" ON startups 
FOR DELETE USING (
    auth.uid() = owner_id
);

-- Select Public
DROP POLICY IF EXISTS "Startups are viewable by everyone" ON startups;
CREATE POLICY "Startups are viewable by everyone" ON startups 
FOR SELECT USING (true);


-- 3. PROFILES POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can update only their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles 
FOR UPDATE USING (
    auth.uid() = id
);

-- Profiles are viewable by everyone (needed for Job Cards etc)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" ON profiles 
FOR SELECT USING (true);


-- 4. APPLICATIONS POLICIES (Job Applications)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Insert: Authenticated users can apply (applicant_id must match auth.uid)
DROP POLICY IF EXISTS "Users can apply to jobs" ON applications;
CREATE POLICY "Users can apply to jobs" ON applications
FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    auth.uid() = applicant_id
);

-- Select: Applicant can see own applications OR Job Owner can see applications for their jobs
DROP POLICY IF EXISTS "View applications" ON applications;
CREATE POLICY "View applications" ON applications
FOR SELECT USING (
    auth.uid() = applicant_id OR 
    EXISTS (
        SELECT 1 FROM jobs 
        WHERE jobs.id = applications.job_id 
        AND jobs.owner_id = auth.uid()
    )
);


-- 5. STARTUP INTERESTS POLICIES
ALTER TABLE startup_interests ENABLE ROW LEVEL SECURITY;

-- Insert: Authenticated users can express interest
DROP POLICY IF EXISTS "Users can express interest" ON startup_interests;
CREATE POLICY "Users can express interest" ON startup_interests
FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    auth.uid() = interested_profile_id
);

-- Select: Interested user OR Startup Owner
DROP POLICY IF EXISTS "View startup interests" ON startup_interests;
CREATE POLICY "View startup interests" ON startup_interests
FOR SELECT USING (
    auth.uid() = interested_profile_id OR
    EXISTS (
        SELECT 1 FROM startups 
        WHERE startups.id = startup_interests.startup_id 
        AND startups.owner_id = auth.uid()
    )
);

-- 6. FAVORITES POLICIES
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users can manage their own favorites
DROP POLICY IF EXISTS "Manage favorites" ON favorites;
CREATE POLICY "Manage favorites" ON favorites
FOR ALL USING (
    auth.uid() = user_id
);
