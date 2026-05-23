import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import PinManagerClient from "./PinManagerClient";

export const metadata = {
  title: "Settings | Quietly Humans",
};

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("pins")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding");

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-3xl mx-auto w-full pb-32 font-serif">
      <header className="mb-12 border-b border-brand-border pb-8">
        <h1 className="text-4xl text-brand-text mb-2">Room Settings</h1>
        <p className="text-brand-soft text-sm uppercase tracking-widest font-sans">
          Manage your space and pinned items.
        </p>
      </header>

      <div className="bg-brand-card border border-brand-border p-8 rounded-2xl">
        <h2 className="text-xl text-brand-text mb-6">Manage Your Pins</h2>
        <p className="text-brand-soft text-sm mb-8 font-sans">
          Pins appear at the top of your Creator Room. Use them to link to your own products, a newsletter, or external projects.
        </p>
        
        <PinManagerClient initialPins={profile.pins || []} userId={user.id} />
      </div>
    </div>
  );
}
