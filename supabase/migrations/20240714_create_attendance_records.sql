-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    marked_by UUID NOT NULL REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(class_id, student_id, date)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS attendance_records_class_id_idx ON attendance_records(class_id);
CREATE INDEX IF NOT EXISTS attendance_records_student_id_idx ON attendance_records(student_id);
CREATE INDEX IF NOT EXISTS attendance_records_date_idx ON attendance_records(date);

-- Enable row-level security
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Add to realtime publication
alter publication supabase_realtime add table attendance_records;
