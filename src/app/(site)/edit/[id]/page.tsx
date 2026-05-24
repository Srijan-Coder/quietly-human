import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import WriteEditorClient from "@/app/(site)/write/WriteEditorClient";

export const metadata = {
  title: "Edit Words | Quietly Humans",
};

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;

  // Fetch author profile
  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("is_premium, pins")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding");

  // Fetch post
  const { data: post } = await supabaseClient
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post || post.author_id !== user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-32">
      <header className="mb-12 border-b border-white/5 pb-8">
        <h1 className="text-4xl text-white mb-2 font-serif">Refine Your Words</h1>
        <p className="text-brand-soft text-sm uppercase tracking-widest font-sans">
          Editing: {post.title || "Untitled"}
        </p>
      </header>

      <WriteEditorClient isPremium={profile.is_premium || false} pins={profile.pins || []} initialPost={post} />
    </div>
  );
}
