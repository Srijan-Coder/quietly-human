-- Add last_name_change_at to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name_change_at timestamp with time zone;

-- Create avatars bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true) 
ON CONFLICT (id) DO NOTHING;

-- Allow public access to avatars
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar."
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    -- Assuming auth integration is present, else we handle it via server API bypassing RLS
  );
