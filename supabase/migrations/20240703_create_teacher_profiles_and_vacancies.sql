-- Create teacher_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS teacher_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  qualification TEXT NOT NULL,
  experience INTEGER NOT NULL,
  subjects TEXT NOT NULL,
  grade_levels TEXT NOT NULL,
  bio TEXT NOT NULL,
  resume_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create school_vacancies table if it doesn't exist
CREATE TABLE IF NOT EXISTS school_vacancies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  position TEXT NOT NULL,
  grade_levels TEXT NOT NULL,
  subjects TEXT NOT NULL,
  location TEXT NOT NULL,
  salary_range TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  application_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vacancy_applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS vacancy_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vacancy_id UUID NOT NULL REFERENCES school_vacancies(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  cover_letter TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vacancy_id, teacher_id)
);

-- Create storage bucket for resumes if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the tables
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE vacancy_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for teacher_profiles
DROP POLICY IF EXISTS "Teachers can view their own profiles" ON teacher_profiles;
CREATE POLICY "Teachers can view their own profiles"
ON teacher_profiles FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Teachers can insert their own profiles" ON teacher_profiles;
CREATE POLICY "Teachers can insert their own profiles"
ON teacher_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Teachers can update their own profiles" ON teacher_profiles;
CREATE POLICY "Teachers can update their own profiles"
ON teacher_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create policies for school_vacancies
DROP POLICY IF EXISTS "School admins can manage their vacancies" ON school_vacancies;
CREATE POLICY "School admins can manage their vacancies"
ON school_vacancies FOR ALL
USING (auth.uid() = school_id);

DROP POLICY IF EXISTS "Everyone can view active vacancies" ON school_vacancies;
CREATE POLICY "Everyone can view active vacancies"
ON school_vacancies FOR SELECT
USING (is_active = true);

-- Create policies for vacancy_applications
DROP POLICY IF EXISTS "Teachers can view their own applications" ON vacancy_applications;
CREATE POLICY "Teachers can view their own applications"
ON vacancy_applications FOR SELECT
USING (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Teachers can insert their own applications" ON vacancy_applications;
CREATE POLICY "Teachers can insert their own applications"
ON vacancy_applications FOR INSERT
WITH CHECK (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Schools can view applications for their vacancies" ON vacancy_applications;
CREATE POLICY "Schools can view applications for their vacancies"
ON vacancy_applications FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM school_vacancies sv
    WHERE sv.id = vacancy_id AND sv.school_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Schools can update application status" ON vacancy_applications;
CREATE POLICY "Schools can update application status"
ON vacancy_applications FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM school_vacancies sv
    WHERE sv.id = vacancy_id AND sv.school_id = auth.uid()
  )
);

-- Add tables to realtime publication
alter publication supabase_realtime add table teacher_profiles;
alter publication supabase_realtime add table school_vacancies;
alter publication supabase_realtime add table vacancy_applications;