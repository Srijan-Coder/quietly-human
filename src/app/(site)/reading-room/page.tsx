import { supabaseClient } from "@/lib/supabase";
import GentleAd from "@/components/global/GentleAd";
import ReadingRoomClient from "./ReadingRoomClient";

export const metadata = {
  title: "The Reading Room | Quietly Humans",
  description: "A daily curated feed of quiet thoughts and midnight letters.",
};

export const revalidate = 60; // Revalidate every minute

export default async function ReadingRoomPage() {
  // Fetch latest published posts joined with author profiles
  // We added view_count implicitly, it might not exist yet in DB but supabase returns what it has
  const { data: posts, error } = await supabaseClient
    .from("posts")
    .select(`
      id, title, slug, type, content, published_at, candle_count, view_count,
      profiles ( id, username, display_name, avatar_url )
    `)
    .eq("is_draft", false)
    .order("published_at", { ascending: false })
    .limit(30);

  return (
    <>
      <ReadingRoomClient initialPosts={posts || []} />
      <div className="pb-32 bg-[#0d0d0d]">
        <GentleAd />
      </div>
    </>
  );
}
