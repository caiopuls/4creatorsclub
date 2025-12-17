-- Ensure authenticated users can View all applications
DROP POLICY IF EXISTS "Allow authenticated view all applications" ON applications;
CREATE POLICY "Allow authenticated view all applications"
ON applications FOR SELECT
TO authenticated
USING (true);
