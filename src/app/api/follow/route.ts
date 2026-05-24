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

    const { targetUserId, action } = await req.json();

    if (!targetUserId || (action !== "follow" && action !== "unfollow")) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (action === "follow") {
      const { error: insertError } = await supabaseAdmin
        .from("follows")
        .insert([{ follower_id: user.id, following_id: targetUserId }]);
      
      if (!insertError) {
        await supabaseAdmin.from("notifications").insert([{
          user_id: targetUserId,
          actor_id: user.id,
          type: "follow"
        }]);
      }

      if (insertError && insertError.code !== "23505") { // Ignore unique violation if already following
        console.error(insertError);
        return NextResponse.json({ error: "Failed to follow" }, { status: 500 });
      }
    } else {
      const { error } = await supabaseAdmin
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId);
        
      if (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to unfollow" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

