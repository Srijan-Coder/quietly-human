"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, UploadCloud, FileText, BookOpen, MessageSquare, Edit3 } from "lucide-react";

type AI_Post = {
  title?: string;
  content: string;
  type?: string;
  category?: string;
  subject?: string;
  mood?: string;
  date?: string;
};

const MOODS = [
  "🌿 Peaceful", "🌧️ Overwhelmed", "💭 Overthinking", "🕯️ Quiet", "✨ Grateful", "🌊 Drifting", "☀️ Inspired", "🍂 Reflective"
];

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

export default function BulkUploaderClient() {
  const [jsonInput, setJsonInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, successful: 0, failed: 0 });

  // Batch Configuration states
  const [defaultType, setDefaultType] = useState("letter"); // letter, blog, quote, prose
  const [defaultCategory, setDefaultCategory] = useState("Midnight Thoughts");
  const [defaultSubject, setDefaultSubject] = useState("For the quiet hours");
  const [defaultMood, setDefaultMood] = useState("🌿 Peaceful");
  const [defaultDate, setDefaultDate] = useState(() => new Date().toISOString().substring(0, 10));

  const handleUpload = async () => {
    if (!jsonInput.trim()) {
      toast.error("Please paste the JSON output from ChatGPT.");
      return;
    }

    let posts: AI_Post[] = [];
    try {
      posts = JSON.parse(jsonInput);
      if (!Array.isArray(posts)) throw new Error("JSON must be an array of posts");
    } catch (e) {
      toast.error("Invalid JSON format. Make sure it is exactly as ChatGPT outputted it.");
      return;
    }

    if (posts.length === 0) {
      toast.error("No posts found in JSON array.");
      return;
    }

    if (posts.length > 50) {
      toast.error("Please upload a maximum of 50 posts at a time to prevent rate limiting.");
      return;
    }

    setIsUploading(true);
    setProgress({ current: 0, total: posts.length, successful: 0, failed: 0 });

    let successful = 0;
    let failed = 0;

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      setProgress(p => ({ ...p, current: i + 1 }));

      // Determine the format type for this post
      const type = post.type || defaultType;
      const category = post.category || defaultCategory;
      const mood = post.mood || defaultMood;
      const date = post.date || defaultDate;
      const subject = post.subject || defaultSubject;

      let title = post.title || "";
      let content = post.content;

      // Validate content exists
      if (!content || !content.trim()) {
        console.error(`Post ${i + 1} failed: No content provided.`);
        failed++;
        continue;
      }

      // Automatically apply HTML layout wrappers based on the type
      if (type === "quote") {
        title = title || content.substring(0, 45) + (content.length > 45 ? "..." : "");
      } else if (type === "letter") {
        title = title || "A Midnight Letter";
        content = `
          <div class="letter-subject font-sans uppercase tracking-widest text-xs text-brand-accent mb-6 border-b border-brand-border/20 pb-4">Subject: ${subject}</div>
          <div class="letter-body">${content}</div>
          <!--letter-subject: ${subject}-->
        `;
      } else if (type === "blog") {
        title = title || `Diary Entry: ${date}`;
        content = `
          <div class="diary-header border-b border-brand-border/20 pb-4 mb-6 font-sans text-xs tracking-wider text-brand-soft flex items-center justify-between">
            <span>Mood: ${mood}</span>
            <span>Date: ${date}</span>
          </div>
          <div class="diary-body font-serif leading-relaxed text-lg">${content}</div>
          <!--diary-mood: ${mood}-->
          <!--diary-date: ${date}-->
        `;
      }

      try {
        const res = await fetch("/api/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title,
            content: content,
            type: type === "prose" ? "letter" : type, // map prose back to letter for rendering compatibility if needed
            category: category,
            postTheme: "default",
          }),
        });

        if (res.ok) {
          successful++;
        } else {
          const data = await res.json();
          console.error(`Post ${i + 1} failed:`, data.error);
          failed++;
        }
      } catch (err) {
        console.error(`Post ${i + 1} request error:`, err);
        failed++;
      }

      // Add a small 1-second delay between posts to prevent overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setProgress(p => ({ ...p, successful, failed }));
    setIsUploading(false);

    if (failed === 0) {
      toast.success(`Successfully published ${successful} posts!`);
      setJsonInput("");
    } else {
      toast.warning(`Published ${successful} posts, but ${failed} failed. Check console for details.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <header className="mb-12">
        <h1 className="text-3xl md:text-5xl font-serif text-brand-text mb-4">Bulk AI Content Importer</h1>
        <p className="text-brand-soft text-lg font-serif italic">
          Choose a default format, configure options, and paste the JSON array below to bulk-publish articles instantly.
        </p>
      </header>

      {/* Configuration Section */}
      <div className="bg-brand-card border border-brand-border/40 rounded-[2rem] p-8 mb-8">
        <h2 className="text-xl font-serif text-brand-text mb-6 flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-brand-accent" /> Default Formatting Configuration
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
              Post Format Type
            </label>
            <select 
              value={defaultType} 
              onChange={e => setDefaultType(e.target.value)} 
              className="bg-brand-bg/50 border border-brand-border rounded-xl p-3 text-brand-text focus:outline-none focus:border-brand-accent font-sans text-sm cursor-pointer hover:bg-brand-bg transition-colors"
            >
              <option value="letter">Midnight Letter (Long Form)</option>
              <option value="blog">Journal Entry (Diary Format)</option>
              <option value="quote">Quiet Quote (Short Form)</option>
              <option value="prose">Standard Prose / Essay</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
              Default Category
            </label>
            <select 
              value={defaultCategory} 
              onChange={e => setDefaultCategory(e.target.value)} 
              className="bg-brand-bg/50 border border-brand-border rounded-xl p-3 text-brand-text focus:outline-none focus:border-brand-accent font-sans text-sm cursor-pointer hover:bg-brand-bg transition-colors"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Type specific config options */}
          {defaultType === "letter" && (
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                Default Subject Line
              </label>
              <input 
                type="text" 
                value={defaultSubject} 
                onChange={e => setDefaultSubject(e.target.value)} 
                placeholder="e.g. For the ones who can't sleep tonight"
                className="bg-brand-bg/50 border border-brand-border rounded-xl p-3 text-brand-text focus:outline-none focus:border-brand-accent font-sans text-sm"
              />
            </div>
          )}

          {defaultType === "blog" && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                  Default Mood
                </label>
                <select 
                  value={defaultMood} 
                  onChange={e => setDefaultMood(e.target.value)} 
                  className="bg-brand-bg/50 border border-brand-border rounded-xl p-3 text-brand-text focus:outline-none focus:border-brand-accent font-sans text-sm cursor-pointer hover:bg-brand-bg transition-colors"
                >
                  {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                  Default Date
                </label>
                <input 
                  type="date" 
                  value={defaultDate} 
                  onChange={e => setDefaultDate(e.target.value)} 
                  className="bg-brand-bg/50 border border-brand-border rounded-xl p-3 text-brand-text focus:outline-none focus:border-brand-accent font-sans text-sm"
                />
              </div>
            </>
          )}
        </div>
        
        <p className="text-[10px] uppercase tracking-widest text-brand-soft font-sans mt-6 italic">
          💡 Note: If a post in your JSON array explicitly defines its own "type", "category", "subject", "mood", or "date", those values will automatically overwrite these default settings.
        </p>
      </div>

      {/* JSON Import Section */}
      <div className="bg-brand-card border border-brand-border/40 rounded-[2rem] p-8 mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold">Paste ChatGPT JSON Output</label>
        </div>
        
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder={'[\n  {\n    "title": "A Walk in the Quiet Woods",\n    "content": "<p>Finding peace in the silence of nature...</p>",\n    "type": "blog",\n    "category": "Soft Living",\n    "mood": "🌿 Peaceful"\n  }\n]'}
          className="w-full h-96 bg-brand-bg/50 border border-brand-border/50 rounded-2xl p-6 font-mono text-sm text-brand-text placeholder-brand-soft focus:outline-none focus:border-brand-accent transition-colors"
          disabled={isUploading}
        />

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleUpload}
            disabled={isUploading || !jsonInput.trim()}
            className="flex items-center gap-2 px-8 py-4 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 cursor-pointer shadow-lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Importing ({progress.current}/{progress.total})...
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5" />
                Start Import
              </>
            )}
          </button>
        </div>
      </div>

      {isUploading && (
        <div className="p-8 bg-brand-accent/5 border border-brand-accent/20 rounded-[2rem]">
          <p className="text-brand-text font-serif mb-3">Importing writings in progress...</p>
          <div className="w-full bg-brand-border/30 rounded-full h-1.5 mb-4 overflow-hidden">
            <div 
              className="bg-brand-accent h-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <div className="flex gap-4 text-xs font-sans uppercase tracking-widest text-brand-soft">
            <span>Successful: {progress.successful}</span>
            {progress.failed > 0 && <span className="text-red-400">Failed: {progress.failed}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
