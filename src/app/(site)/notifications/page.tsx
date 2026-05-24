import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import Link from "next/link";
import NotificationClearClient from "./NotificationClearClient";

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
      profiles!notifications_actor_id_fkey ( username, display_name )
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

      <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
        {notifications && notifications.length > 0 ? (
          <div className="divide-y divide-brand-border/50">
            {notifications.map((notif: any) => {
              const actor = notif.profiles;
              const actorName = actor.display_name || actor.username;
              let message = "";
              let icon = "";
              
              if (notif.type === "follow") {
                message = `quietly entered your room.`;
                icon = "🚪";
              } else if (notif.type === "candle_post") {
                message = `lit a candle for your writing.`;
                icon = "🕯️";
              } else if (notif.type === "candle_note") {
                message = `lit a candle for your Pilgrim Note.`;
                icon = "🕯️";
              }

              return (
                <div key={notif.id} className={`p-6 flex items-start gap-4 hover:bg-brand-bg/50 transition-colors ${!notif.is_read ? 'bg-brand-accent/5' : ''}`}>
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="text-brand-text leading-relaxed">
                      <Link href={`/room/${actor.username}`} className="font-bold hover:text-brand-accent transition-colors">
                        {actorName}
                      </Link>{" "}
                      <span className="text-brand-soft">{message}</span>
                    </p>
                    <span className="text-xs text-brand-soft font-sans opacity-50">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-16 text-center">
            <span className="text-4xl filter grayscale opacity-30 mb-4 block">🍃</span>
            <p className="text-brand-soft italic">Your notifications are silent.</p>
          </div>
        )}
      </div>
    </div>
  );
}
