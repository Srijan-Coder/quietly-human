import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import BulkUploaderClient from "./BulkUploaderClient";

export const metadata = {
  title: "Bulk AI Uploader — Dashboard | Quietly Humans",
  description: "Upload and publish multiple quiet posts and creative writings at once.",
};

export default async function BulkUploaderPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  // Fetch creator's profile to verify onboarding
  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("id, username")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding");
  if (profile.username !== "srijan") redirect("/dashboard");

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-32 text-brand-text">
      <BulkUploaderClient />
    </div>
  );
}
