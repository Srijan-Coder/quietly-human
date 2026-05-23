import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";
import { headers } from "next/headers";

export default async function UsernameCheck({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const currentPath = headersList.get("x-current-path");

  // Skip the check if they are already on the onboarding page
  if (currentPath === "/onboarding") {
    return <>{children}</>;
  }

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
