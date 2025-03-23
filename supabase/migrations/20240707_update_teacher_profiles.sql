-- Update teacher_profiles table with additional fields
ALTER TABLE teacher_profiles
ADD COLUMN IF NOT EXISTS personal_information JSONB DEFAULT '{}'::JSONB,
ADD COLUMN IF NOT EXISTS professional_summary TEXT,
ADD COLUMN IF NOT EXISTS educational_qualifications JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS teaching_certifications JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS work_experience JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS teaching_methodologies TEXT[],
ADD COLUMN IF NOT EXISTS classroom_management_strategies TEXT[],
ADD COLUMN IF NOT EXISTS lesson_planning TEXT,
ADD COLUMN IF NOT EXISTS technological_proficiency TEXT[],
ADD COLUMN IF NOT EXISTS research_publications JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS workshops_training JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS extracurricular_activities TEXT[],
ADD COLUMN IF NOT EXISTS awards_recognitions JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS professional_memberships JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS references JSONB DEFAULT '[]'::JSONB,
ADD COLUMN IF NOT EXISTS current_school_id TEXT,
ADD COLUMN IF NOT EXISTS looking_for_school BOOLEAN DEFAULT TRUE;

-- Add foreign key constraint for current_school_id
ALTER TABLE teacher_profiles
ADD CONSTRAINT IF NOT EXISTS teacher_profiles_current_school_id_fkey
FOREIGN KEY (current_school_id) REFERENCES school_profiles(id) ON DELETE SET NULL;

-- Enable realtime for the updated table
alter publication supabase_realtime add table teacher_profiles;