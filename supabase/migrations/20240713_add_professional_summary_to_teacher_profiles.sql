-- Add professional_summary column to teacher_profiles table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'teacher_profiles' AND column_name = 'professional_summary') THEN
    ALTER TABLE teacher_profiles ADD COLUMN professional_summary TEXT;
  END IF;
END $$;

-- Update realtime publication
alter publication supabase_realtime add table teacher_profiles;