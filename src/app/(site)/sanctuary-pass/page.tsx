import { currentUser } from "@clerk/nextjs/server";
import { supabaseClient } from "@/lib/supabase";
import SanctuaryPassClient from "./SanctuaryPassClient";

export const metadata = {
  title: "The Sanctuary Pass | Quietly Humans",
};

export default async function SanctuaryPassPage() {
  const user = await currentUser();
  
  let isPremium = false;
  if (user) {
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("is_premium")
      .eq("id", user.id)
      .single();
    if (profile?.is_premium) isPremium = true;
  }

  return (
    <SanctuaryPassClient 
      isPremium={isPremium} 
      userEmail={user?.emailAddresses?.[0]?.emailAddress} 
    />
  );
}
