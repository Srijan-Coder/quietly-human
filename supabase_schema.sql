-- 1. Create Profiles Table
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE public.profiles (
  id text NOT NULL PRIMARY KEY, -- Clerk User ID
  username text UNIQUE NOT NULL,
  display_name text,
  bio text,
  avatar_url text,
  stripe_customer_id text,
  is_premium boolean DEFAULT false,
  pins jsonb DEFAULT '[]'::jsonb,
  room_theme text DEFAULT 'dark', -- Sprint 6
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Follows Table
CREATE TABLE public.follows (
  follower_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (follower_id, following_id)
);

-- 3. Create Posts Table
CREATE TABLE public.posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('blog', 'quote', 'letter', 'ebook', 'guide')),
  title text NOT NULL,
  slug text UNIQUE,
  content text NOT NULL,
  category text, -- Sprint 6
  post_theme text DEFAULT 'default', -- Sprint 6
  cover_image_url text, -- Sprint 7
  pdf_file_url text, -- Sprint 7
  candle_count integer DEFAULT 0,
  is_draft boolean DEFAULT false,
  attached_pins jsonb DEFAULT '[]'::jsonb, -- Sprint 6 (Up to 3 pins)
  published_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Pilgrim Notes Table
CREATE TABLE public.pilgrim_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  candle_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Comments Table (Sprint 6)
CREATE TABLE public.comments (
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
CREATE TABLE public.candles (
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('post', 'note', 'comment')),
  target_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, target_type, target_id)
);

-- 7. Create Notifications Table
CREATE TABLE public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  actor_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('follow', 'candle_post', 'candle_note', 'candle_comment', 'comment', 'creator_heart')),
  target_id uuid, -- Optional reference to post, note, or comment
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create Page Views Table
CREATE TABLE public.page_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  path text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Create Link Clicks Table
CREATE TABLE public.link_clicks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilgrim_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Simple Policies (Open reads, restricted writes)
-- Note: We will use a Server Key for writes in API routes to bypass RLS initially, 
-- or we can use Clerk's JWT template. For now, let's allow read access to all.

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Public posts are viewable by everyone."
  ON public.posts FOR SELECT USING (is_draft = false);

CREATE POLICY "Public notes are viewable by everyone."
  ON public.pilgrim_notes FOR SELECT USING (true);

CREATE POLICY "Follows are viewable by everyone."
  ON public.follows FOR SELECT USING (true);

CREATE POLICY "Candles are viewable by everyone."
  ON public.candles FOR SELECT USING (true);

CREATE POLICY "Comments are viewable by everyone."
  ON public.comments FOR SELECT USING (true);

-- (Write policies will be enforced on our Next.js backend using the Supabase Service Role Key)

-- 10. Create Subscribers Table (Sprint 8)
CREATE TABLE public.subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subscriber_email text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(creator_id, subscriber_email)
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creators can view their subscribers"
  ON public.subscribers FOR SELECT USING (true); -- Read logic handled in backend
