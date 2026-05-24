"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { searchSanctuary, GlobalSearchResult } from "@/actions/search";

// -------------------------------------------------------------
// HYBRID EMOTIONAL SEARCH: THE LOCAL TOOL DICTIONARY
// -------------------------------------------------------------
type ToolRecommendation = {
  id: string;
  name: string;
  icon: string;
  desc: string;
  link: string;
  keywords: string[];
};

const TOOL_DATABASE: ToolRecommendation[] = [
  { id: "panic", name: "Panic Redirector", icon: "🕰️", desc: "Break thought spirals using the 5-4-3-2-1 clinical method.", link: "/toolkit/panic-redirector", keywords: ["panic", "scared", "terrified", "panic attack", "anxiety", "freaking out", "hyperventilating"] },
  { id: "heavy-exhausted", name: "I am completely exhausted", icon: "🔋", desc: "A quiet space that gives you permission to do absolutely nothing.", link: "/heavy", keywords: ["tired", "exhausted", "burnout", "burnt out", "sleepy", "fatigue", "can't do this"] },
  { id: "breathe", name: "The Breathing Room", icon: "🌬️", desc: "A cyclic visualizer to regulate your nervous system.", link: "/breathe", keywords: ["breathe", "breathing", "hyperventilating", "calm down", "slow down"] },
  { id: "heavy-alone", name: "I feel completely alone", icon: "🌌", desc: "A cosmic perspective for the deeply isolated.", link: "/heavy", keywords: ["alone", "lonely", "isolated", "no one", "nobody", "invisible"] },
  { id: "heavy-sleep", name: "I cannot sleep", icon: "🌙", desc: "Permission to rest your body without forcing sleep.", link: "/heavy", keywords: ["sleep", "insomnia", "can't sleep", "awake", "night", "3am"] },
  { id: "atomizer", name: "The Task Atomizer", icon: "🔨", desc: "Shatter an overwhelming task and enter hyper-focus mode.", link: "/toolkit/task-atomizer", keywords: ["procrastination", "task", "work", "adhd", "overwhelmed", "stuck", "paralyzed"] },
  { id: "done-list", name: "The 'Done' List", icon: "✅", desc: "A reverse to-do list for low-energy days to track survival.", link: "/toolkit/done-list", keywords: ["unproductive", "lazy", "did nothing", "failure", "worthless"] },
  { id: "brain-dump", name: "The Brain Dump", icon: "🗑️", desc: "An unreadable canvas. Vent your chaos and wipe it clean.", link: "/toolkit/brain-dump", keywords: ["vent", "angry", "rant", "thoughts", "noise", "loud", "too much"] },
  { id: "decision", name: "The Decision Coin", icon: "🪙", desc: "Flip a slow-motion coin and let the universe decide.", link: "/toolkit/decision-coin", keywords: ["choice", "decide", "decision", "indecisive", "options", "paralyzed by choices"] },
  { id: "courtroom", name: "Cognitive Courtroom", icon: "⚖️", desc: "Put your anxious story on trial and extract objective facts.", link: "/toolkit/cognitive-courtroom", keywords: ["worry", "anxious", "catastrophizing", "fake", "truth", "overthinking"] },
  { id: "sandbox", name: "Grounding Sandbox", icon: "✨", desc: "A calming physics sandbox to pull your mind to the present.", link: "/toolkit/grounding-sandbox", keywords: ["distract", "distraction", "fidget", "play", "sandbox"] },
  { id: "leaves", name: "Leaves on a Stream", icon: "🍃", desc: "Place intrusive thoughts on a leaf and watch them float away.", link: "/toolkit/leaves-on-stream", keywords: ["intrusive", "thoughts", "let go", "obsessive", "ocd"] },
  { id: "friction", name: "Friction Generator", icon: "🛑", desc: "A physical speed bump to stop impulsive behaviors.", link: "/toolkit/friction-generator", keywords: ["impulsive", "stop", "urge", "addiction", "texting ex", "spending"] },
  { id: "urge", name: "Urge Surfer", icon: "🌊", desc: "Watch a 5-minute wave and log craving intensity until it breaks.", link: "/toolkit/urge-surfer", keywords: ["urge", "craving", "addiction", "smoke", "drink", "relapse"] },
  { id: "worry-post", name: "Worry Postponer", icon: "📦", desc: "Lock your worry in a box and schedule a 15-minute window for later.", link: "/toolkit/worry-postponer", keywords: ["worrying", "can't stop", "future", "postpone", "later"] },
  { id: "control", name: "Control Sorter", icon: "⚖️", desc: "Sort anxieties and watch the uncontrollable ones disintegrate.", link: "/toolkit/control-sorter", keywords: ["control", "helpless", "out of control", "world", "politics", "news"] },
  { id: "dopamine", name: "Dopamine Menu", icon: "🍽️", desc: "Get a 'Chef's Recommendation' for healthy stimulation.", link: "/toolkit/dopamine-menu", keywords: ["bored", "doomscrolling", "phone", "scrolling", "dopamine", "tiktok"] },
  { id: "yes-but", name: "The 'Yes, But' Flipper", icon: "🃏", desc: "Combat black-and-white thinking by forcing nuance.", link: "/toolkit/yes-but-flipper", keywords: ["always", "never", "ruined", "black and white", "failure", "awful"] },
  { id: "color", name: "Emotion Color Wheel", icon: "🎨", desc: "Drill down into an interactive wheel to find the exact emotion.", link: "/toolkit/emotion-color-wheel", keywords: ["don't know", "confused", "numb", "feeling", "alexithymia", "name it"] },
  { id: "energy", name: "Energy Battery", icon: "🔋", desc: "Manage your daily capacity based on Spoon Theory.", link: "/toolkit/energy-battery", keywords: ["spoon", "spoons", "capacity", "energy", "social battery", "drained"] },
  { id: "focus", name: "Quiet Focus", icon: "🎧", desc: "A lofi pomodoro environment for deep, unbothered work.", link: "/focus", keywords: ["focus", "work", "study", "pomodoro", "timer", "music", "lofi"] },
  { id: "heavy-hate", name: "I hate myself right now", icon: "💔", desc: "Gentle defusion for intense self-loathing.", link: "/heavy", keywords: ["hate", "hate myself", "worthless", "stupid", "ugly", "disgusting", "shame"] }
];

type FilterType = "all" | "tools" | "essays" | "books";

export function StandaloneSearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  // 1. SMART TOOL MATCHING (Local, instant)
  const matchedTools = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    
    // Find tools where any keyword matches the query, or the query is contained in the keyword
    const matches = TOOL_DATABASE.filter(tool => {
      // Check if tool name matches
      if (tool.name.toLowerCase().includes(q)) return true;
      // Check if any keyword matches
      return tool.keywords.some(kw => kw.includes(q) || q.includes(kw));
    });

    return matches.slice(0, 3); // Max 3 tool recommendations
  }, [query]);

  // 2. CMS SEARCH (Sanity, debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        setIsSearching(true);
        const res = await searchSanctuary(query);
        setResults(res);
        setIsSearching(false);
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Handle Filtering
  const filteredCmsResults = useMemo(() => {
    if (filter === "all") return results;
    if (filter === "essays") return results.filter(r => r._type === "post" || r._type === "letter");
    if (filter === "books") return results.filter(r => r._type === "book" || r._type === "ebook" || r._type === "guide");
    if (filter === "tools") return []; // Tools are handled separately
    return results;
  }, [results, filter]);

  const getUrl = (item: GlobalSearchResult) => {
    if (item._type === "profile" && item.username) return `/room/${item.username}`;
    const slug = item.slug?.current;
    if (!slug) return "#";
    switch (item._type) {
      case "post": return `/blog/${slug}`;
      case "letter": return `/letters/${slug}`;
      case "guide": return `/guides/${slug}`;
      case "ebook": return `/books/${slug}`;
      case "book": return `/books/${slug}`;
      default: return "#";
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case "profile": return "Creator";
      case "post": return "Thought";
      case "letter": return "Letter";
      case "guide": return "Guide";
      case "ebook": return "Book";
      case "book": return "Book";
      default: return type;
    }
  };

  return (
    <div className="w-full flex flex-col items-center relative min-h-[70vh]">
      <button 
        onClick={() => router.back()}
        className="absolute -top-16 right-0 md:-top-24 opacity-60 hover:opacity-100 transition-opacity p-2 flex items-center gap-2 text-xs uppercase tracking-widest text-brand-text"
      >
        <span>Close</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="w-full max-w-3xl mx-auto flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-brand-accent mb-4 block text-center">Sanctuary Search</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a feeling, word, or topic..."
          className="w-full bg-transparent border-b-2 border-brand-border pb-6 text-center text-3xl md:text-5xl font-serif outline-none focus:border-brand-accent transition-colors text-brand-text placeholder:text-brand-soft/30"
          autoFocus
        />

        {/* QUICK FILTERS */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {(["all", "tools", "essays", "books"] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-widest transition-all ${filter === f ? 'bg-brand-accent text-brand-bg font-bold' : 'bg-brand-card text-brand-soft hover:text-brand-text border border-brand-border'}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-16 w-full flex flex-col gap-12">
          
          {/* EMPTY STATE */}
          {query.trim().length <= 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center">
              <h3 className="font-serif text-xl text-brand-soft italic mb-6">Quiet places to start...</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Link href="/heavy" className="p-4 border border-brand-border bg-brand-card hover:border-brand-accent transition-all rounded-xl flex items-center gap-4 group">
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">🌧️</span>
                  <div className="text-left">
                    <h4 className="text-brand-text font-serif">When it feels heavy</h4>
                    <p className="text-xs text-brand-soft uppercase tracking-widest">Comfort Room</p>
                  </div>
                </Link>
                <Link href="/toolkit/panic-redirector" className="p-4 border border-brand-border bg-brand-card hover:border-brand-accent transition-all rounded-xl flex items-center gap-4 group">
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">🕰️</span>
                  <div className="text-left">
                    <h4 className="text-brand-text font-serif">Panic Redirector</h4>
                    <p className="text-xs text-brand-soft uppercase tracking-widest">Interactive Tool</p>
                  </div>
                </Link>
                <Link href="/toolkit/task-atomizer" className="p-4 border border-brand-border bg-brand-card hover:border-brand-accent transition-all rounded-xl flex items-center gap-4 group">
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">🔨</span>
                  <div className="text-left">
                    <h4 className="text-brand-text font-serif">The Task Atomizer</h4>
                    <p className="text-xs text-brand-soft uppercase tracking-widest">Interactive Tool</p>
                  </div>
                </Link>
                <Link href="/3am" className="p-4 border border-brand-border bg-brand-card hover:border-brand-accent transition-all rounded-xl flex items-center gap-4 group">
                  <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">🌌</span>
                  <div className="text-left">
                    <h4 className="text-brand-text font-serif">The 3AM Room</h4>
                    <p className="text-xs text-brand-soft uppercase tracking-widest">Comfort Room</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          )}

          {isSearching && (
            <p className="text-center text-brand-soft italic font-serif">Searching the sanctuary...</p>
          )}

          {!isSearching && query.length > 1 && matchedTools.length === 0 && filteredCmsResults.length === 0 && (
            <p className="text-center text-brand-soft italic font-serif mt-12">Nothing was found. Try a feeling like 'tired', 'scared', or 'overwhelmed'.</p>
          )}

          {/* RESULTS ALREADY LOADED */}
          {!isSearching && query.length > 1 && (
            <div className="flex flex-col gap-16">
              
              {/* RECOMMENDED TOOLS */}
              {(filter === "all" || filter === "tools") && matchedTools.length > 0 && (
                <div className="flex flex-col gap-4">
                  <span className="text-xs uppercase tracking-widest text-brand-accent border-b border-brand-border pb-2">Recommended Tools</span>
                  <div className="grid grid-cols-1 gap-4">
                    {matchedTools.map(tool => (
                      <Link key={tool.id} href={tool.link}>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-6 border border-brand-accent/50 bg-brand-bg rounded-xl hover:shadow-[0_0_30px_rgba(252,163,17,0.1)] transition-all flex items-center gap-6 group relative overflow-hidden"
                        >
                          <div className="absolute right-0 top-0 opacity-5 group-hover:opacity-10 transition-opacity p-4 text-7xl">{tool.icon}</div>
                          <span className="text-4xl z-10 grayscale group-hover:grayscale-0 transition-all">{tool.icon}</span>
                          <div className="z-10">
                            <h3 className="font-serif text-2xl text-brand-text mb-1">{tool.name}</h3>
                            <p className="text-sm text-brand-soft">{tool.desc}</p>
                          </div>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* LIBRARY RESULTS */}
              {(filter === "all" || filter === "essays" || filter === "books") && filteredCmsResults.length > 0 && (
                <div className="flex flex-col gap-4">
                  <span className="text-xs uppercase tracking-widest text-brand-accent border-b border-brand-border pb-2">From the Library</span>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {filteredCmsResults.map((item) => (
                      <Link key={item._id} href={getUrl(item)}>
                        <div className="p-6 border border-brand-border rounded-xl bg-brand-card hover:border-brand-accent transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full flex flex-col relative overflow-hidden">
                          <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-3 block">{getLabel(item._type)}</span>
                          <h3 className="font-serif text-xl text-brand-text mb-2">{item.title}</h3>
                          {(item.subtitle || item.excerpt) && (
                            <p className="text-sm text-brand-soft line-clamp-2">
                              {item.subtitle || item.excerpt}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
