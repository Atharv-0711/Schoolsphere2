-- Add missing columns to teacher_profiles table
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS zip_code TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS classroom_management JSONB;
ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS looking_for_school BOOLEAN DEFAULT TRUE;

alter publication supabase_realtime add table teacher_profiles;