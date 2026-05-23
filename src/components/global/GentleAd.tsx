import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { supabaseClient } from "@/lib/supabase";

export default async function GentleAd() {
  const user = await currentUser();
  
  if (user) {
    // Check if user is premium. If so, they have "Quiet Mode" and don't see ads.
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("is_premium")
      .eq("id", user.id)
      .single();
      
    if (profile?.is_premium) {
      return null;
    }
  }

  return (
    <div className="my-16 p-8 border border-brand-border rounded-xl bg-brand-card/50 text-center max-w-2xl mx-auto font-serif group hover:border-brand-accent transition-colors">
      <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-4 inline-block">
        Gentle Support
      </span>
      <h3 className="text-2xl text-brand-text mb-3">The Overthinker's Journal</h3>
      <p className="text-brand-soft mb-6 leading-relaxed">
        If you found comfort in these tools, you might appreciate our structured Notion workspace designed to untangle loud thoughts.
      </p>
      <Link href="/store" className="inline-block border border-brand-border px-8 py-3 rounded-full text-xs uppercase tracking-widest font-sans text-brand-text hover:bg-brand-text hover:text-brand-bg transition-colors">
        Visit The Store
      </Link>
    </div>
  );
}
