import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder")
);

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { action } = await req.json(); // "heart", "pin", "candle"

    // Fetch comment to verify authorship etc.
    const { data: comment, error: fetchErr } = await supabaseAdmin
      .from("comments")
      .select("post_id, author_id, candle_count, has_creator_heart, is_pinned")
      .eq("id", id)
      .single();

    if (fetchErr || !comment) throw new Error("Comment not found");

    // Fetch post to verify post authorship
    const { data: post } = await supabaseAdmin
      .from("posts")
      .select("author_id")
      .eq("id", comment.post_id)
      .single();

    if (action === "heart" || action === "pin") {
      if (post?.author_id !== user.id) {
        return NextResponse.json({ error: "Only the post author can do this" }, { status: 403 });
      }

      if (action === "heart") {
        await supabaseAdmin.from("comments").update({ has_creator_heart: !comment.has_creator_heart }).eq("id", id);
      } else if (action === "pin") {
        // verify premium
        const { data: profile } = await supabaseAdmin.from("profiles").select("is_premium").eq("id", user.id).single();
        if (!profile?.is_premium) {
          return NextResponse.json({ error: "Sanctuary Pass required to pin comments" }, { status: 403 });
        }
        await supabaseAdmin.from("comments").update({ is_pinned: !comment.is_pinned }).eq("id", id);
      }
    } else if (action === "candle") {
      // Toggle candle
      const { data: existing } = await supabaseAdmin
        .from("candles")
        .select()
        .eq("user_id", user.id)
        .eq("target_type", "comment")
        .eq("target_id", id)
        .single();

      if (existing) {
        await supabaseAdmin.from("candles").delete().eq("user_id", user.id).eq("target_type", "comment").eq("target_id", id);
        await supabaseAdmin.from("comments").update({ candle_count: Math.max(0, comment.candle_count - 1) }).eq("id", id);
      } else {
        await supabaseAdmin.from("candles").insert([{ user_id: user.id, target_type: "comment", target_id: id }]);
        await supabaseAdmin.from("comments").update({ candle_count: comment.candle_count + 1 }).eq("id", id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
