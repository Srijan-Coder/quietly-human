import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimiter } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitize";
import { z } from "zod";

// Validate input shape
const thoughtSchema = z.object({
  postId: z.string().uuid(),
  content: z.string().min(1).max(2000),
});

// Run OpenAI moderation with a hard 3-second timeout so it never blocks the response
async function moderateContent(content: string): Promise<boolean> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return false; // no key = skip moderation, allow post

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);

    const res = await fetch("https://api.openai.com/v1/moderations", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({ input: content }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (!res.ok) return false;
    const data = await res.json();
    return data?.results?.[0]?.flagged === true;
  } catch {
    // Timeout or network error — fail open (allow the post)
    return false;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  if (!postId) return NextResponse.json({ error: "Missing postId" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("comments")
    .select(`
      *,
      author:profiles(id, username, display_name, avatar_url)
    `)
    .eq("post_id", postId)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ comments: data });
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Rate limit: 10 thoughts per 5 minutes
    const rateLimit = rateLimiter.check(user.id + "_comment", 10, 5 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many thoughts posted. Please wait a few minutes." }, { status: 429 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body." }, { status: 400 });
    }

    const parsed = thoughtSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Content must be between 1 and 2000 characters." }, { status: 400 });
    }

    const { postId, content: rawContent } = parsed.data;
    const content = sanitizeText(rawContent);

    // Run moderation with timeout — if it times out or fails, we still post
    const flagged = await moderateContent(content);
    if (flagged) {
      return NextResponse.json({
        error: "This thought was flagged by our safety system. Quietly Humans is a safe sanctuary — please keep thoughts kind."
      }, { status: 400 });
    }

    // Self-healing database profile lookup/creation for users who bypassed/missed onboarding
    let { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!profile) {
      const email = user.emailAddresses[0]?.emailAddress || "";
      const baseUsername = user.username || email.split("@")[0] || `user_${Date.now()}`;
      const cleanedUsername = baseUsername.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase() || `user_${Math.floor(Math.random() * 1000)}`;
      
      let username = cleanedUsername;
      const { data: existingUser } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("username", username)
        .single();
      
      if (existingUser) {
        username = `${cleanedUsername}_${Math.floor(Math.random() * 1000)}`;
      }

      const { data: newProfile, error: createError } = await supabaseAdmin
        .from("profiles")
        .insert([{
          id: user.id,
          username,
          display_name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || username,
          avatar_url: user.imageUrl || null,
          bio: null,
          room_theme: "dark",
          is_premium: false
        }])
        .select("id")
        .single();

      if (createError) {
        console.error("Auto profile creation failed:", createError);
        return NextResponse.json({ error: "Failed to verify your profile. Please try completing onboarding." }, { status: 500 });
      }
    }

    const { data, error } = await supabaseAdmin
      .from("comments")
      .insert([{ post_id: postId, author_id: user.id, content }])
      .select(`*, author:profiles(id, username, display_name, avatar_url)`)
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save your thought. Please try again." }, { status: 500 });
    }

    // Notify post author (non-blocking, handled in async IIFE to prevent crashes)
    (async () => {
      try {
        const { data: post } = await supabaseAdmin
          .from("posts")
          .select("author_id")
          .eq("id", postId)
          .single();

        if (post && post.author_id !== user.id) {
          await supabaseAdmin.from("notifications").insert([{
            user_id: post.author_id,
            actor_id: user.id,
            type: "comment",
            target_id: postId
          }]);
        }
      } catch (e) {
        console.error("Failed to process post notification:", e);
      }
    })();

    return NextResponse.json({ comment: data });
  } catch (err: any) {
    console.error("public-thoughts POST error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
