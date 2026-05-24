import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: postId } = await params;
    if (!postId) {
      return NextResponse.json({ error: "Missing post id" }, { status: 400 });
    }

    // Call Supabase RPC to safely increment view_count, or just read and update using admin
    const { data: post, error: fetchError } = await supabaseAdmin
      .from("posts")
      .select("view_count")
      .eq("id", postId)
      .maybeSingle();

    if (fetchError || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const { error: updateError } = await supabaseAdmin
      .from("posts")
      .update({ view_count: (post.view_count || 0) + 1 })
      .eq("id", postId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
