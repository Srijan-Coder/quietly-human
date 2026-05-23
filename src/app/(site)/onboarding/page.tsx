import { redirect } from "next/navigation";
import OnboardingForm from "./OnboardingForm";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseClient } from "@/lib/supabase";

export const metadata = {
  title: "Welcome to Quietly Humans",
};

export default async function OnboardingPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/");
  }

  // Double check if already exists
  const { data: profile } = await supabaseClient
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  if (profile) {
    redirect("/collection"); // Already onboarded
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-serif">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl text-brand-text mb-4">Welcome to the Sanctuary.</h1>
          <p className="text-brand-soft font-sans text-sm max-w-sm mx-auto leading-relaxed">
            Before you enter, choose a name for your Quiet Room. This is how others will know you if you choose to write.
          </p>
        </div>
        
        <OnboardingForm userId={user.id} fallbackName={user.firstName || ""} fallbackAvatar={user.imageUrl} />
      </div>
    </div>
  );
}
