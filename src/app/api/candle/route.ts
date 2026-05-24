import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder")
);

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { targetId, targetType } = await req.json();

    if (!targetId || (targetType !== "post" && targetType !== "note")) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // 1. Insert into candles table
    const { error: insertError } = await supabaseAdmin
      .from("candles")
      .insert([{
        user_id: user.id,
        target_type: targetType,
        target_id: targetId
      }]);

    if (!insertError) {
      // Find the author of the post or note to send them a notification
      let authorId = null;
      if (targetType === "post") {
        const { data: post } = await supabaseAdmin.from("posts").select("author_id").eq("id", targetId).single();
        authorId = post?.author_id;
      } else if (targetType === "note") {
        const { data: note } = await supabaseAdmin.from("pilgrim_notes").select("author_id").eq("id", targetId).single();
        authorId = note?.author_id;
      }

      // If it's not our own post, send a notification
      if (authorId && authorId !== user.id) {
        await supabaseAdmin.from("notifications").insert([{
          user_id: authorId,
          actor_id: user.id,
          type: targetType === "post" ? "candle_post" : "candle_note",
          target_id: targetId
        }]);
      }
    } else {
      if (insertError.code === "23505") { // Unique constraint violation
        return NextResponse.json({ error: "Already lit a candle" }, { status: 400 });
      }
      throw insertError;
    }

    // 2. Increment candle_count on the target
    const table = targetType === "post" ? "posts" : "pilgrim_notes";
    
    // Supabase RPC is best for atomic increments, but for speed we can just read/update
    // A better approach is using an RPC function, but let's do a simple read/update for now
    const { data: current } = await supabaseAdmin
      .from(table)
      .select("candle_count")
      .eq("id", targetId)
      .single();
      
    if (current) {
      await supabaseAdmin
        .from(table)
        .update({ candle_count: (current.candle_count || 0) + 1 })
        .eq("id", targetId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

