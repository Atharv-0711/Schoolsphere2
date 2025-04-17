ALTER TABLE teacher_profiles ADD COLUMN IF NOT EXISTS country TEXT;
alter publication supabase_realtime add table teacher_profiles;