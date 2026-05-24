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

const noteSchema = z.object({
  content: z.string().min(1).max(300),
});

// 3-second timeout moderation — fail open if slow/missing
async function moderateContent(content: string): Promise<boolean> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return false;

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
    return false; // Timeout or network error — fail open
  }
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    // Rate limit: 5 notes per 10 minutes
    const rateLimit = rateLimiter.check(user.id + "_pilgrim", 5, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many notes. Please wait a few minutes." }, { status: 429 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const parsed = noteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Note must be between 1 and 300 characters." }, { status: 400 });
    }

    const content = sanitizeText(parsed.data.content);

    // Moderation with hard timeout — if it fails, we still allow the note
    const flagged = await moderateContent(content);
    if (flagged) {
      return NextResponse.json({
        error: "This note was flagged by our safety system. Quietly Humans is a safe sanctuary — please keep notes kind."
      }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("pilgrim_notes")
      .insert([{ author_id: user.id, content }]);

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to leave note. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("pilgrim/submit error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
