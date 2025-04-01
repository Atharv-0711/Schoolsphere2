-- Add missing address fields to teacher_profiles table
ALTER TABLE teacher_profiles
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT;

-- Make sure realtime is enabled for this table
alter publication supabase_realtime add table teacher_profiles;