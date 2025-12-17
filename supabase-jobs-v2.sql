-- Add new columns for Job Flexibility and Services
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS listing_type text DEFAULT 'hiring' CHECK (listing_type IN ('hiring', 'freelancing')),
ADD COLUMN IF NOT EXISTS deadline_type text DEFAULT 'date' CHECK (deadline_type IN ('date', 'duration', 'flexible')),
ADD COLUMN IF NOT EXISTS duration_text text;

-- Comment on columns
COMMENT ON COLUMN public.jobs.listing_type IS 'hiring = Client seeking Talent; freelancing = Talent offering Service';
COMMENT ON COLUMN public.jobs.deadline_type IS 'Type of deadline: specific date, duration (e.g., 30 days), or flexible';
COMMENT ON COLUMN public.jobs.duration_text IS 'Text for duration, e.g., "30 dias" or "3 meses"';
