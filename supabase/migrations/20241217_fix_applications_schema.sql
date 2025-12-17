-- Fix for missing columns in applications table
-- This handles cases where the table already existed with a different schema

ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS current_status TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS goal TEXT;

-- Drop constraints if they exist to avoid conflicts when re-adding
ALTER TABLE public.applications DROP CONSTRAINT IF EXISTS applications_status_check;

-- Ensure status column exists and has proper check
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

ALTER TABLE public.applications 
ADD CONSTRAINT applications_status_check 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Fix for existing legacy column 'job_id' that shouldn't be required for Club Applications
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'job_id') THEN
        ALTER TABLE public.applications ALTER COLUMN job_id DROP NOT NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'applicant_id') THEN
        ALTER TABLE public.applications ALTER COLUMN applicant_id DROP NOT NULL;
    END IF;
END $$;

-- Reload the schema cache is automatic in Supabase usually, but good to know this runs.
