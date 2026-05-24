"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/global/TiptapEditor";

const CATEGORIES = [
  "Uncategorized", "Stoicism", "Minimalism", "Healing", "Midnight Thoughts", 
  "Overthinking", "Journaling", "Anxiety", "Focus", "Ebooks", "Guides", 
  "Templates", "Art", "Poetry", "Love", "Grief", "Productivity", "Mindfulness", 
  "Philosophy", "Mental Health", "Self Care", "Burnout", "Creativity", "Design",
  "Writing", "Solitude", "Nature", "Habits", "Discipline", "Motivation", 
  "Depression", "Therapy", "ADHD", "Introversion", "Quiet", "Spirituality",
  "Meditation", "Buddhism", "Psychology", "Relationships", "Letting Go",
  "Acceptance", "Growth", "Life Lessons", "Reflections", "Personal Essays",
  "Fiction", "Short Stories", "Letters", "Dreams", "Nostalgia"
].sort();

const POST_THEMES = [
  { id: "default", name: "Classic Onyx" },
  { id: "midnight-blue", name: "Midnight Blue" },
  { id: "forest-green", name: "Deep Forest" },
  { id: "crimson", name: "Dark Crimson" },
  { id: "sepia", name: "Warm Sepia" },
];

export default function WriteEditorClient({ isPremium, pins, initialPost }: { isPremium: boolean, pins: any[], initialPost?: any }) {
  const [title, setTitle] = useState(initialPost?.title || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [type, setType] = useState(initialPost?.type || "letter");
  const [category, setCategory] = useState(initialPost?.category || "Uncategorized");
  const [postTheme, setPostTheme] = useState(initialPost?.post_theme || "default");
  
  // Find which pin indexes correspond to the attached_pins
  const initialPinIndexes: number[] = [];
  if (initialPost?.attached_pins && pins) {
    initialPost.attached_pins.forEach((attachedPin: any) => {
      const idx = pins.findIndex(p => p.url === attachedPin.url);
      if (idx !== -1) initialPinIndexes.push(idx);
    });
  }
  
  const [selectedPinIndexes, setSelectedPinIndexes] = useState<number[]>(initialPinIndexes);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("Draft saved locally");
  
  const router = useRouter();

  // Load draft on mount (only if NOT editing an existing post)
  useEffect(() => {
    if (!initialPost) {
      const savedDraft = localStorage.getItem("quietly_draft");
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.content) setContent(parsed.content);
          if (parsed.type) setType(parsed.type);
          if (parsed.category) setCategory(parsed.category);
          if (parsed.postTheme) setPostTheme(parsed.postTheme);
          if (parsed.selectedPinIndexes) setSelectedPinIndexes(parsed.selectedPinIndexes);
        } catch (e) {}
      }
    }
  }, [initialPost]);

  // Auto-save draft every 3 seconds if changed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!initialPost && (title || content)) {
        localStorage.setItem("quietly_draft", JSON.stringify({ 
          title, content, type, category, postTheme, selectedPinIndexes 
        }));
        setSaveStatus(`Draft saved at ${new Date().toLocaleTimeString()}`);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [title, content, type, category, postTheme, selectedPinIndexes, initialPost]);

  const togglePin = (index: number) => {
    if (selectedPinIndexes.includes(index)) {
      setSelectedPinIndexes(selectedPinIndexes.filter(i => i !== index));
    } else {
      if (selectedPinIndexes.length >= 3) {
        alert("You can only attach up to 3 links per post.");
        return;
      }
      setSelectedPinIndexes([...selectedPinIndexes, index]);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Please add a title and some words before publishing.");
      return;
    }

    setIsPublishing(true);
    setError("");

    try {
      const payload: any = { title, content, type, category, postTheme };
      
      // Attach selected pins if premium
      if (selectedPinIndexes.length > 0 && isPremium) {
        payload.attachedPins = selectedPinIndexes.map(i => pins[i]);
      }

      const url = initialPost ? `/api/posts/${initialPost.id}` : "/api/publish";
      const method = initialPost ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to publish");
      }

      // Success
      if (!initialPost) {
        localStorage.removeItem("quietly_draft");
      }
      
      router.push("/dashboard");
      router.refresh();
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

      {/* Editor Main Container */}
      <div className={`border border-white/5 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group transition-colors duration-1000 ${
        postTheme === 'midnight-blue' ? 'bg-[#0a0f1c]' :
        postTheme === 'forest-green' ? 'bg-[#0a120c]' :
        postTheme === 'crimson' ? 'bg-[#1a0a0a]' :
        postTheme === 'sepia' ? 'bg-[#1c1812]' :
        'bg-[#121212]'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        
        {/* Editor Settings Row */}
        <div className="flex flex-col gap-8 relative z-10 mb-12 border-b border-white/5 pb-8">
          
          {/* Top row: Type, Category, Theme */}
          <div className="flex gap-4 flex-wrap w-full">
            <div className="flex flex-col gap-3 flex-1 min-w-[180px]">
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                Format
              </label>
              <select value={type} onChange={e => setType(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent font-sans text-sm appearance-none cursor-pointer hover:bg-white/5 transition-colors">
                <option value="letter" className="bg-[#1a1a1a] text-white">Midnight Letter (Long)</option>
                <option value="quote" className="bg-[#1a1a1a] text-white">Quiet Quote (Short)</option>
                <option value="blog" className="bg-[#1a1a1a] text-white">Journal Entry</option>
                <option value="ebook" className="bg-[#1a1a1a] text-white">Ebook / Book</option>
                <option value="guide" className="bg-[#1a1a1a] text-white">Guide / Course</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 flex-1 min-w-[180px]">
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                Category
              </label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent font-sans text-sm appearance-none cursor-pointer hover:bg-white/5 transition-colors">
                {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1a1a1a] text-white">{c}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-3 flex-1 min-w-[180px]">
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                Post Theme
              </label>
              <select value={postTheme} onChange={e => setPostTheme(e.target.value)} className="bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent font-sans text-sm appearance-none cursor-pointer hover:bg-white/5 transition-colors">
                {POST_THEMES.map(t => <option key={t.id} value={t.id} className="bg-[#1a1a1a] text-white">{t.name}</option>)}
              </select>
            </div>
          </div>

          {/* Bottom row: Pins */}
          <div className="flex flex-col gap-3 w-full">
            <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${isPremium ? 'bg-brand-accent' : 'bg-brand-soft'}`}></span>
              Attach Products {isPremium ? '(Up to 3)' : '🔒 Premium Required'}
            </label>
            
            {!isPremium ? (
              <div className="text-sm font-sans text-brand-soft/50 bg-black/50 border border-white/5 p-4 rounded-xl">
                Upgrade to the Sanctuary Pass to attach store products to this post.
              </div>
            ) : pins.length === 0 ? (
              <div className="text-sm font-sans text-brand-soft/50 bg-black/50 border border-white/5 p-4 rounded-xl">
                You haven't added any Store Pins yet. Go to Settings to add some!
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {pins.map((pin, i) => (
                  <button
                    key={i}
                    onClick={() => togglePin(i)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-sans ${
                      selectedPinIndexes.includes(i) 
                        ? 'bg-brand-accent text-black border-brand-accent font-bold' 
                        : 'bg-black/50 border-white/10 text-brand-soft hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{pin.emoji}</span>
                    <span>{pin.title}</span>
                  </button>
                ))}
              </div>
            )}
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

        {/* Tiptap Rich Text Editor */}
        <div className="relative z-10">
          <TiptapEditor content={content} onChange={setContent} />
        </div>

        {/* Action Bar */}
        <div className="fixed sm:absolute bottom-6 left-6 right-6 sm:bottom-12 sm:left-12 sm:right-12 flex justify-between items-center bg-black/90 sm:bg-transparent backdrop-blur-xl sm:backdrop-blur-none p-4 sm:p-0 rounded-2xl sm:rounded-none border sm:border-none border-white/10 z-50 shadow-2xl sm:shadow-none">
          <span className="text-[10px] uppercase tracking-widest text-brand-soft flex items-center gap-2">
            <span className="animate-pulse text-brand-accent">●</span> {saveStatus}
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
