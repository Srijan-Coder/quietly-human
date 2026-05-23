"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PinManagerClient({ initialPins, userId }: { initialPins: any[], userId: string }) {
  const [pins, setPins] = useState(initialPins);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/settings/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pins })
      });

      if (!res.ok) throw new Error("Failed to save pins");
      
      router.refresh();
      alert("Pins saved successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addPin = () => {
    if (pins.length >= 4) {
      setError("Maximum 4 pins allowed.");
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
      {error && <div className="text-red-400 mb-4 text-sm font-sans">{error}</div>}
      
      <div className="space-y-4 mb-8">
        {pins.map((pin, i) => (
          <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 border border-brand-border/50 rounded-xl bg-brand-bg relative">
            <button 
              onClick={() => removePin(i)} 
              className="absolute -top-2 -right-2 bg-red-500/20 text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-500 hover:text-white transition-colors"
            >
              ×
            </button>
            <input 
              value={pin.emoji} 
              onChange={e => updatePin(i, "emoji", e.target.value)} 
              className="bg-transparent border-b border-brand-border text-center w-12 text-2xl outline-none" 
              maxLength={2}
            />
            <div className="flex-1 space-y-2">
              <input 
                value={pin.title} 
                onChange={e => updatePin(i, "title", e.target.value)} 
                placeholder="Title" 
                className="w-full bg-transparent border-b border-brand-border outline-none font-sans text-brand-text" 
              />
              <input 
                value={pin.subtitle} 
                onChange={e => updatePin(i, "subtitle", e.target.value)} 
                placeholder="Subtitle" 
                className="w-full bg-transparent border-b border-brand-border outline-none font-sans text-xs text-brand-soft" 
              />
              <input 
                value={pin.url} 
                onChange={e => updatePin(i, "url", e.target.value)} 
                placeholder="https://" 
                className="w-full bg-transparent border-b border-brand-border outline-none font-sans text-xs text-brand-accent" 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <button 
          onClick={addPin} 
          disabled={pins.length >= 4}
          className="text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors font-sans disabled:opacity-50"
        >
          + Add Pin
        </button>
        
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-brand-text text-brand-bg px-6 py-2 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-brand-accent hover:text-white transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Pins"}
        </button>
      </div>
    </div>
  );
}
