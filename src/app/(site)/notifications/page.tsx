import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import Link from "next/link";
import NotificationClearClient from "./NotificationClearClient";
import NotificationsListClient from "./NotificationsListClient";

export const metadata = {
  title: "Notifications | Quietly Humans",
};

export default async function NotificationsPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  // Fetch notifications with actor profile info
  const { data: notifications } = await supabaseClient
    .from("notifications")
    .select(`
      id, type, is_read, created_at, target_id,
      profiles!notifications_actor_id_fkey ( username, display_name, avatar_url )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  // Mark all as read when visited (we do this safely via a Client Component or Server Action, but here we can just update them)
  if (notifications && notifications.some(n => !n.is_read)) {
    await supabaseClient
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-3xl mx-auto w-full pb-32 font-serif">
      <header className="mb-12 border-b border-brand-border pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl text-brand-text mb-2">Notifications</h1>
          <p className="text-brand-soft text-sm uppercase tracking-widest font-sans">
            Quiet echoes from the sanctuary.
          </p>
        </div>
        <NotificationClearClient userId={user.id} />
      </header>

      <NotificationsListClient initialNotifications={notifications || []} />
    </div>
  );
}
