import { auth } from "@clerk/nextjs/server";
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

  const { userId } = await auth();
  
  if (userId) {
    // Check if user exists in Supabase profiles
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (!profile) {
      // User is signed in but hasn't completed onboarding
      redirect("/onboarding");
    }
  }

  return <>{children}</>;
}
