import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";

export default async function UsernameCheck({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  
  if (user) {
    // Check if user exists in Supabase profiles
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!profile) {
      // User is signed in but hasn't completed onboarding
      redirect("/onboarding");
    }
  }

  return <>{children}</>;
}
