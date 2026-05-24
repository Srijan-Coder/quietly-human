import { currentUser } from "@clerk/nextjs/server";
import { supabaseClient } from "@/lib/supabase";
import Link from "next/link";
import React from "react";

export default async function PremiumGate({ children }: { children: React.ReactNode }) {
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
    <div className="min-h-screen pt-32 px-6 pb-32 font-sans bg-[#0d0d0d] flex items-center justify-center text-center">
      <div className="max-w-xl mx-auto bg-[#121212] border border-brand-accent p-12 rounded-[2rem] shadow-[0_0_50px_rgba(252,163,17,0.1)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/10 to-transparent opacity-50 pointer-events-none" />
        
        <span className="text-6xl mb-6 block relative z-10">🌿</span>
        <h2 className="text-4xl text-brand-text mb-4 relative z-10 font-serif">Guardian Access Required</h2>
        
        <p className="text-brand-soft mb-8 text-lg relative z-10 font-sans leading-relaxed">
          This is a premium Soft Tool. To unlock it, become a Guardian by upgrading to the Sanctuary Pass.
        </p>
        
        <div className="flex flex-col gap-4 relative z-10">
          <Link href="/sanctuary-pass" className="bg-brand-accent text-white px-8 py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(252,163,17,0.3)] inline-block">
            View Sanctuary Pass
          </Link>
          <Link href="/toolkit" className="text-brand-soft text-[10px] uppercase tracking-widest hover:text-white transition-colors">
            Return to Free Toolkit
          </Link>
        </div>
      </div>
    </div>
  );
}
