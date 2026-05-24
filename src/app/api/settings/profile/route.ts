import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { rateLimiter } from "@/lib/rate-limit";
import { z } from "zod";
import { sanitizeText } from "@/lib/sanitize";

const supabaseAdmin = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder")
);

const profileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).optional(),
  avatarUrl: z.string().url().or(z.literal("")).nullable().optional(),
  bio: z.string().max(200).nullable().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const rateLimit = rateLimiter.check(user.id + "_profile", 5, 15 * 60 * 1000); // 5 per 15 min
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = profileSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid profile data provided." }, { status: 400 });
    }

    const { displayName, username, avatarUrl, bio } = parsed.data;

    // Fetch current profile
    const { data: currentProfile } = await supabaseAdmin
      .from("profiles")
      .select("display_name, username, last_name_change_at")
      .eq("id", user.id)
      .single();

    if (!currentProfile) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const updates: any = {};
    let nameChanged = false;

    if (displayName !== undefined && displayName !== currentProfile.display_name) {
      updates.display_name = sanitizeText(displayName);
      nameChanged = true;
    }

    if (username !== undefined && username !== currentProfile.username) {
      // Check if username is already taken
      const { data: existingUser } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("username", username)
        .neq("id", user.id)
        .single();
        
      if (existingUser) {
        return NextResponse.json({ error: "Username is already taken." }, { status: 400 });
      }
      updates.username = sanitizeText(username);
      nameChanged = true;
    }

    if (nameChanged) {
      // Enforce 14-day rule
      if (currentProfile.last_name_change_at) {
        const lastChange = new Date(currentProfile.last_name_change_at).getTime();
        const now = Date.now();
        const daysPassed = (now - lastChange) / (1000 * 60 * 60 * 24);
        
        if (daysPassed < 14) {
          const daysLeft = Math.ceil(14 - daysPassed);
          return NextResponse.json({ error: `You can only change your name once every 14 days. Please wait ${daysLeft} more days.` }, { status: 403 });
        }
      }
      updates.last_name_change_at = new Date().toISOString();
    }

    if (avatarUrl !== undefined) {
      updates.avatar_url = (avatarUrl === "" || avatarUrl === null) ? null : avatarUrl;
    }

    if (bio !== undefined) {
      updates.bio = (bio === "" || bio === null) ? null : sanitizeText(bio);
    }

    if (Object.keys(updates).length > 0) {
      const { error } = await supabaseAdmin
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
