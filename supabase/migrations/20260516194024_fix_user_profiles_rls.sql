/*
  # Fix user_profiles RLS policies

  The previous policy that reads company profiles had a self-referencing
  subquery that could cause infinite recursion and fail on first login.
  Simplified to: authenticated users can read all profiles (needed for
  admin user management) and write only their own.
*/

-- Drop the problematic company-wide read policy
DROP POLICY IF EXISTS "Users can read company profiles" ON user_profiles;

-- Replace with simpler: any authenticated user can read any profile
-- (access control is handled at the app layer by company_id filtering)
CREATE POLICY "Authenticated users can read profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);
