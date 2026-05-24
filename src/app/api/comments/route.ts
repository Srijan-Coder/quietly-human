import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder")
);

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

    const { postId, content } = await req.json();
    if (!postId || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("comments")
      .insert([{
        post_id: postId,
        author_id: user.id,
        content
      }])
      .select(`*, author:profiles(id, username, display_name, avatar_url)`)
      .single();

    if (error) throw error;

    // Send notification to post author
    const { data: post } = await supabaseAdmin.from("posts").select("author_id").eq("id", postId).single();
    if (post && post.author_id !== user.id) {
      await supabaseAdmin.from("notifications").insert([{
        user_id: post.author_id,
        actor_id: user.id,
        type: "comment_post",
        target_id: postId
      }]);
    }

    return NextResponse.json({ comment: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

