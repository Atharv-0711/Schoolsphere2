-- Enable RLS on teacher_profiles table
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own profiles
DROP POLICY IF EXISTS "Users can insert their own teacher profiles" ON teacher_profiles;
CREATE POLICY "Users can insert their own teacher profiles"
  ON teacher_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to select their own profiles
DROP POLICY IF EXISTS "Users can view their own teacher profiles" ON teacher_profiles;
CREATE POLICY "Users can view their own teacher profiles"
  ON teacher_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to update their own profiles
DROP POLICY IF EXISTS "Users can update their own teacher profiles" ON teacher_profiles;
CREATE POLICY "Users can update their own teacher profiles"
  ON teacher_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own profiles
DROP POLICY IF EXISTS "Users can delete their own teacher profiles" ON teacher_profiles;
CREATE POLICY "Users can delete their own teacher profiles"
  ON teacher_profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policy to allow storage access for resumes bucket
DROP POLICY IF EXISTS "Storage access for authenticated users" ON storage.objects;
CREATE POLICY "Storage access for authenticated users"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'resumes');
