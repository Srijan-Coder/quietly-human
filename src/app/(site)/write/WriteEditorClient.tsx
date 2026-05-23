"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WriteEditorClient() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("letter");
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
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, type })
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

      {/* Editor Controls */}
      <div className="flex justify-between items-end gap-4 flex-wrap">
        <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
          <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans">Type of writing</label>
          <select 
            value={type} 
            onChange={e => setType(e.target.value)}
            className="bg-brand-bg border border-brand-border rounded-lg p-3 text-brand-text focus:outline-none focus:border-brand-accent font-sans text-sm appearance-none cursor-pointer"
          >
            <option value="letter">Midnight Letter (Long form)</option>
            <option value="quote">Quiet Quote (Short thought)</option>
            <option value="blog">Journal Entry (Updates/Thoughts)</option>
          </select>
        </div>
        
        <div className="text-[10px] uppercase tracking-widest text-brand-soft/50 font-sans hidden sm:block mb-3">
          {saveStatus}
        </div>
      </div>

      {/* Title Input */}
      <input
        type="text"
        placeholder="Title..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="w-full bg-transparent border-none outline-none text-4xl text-brand-text font-serif placeholder:text-brand-border"
      />

      {/* Content Input */}
      <textarea
        placeholder="Write what is heavy on your mind..."
        value={content}
        onChange={e => setContent(e.target.value)}
        className="w-full bg-transparent border-none outline-none text-xl text-brand-soft font-serif placeholder:text-brand-border/50 resize-none min-h-[50vh] leading-relaxed"
      />

      {/* Action Bar (Fixed to bottom for mobile, inline for desktop) */}
      <div className="fixed sm:static bottom-6 left-6 right-6 sm:mt-12 flex justify-between items-center bg-brand-card/90 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none p-4 sm:p-0 rounded-full sm:rounded-none border sm:border-none border-brand-border z-50 shadow-xl sm:shadow-none">
        <span className="text-[10px] sm:hidden uppercase tracking-widest text-brand-soft line-clamp-1 flex-1 pr-4">
          {saveStatus.replace('Draft saved at ', '')}
        </span>
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="ml-auto px-8 py-3 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all font-bold disabled:opacity-50"
        >
          {isPublishing ? "Publishing..." : "Publish to Sanctuary"}
        </button>
      </div>
    </div>
  );
}
