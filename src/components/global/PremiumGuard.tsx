import { currentUser } from "@clerk/nextjs/server";
import { supabaseClient } from "@/lib/supabase";
import Link from "next/link";

export default async function PremiumGuard({ children }: { children: React.ReactNode }) {
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

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-brand-card/50 border border-brand-border rounded-3xl font-serif max-w-2xl mx-auto my-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      
      <span className="text-5xl filter grayscale opacity-50 mb-6">🔒</span>
      <h3 className="text-3xl text-brand-text mb-4">A Guardian's Tool</h3>
      <p className="text-brand-soft mb-8 max-w-md mx-auto text-lg leading-relaxed">
        This specific tool is reserved for those who hold the Sanctuary Pass. Unlocking it helps keep the rest of Quietly Humans free and ad-free.
      </p>
      <Link href="/sanctuary-pass" className="bg-brand-text text-brand-bg px-8 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-colors font-bold z-10">
        Unlock Sanctuary Pass
      </Link>
    </div>
  );
}
