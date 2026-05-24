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
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const { title, content, type, category, postTheme, attachedPins } = await req.json();

    if (!title || !content || !type) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Check if user is premium to allow attached pins
    let finalAttachedPins = [];
    if (attachedPins && attachedPins.length > 0) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();
        
      if (profile?.is_premium) {
        finalAttachedPins = attachedPins.slice(0, 3); // Max 3 pins
      }
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") 
      + "-" + Math.random().toString(36).substring(2, 8);

    // AI MODERATION STEP
    // We use OpenAI's free moderation endpoint to block sexual/hateful content
    try {
      const modRes = await fetch("https://api.openai.com/v1/moderations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({ input: `${title}\n${content}` })
      });

      if (modRes.ok) {
        const modData = await modRes.json();
        const results = modData.results[0];
        
        if (results.flagged) {
          // Check specific categories if needed, but flagging generally means it's bad
          console.warn(`Content flagged by AI moderation. User: ${user.id}`);
          return NextResponse.json({ 
            error: "Quietly Humans is a safe sanctuary. This content violates our safety guidelines (NSFW, hate speech, or violence) and cannot be published." 
          }, { status: 400 });
        }
      } else {
        console.error("OpenAI Moderation API failed, proceeding with caution or you can block by default.");
        // We will allow it through if OpenAI is down, but log it.
      }
    } catch (e) {
      console.error("Moderation fetch error", e);
    }

    // Save to Supabase
    const { data, error } = await supabaseAdmin
      .from("posts")
      .insert([{
        author_id: user.id,
        type,
        title,
        content,
        slug,
        category: category || "Uncategorized",
        post_theme: postTheme || "default",
        is_draft: false,
        attached_pins: finalAttachedPins,
        published_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error", error);
      return NextResponse.json({ error: "Failed to publish post." }, { status: 500 });
    }

    return NextResponse.json({ success: true, post: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

