"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CheckoutButton({ priceId }: { priceId: string }) {
  const [loading, setLoading] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleCheckout = async () => {
    if (!isSignedIn) {
      alert("Please sign in first to subscribe.");
      router.push("/onboarding");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId })
      });
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCheckout}
      disabled={loading || !priceId}
      className="bg-brand-text text-brand-bg px-12 py-4 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-brand-accent hover:text-white transition-all disabled:opacity-50"
    >
      {loading ? "Preparing Gateway..." : "Unlock Sanctuary Pass"}
    </button>
  );
}
