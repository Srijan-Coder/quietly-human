import { currentUser } from "@clerk/nextjs/server";
import { supabaseClient } from "@/lib/supabase";
import Link from "next/link";
import CheckoutButton from "./CheckoutButton";

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
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-3xl mx-auto w-full pb-32 font-serif text-center">
      <header className="mb-16 border-b border-brand-border pb-12">
        <h1 className="text-5xl text-brand-text mb-4">The Sanctuary Pass</h1>
        <p className="text-brand-soft text-lg max-w-xl mx-auto italic">
          Unlock the deepest tools, expand your quiet collection, and support the sanctuary.
        </p>
      </header>

      {isPremium ? (
        <div className="bg-brand-card border border-brand-accent p-12 rounded-2xl shadow-[0_0_30px_rgba(252,163,17,0.1)]">
          <h2 className="text-3xl text-brand-accent mb-4">You are a Guardian.</h2>
          <p className="text-brand-soft mb-8">
            Thank you for supporting Quietly Humans. Your Sanctuary Pass is active, granting you full access to all premium tools, quiet mode, and unlimited collection saves.
          </p>
          <Link href="/collection" className="bg-brand-text text-brand-bg px-8 py-3 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-brand-accent hover:text-white transition-colors">
            Enter Your Vault
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          <div className="bg-brand-card border border-brand-border p-8 md:p-12 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <h2 className="text-3xl text-brand-text mb-2">Become a Guardian</h2>
            <div className="text-brand-accent text-xl font-sans mb-8">
              <span className="text-4xl font-bold font-serif">$4.99</span> / month
            </div>

            <ul className="text-left space-y-4 max-w-sm mx-auto font-sans text-brand-soft mb-12">
              <li className="flex items-center gap-3">
                <span className="text-brand-accent">✦</span> Access all 5 Premium Tools
              </li>
              <li className="flex items-center gap-3">
                <span className="text-brand-accent">✦</span> Unlimited Collection Saves
              </li>
              <li className="flex items-center gap-3">
                <span className="text-brand-accent">✦</span> Quiet Mode (Ad-free reading)
              </li>
              <li className="flex items-center gap-3">
                <span className="text-brand-accent">✦</span> Guardian Profile Badge 🌿
              </li>
            </ul>

            <CheckoutButton priceId={process.env.NEXT_PUBLIC_STRIPE_PASS_PRICE_ID!} />
          </div>

          <p className="text-xs uppercase tracking-widest text-brand-soft">
            Cancel anytime. No questions asked.
          </p>
        </div>
      )}
    </div>
  );
}
