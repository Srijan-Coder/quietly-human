"use client";

import { useState } from "react";
import { createProfile } from "@/actions/profile";
import { useRouter } from "next/navigation";

export default function OnboardingForm({ userId, fallbackName, fallbackAvatar }: { userId: string, fallbackName: string, fallbackAvatar?: string }) {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState(fallbackName);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // basic validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      setError("Username must be 3-20 characters, letters, numbers, or underscores.");
      return;
    }

    setLoading(true);
    try {
      const res = await createProfile({
        id: userId,
        username: username.toLowerCase(),
        display_name: displayName,
        bio,
        avatar_url: fallbackAvatar || null
      });

      if (res.error) {
        setError(res.error);
      } else {
        router.push("/collection");
        router.refresh(); // hard refresh to update UsernameCheck wrapper
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ambiances = [
    { id: "sky", name: "Sky", color: "bg-blue-500/20", border: "border-blue-500/50" },
    { id: "forest", name: "Forest", color: "bg-emerald-500/20", border: "border-emerald-500/50" },
    { id: "dusk", name: "Dusk", color: "bg-purple-500/20", border: "border-purple-500/50" },
    { id: "midnight", name: "Midnight", color: "bg-slate-500/20", border: "border-slate-500/50" },
    { id: "ember", name: "Ember", color: "bg-brand-accent/20", border: "border-brand-accent/50" }
  ];
  const [ambiance, setAmbiance] = useState("ember");

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-[#121212] border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      
      {error && <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 p-4 rounded-xl text-center relative z-10">{error}</div>}

      <div className="flex flex-col gap-3 relative z-10">
        <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
          Username
        </label>
        <div className="relative flex items-center">
          <span className="absolute left-4 text-white/40 font-sans">@</span>
          <input 
            type="text" 
            required
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
            className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors font-sans hover:bg-white/5"
            placeholder="quietlyhuman"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 relative z-10">
        <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
          Display Name
        </label>
        <input 
          type="text" 
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors font-sans hover:bg-white/5"
          placeholder="How should we call you?"
        />
      </div>

      <div className="flex flex-col gap-3 relative z-10">
        <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
          Room Ambiance
        </label>
        <div className="grid grid-cols-5 gap-3">
          {ambiances.map(a => (
            <div 
              key={a.id} 
              onClick={() => setAmbiance(a.id)}
              className={`aspect-square rounded-xl cursor-pointer flex items-center justify-center border-2 transition-all hover:scale-105 ${a.color} ${ambiance === a.id ? a.border : 'border-transparent'}`}
            >
              {ambiance === a.id && <span className="text-white text-xs">✓</span>}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-brand-soft/50 uppercase tracking-widest text-center mt-2">{ambiances.find(a => a.id === ambiance)?.name} Ambiance Selected</p>
      </div>

      <div className="flex flex-col gap-3 relative z-10">
        <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
          Bio (Optional)
        </label>
        <textarea 
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full bg-black/50 border border-white/10 rounded-xl py-4 px-4 text-brand-soft focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-colors resize-none font-serif text-sm hover:bg-white/5 leading-relaxed"
          placeholder="A few quiet words about yourself..."
        />
      </div>

      <button 
        type="submit" 
        disabled={loading || !username}
        className="mt-6 w-full bg-white text-black py-5 rounded-full text-xs uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50 font-bold relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
      >
        {loading ? "Entering..." : "Enter Sanctuary"}
      </button>
    </form>
  );
}
