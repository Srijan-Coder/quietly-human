import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: postId } = await params;
    if (!postId) {
      return NextResponse.json({ error: "Missing post id" }, { status: 400 });
    }

    // Fetch the author profile ID and slug from the post
    const { data: post, error: fetchError } = await supabaseAdmin
      .from("posts")
      .select("author_id, slug")
      .eq("id", postId)
      .maybeSingle();

    if (fetchError || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Fetch the author's username to construct the path
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("username")
      .eq("id", post.author_id)
      .maybeSingle();

    // Log the view into the page_views table
    const path = `/room/${profile?.username || "unknown"}/${post.slug || postId}`;
    const { error: insertError } = await supabaseAdmin
      .from("page_views")
      .insert({ profile_id: post.author_id, path });

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
