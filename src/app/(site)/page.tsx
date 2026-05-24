import HomeContentClient from "./HomeContentClient";
import { supabaseClient } from "@/lib/supabase";

export const revalidate = 60;

export default async function Home() {
  // Fetch live stats
  const { count: postsCount } = await supabaseClient.from("posts").select("*", { count: "exact", head: true });
  const { count: notesCount } = await supabaseClient.from("pilgrim_notes").select("*", { count: "exact", head: true });
  const { count: candlesCount } = await supabaseClient.from("candles").select("*", { count: "exact", head: true });
  const { count: membersCount } = await supabaseClient.from("profiles").select("*", { count: "exact", head: true });

  const stats = {
    posts: postsCount || 0,
    notes: notesCount || 0,
    candles: candlesCount || 0,
    members: membersCount || 0,
  };

  // Fetch 3 latest pilgrim notes
  const { data: latestNotes } = await supabaseClient
    .from("pilgrim_notes")
    .select("id, content, created_at, profiles(username)")
    .order("created_at", { ascending: false })
    .limit(3);

  // Fetch 6 latest posts (for trending section)
  const { data: latestPosts } = await supabaseClient
    .from("posts")
    .select("id, title, slug, excerpt, type, created_at, candle_count, view_count, profiles(username, display_name, avatar_url)")
    .eq("is_draft", false)
    .order("created_at", { ascending: false })
    .limit(6);

  // Fetch top 6 creators
  const { data: topCreators } = await supabaseClient
    .from("profiles")
    .select("id, username, display_name, avatar_url, bio, is_premium")
    .order("created_at", { ascending: true })
    .limit(6);

  // Fetch featured products (pins from profiles)
  let featuredProducts: any[] = [];
  try {
    const { data: profiles } = await supabaseClient
      .from("profiles")
      .select("username, display_name, avatar_url, pins")
      .not("pins", "is", null)
      .limit(10);

    if (profiles) {
      profiles.forEach(profile => {
        const pins = profile.pins || [];
        pins.forEach((pin: any) => {
          featuredProducts.push({
            ...pin,
            creatorUsername: profile.username,
            creatorName: profile.display_name || profile.username,
          });
        });
      });
    }
  } catch (e) {
    console.error("Failed to fetch products for homepage:", e);
  }

  return (
    <HomeContentClient 
      stats={stats} 
      latestNotes={latestNotes || []} 
      latestPosts={latestPosts || []} 
      topCreators={topCreators || []}
      featuredProducts={featuredProducts}
    />
  );
}
