-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."users";
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."users";

-- Create new policies
CREATE POLICY "Enable insert for authenticated users only"
ON "public"."users"
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Enable read access for all users"
ON "public"."users"
FOR SELECT
USING (true);

-- Enable RLS on the users table
ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

-- Make sure the table is part of realtime
alter publication supabase_realtime add table users;