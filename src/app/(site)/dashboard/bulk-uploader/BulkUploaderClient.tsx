"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, UploadCloud, Code, CheckCircle, AlertTriangle } from "lucide-react";

type AI_Post = {
  title?: string;
  content?: string;
  type?: string;
  category?: string;
  subject?: string;
  mood?: string;
  date?: string;
  description?: string;
  chapters?: Array<{ title: string; body: string }>;
  steps?: Array<{ title: string; body: string }>;
  overview?: string;
};

export default function BulkUploaderClient() {
  const [jsonInput, setJsonInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, successful: 0, failed: 0 });

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

      const type = post.type || "letter";
      const category = post.category || "Uncategorized";
      const mood = post.mood || "🌿 Peaceful";
      const date = post.date || new Date().toISOString().substring(0, 10);
      const subject = post.subject || "For the quiet hours";
      
      let title = post.title || "";
      let content = post.content || "";

      // Format validation and HTML compiling matching WriteEditorClient.tsx
      if (type === "ebook") {
        const chapters = post.chapters || [];
        const description = post.description || post.content || "A quiet book.";
        if (chapters.length === 0) {
          console.error(`Post ${i + 1} failed: Ebook requires a "chapters" array.`);
          failed++;
          continue;
        }
        title = title || "Untitled Ebook";
        content = `
          <div class="book-description mb-12 text-brand-soft font-serif italic text-lg leading-relaxed border-l-2 border-brand-accent pl-6">${description}</div>
          <div class="book-toc bg-brand-card border border-brand-border/30 rounded-2xl p-8 mb-16 font-sans">
            <h3 class="text-sm uppercase tracking-widest text-brand-accent mb-4 font-bold">Table of Contents</h3>
            <ol class="list-decimal pl-6 space-y-2 text-brand-text">
              ${chapters.map((ch, idx) => `<li><a href="#chapter-${idx}" class="hover:text-brand-accent text-brand-soft transition-colors">${ch.title || `Chapter ${idx+1}`}</a></li>`).join("")}
            </ol>
          </div>
          <div class="book-chapters space-y-16">
            ${chapters.map((ch, idx) => `
              <section id="chapter-${idx}" class="book-chapter border-t border-brand-border/20 pt-12">
                <h2 class="text-3xl font-serif text-brand-text mb-6">Chapter ${idx+1}: ${ch.title || `Chapter ${idx+1}`}</h2>
                <div class="chapter-body font-serif leading-relaxed text-lg text-brand-text">${ch.body || ""}</div>
              </section>
            `).join("")}
          </div>
          <!--book-data: ${JSON.stringify({ description, chapters })}-->
        `;
      } else if (type === "guide") {
        const steps = post.steps || [];
        const overview = post.overview || post.content || "A guided course.";
        const description = post.description || overview;
        if (steps.length === 0) {
          console.error(`Post ${i + 1} failed: Guide requires a "steps" array.`);
          failed++;
          continue;
        }
        title = title || "Untitled Guide";
        content = `
          <div class="guide-overview mb-12 text-brand-text leading-relaxed">${overview}</div>
          <div class="guide-steps space-y-12">
            ${steps.map((st, idx) => `
              <div class="guide-step bg-brand-card border border-brand-border/30 p-8 rounded-3xl">
                <span class="text-xs uppercase tracking-widest text-brand-accent font-bold">Step ${idx+1}</span>
                <h3 class="text-2xl font-serif text-brand-text mt-2 mb-4">${st.title || `Step ${idx+1}`}</h3>
                <div class="step-content text-brand-soft">${st.body || ""}</div>
              </div>
            `).join("")}
          </div>
          <!--guide-data: ${JSON.stringify({ description, overview, steps })}-->
        `;
      } else {
        // quote, letter, blog, prose
        if (!content || !content.trim()) {
          console.error(`Post ${i + 1} failed: Content is required for standard formats.`);
          failed++;
          continue;
        }

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
      }

      try {
        const res = await fetch("/api/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title,
            content: content,
            type: type,
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

      // Add a small 1-second delay between posts to prevent rate-limiting/overwhelming
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
          Paste the JSON array of posts. The importer will automatically format and publish Midnight Letters, Journal Entries, Quotes, Ebooks, and Guides matching the Creator Write templates.
        </p>
      </header>

      {/* JSON Import Section */}
      <div className="bg-brand-card border border-brand-border/40 rounded-[2rem] p-8 mb-8">
        <div className="flex justify-between items-center mb-4">
          <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold flex items-center gap-2">
            <Code className="w-4 h-4 text-brand-accent" /> Paste ChatGPT JSON Output
          </label>
        </div>
        
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder={`[
  {
    "title": "A Walk in the Quiet Woods",
    "content": "<p>Finding peace in the silence of nature...</p>",
    "type": "blog",
    "category": "Soft Living",
    "mood": "🌿 Peaceful"
  },
  {
    "title": "Overthinking at 3AM",
    "type": "letter",
    "category": "Overthinking",
    "subject": "To the night owls",
    "content": "<p>When the world goes quiet, the mind gets loud...</p>"
  }
]`}
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
            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Successful: {progress.successful}</span>
            {progress.failed > 0 && <span className="flex items-center gap-1 text-red-400"><AlertTriangle className="w-4 h-4 text-red-400" /> Failed: {progress.failed}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
