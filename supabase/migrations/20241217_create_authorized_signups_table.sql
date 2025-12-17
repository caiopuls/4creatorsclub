-- Create authorized_signups table for secure signup flow
CREATE TABLE IF NOT EXISTS authorized_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  kiwify_order_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE authorized_signups ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role (webhook) to insert/update
-- We don't want public access to this table generally.
-- But for the setup-account page, we might need to check if an email exists.
-- A secure way is to use a database function or an API route that uses system privileges to check,
-- rather than exposing this table to public SELECT.
-- However, for simplicity in client-side validaton (if needed), we might allow read.
-- ideally we only allow the system api to read/write.

-- Allow authenticated users (e.g. admins) to view
CREATE POLICY "Allow authenticated view authorized_signups"
ON authorized_signups FOR SELECT
TO authenticated
USING (true);
