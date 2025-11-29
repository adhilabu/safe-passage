-- Migration script to update existing profiles table
-- Run this in your Supabase SQL Editor

-- Add the missing preferredItineraryTypes column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS "preferredItineraryTypes" text[];

-- Drop old RLS policies
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

-- Recreate policies with correct user_id check
CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = user_id );
