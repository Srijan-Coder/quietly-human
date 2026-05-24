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
    <div className="min-h-screen bg-[#0d0d0d] text-white pt-24 md:pt-32 px-6 md:px-12 w-full pb-32">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-white/5 pb-8 text-center flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
            Creation
          </span>
          <h1 className="text-5xl md:text-6xl text-white mb-4 font-serif">Compose a Thought</h1>
          <p className="text-brand-soft text-lg font-serif italic max-w-lg">
            Your words are safe here. They will be published to the Reading Room and your Creator Room.
          </p>
        </header>

        <WriteEditorClient />
      </div>
    </div>
  );
}
