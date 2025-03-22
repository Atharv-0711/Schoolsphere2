-- Fix the error with tables already being in the realtime publication
-- This script checks if tables exist in the publication before adding them

DO $$
BEGIN
  -- Check if teacher_profiles is already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'teacher_profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE teacher_profiles;
  END IF;
  
  -- Check if school_vacancies is already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'school_vacancies'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE school_vacancies;
  END IF;
  
  -- Check if vacancy_applications is already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'vacancy_applications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE vacancy_applications;
  END IF;
END
$$;