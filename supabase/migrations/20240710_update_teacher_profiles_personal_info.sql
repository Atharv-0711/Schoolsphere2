-- Add missing columns to teacher_profiles table for personal information
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS zip_code TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS classroom_management TEXT[];

-- Enable realtime for the updated table
alter publication supabase_realtime add table teacher_profiles;