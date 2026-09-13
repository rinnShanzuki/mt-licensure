-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- 1. Create a table to store user progress
CREATE TABLE user_progress (
  user_id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  progress_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS) for user_progress
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress" 
  ON user_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
  ON user_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON user_progress FOR UPDATE 
  USING (auth.uid() = user_id);

-- 2. Create a table to store valid access codes and link them to users
CREATE TABLE access_codes (
  code TEXT PRIMARY KEY,
  is_used BOOLEAN DEFAULT false,
  used_by UUID REFERENCES auth.users,
  used_at TIMESTAMP WITH TIME ZONE
);

-- Set up Row Level Security (RLS) for access_codes
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

-- Anyone can read an access code to check if it exists and is unused
CREATE POLICY "Anyone can read access codes" 
  ON access_codes FOR SELECT 
  TO public
  USING (true);

-- Only authenticated users can update a code (to mark it as used by them)
CREATE POLICY "Users can claim an unused access code" 
  ON access_codes FOR UPDATE 
  USING (auth.uid() IS NOT NULL AND is_used = false)
  WITH CHECK (used_by = auth.uid() AND is_used = true);

-- Add a trigger to update 'updated_at' on user_progress
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_progress_updated_at
BEFORE UPDATE ON user_progress
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 3. Create a table to designate admin users
CREATE TABLE admin_users (
  user_id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS) for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can check if they are an admin" 
  ON admin_users FOR SELECT 
  USING (auth.uid() = user_id);


-- Function to allow admins to securely view user emails for claimed codes
CREATE OR REPLACE FUNCTION get_admin_recent_codes()
RETURNS TABLE (
    code text,
    is_used boolean,
    used_at timestamp with time zone,
    user_email varchar
) 
SECURITY DEFINER
AS $$
BEGIN
    -- Check if the calling user is an admin
    IF NOT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()) THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    RETURN QUERY
    SELECT 
        ac.code,
        ac.is_used,
        ac.used_at,
        au.email::varchar
    FROM public.access_codes ac
    LEFT JOIN auth.users au ON ac.used_by = au.id
    ORDER BY ac.used_at DESC NULLS LAST
    LIMIT 20;
END;
$$ LANGUAGE plpgsql;

CREATE POLICY "Admins can insert access codes" 
  ON access_codes FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- Note: You should populate the `access_codes` table or use the Admin panel.
-- IMPORTANT: To use the admin panel, you MUST manually insert your UUID into `admin_users` via the Supabase Dashboard.

-- Function to reliably check if the current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
END;
$$ LANGUAGE plpgsql;
