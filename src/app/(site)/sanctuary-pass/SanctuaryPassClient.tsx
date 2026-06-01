"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SanctuaryPassClient({ isPremium, userEmail }: { isPremium: boolean, userEmail?: string }) {
  const router = useRouter();
  const [licenseKey, setLicenseKey] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showRedeem, setShowRedeem] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKey.trim()) return;
    
    setIsVerifying(true);
    setError("");
    
    try {
      const res = await fetch("/api/gumroad/verify-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        setError(data.error || "Failed to verify license.");
      }
    } catch (e) {
      setError("An unexpected error occurred.");
    } finally {
      setIsVerifying(false);
    }
  };

  const checkoutUrl = userEmail 
    ? `https://quietlyhumansspace.gumroad.com/l/soacp?email=${encodeURIComponent(userEmail)}`
    : "https://quietlyhumansspace.gumroad.com/l/soacp";

  const annualCheckoutUrl = userEmail
    ? `https://quietlyhumansspace.gumroad.com/l/soacp-annual?email=${encodeURIComponent(userEmail)}`
    : "https://quietlyhumansspace.gumroad.com/l/soacp-annual";


  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-4xl mx-auto w-full pb-32 font-serif text-center">
      <header className="mb-16 border-b border-brand-border/30 pb-12">
        <h1 className="text-5xl text-brand-text mb-4">The Sanctuary Pass</h1>
        <p className="text-brand-soft text-lg max-w-xl mx-auto italic">
          Unlock the deepest tools, expand your quiet collection, and support the sanctuary.
        </p>
      </header>

      {isPremium || success ? (
        <div className="bg-brand-card border border-brand-accent p-12 rounded-[2rem] shadow-[0_0_50px_rgba(201,164,106,0.08)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/10 to-transparent opacity-50 pointer-events-none" />
          <h2 className="text-4xl text-brand-accent mb-4 relative z-10 font-serif">You are a Guardian.</h2>
          <p className="text-brand-soft mb-8 text-lg relative z-10 font-sans leading-relaxed">
            Thank you for supporting Quietly Humans. Your Sanctuary Pass is active, granting you full access to all premium tools, quiet mode, and unlimited collection saves.
          </p>
          <Link href="/toolkit" className="bg-brand-text text-brand-bg px-8 py-3.5 rounded-full uppercase tracking-widest text-xs font-bold hover:scale-105 transition-transform relative z-10 shadow-lg inline-block cursor-pointer">
            Enter The Toolkit
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          
          {/* Comparison Cards Grid */}
          <div className="bg-brand-card border border-brand-border/40 rounded-[2rem] overflow-hidden">
            <div className="grid grid-cols-3 border-b border-brand-border/30 bg-brand-bg/20 text-[10px] uppercase tracking-widest text-brand-soft p-6 font-bold">
              <div>Features</div>
              <div className="text-center">Free</div>
              <div className="text-center text-brand-accent">Guardian</div>
            </div>
            
            <div className="divide-y divide-brand-border/20 font-sans text-sm">
              <div className="grid grid-cols-3 p-6 hover:bg-brand-bg/30 transition-colors">
                <div className="text-left text-brand-text">Basic Toolkit (10 Tools)</div>
                <div className="text-center text-brand-soft/70">✓</div>
                <div className="text-center text-brand-accent">✓</div>
              </div>
              <div className="grid grid-cols-3 p-6 hover:bg-brand-bg/30 transition-colors">
                <div className="text-left text-brand-text">Creator Room & Writing</div>
                <div className="text-center text-brand-soft/70">✓</div>
                <div className="text-center text-brand-accent">✓</div>
              </div>
              <div className="grid grid-cols-3 p-6 hover:bg-brand-bg/30 transition-colors">
                <div className="text-left text-brand-text">Premium Toolkit (20 Tools)</div>
                <div className="text-center text-brand-soft/20">-</div>
                <div className="text-center text-brand-accent">✓</div>
              </div>
              <div className="grid grid-cols-3 p-6 hover:bg-brand-bg/30 transition-colors">
                <div className="text-left text-brand-text">Quiet Mode (Ad-Free)</div>
                <div className="text-center text-brand-soft/20">-</div>
                <div className="text-center text-brand-accent">✓</div>
              </div>
              <div className="grid grid-cols-3 p-6 hover:bg-brand-bg/30 transition-colors">
                <div className="text-left text-brand-text">Guardian Profile Badge</div>
                <div className="text-center text-brand-soft/20">-</div>
                <div className="text-center text-brand-accent">🌿</div>
              </div>
            </div>
          </div>

          {/* Billing Switcher */}
          <div className="flex justify-center items-center gap-4 my-4">
            <span className={`text-[10px] uppercase tracking-widest font-sans font-bold transition-colors ${billingPeriod === "monthly" ? "text-brand-text" : "text-brand-soft"}`}>Monthly Billing</span>
            <button 
              onClick={() => setBillingPeriod(prev => prev === "monthly" ? "annual" : "monthly")}
              className="w-12 h-6 bg-brand-border/40 hover:bg-brand-border/60 rounded-full relative p-0.5 transition-colors focus:outline-none cursor-pointer"
            >
              <div className={`w-5 h-5 bg-brand-accent rounded-full shadow-md transform transition-transform duration-300 ${billingPeriod === "annual" ? "translate-x-6" : ""}`} />
            </button>
            <span className={`text-[10px] uppercase tracking-widest font-sans font-bold flex items-center gap-1.5 transition-colors ${billingPeriod === "annual" ? "text-brand-text" : "text-brand-soft"}`}>
              Annual Billing <span className="bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Save 33%</span>
            </span>
          </div>

          {/* Choices Grid */}
          <div className="flex justify-center text-left">
            {/* Guardian Pass card */}
            <div className="bg-brand-card border border-brand-accent/40 p-8 md:p-10 rounded-[2rem] flex flex-col justify-between h-full relative group shadow-[0_0_50px_rgba(201,164,106,0.03)] max-w-md w-full">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent pointer-events-none" />
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-2 block font-bold">Full Access</span>
                <h3 className="text-2xl text-brand-text font-serif mb-2">Sanctuary Membership</h3>
                <p className="text-xs text-brand-soft font-sans mb-6 leading-relaxed">
                  Support independent, clinical mental wellness development and build your custom room.
                </p>
                <div className="text-brand-accent font-sans mb-6">
                  {billingPeriod === "monthly" ? (
                    <>
                      <span className="text-4xl font-serif font-bold">$4.99</span> <span className="text-xs text-brand-soft">/ month</span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-serif font-bold">$3.33</span> <span className="text-xs text-brand-soft">/ month ($39.99/yr)</span>
                    </>
                  )}
                </div>
                <ul className="text-xs text-brand-soft font-sans space-y-3 mb-8 border-t border-brand-border/20 pt-6">
                  <li className="flex items-center gap-2">✓ All 20 interactive clinical tools</li>
                  <li className="flex items-center gap-2">✓ Complete Quiet Mode (100% ad-free)</li>
                  <li className="flex items-center gap-2">✓ Upgraded Guardian profile badge (🌿)</li>
                  <li className="flex items-center gap-2">✓ Attach up to 3 custom pins to your posts</li>
                </ul>
              </div>
              <a 
                href={billingPeriod === "monthly" ? checkoutUrl : annualCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-brand-accent text-white hover:scale-102 transition-transform px-6 py-3.5 rounded-full text-[10px] uppercase tracking-widest font-bold inline-block cursor-pointer shadow-[0_0_30px_rgba(201,164,106,0.15)]"
              >
                Become a Guardian
              </a>
            </div>
          </div>

          {/* Redeem section */}
          <div className="mt-8 text-center">
            {!showRedeem ? (
              <button 
                onClick={() => setShowRedeem(true)}
                className="text-[10px] uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors border-b border-transparent hover:border-brand-border/60 pb-0.5 cursor-pointer"
              >
                Already purchased? Redeem License Key
              </button>
            ) : (
              <form onSubmit={handleRedeem} className="mt-4 max-w-sm mx-auto flex flex-col gap-3 font-sans">
                <p className="text-xs text-brand-soft mb-2">Check your Gumroad email receipt for your license key.</p>
                <input
                  type="text"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX"
                  className="w-full bg-brand-bg/40 border border-brand-border/40 rounded-lg px-4 py-3 text-sm text-center font-mono focus:outline-none focus:border-brand-accent text-brand-text uppercase placeholder:text-brand-soft/20"
                  required
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
                <button 
                  type="submit" 
                  disabled={isVerifying}
                  className="bg-brand-border/20 hover:bg-brand-border/40 border border-brand-border/30 text-brand-text py-3 rounded-lg text-xs uppercase tracking-widest transition-colors font-bold disabled:opacity-50 cursor-pointer"
                >
                  {isVerifying ? "Verifying..." : "Unlock Sanctuary Pass"}
                </button>
              </form>
            )}
            
            <p className="text-[9px] uppercase tracking-[0.2em] text-brand-soft/50 mt-12">
              Secure payment processing via Gumroad. Cancel anytime.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
