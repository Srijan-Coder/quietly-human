import { Suspense } from "react";
import LeavingWarningClient from "./LeavingWarningClient";

export const metadata = {
  title: "Leaving Sanctuary",
};

export default function LeavingPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] font-sans text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-black to-black pointer-events-none" />
      
      <div className="max-w-md w-full bg-[#121212] border border-white/5 rounded-3xl p-10 text-center relative z-10">
        <span className="text-4xl filter grayscale opacity-50 mb-6 block">🛡️</span>
        <h1 className="font-serif text-3xl text-white mb-4">You are leaving the Sanctuary.</h1>
        <p className="text-brand-soft text-sm leading-relaxed mb-8">
          You are about to visit an external website. While we hope it's a beautiful place, Quietly Humans is not responsible for its content. 
          <br/><br/>
          <span className="text-brand-accent font-bold">Never enter your passwords on untrusted sites.</span>
        </p>

        <Suspense fallback={<div className="h-20" />}>
          <LeavingWarningClient />
        </Suspense>
      </div>
    </div>
  );
}
