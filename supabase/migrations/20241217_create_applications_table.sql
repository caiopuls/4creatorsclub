-- Create applications table for 4c Club Founder Application
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  instagram TEXT NOT NULL,
  current_status TEXT NOT NULL,
  goal TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert (for application form)
CREATE POLICY "Allow public insert to applications"
ON applications FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Allow admins/authenticated users to view all
CREATE POLICY "Allow authenticated view all applications"
ON applications FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow admins/authenticated users to update/delete
CREATE POLICY "Allow authenticated update applications"
ON applications FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated delete applications"
ON applications FOR DELETE
TO authenticated
USING (true);
