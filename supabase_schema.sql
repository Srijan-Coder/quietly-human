-- Quietly Humans - Master Supabase Schema
-- Safely creates tables, columns, and storage buckets without destroying existing data.

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id text NOT NULL PRIMARY KEY, -- Clerk User ID
  username text UNIQUE NOT NULL,
  display_name text,
  bio text,
  avatar_url text,
  stripe_customer_id text,
  is_premium boolean DEFAULT false,
  pins jsonb DEFAULT '[]'::jsonb,
  room_theme text DEFAULT 'dark',
  last_name_change_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add last_name_change_at if it was missing from earlier schema versions
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='last_name_change_at') THEN
        ALTER TABLE public.profiles ADD COLUMN last_name_change_at timestamp with time zone;
    END IF;
END $$;

-- 2. Create Follows Table
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (follower_id, following_id)
);

-- 3. Create Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('blog', 'quote', 'letter', 'ebook', 'guide')),
  title text NOT NULL,
  slug text UNIQUE,
  content text NOT NULL,
  category text, 
  post_theme text DEFAULT 'default', 
  cover_image_url text, 
  pdf_file_url text, 
  candle_count integer DEFAULT 0,
  is_draft boolean DEFAULT false,
  attached_pins jsonb DEFAULT '[]'::jsonb, 
  published_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Pilgrim Notes Table
CREATE TABLE IF NOT EXISTS public.pilgrim_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  candle_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  candle_count integer DEFAULT 0,
  has_creator_heart boolean DEFAULT false,
  is_pinned boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create Candles Table
CREATE TABLE IF NOT EXISTS public.candles (
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('post', 'note', 'comment')),
  target_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, target_type, target_id)
);

-- 7. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('follow', 'candle_post', 'candle_note', 'candle_comment', 'comment', 'creator_heart')),
  target_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Create Page Views Table
CREATE TABLE IF NOT EXISTS public.page_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  path text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Create Link Clicks Table
CREATE TABLE IF NOT EXISTS public.link_clicks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Create Subscribers Table
CREATE TABLE IF NOT EXISTS public.subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscriber_email text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(creator_id, subscriber_email)
);

-- Turn on Row Level Security (RLS) safely
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilgrim_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Storage Setup: Create 'avatars' bucket safely
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true) 
ON CONFLICT (id) DO NOTHING;

-- RLS for Storage (Drop if exists to recreate safely)
DROP POLICY IF EXISTS "Avatar images are publicly accessible." ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload their own avatar." ON storage.objects;
CREATE POLICY "Users can upload their own avatar."
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
