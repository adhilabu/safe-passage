-- Complete migration to fix profiles table schema
-- Run this in your Supabase SQL Editor

-- First, check if the table exists and what columns it has
-- You can run: SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles';

-- Add missing columns if they don't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS "preferredItineraryTypes" text[];

-- Ensure all columns have correct types
-- Note: These will only run if the column doesn't exist or needs modification

-- Update the updatedAt column to use camelCase (if it's using snake_case)
DO $$ 
BEGIN
    -- Check if updated_at exists and rename it
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE profiles RENAME COLUMN updated_at TO "updatedAt";
    END IF;
    
    -- Check if created_at exists and rename it
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE profiles RENAME COLUMN created_at TO "createdAt";
    END IF;
END $$;

-- Ensure RLS policies are correct
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

-- Recreate policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = user_id );

-- Verify the schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
