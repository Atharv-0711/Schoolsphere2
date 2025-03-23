-- Create messages table for parent-teacher communication
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES users(id),
  recipient_id UUID NOT NULL REFERENCES users(id),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  parent_message_id UUID REFERENCES messages(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_parent ON messages(parent_message_id);

-- Enable row level security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see their own messages (sent or received)
DROP POLICY IF EXISTS "Users can see their own messages" ON messages;
CREATE POLICY "Users can see their own messages"
ON messages FOR SELECT
USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- Create policy for users to insert their own messages
DROP POLICY IF EXISTS "Users can insert their own messages" ON messages;
CREATE POLICY "Users can insert their own messages"
ON messages FOR INSERT
WITH CHECK (sender_id = auth.uid());

-- Create policy for users to update their own messages
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
CREATE POLICY "Users can update their own messages"
ON messages FOR UPDATE
USING (sender_id = auth.uid());

-- Create meetings table for scheduling parent-teacher meetings
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES users(id),
  parent_id UUID NOT NULL REFERENCES users(id),
  student_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  meeting_link TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_meetings_teacher ON meetings(teacher_id);
CREATE INDEX IF NOT EXISTS idx_meetings_parent ON meetings(parent_id);
CREATE INDEX IF NOT EXISTS idx_meetings_student ON meetings(student_id);

-- Enable row level security
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Create policy for users to see meetings they're involved in
DROP POLICY IF EXISTS "Users can see their own meetings" ON meetings;
CREATE POLICY "Users can see their own meetings"
ON meetings FOR SELECT
USING (teacher_id = auth.uid() OR parent_id = auth.uid());

-- Create policy for teachers to insert meetings
DROP POLICY IF EXISTS "Teachers can insert meetings" ON meetings;
CREATE POLICY "Teachers can insert meetings"
ON meetings FOR INSERT
WITH CHECK (teacher_id = auth.uid());

-- Create policy for users to update meetings they created
DROP POLICY IF EXISTS "Users can update their own meetings" ON meetings;
CREATE POLICY "Users can update their own meetings"
ON meetings FOR UPDATE
USING (teacher_id = auth.uid() OR parent_id = auth.uid());

-- Add realtime support
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table meetings;