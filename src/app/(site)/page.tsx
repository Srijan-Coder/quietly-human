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

  return (
    <HomeContentClient 
      stats={stats} 
      latestNotes={latestNotes || []} 
      latestPosts={latestPosts || []} 
    />
  );
}
