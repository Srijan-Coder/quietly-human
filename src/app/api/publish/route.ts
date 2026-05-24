import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { ensureProfileExists } from "@/lib/self-heal";

const supabaseAdmin = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder")
);

import { rateLimiter } from "@/lib/rate-limit";
import { sanitizeHtml, sanitizeText } from "@/lib/sanitize";
import { z } from "zod";

const publishSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(100000), // Max 100k chars
  type: z.string(),
  category: z.string().optional(),
  postTheme: z.string().optional(),
  attachedPins: z.array(z.string()).optional(),
  coverImageUrl: z.string().url().optional().or(z.literal("")),
  pdfFileUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    // Rate Limit: 10 posts per hour per user
    const rateLimit = rateLimiter.check(user.id + "_publish", 10, 60 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many posts published recently. Please wait." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = publishSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload data." }, { status: 400 });
    }

    const profileExists = await ensureProfileExists(user);
    if (!profileExists) {
      return NextResponse.json({ error: "Failed to verify your profile. Please try completing onboarding." }, { status: 500 });
    }

    let { title, content, type, category, postTheme, attachedPins, coverImageUrl, pdfFileUrl } = parsed.data;

    // Sanitize user inputs
    title = sanitizeText(title);
    content = sanitizeHtml(content);

    // Check if user is premium to allow attached pins
    let finalAttachedPins: string[] = [];
    if (attachedPins && attachedPins.length > 0) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .maybeSingle();
        
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

    const payload: any = {
        author_id: user.id,
        type,
        title,
        content,
        slug,
        category: category || "Uncategorized",
        post_theme: postTheme || "default",
        cover_image_url: coverImageUrl || null,
        pdf_file_url: (type === 'ebook' && pdfFileUrl) ? pdfFileUrl : null,
        is_draft: false,
        published_at: new Date().toISOString()
    };

    // Only add attached_pins if the user explicitly provided them, 
    // to avoid PGRST204 error if the column is missing in their DB
    if (attachedPins !== undefined && attachedPins !== null) {
        payload.attached_pins = finalAttachedPins;
    }

    // Save to Supabase
    const { data, error } = await supabaseAdmin
      .from("posts")
      .insert([payload])
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase insert error", error);
      return NextResponse.json({ error: `Failed to publish post: ${error.message} (Code: ${error.code})` }, { status: 500 });
    }

    return NextResponse.json({ success: true, post: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

