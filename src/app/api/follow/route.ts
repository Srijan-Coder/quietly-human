import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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
      const { error } = await supabaseAdmin
        .from("follows")
        .insert([{ follower_id: user.id, following_id: targetUserId }]);
      
      if (error && error.code !== "23505") { // Ignore unique violation if already following
        console.error(error);
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
