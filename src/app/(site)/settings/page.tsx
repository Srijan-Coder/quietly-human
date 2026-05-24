import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import PinManagerClient from "./PinManagerClient";
import RoomThemeSelectorClient from "./RoomThemeSelectorClient";
import ProfileSettingsClient from "./ProfileSettingsClient";

export const metadata = {
  title: "Settings | Quietly Humans",
};

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("username, display_name, avatar_url, last_name_change_at, pins, is_premium, room_theme, bio")
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

      {/* Settings Sections */}
      <div className="space-y-16">
        {/* Public Profile */}
        <section className="bg-brand-card border border-brand-border p-8 rounded-[2rem]">
          <h2 className="text-xl text-brand-text mb-2 font-serif">Public Profile</h2>
          <p className="text-brand-soft text-sm mb-8 font-sans">
            Update your avatar, display name, biography, and username.
          </p>
          <ProfileSettingsClient initialProfile={profile} />
        </section>

        {/* Appearance */}
        <section className="bg-brand-card border border-brand-border p-8 rounded-[2rem]">
          <h2 className="text-xl text-brand-text mb-2 font-serif">Room Theme</h2>
          <p className="text-brand-soft text-sm mb-8 font-sans">
            Choose the aesthetic for your public Creator Room.
          </p>
          <RoomThemeSelectorClient initialTheme={profile.room_theme || "dark"} userId={user.id} />
        </section>

        {/* Store & Pins */}
        <section className="bg-brand-card border border-brand-border p-8 rounded-[2rem]">
          <h2 className="text-xl text-brand-text mb-2 font-serif">Store & Pins</h2>
          <p className="text-brand-soft text-sm mb-8 font-sans">
            Manage your shop links and pinned content to showcase your work.
          </p>
          
          <PinManagerClient initialPins={profile.pins || []} userId={user.id} isPremium={profile.is_premium || false} />
        </section>
      </div>
    </div>
  );
}
