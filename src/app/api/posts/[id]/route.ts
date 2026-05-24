import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder")
);

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Verify ownership
    const { data: post } = await supabaseAdmin.from("posts").select("author_id").eq("id", id).single();
    if (!post || post.author_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized or not found" }, { status: 403 });
    }

    await supabaseAdmin.from("posts").delete().eq("id", id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { title, content, type, category, postTheme, attachedPins, coverImageUrl, pdfFileUrl } = await req.json();

    // Verify ownership
    const { data: post } = await supabaseAdmin.from("posts").select("author_id").eq("id", id).single();
    if (!post || post.author_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized or not found" }, { status: 403 });
    }

    // Check premium for pins
    let finalAttachedPins = [];
    if (attachedPins && attachedPins.length > 0) {
      const { data: profile } = await supabaseAdmin.from("profiles").select("is_premium").eq("id", user.id).single();
      if (profile?.is_premium) {
        finalAttachedPins = attachedPins.slice(0, 3);
      }
    }

    const { error } = await supabaseAdmin
      .from("posts")
      .update({
        title,
        content,
        type,
        category: category || "Uncategorized",
        post_theme: postTheme || "default",
        cover_image_url: coverImageUrl || null,
        pdf_file_url: (type === 'ebook' && pdfFileUrl) ? pdfFileUrl : null,
        attached_pins: finalAttachedPins
      })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
