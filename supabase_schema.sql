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
  type text NOT NULL CHECK (type IN ('letter', 'quote', 'blog')),
  title text,
  slug text UNIQUE,
  content text NOT NULL,
  candle_count integer DEFAULT 0,
  is_draft boolean DEFAULT false,
  published_at timestamp with time zone,
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

-- 5. Create Candles Table
CREATE TABLE public.candles (
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('post', 'note')),
  target_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, target_type, target_id)
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilgrim_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candles ENABLE ROW LEVEL SECURITY;

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

-- (Write policies will be enforced on our Next.js backend using the Supabase Service Role Key)
