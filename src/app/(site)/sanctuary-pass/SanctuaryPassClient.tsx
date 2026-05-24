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

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-3xl mx-auto w-full pb-32 font-serif text-center">
      <header className="mb-16 border-b border-brand-border pb-12">
        <h1 className="text-5xl text-brand-text mb-4">The Sanctuary Pass</h1>
        <p className="text-brand-soft text-lg max-w-xl mx-auto italic">
          Unlock the deepest tools, expand your quiet collection, and support the sanctuary.
        </p>
      </header>

      {isPremium || success ? (
        <div className="bg-[#121212] border border-brand-accent p-12 rounded-[2rem] shadow-[0_0_50px_rgba(252,163,17,0.1)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/10 to-transparent opacity-50 pointer-events-none" />
          <h2 className="text-4xl text-brand-accent mb-4 relative z-10 font-serif">You are a Guardian.</h2>
          <p className="text-brand-soft mb-8 text-lg relative z-10 font-sans">
            Thank you for supporting Quietly Humans. Your Sanctuary Pass is active, granting you full access to all premium tools, quiet mode, and unlimited collection saves.
          </p>
          <Link href="/toolkit" className="bg-white text-black px-8 py-3 rounded-full uppercase tracking-widest text-xs font-bold hover:scale-105 transition-transform relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.1)] inline-block">
            Enter The Toolkit
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-16">
          
          {/* Comparison Table */}
          <div className="bg-[#121212] border border-white/5 rounded-[2rem] overflow-hidden">
            <div className="grid grid-cols-3 border-b border-white/5 bg-black/40 text-[10px] uppercase tracking-widest text-brand-soft p-6 font-bold">
              <div>Features</div>
              <div className="text-center">Free</div>
              <div className="text-center text-brand-accent">Guardian</div>
            </div>
            
            <div className="divide-y divide-white/5 font-sans text-sm">
              <div className="grid grid-cols-3 p-6 hover:bg-white/5 transition-colors">
                <div className="text-left text-white">Basic Toolkit (10 Tools)</div>
                <div className="text-center text-white/50">✓</div>
                <div className="text-center text-brand-accent">✓</div>
              </div>
              <div className="grid grid-cols-3 p-6 hover:bg-white/5 transition-colors">
                <div className="text-left text-white">Creator Room & Writing</div>
                <div className="text-center text-white/50">✓</div>
                <div className="text-center text-brand-accent">✓</div>
              </div>
              <div className="grid grid-cols-3 p-6 hover:bg-white/5 transition-colors">
                <div className="text-left text-white">Premium Toolkit (20 Tools)</div>
                <div className="text-center text-white/10">-</div>
                <div className="text-center text-brand-accent">✓</div>
              </div>
              <div className="grid grid-cols-3 p-6 hover:bg-white/5 transition-colors">
                <div className="text-left text-white">Quiet Mode (Ad-Free)</div>
                <div className="text-center text-white/10">-</div>
                <div className="text-center text-brand-accent">✓</div>
              </div>
              <div className="grid grid-cols-3 p-6 hover:bg-white/5 transition-colors">
                <div className="text-left text-white">Guardian Profile Badge</div>
                <div className="text-center text-white/10">-</div>
                <div className="text-center text-brand-accent">🌿</div>
              </div>
            </div>
          </div>

          {/* Checkout Card */}
          <div className="bg-[#121212] border border-white/10 p-8 md:p-12 rounded-[2rem] relative overflow-hidden text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
            
            <h2 className="text-4xl text-white mb-2 font-serif relative z-10">Become a Guardian</h2>
            <div className="text-brand-accent text-xl font-sans mb-8 relative z-10">
              <span className="text-5xl font-bold font-serif">$4.99</span> / month
            </div>

            <a 
              href={checkoutUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-brand-accent text-black px-12 py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:scale-105 transition-transform shadow-[0_0_30px_rgba(252,163,17,0.3)] inline-block relative z-10 mb-6"
            >
              Subscribe via Gumroad
            </a>
            
            <div className="relative z-10">
              {!showRedeem ? (
                <button 
                  onClick={() => setShowRedeem(true)}
                  className="text-[10px] uppercase tracking-widest text-brand-soft hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
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
                    className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-sm text-center font-mono focus:outline-none focus:border-brand-accent text-white uppercase"
                    required
                  />
                  {error && <p className="text-xs text-red-400">{error}</p>}
                  <button 
                    type="submit" 
                    disabled={isVerifying}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 rounded-lg text-xs uppercase tracking-widest transition-colors font-bold disabled:opacity-50"
                  >
                    {isVerifying ? "Verifying..." : "Unlock Sanctuary Pass"}
                  </button>
                </form>
              )}
            </div>
            
            <p className="text-[10px] uppercase tracking-widest text-white/30 mt-8 relative z-10">
              Secure payment processing. Cancel anytime.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
