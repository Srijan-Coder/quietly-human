import { supabaseClient } from "@/lib/supabase";
import GentleAd from "@/components/global/GentleAd";
import ReadingRoomClient from "./ReadingRoomClient";
import { currentUser } from "@clerk/nextjs/server";

export const metadata = {
  title: "The Reading Room | Quietly Humans",
  description: "A daily curated feed of quiet thoughts and midnight letters.",
};

export const revalidate = 60; // Revalidate every minute

export default async function ReadingRoomPage() {
  const user = await currentUser();
  let followingIds: string[] = [];

  if (user) {
    // Fetch who the user is following
    const { data: follows } = await supabaseClient
      .from("follows")
      .select("following_id")
      .eq("follower_id", user.id);
      
    if (follows) {
      followingIds = follows.map(f => f.following_id);
    }
  }

  // Fetch a larger batch of posts to allow client-side filtering and sorting
  const { data: posts } = await supabaseClient
    .from("posts")
    .select(`
      id, title, slug, type, content, published_at, candle_count, view_count, author_id,
      profiles ( id, username, display_name, avatar_url )
    `)
    .eq("is_draft", false)
    .order("published_at", { ascending: false })
    .limit(100);

  // Fetch top profiles for Creator discovery
  const { data: profiles } = await supabaseClient
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, is_premium")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <>
      <ReadingRoomClient 
        initialPosts={posts || []} 
        initialProfiles={profiles || []}
        currentUserId={user?.id || null}
        followingIds={followingIds}
      />
      <div className="pb-32 bg-[#0d0d0d]">
        <GentleAd />
      </div>
    </>
  );
}
