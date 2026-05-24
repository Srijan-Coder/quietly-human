"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PinManagerClient({ initialPins, userId, isPremium }: { initialPins: any[], userId: string, isPremium: boolean }) {
  const [pins, setPins] = useState(initialPins);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/settings/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pins })
      });

      if (!res.ok) throw new Error("Failed to save pins");
      
      router.refresh();
      setSuccess("Pins saved successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addPin = () => {
    if (!isPremium && pins.length >= 2) {
      setError("Free rooms are limited to 2 pins. Upgrade to the Sanctuary Pass to unlock unlimited store pins and post embeds.");
      return;
    }
    if (pins.length >= 10) {
      setError("Maximum 10 pins allowed per room.");
      return;
    }
    setPins([...pins, { emoji: "🔗", title: "New Link", subtitle: "Description", url: "https://" }]);
  };

  const removePin = (index: number) => {
    setPins(pins.filter((_, i) => i !== index));
  };

  const updatePin = (index: number, field: string, value: string) => {
    const newPins = [...pins];
    newPins[index] = { ...newPins[index], [field]: value };
    setPins(newPins);
  };

  return (
    <div>
      {error && <div className="text-red-400 mb-4 text-sm font-sans bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</div>}
      {success && <div className="text-green-400 mb-4 text-sm font-sans bg-green-500/10 p-3 rounded-lg border border-green-500/20">{success}</div>}
      
      <p className="text-brand-soft text-sm font-sans mb-8">
        Add up to {isPremium ? "10" : "2"} pins to your Creator Room. You can link your Gumroad products, your social media, or any other link. Use a price tag emoji (🏷️) or link emoji (🔗).
      </p>

      <div className="space-y-6 mb-8">
        {pins.map((pin, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-6 p-6 border border-brand-border/40 rounded-2xl bg-brand-bg/20 relative group hover:border-brand-accent/50 transition-colors">
            <button 
              onClick={() => removePin(i)} 
              className="absolute -top-3 -right-3 bg-brand-card border border-brand-border text-brand-soft rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors z-10 shadow-lg cursor-pointer"
            >
              ✕
            </button>
            <div className="flex flex-col items-center justify-center bg-brand-card border border-brand-border rounded-xl w-24 h-24 shrink-0 mx-auto sm:mx-0">
              <input 
                value={pin.emoji} 
                onChange={e => updatePin(i, "emoji", e.target.value)} 
                className="bg-transparent text-center w-full text-4xl outline-none text-brand-text" 
                maxLength={2}
                placeholder="🔗"
              />
              <span className="text-[9px] uppercase tracking-widest text-brand-soft/50 mt-2">Emoji</span>
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-1 block">Title / Product Name</label>
                <input 
                  value={pin.title} 
                  onChange={e => updatePin(i, "title", e.target.value)} 
                  placeholder="e.g. Minimalist Notion Journal" 
                  className="w-full bg-transparent border-b border-brand-border/40 focus:border-brand-accent pb-2 outline-none font-sans text-brand-text text-lg transition-colors" 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-1 block">Subtitle / Price</label>
                <input 
                  value={pin.subtitle} 
                  onChange={e => updatePin(i, "subtitle", e.target.value)} 
                  placeholder="e.g. $9.99 • Digital Download" 
                  className="w-full bg-transparent border-b border-brand-border/40 focus:border-brand-accent pb-2 outline-none font-sans text-brand-soft transition-colors text-sm" 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mb-1 block">Gumroad / External Link</label>
                <input 
                  value={pin.url} 
                  onChange={e => updatePin(i, "url", e.target.value)} 
                  placeholder="https://gumroad.com/l/..." 
                  className="w-full bg-transparent border-b border-brand-border/40 focus:border-brand-accent pb-2 outline-none font-sans text-brand-accent transition-colors text-sm" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center bg-brand-card border border-brand-border p-6 rounded-2xl gap-4">
        <button 
          onClick={addPin} 
          disabled={isPremium ? pins.length >= 10 : pins.length >= 2}
          className="text-xs uppercase tracking-widest text-brand-text hover:text-brand-accent transition-colors font-sans disabled:opacity-50 flex items-center gap-2 font-bold cursor-pointer"
        >
          <span className="text-xl">+</span> Add Pin ({pins.length}/{isPremium ? "10" : "2"})
        </button>
        
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-brand-text text-brand-bg px-8 py-3 rounded-full uppercase tracking-widest text-xs font-bold hover:scale-105 transition-transform disabled:opacity-50 cursor-pointer w-full sm:w-auto text-center"
        >
          {loading ? "Saving..." : "Save Store & Pins"}
        </button>
      </div>
    </div>
  );
}
