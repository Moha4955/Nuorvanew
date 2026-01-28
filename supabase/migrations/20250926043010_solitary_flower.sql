/*
  # Fix RLS Infinite Recursion

  1. Security Changes
    - Drop all existing policies on user_profiles
    - Create simple, non-recursive policies
    - Use auth.uid() directly without table lookups
    
  2. Policy Structure
    - Users can insert their own profile (auth.uid() = id)
    - Users can read their own profile (auth.uid() = id) 
    - Users can update their own profile (auth.uid() = id)
    - Service role can bypass RLS for admin operations
*/

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can insert own profile during registration" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Enable insert for users based on user_id"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read access for own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable update for own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow service role to bypass RLS for admin operations
CREATE POLICY "Enable all access for service role"
  ON user_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);