import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder")
);

export async function POST(req: Request) {
  try {
    const { creatorId, email } = await req.json();

    if (!creatorId || !email) {
      return NextResponse.json({ error: "Missing creatorId or email" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Insert subscriber
    const { error } = await supabaseAdmin
      .from("subscribers")
      .insert([
        { creator_id: creatorId, subscriber_email: email }
      ]);

    if (error) {
      // If error code is 23505 (unique violation), we can gracefully handle it
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: "Already subscribed!" });
      }
      throw error;
    }

    // Also send a notification to the creator
    await supabaseAdmin.from("notifications").insert([{
      user_id: creatorId,
      actor_id: creatorId, // Use creator's own ID as actor since the subscriber isn't a logged-in user necessarily
      type: "follow", // Reuse follow type, or we could make a "subscribe" type
    }]);

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
