import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimiter } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitize";
import { z } from "zod";

const supabaseAdmin = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder")
);

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

    const { data, error } = await supabaseAdmin
      .from("comments")
      .insert([{ post_id: postId, author_id: user.id, content }])
      .select(`*, author:profiles(id, username, display_name, avatar_url)`)
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save your thought. Please try again." }, { status: 500 });
    }

    // Notify post author (non-blocking)
    supabaseAdmin.from("posts").select("author_id").eq("id", postId).single().then(({ data: post }) => {
      if (post && post.author_id !== user.id) {
        supabaseAdmin.from("notifications").insert([{
          user_id: post.author_id,
          actor_id: user.id,
          type: "comment",
          target_id: postId
        }]).then();
      }
    });

    return NextResponse.json({ comment: data });
  } catch (err: any) {
    console.error("public-thoughts POST error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
