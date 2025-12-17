-- Add images column to jobs and startups
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS images TEXT[];
ALTER TABLE startups ADD COLUMN IF NOT EXISTS images TEXT[];

-- Update RLS to allow updating images (covered by existing update policies)
