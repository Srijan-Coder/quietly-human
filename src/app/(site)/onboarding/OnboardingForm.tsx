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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-brand-card border border-brand-border p-8 rounded-2xl shadow-sm">
      {error && <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-md text-center">{error}</div>}

      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-widest text-brand-soft">Username</label>
        <div className="relative flex items-center">
          <span className="absolute left-3 text-brand-soft font-sans">@</span>
          <input 
            type="text" 
            required
            value={username}
            onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
            className="w-full bg-brand-bg border border-brand-border rounded-lg py-3 pl-8 pr-3 text-brand-text focus:outline-none focus:border-brand-accent transition-colors font-sans"
            placeholder="quietlyhuman"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-widest text-brand-soft">Display Name</label>
        <input 
          type="text" 
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full bg-brand-bg border border-brand-border rounded-lg py-3 px-4 text-brand-text focus:outline-none focus:border-brand-accent transition-colors font-sans"
          placeholder="How should we call you?"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs uppercase tracking-widest text-brand-soft">Bio (Optional)</label>
        <textarea 
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full bg-brand-bg border border-brand-border rounded-lg py-3 px-4 text-brand-text focus:outline-none focus:border-brand-accent transition-colors resize-none font-serif text-sm"
          placeholder="A few quiet words about yourself..."
        />
      </div>

      <button 
        type="submit" 
        disabled={loading || !username}
        className="mt-4 w-full bg-brand-text text-brand-bg py-4 rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all disabled:opacity-50 font-bold"
      >
        {loading ? "Entering..." : "Enter Sanctuary"}
      </button>
    </form>
  );
}
