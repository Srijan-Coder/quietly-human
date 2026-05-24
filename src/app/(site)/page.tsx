import HomeContentClient from "./HomeContentClient";
import { supabaseClient } from "@/lib/supabase";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch some live stats for the Pulse section
  const { count: postsCount } = await supabaseClient.from("posts").select("*", { count: "exact", head: true });
  const { count: notesCount } = await supabaseClient.from("pilgrim_notes").select("*", { count: "exact", head: true });
  const { count: candlesCount } = await supabaseClient.from("candles").select("*", { count: "exact", head: true });

  const stats = {
    posts: postsCount || 0,
    notes: notesCount || 0,
    candles: candlesCount || 0
  };

  // Fetch top 3 latest pilgrim notes for the Bento box
  const { data: latestNotes } = await supabaseClient
    .from("pilgrim_notes")
    .select("id, content, created_at, profiles(username)")
    .order("created_at", { ascending: false })
    .limit(3);

  // Fetch 2 latest posts for the Bento box
  const { data: latestPosts } = await supabaseClient
    .from("posts")
    .select("id, title, slug, excerpt, created_at, profiles(username, display_name)")
    .eq("is_draft", false)
    .order("created_at", { ascending: false })
    .limit(2);

  // Fetch featured products (pins from profiles) for the Store promo section
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
      // Shuffle and take top 4
      featuredProducts = featuredProducts.sort(() => 0.5 - Math.random()).slice(0, 4);
    }
  } catch (e) {
    console.error("Failed to fetch products for homepage:", e);
  }

  return (
    <HomeContentClient 
      stats={stats} 
      latestNotes={latestNotes || []} 
      latestPosts={latestPosts || []} 
      featuredProducts={featuredProducts}
    />
  );
}
