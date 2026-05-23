import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import WriteEditorClient from "./WriteEditorClient";
import { supabaseClient } from "@/lib/supabase";

export const metadata = {
  title: "Write | Quietly Humans",
};

export default async function WritePage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  // Ensure they have a profile
  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-32">
      <header className="mb-12 border-b border-brand-border pb-6">
        <h1 className="text-4xl text-brand-text mb-2 font-serif">Compose a Thought</h1>
        <p className="text-brand-soft text-sm uppercase tracking-widest font-sans">
          Your words are safe here.
        </p>
      </header>

      <WriteEditorClient />
    </div>
  );
}
