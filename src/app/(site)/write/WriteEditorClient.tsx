"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WriteEditorClient({ isPremium, pins }: { isPremium: boolean, pins: any[] }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("letter");
  const [attachedPinIndex, setAttachedPinIndex] = useState("-1");
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("Draft saved locally");
  
  const router = useRouter();

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("quietly_draft");
    if (savedDraft) {
      try {
        const { title, content, type } = JSON.parse(savedDraft);
        if (title) setTitle(title);
        if (content) setContent(content);
        if (type) setType(type);
      } catch (e) {}
    }
  }, []);

  // Auto-save draft every 3 seconds if changed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content) {
        localStorage.setItem("quietly_draft", JSON.stringify({ title, content, type }));
        setSaveStatus(`Draft saved at ${new Date().toLocaleTimeString()}`);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [title, content, type]);

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Please add a title and some words before publishing.");
      return;
    }

    setIsPublishing(true);
    setError("");

    try {
      const payload: any = { title, content, type };
      
      // If a pin is selected and they are premium, attach it
      if (attachedPinIndex !== "-1" && isPremium) {
        payload.attachedPin = pins[parseInt(attachedPinIndex)];
      }

      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to publish");
      }

      // Success
      localStorage.removeItem("quietly_draft");
      router.push("/reading-room");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-serif relative">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-sans text-center">
          {error}
        </div>
      )}

      <div className="bg-[#121212] border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        
        {/* Editor Controls */}
        <div className="flex justify-between items-end gap-4 flex-wrap relative z-10 mb-12 border-b border-white/5 pb-8">
          <div className="flex gap-4 flex-wrap w-full md:w-auto">
            <div className="flex flex-col gap-3 flex-1 min-w-[200px]">
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                Type of writing
              </label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent font-sans text-sm appearance-none cursor-pointer hover:bg-white/5 transition-colors"
              >
                <option value="letter">Midnight Letter (Long form)</option>
                <option value="quote">Quiet Quote (Short thought)</option>
                <option value="blog">Journal Entry (Updates/Thoughts)</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 flex-1 min-w-[200px] relative">
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${isPremium ? 'bg-brand-accent' : 'bg-brand-soft'}`}></span>
                Attach Product {isPremium ? '' : '🔒'}
              </label>
              <select 
                value={attachedPinIndex} 
                onChange={e => setAttachedPinIndex(e.target.value)}
                disabled={!isPremium || pins.length === 0}
                className={`bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent font-sans text-sm appearance-none cursor-pointer hover:bg-white/5 transition-colors ${!isPremium ? 'opacity-50' : ''}`}
              >
                <option value="-1">No product attached</option>
                {pins.map((pin, i) => (
                  <option key={i} value={i.toString()}>{pin.emoji} {pin.title}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="text-[10px] uppercase tracking-widest text-brand-soft/50 font-sans hidden sm:flex items-center gap-2 mb-4">
            <span className="animate-pulse">●</span> {saveStatus}
          </div>
        </div>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-4xl md:text-5xl text-white font-serif placeholder:text-white/20 mb-8 relative z-10"
        />

        {/* Content Input */}
        <textarea
          placeholder="Write what is heavy on your mind..."
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-xl md:text-2xl text-brand-soft font-serif placeholder:text-white/10 resize-none min-h-[70vh] leading-relaxed relative z-10"
        />

        {/* Action Bar */}
        <div className="fixed sm:absolute bottom-6 left-6 right-6 sm:bottom-12 sm:left-12 sm:right-12 flex justify-between items-center bg-black/90 sm:bg-transparent backdrop-blur-xl sm:backdrop-blur-none p-4 sm:p-0 rounded-2xl sm:rounded-none border sm:border-none border-white/10 z-50 shadow-2xl sm:shadow-none">
          <span className="text-[10px] sm:hidden uppercase tracking-widest text-brand-soft line-clamp-1 flex-1 pr-4 flex items-center gap-2">
            <span className="animate-pulse text-brand-accent">●</span> Saved
          </span>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="ml-auto px-8 py-4 bg-white text-black rounded-full text-xs uppercase tracking-widest hover:scale-105 transition-transform font-bold disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            {isPublishing ? "Publishing..." : "Publish to Sanctuary"}
          </button>
        </div>
      </div>
    </div>
  );
}
