-- Create school_profiles table
CREATE TABLE IF NOT EXISTS public.school_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  location TEXT NOT NULL,
  teacher_count INTEGER NOT NULL,
  student_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable row level security
ALTER TABLE public.school_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own school profile";
CREATE POLICY "Users can view their own school profile"
  ON public.school_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own school profile";
CREATE POLICY "Users can insert their own school profile"
  ON public.school_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own school profile";
CREATE POLICY "Users can update their own school profile"
  ON public.school_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Add to realtime publication
alter publication supabase_realtime add table school_profiles;