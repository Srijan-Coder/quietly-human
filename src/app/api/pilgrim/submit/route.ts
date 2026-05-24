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

    const { content } = await req.json();

    if (!content || content.length > 300) {
      return NextResponse.json({ error: "Note must be between 1 and 300 characters." }, { status: 400 });
    }

    // AI MODERATION STEP
    try {
      const modRes = await fetch("https://api.openai.com/v1/moderations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({ input: content })
      });

      if (modRes.ok) {
        const modData = await modRes.json();
        const results = modData.results[0];
        
        if (results.flagged) {
          console.warn(`Pilgrim note flagged by AI moderation. User: ${user.id}`);
          return NextResponse.json({ 
            error: "Quietly Humans is a safe sanctuary. This note violates our safety guidelines (NSFW, hate speech, or violence)." 
          }, { status: 400 });
        }
      }
    } catch (e) {
      console.error("Moderation fetch error", e);
    }

    // Save to Supabase
    const { error } = await supabaseAdmin
      .from("pilgrim_notes")
      .insert([{
        author_id: user.id,
        content
      }]);

    if (error) {
      console.error("Supabase insert error", error);
      return NextResponse.json({ error: "Failed to leave note." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

