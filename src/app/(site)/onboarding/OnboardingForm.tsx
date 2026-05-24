"use client";

import { useState } from "react";
import { createProfile } from "@/actions/profile";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function OnboardingForm({ userId, fallbackName, fallbackAvatar }: { userId: string, fallbackName: string, fallbackAvatar?: string }) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState(fallbackName);
  const [bio, setBio] = useState("");
  const [roomTheme, setRoomTheme] = useState("dark");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleNext = () => {
    setError("");
    if (step === 1) {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        setError("Username must be 3-20 characters, letters, numbers, or underscores.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await createProfile({
        id: userId,
        username: username.toLowerCase(),
        display_name: displayName,
        bio,
        avatar_url: fallbackAvatar || null,
        room_theme: roomTheme
      });

      if (res.error) {
        setError(res.error);
        setStep(1); // Go back if error
      } else {
        router.push("/collection");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const themes = [
    { id: "dark", name: "Classic Onyx", color: "bg-[#121212]", border: "border-white/20" },
    { id: "midnight-blue", name: "Midnight Blue", color: "bg-[#0a0f1c]", border: "border-blue-500/30" },
    { id: "forest-green", name: "Forest Green", color: "bg-[#0a120c]", border: "border-emerald-500/30" },
    { id: "crimson", name: "Crimson Ember", color: "bg-[#1a0a0a]", border: "border-red-500/30" },
    { id: "sepia", name: "Warm Sepia", color: "bg-[#1c1812]", border: "border-amber-500/30" }
  ];

  return (
    <div className="bg-[#121212] border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden min-h-[450px] flex flex-col justify-center">
      {/* Progress Dots */}
      <div className="absolute top-8 left-0 right-0 flex justify-center gap-3 z-20">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`w-2 h-2 rounded-full transition-all duration-500 ${step === s ? 'bg-brand-accent scale-125' : step > s ? 'bg-white/50' : 'bg-white/10'}`} />
        ))}
      </div>

      {error && <div className="absolute top-16 left-8 right-8 text-red-400 text-xs bg-red-400/10 border border-red-400/20 p-3 rounded-xl text-center z-20">{error}</div>}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            <div className="text-center mb-4">
              <h2 className="font-serif text-3xl text-white mb-2">Who are you?</h2>
              <p className="text-brand-soft text-sm">Choose how others will know you.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-brand-accent"></span> Username
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-white/40 font-sans">@</span>
                <input 
                  type="text" required value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-accent transition-colors text-sm"
                  placeholder="quietlyhuman"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-brand-accent"></span> Display Name
              </label>
              <input 
                type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-accent transition-colors text-sm"
                placeholder="How should we call you?"
              />
            </div>

            <button 
              onClick={handleNext} disabled={!username}
              className="mt-4 w-full bg-white text-black py-4 rounded-full text-[10px] uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50 font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6"
          >
            <div className="text-center mb-2">
              <h2 className="font-serif text-3xl text-white mb-2">Set the Ambiance</h2>
              <p className="text-brand-soft text-sm">Choose a theme for your Quiet Room.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {themes.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => setRoomTheme(t.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-all ${t.color} ${roomTheme === t.id ? t.border + ' shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'border-transparent hover:border-white/10'}`}
                >
                  <div className={`w-6 h-6 rounded-full border ${roomTheme === t.id ? 'border-brand-accent flex items-center justify-center' : 'border-white/20'}`}>
                    {roomTheme === t.id && <div className="w-3 h-3 rounded-full bg-brand-accent" />}
                  </div>
                  <span className={`font-serif ${roomTheme === t.id ? 'text-white' : 'text-brand-soft'}`}>{t.name}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-4">
              <button 
                onClick={() => setStep(1)}
                className="w-1/3 bg-white/5 border border-white/10 text-brand-soft py-4 rounded-full text-[10px] uppercase tracking-widest hover:text-white transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleNext}
                className="w-2/3 bg-white text-black py-4 rounded-full text-[10px] uppercase tracking-widest hover:scale-105 transition-transform font-bold"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6 text-center h-full justify-center py-8"
          >
            <span className="text-6xl mb-4 filter grayscale opacity-80">🗝️</span>
            <h2 className="font-serif text-3xl text-white mb-2">The Door is Open.</h2>
            <p className="text-brand-soft text-sm leading-relaxed mb-8">
              Your room has been prepared. <br/>Enter the sanctuary and begin your journey.
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setStep(2)} disabled={loading}
                className="w-1/3 bg-transparent text-brand-soft py-4 rounded-full text-[10px] uppercase tracking-widest hover:text-white transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button 
                onClick={handleSubmit} disabled={loading}
                className="w-2/3 bg-brand-accent text-brand-bg py-4 rounded-full text-[10px] uppercase tracking-widest hover:scale-105 transition-transform font-bold disabled:opacity-50 shadow-[0_0_20px_rgba(201,164,106,0.3)]"
              >
                {loading ? "Entering..." : "Enter Room"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
