import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import AdminBanClient from "./AdminBanClient";

export const metadata = {
  title: "Admin Dashboard | Quietly Humans",
};

export default async function AdminPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  // SECURITY: Only YOU can access this page. Replace with your actual Clerk user email or ID.
  const isAdmin = user.emailAddresses.some(email => email.emailAddress === process.env.ADMIN_EMAIL);
  
  if (!isAdmin) {
    redirect("/"); // Kick them out quietly
  }

  // Fetch all users
  const { data: profiles } = await supabaseClient
    .from("profiles")
    .select("id, username, display_name, created_at")
    .order("created_at", { ascending: false });

  // Fetch all posts (including drafts)
  const { data: posts } = await supabaseClient
    .from("posts")
    .select("id, title, is_draft, created_at, profiles(username)")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-32 font-sans">
      <header className="mb-12 border-b border-brand-border pb-8">
        <h1 className="text-4xl text-brand-text mb-2 font-serif text-red-500">Admin Sanctuary</h1>
        <p className="text-brand-soft text-sm uppercase tracking-widest">
          With great power comes great responsibility.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* User Management */}
        <div>
          <h2 className="text-xl text-brand-text mb-6 font-serif flex items-center gap-2">
            <span>👥</span> Citizens
          </h2>
          <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden divide-y divide-brand-border/50">
            {profiles?.map((profile: any) => (
              <div key={profile.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-brand-text font-bold">@{profile.username}</p>
                  <p className="text-xs text-brand-soft">Joined: {new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
                <AdminBanClient targetId={profile.id} targetType="user" />
              </div>
            ))}
          </div>
        </div>

        {/* Content Management */}
        <div>
          <h2 className="text-xl text-brand-text mb-6 font-serif flex items-center gap-2">
            <span>📝</span> All Content
          </h2>
          <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden divide-y divide-brand-border/50 h-[600px] overflow-y-auto">
            {posts?.map((post: any) => (
              <div key={post.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-brand-text font-bold truncate max-w-[200px]">{post.title}</p>
                  <p className="text-xs text-brand-soft">By @{post.profiles?.username} {post.is_draft ? '(Draft)' : ''}</p>
                </div>
                <AdminBanClient targetId={post.id} targetType="post" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
