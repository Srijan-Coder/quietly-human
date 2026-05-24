"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/global/TiptapEditor";
import { supabaseClient } from "@/lib/supabase";

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

const MOODS = [
  "🌿 Peaceful", "🌧️ Overwhelmed", "💭 Overthinking", "🕯️ Quiet", "✨ Grateful", "🌊 Drifting", "☀️ Inspired", "🍂 Reflective"
];

export default function WriteEditorClient({ isPremium, pins, initialPost }: { isPremium: boolean, pins: any[], initialPost?: any }) {
  const router = useRouter();

  // Parser to extract structured data from HTML comment metadata when editing
  const parseInitialContent = () => {
    let parsedSubject = "";
    let parsedMood = "🌿 Peaceful";
    let parsedDate = new Date().toISOString().substring(0, 10);
    let parsedEbookDescription = "";
    let parsedChapters: { title: string, body: string }[] = [{ title: "Chapter 1", body: "" }];
    let parsedGuideDescription = "";
    let parsedOverview = "";
    let parsedSteps: { title: string, body: string }[] = [{ title: "Step 1", body: "" }];
    let parsedBody = initialPost?.content || "";

    if (initialPost?.content && initialPost?.type) {
      const contentStr = initialPost.content;
      
      if (initialPost.type === "letter") {
        const match = contentStr.match(/<!--letter-subject: (.*?)-->/);
        if (match) parsedSubject = match[1];
        
        const bodyMatch = contentStr.match(/<div class="letter-body">([\s\S]*?)<\/div>/);
        if (bodyMatch) parsedBody = bodyMatch[1];
      } else if (initialPost.type === "blog") {
        const moodMatch = contentStr.match(/<!--diary-mood: (.*?)-->/);
        const dateMatch = contentStr.match(/<!--diary-date: (.*?)-->/);
        if (moodMatch) parsedMood = moodMatch[1];
        if (dateMatch) parsedDate = dateMatch[1];
        
        const bodyMatch = contentStr.match(/<div class="diary-body font-serif leading-relaxed text-lg">([\s\S]*?)<\/div>/);
        if (bodyMatch) parsedBody = bodyMatch[1];
      } else if (initialPost.type === "ebook") {
        const bookMatch = contentStr.match(/<!--book-data: (.*?)-->/);
        if (bookMatch) {
          try {
            const bookData = JSON.parse(bookMatch[1]);
            parsedEbookDescription = bookData.description || "";
            parsedChapters = bookData.chapters || [];
          } catch (e) {
            console.error("Failed to parse book JSON", e);
          }
        }
      } else if (initialPost.type === "guide") {
        const guideMatch = contentStr.match(/<!--guide-data: (.*?)-->/);
        if (guideMatch) {
          try {
            const guideData = JSON.parse(guideMatch[1]);
            parsedGuideDescription = guideData.description || "";
            parsedOverview = guideData.overview || "";
            parsedSteps = guideData.steps || [];
          } catch (e) {
            console.error("Failed to parse guide JSON", e);
          }
        }
      }
    }

    return {
      parsedSubject,
      parsedMood,
      parsedDate,
      parsedEbookDescription,
      parsedChapters,
      parsedGuideDescription,
      parsedOverview,
      parsedSteps,
      parsedBody
    };
  };

  const parsed = parseInitialContent();

  const [title, setTitle] = useState(initialPost?.title || "");
  const [content, setContent] = useState(parsed.parsedBody || "");
  const [type, setType] = useState(initialPost?.type || "letter");
  const [category, setCategory] = useState(initialPost?.category || "Uncategorized");
  const [postTheme, setPostTheme] = useState(initialPost?.post_theme || "default");
  
  // Specific Format states
  const [subject, setSubject] = useState(parsed.parsedSubject);
  const [mood, setMood] = useState(parsed.parsedMood);
  const [date, setDate] = useState(parsed.parsedDate);
  const [ebookDescription, setEbookDescription] = useState(parsed.parsedEbookDescription);
  const [chapters, setChapters] = useState<{ title: string; body: string }[]>(parsed.parsedChapters);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  
  const [guideDescription, setGuideDescription] = useState(parsed.parsedGuideDescription);
  const [overview, setOverview] = useState(parsed.parsedOverview);
  const [steps, setSteps] = useState<{ title: string; body: string }[]>(parsed.parsedSteps);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Find which pin indexes correspond to the attached_pins
  const initialPinIndexes: number[] = [];
  if (initialPost?.attached_pins && pins) {
    initialPost.attached_pins.forEach((attachedPin: any) => {
      const idx = pins.findIndex(p => p.url === attachedPin.url);
      if (idx !== -1) initialPinIndexes.push(idx);
    });
  }
  
  const [selectedPinIndexes, setSelectedPinIndexes] = useState<number[]>(initialPinIndexes);
  const [enablePins, setEnablePins] = useState(initialPinIndexes.length > 0);
  const [coverImageUrl, setCoverImageUrl] = useState(initialPost?.cover_image_url || "");
  const [pdfFileUrl, setPdfFileUrl] = useState(initialPost?.pdf_file_url || "");
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("Draft saved locally");

  // Load draft on mount (only if NOT editing an existing post)
  useEffect(() => {
    if (!initialPost) {
      const savedDraft = localStorage.getItem("quietly_draft");
      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          if (parsedDraft.title) setTitle(parsedDraft.title);
          if (parsedDraft.content) setContent(parsedDraft.content);
          if (parsedDraft.type) setType(parsedDraft.type);
          if (parsedDraft.category) setCategory(parsedDraft.category);
          if (parsedDraft.postTheme) setPostTheme(parsedDraft.postTheme);
          if (parsedDraft.selectedPinIndexes) setSelectedPinIndexes(parsedDraft.selectedPinIndexes);
          
          if (parsedDraft.subject) setSubject(parsedDraft.subject);
          if (parsedDraft.mood) setMood(parsedDraft.mood);
          if (parsedDraft.date) setDate(parsedDraft.date);
          if (parsedDraft.ebookDescription) setEbookDescription(parsedDraft.ebookDescription);
          if (parsedDraft.chapters) setChapters(parsedDraft.chapters);
          if (parsedDraft.guideDescription) setGuideDescription(parsedDraft.guideDescription);
          if (parsedDraft.overview) setOverview(parsedDraft.overview);
          if (parsedDraft.steps) setSteps(parsedDraft.steps);
        } catch (e) {}
      }
    }
  }, [initialPost]);

  // Auto-save draft every 3 seconds if changed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!initialPost && (title || content || chapters.length > 1 || steps.length > 1)) {
        localStorage.setItem("quietly_draft", JSON.stringify({ 
          title, content, type, category, postTheme, selectedPinIndexes,
          subject, mood, date, ebookDescription, chapters, guideDescription, overview, steps
        }));
        setSaveStatus(`Draft saved at ${new Date().toLocaleTimeString()}`);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [title, content, type, category, postTheme, selectedPinIndexes, subject, mood, date, ebookDescription, chapters, guideDescription, overview, steps, initialPost]);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>, isPdf: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeInKb = file.size / 1024;
    
    if (isPdf) {
      if (file.type !== "application/pdf") return alert("Only PDF files are allowed.");
      if (sizeInKb > 5120) return alert(`PDF is too large (${Math.round(sizeInKb)}KB). Maximum size is 5120KB (5MB).`);
      setIsUploadingPdf(true);
    } else {
      if (!file.type.startsWith("image/")) return alert("Only images are allowed.");
      if (sizeInKb > 2048) return alert(`Image is too large (${Math.round(sizeInKb)}KB). Maximum size is 2048KB (2MB).`);
      setIsUploadingCover(true);
    }

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${isPdf ? 'pdfs' : 'covers'}/${fileName}`;

      const { data, error: uploadError } = await supabaseClient
        .storage
        .from("creator_media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabaseClient
        .storage
        .from("creator_media")
        .getPublicUrl(filePath);

      if (isPdf) {
        setPdfFileUrl(publicUrlData.publicUrl);
      } else {
        setCoverImageUrl(publicUrlData.publicUrl);
      }
    } catch (err: any) {
      alert("Error uploading file: " + err.message);
    } finally {
      if (isPdf) setIsUploadingPdf(false);
      else setIsUploadingCover(false);
    }
  };

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
    let finalTitle = title;
    let finalContent = content;
    let finalCoverImageUrl = coverImageUrl;

    // Validate based on selected type
    if (type === "quote") {
      if (!content.trim()) {
        setError("Please add a quote before publishing.");
        return;
      }
      finalTitle = content.substring(0, 45) + (content.length > 45 ? "..." : "");
      finalCoverImageUrl = "";
    } else if (type === "letter") {
      if (!title.trim() || !content.trim()) {
        setError("Please add a title and some words before publishing.");
        return;
      }
      finalCoverImageUrl = "";
      finalContent = `
        <div class="letter-subject font-sans uppercase tracking-widest text-xs text-brand-accent mb-6 border-b border-brand-border/20 pb-4">Subject: ${subject}</div>
        <div class="letter-body">${content}</div>
        <!--letter-subject: ${subject}-->
      `;
    } else if (type === "blog") {
      // Diary Entry format
      const finalDiaryTitle = title.trim() || `Diary Entry: ${date}`;
      if (!content.trim()) {
        setError("Please write something in your diary entry before publishing.");
        return;
      }
      finalTitle = finalDiaryTitle;
      finalCoverImageUrl = "";
      finalContent = `
        <div class="diary-header border-b border-brand-border/20 pb-4 mb-6 font-sans text-xs tracking-wider text-brand-soft flex items-center justify-between">
          <span>Mood: ${mood}</span>
          <span>Date: ${date}</span>
        </div>
        <div class="diary-body font-serif leading-relaxed text-lg">${content}</div>
        <!--diary-mood: ${mood}-->
        <!--diary-date: ${date}-->
      `;
    } else if (type === "ebook") {
      if (!title.trim()) {
        setError("Please add a title for your Ebook.");
        return;
      }
      if (!ebookDescription.trim()) {
        setError("Please add a description for your Ebook.");
        return;
      }
      if (chapters.some(ch => !ch.title.trim())) {
        setError("All chapters must have a title.");
        return;
      }
      // Compile book contents
      finalContent = `
        <div class="book-description mb-12 text-brand-soft font-serif italic text-lg leading-relaxed border-l-2 border-brand-accent pl-6">${ebookDescription}</div>
        <div class="book-toc bg-brand-card border border-brand-border/30 rounded-2xl p-8 mb-16 font-sans">
          <h3 class="text-sm uppercase tracking-widest text-brand-accent mb-4 font-bold">Table of Contents</h3>
          <ol class="list-decimal pl-6 space-y-2 text-brand-text">
            ${chapters.map((ch, i) => `<li><a href="#chapter-${i}" class="hover:text-brand-accent text-brand-soft transition-colors">${ch.title}</a></li>`).join("")}
          </ol>
        </div>
        <div class="book-chapters space-y-16">
          ${chapters.map((ch, i) => `
            <section id="chapter-${i}" class="book-chapter border-t border-brand-border/20 pt-12">
              <h2 class="text-3xl font-serif text-brand-text mb-6">Chapter ${i+1}: ${ch.title}</h2>
              <div class="chapter-body font-serif leading-relaxed text-lg text-brand-text">${ch.body}</div>
            </section>
          `).join("")}
        </div>
        <!--book-data: ${JSON.stringify({ description: ebookDescription, chapters })}-->
      `;
    } else if (type === "guide") {
      if (!title.trim()) {
        setError("Please add a title for your Guide.");
        return;
      }
      if (steps.some(st => !st.title.trim())) {
        setError("All steps must have a title.");
        return;
      }
      // Compile guide contents
      finalContent = `
        <div class="guide-overview mb-12 text-brand-text leading-relaxed">${overview}</div>
        <div class="guide-steps space-y-12">
          ${steps.map((st, i) => `
            <div class="guide-step bg-brand-card border border-brand-border/30 p-8 rounded-3xl">
              <span class="text-xs uppercase tracking-widest text-brand-accent font-bold">Step ${i+1}</span>
              <h3 class="text-2xl font-serif text-brand-text mt-2 mb-4">${st.title}</h3>
              <div class="step-content text-brand-soft">${st.body}</div>
            </div>
          `).join("")}
        </div>
        <!--guide-data: ${JSON.stringify({ description: guideDescription, overview, steps })}-->
      `;
    }

    setIsPublishing(true);
    setError("");

    try {
      const payload: any = { 
        title: finalTitle, 
        content: finalContent, 
        type, 
        category, 
        postTheme, 
        coverImageUrl: finalCoverImageUrl, 
        pdfFileUrl: type === 'ebook' ? pdfFileUrl : null 
      };
      
      if (enablePins && selectedPinIndexes.length > 0 && isPremium) {
        payload.attachedPins = selectedPinIndexes.map(i => pins[i]);
      } else {
        payload.attachedPins = null;
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

  // Theme container classes
  const getThemeClasses = (theme: string) => {
    switch(theme) {
      case 'midnight-blue': return 'bg-[#0a0f1c] text-white border-white/10';
      case 'forest-green': return 'bg-[#0a120c] text-white border-white/10';
      case 'crimson': return 'bg-[#1a0a0a] text-white border-white/10';
      case 'sepia': return 'bg-[#1c1812] text-[#e3dac9] border-white/10';
      default: return 'bg-brand-card text-brand-text border-brand-border';
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
      <div className={`border rounded-[2rem] p-6 md:p-12 shadow-2xl relative overflow-hidden group transition-all duration-1000 ${getThemeClasses(postTheme)}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        
        {/* Editor Settings Row */}
        <div className="flex flex-col gap-6 relative z-10 mb-8 border-b border-brand-border/30 pb-6">
          {/* Format, Category, Theme selectors */}
          <div className="flex gap-4 flex-wrap w-full">
            <div className="flex flex-col gap-2 flex-1 min-w-[180px]">
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                Format
              </label>
              <select value={type} onChange={e => setType(e.target.value)} className="bg-brand-bg/50 border border-brand-border rounded-xl p-3 text-brand-text focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent font-sans text-sm appearance-none cursor-pointer hover:bg-brand-bg transition-colors">
                <option value="letter">Midnight Letter (Long)</option>
                <option value="quote">Quiet Quote (Short)</option>
                <option value="blog">Journal Entry (Diary)</option>
                <option value="ebook">Ebook / Book</option>
                <option value="guide">Guide / Course</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 flex-1 min-w-[180px]">
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                Category
              </label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="bg-brand-bg/50 border border-brand-border rounded-xl p-3 text-brand-text focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent font-sans text-sm appearance-none cursor-pointer hover:bg-brand-bg transition-colors">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-2 flex-1 min-w-[180px]">
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                Theme Layout
              </label>
              <select value={postTheme} onChange={e => setPostTheme(e.target.value)} className="bg-brand-bg/50 border border-brand-border rounded-xl p-3 text-brand-text focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent font-sans text-sm appearance-none cursor-pointer hover:bg-brand-bg transition-colors">
                {POST_THEMES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>

          {/* Attach Store Products */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-4">
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${isPremium ? 'bg-brand-accent' : 'bg-brand-soft'}`}></span>
                Attach Products {isPremium ? '(Up to 3)' : '🔒 Premium Required'}
              </label>
              
              {isPremium && pins.length > 0 && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={enablePins}
                    onChange={(e) => setEnablePins(e.target.checked)}
                    className="w-4 h-4 rounded border-brand-border/50 text-brand-accent focus:ring-brand-accent bg-transparent"
                  />
                  <span className="text-xs font-sans text-brand-soft">Enable Pins for this post</span>
                </label>
              )}
            </div>
            
            {!isPremium ? (
              <div className="text-xs font-sans text-brand-soft/70 bg-brand-bg/40 border border-brand-border/30 p-3 rounded-xl">
                Upgrade to the Sanctuary Pass to attach store products to this post.
              </div>
            ) : pins.length === 0 ? (
              <div className="text-xs font-sans text-brand-soft/70 bg-brand-bg/40 border border-brand-border/30 p-3 rounded-xl">
                You haven't added any Store Pins yet. Go to Settings to add some!
              </div>
            ) : enablePins ? (
              <div className="flex gap-2 flex-wrap">
                {pins.map((pin, i) => (
                  <button
                    key={i}
                    onClick={() => togglePin(i)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-sans ${
                      selectedPinIndexes.includes(i) 
                        ? 'bg-brand-accent text-black border-brand-accent font-bold' 
                        : 'bg-brand-bg/60 border-brand-border text-brand-soft hover:bg-brand-bg hover:text-brand-text'
                    }`}
                  >
                    <span>{pin.emoji}</span>
                    <span>{pin.title}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Dynamic File Upload Row (Ebooks Cover & PDF Upload) */}
        {type === 'ebook' && (
          <div className="relative z-10 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Cover Image Upload */}
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-brand-bg/50 border border-brand-border hover:bg-brand-bg transition-colors px-4 py-2 rounded-full text-[10px] font-sans text-brand-soft uppercase tracking-widest flex items-center gap-2">
                <span>{isUploadingCover ? "Uploading..." : "📷 Book Cover Page"}</span>
                <input type="file" accept="image/*" onChange={(e) => uploadFile(e, false)} className="hidden" disabled={isUploadingCover} />
              </label>
              {coverImageUrl && (
                <span className="text-[10px] text-green-500 font-sans uppercase tracking-widest font-bold">Cover Added ✓</span>
              )}
            </div>

            {/* Ebook PDF Upload */}
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-brand-accent/10 border border-brand-accent/35 hover:bg-brand-accent/20 transition-colors px-4 py-2 rounded-full text-[10px] font-sans text-brand-accent uppercase tracking-widest flex items-center gap-2">
                <span>{isUploadingPdf ? "Uploading..." : "📄 Upload Book PDF"}</span>
                <input type="file" accept="application/pdf" onChange={(e) => uploadFile(e, true)} className="hidden" disabled={isUploadingPdf} />
              </label>
              {pdfFileUrl && (
                <span className="text-[10px] text-green-500 font-sans uppercase tracking-widest font-bold">PDF Uploaded ✓</span>
              )}
            </div>
            {coverImageUrl && (
              <div className="h-20 w-16 rounded bg-cover bg-center border border-brand-border shrink-0" style={{ backgroundImage: `url(${coverImageUrl})` }} />
            )}
          </div>
        )}

        {/* ========================================================
            FORMAT SPECIFIC COMPOSER INTERFACES
            ======================================================== */}

        {/* 1. QUIET QUOTE (Short Form, single-line text, no title) */}
        {type === "quote" && (
          <div className="relative z-10 flex flex-col gap-4 mb-6">
            <span className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold block mb-1">Your Single Line Quote</span>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value.substring(0, 300))}
              placeholder="Leave a single, beautiful thought here..."
              maxLength={300}
              className="w-full bg-brand-bg/30 border border-brand-border/40 hover:border-brand-accent focus:border-brand-accent outline-none text-xl md:text-2xl p-6 rounded-2xl text-brand-text font-serif italic placeholder:text-brand-soft/40 min-h-[120px] resize-none transition-all duration-300"
            />
            <div className="text-right text-[10px] font-sans uppercase tracking-widest text-brand-soft">
              {content.length} / 300 Characters
            </div>
          </div>
        )}

        {/* 2. MIDNIGHT LETTER (Title, Subject line, Body) */}
        {type === "letter" && (
          <div className="relative z-10 flex flex-col gap-6">
            {/* Title */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold block mb-2">Letter Title</label>
              <input
                type="text"
                placeholder="Title of this Midnight Letter..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-transparent border-b border-brand-border/40 focus:border-brand-accent outline-none text-3xl md:text-4xl text-brand-text font-serif placeholder:text-brand-soft/30 pb-2 transition-colors"
              />
            </div>
            
            {/* Subject */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold block mb-2">Subject Line</label>
              <input
                type="text"
                placeholder="e.g. For the ones who can't sleep tonight"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full bg-brand-bg/30 border border-brand-border rounded-xl px-4 py-3 text-sm font-sans outline-none focus:border-brand-accent transition-colors"
              />
            </div>

            {/* Rich Editor Body */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold block mb-2">Letter Body</label>
              <TiptapEditor content={content} onChange={setContent} />
            </div>
          </div>
        )}

        {/* 3. JOURNAL ENTRY / DIARY (Date, Mood, Title, Diary Body) */}
        {type === "blog" && (
          <div className="relative z-10 flex flex-col gap-6">
            {/* Diary Date & Mood */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex flex-col gap-2 flex-grow min-w-[150px]">
                <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold flex items-center gap-1.5">
                  📅 Diary Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="bg-brand-bg/50 border border-brand-border rounded-xl p-3 text-brand-text font-sans text-sm focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div className="flex flex-col gap-2 flex-grow min-w-[150px]">
                <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold flex items-center gap-1.5">
                  💭 Feeling/Mood
                </label>
                <select
                  value={mood}
                  onChange={e => setMood(e.target.value)}
                  className="bg-brand-bg/50 border border-brand-border rounded-xl p-3 text-brand-text font-sans text-sm focus:outline-none focus:border-brand-accent cursor-pointer"
                >
                  {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            {/* Diary Entry Title */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold block mb-2">Diary Entry Title (Optional)</label>
              <input
                type="text"
                placeholder={`Diary Entry: ${date}`}
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-transparent border-b border-brand-border/40 focus:border-brand-accent outline-none text-3xl md:text-4xl text-brand-text font-serif placeholder:text-brand-soft/30 pb-2 transition-colors"
              />
            </div>

            {/* Rich Editor Body */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold block mb-2">Diary Thoughts</label>
              <TiptapEditor content={content} onChange={setContent} />
            </div>
          </div>
        )}

        {/* 4. EBOOK (Title, Description, Chapters Creator) */}
        {type === "ebook" && (
          <div className="relative z-10 flex flex-col gap-6">
            {/* Book Title */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold block mb-2">Book Title</label>
              <input
                type="text"
                placeholder="Title of your Ebook..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-transparent border-b border-brand-border/40 focus:border-brand-accent outline-none text-3xl md:text-4xl text-brand-text font-serif placeholder:text-brand-soft/30 pb-2 transition-colors"
              />
            </div>

            {/* Book Description */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold block mb-2">Book Description</label>
              <textarea
                value={ebookDescription}
                onChange={e => setEbookDescription(e.target.value)}
                placeholder="Write a brief, cinematic description of this book's essence..."
                className="w-full bg-brand-bg/30 border border-brand-border rounded-xl p-4 text-sm font-sans outline-none focus:border-brand-accent min-h-[90px] resize-y transition-colors"
              />
            </div>

            {/* CHAPTERS MANAGER */}
            <div className="border-t border-brand-border/30 pt-6 mt-2">
              <h3 className="text-base uppercase tracking-widest text-brand-text font-bold mb-4 font-sans flex items-center gap-2">
                📖 Chapters & Contents
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Chapters Navigation List */}
                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto no-scrollbar border border-brand-border/30 rounded-2xl p-4 bg-brand-bg/25">
                  <span className="text-[9px] uppercase tracking-widest text-brand-soft font-sans font-bold mb-2">Index Table</span>
                  {chapters.map((ch, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${activeChapterIndex === idx ? 'bg-brand-accent/15 border-brand-accent font-bold' : 'bg-brand-bg/40 border-brand-border/40 hover:bg-brand-bg'}`}>
                      <button type="button" onClick={() => setActiveChapterIndex(idx)} className="flex-grow text-left font-serif text-sm text-brand-text truncate pr-2">
                        Ch {idx + 1}: {ch.title || "Untitled Chapter"}
                      </button>
                      {chapters.length > 1 && (
                        <button type="button" onClick={() => {
                          const updated = chapters.filter((_, i) => i !== idx);
                          setChapters(updated);
                          setActiveChapterIndex(Math.max(0, idx - 1));
                        }} className="text-red-400 hover:text-red-300 text-xs px-1.5 py-0.5 rounded hover:bg-red-500/10">✕</button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newChapter = { title: `Chapter ${chapters.length + 1}`, body: "" };
                      setChapters([...chapters, newChapter]);
                      setActiveChapterIndex(chapters.length);
                    }}
                    className="p-3 border border-dashed border-brand-border hover:border-brand-accent rounded-xl text-center text-[10px] uppercase tracking-widest text-brand-soft hover:text-brand-text font-bold transition-colors mt-2"
                  >
                    + Add New Chapter
                  </button>
                </div>

                {/* Selected Chapter Editor */}
                <div className="lg:col-span-2 flex flex-col gap-4 border border-brand-border/30 rounded-2xl p-4 md:p-6 bg-brand-bg/10">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold">Chapter Title</label>
                    <input
                      type="text"
                      value={chapters[activeChapterIndex]?.title || ""}
                      onChange={(e) => {
                        const updated = [...chapters];
                        if (updated[activeChapterIndex]) {
                          updated[activeChapterIndex].title = e.target.value;
                          setChapters(updated);
                        }
                      }}
                      placeholder={`Chapter ${activeChapterIndex + 1} Title`}
                      className="w-full bg-brand-bg/30 border border-brand-border rounded-xl px-4 py-2.5 text-sm font-sans outline-none focus:border-brand-accent transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold">Chapter Body Text</label>
                    <TiptapEditor
                      key={activeChapterIndex}
                      content={chapters[activeChapterIndex]?.body || ""}
                      onChange={(val) => {
                        const updated = [...chapters];
                        if (updated[activeChapterIndex]) {
                          updated[activeChapterIndex].body = val;
                          setChapters(updated);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. GUIDES / COURSE (Title, Description, Overview, Steps Creator) */}
        {type === "guide" && (
          <div className="relative z-10 flex flex-col gap-6">
            {/* Guide Title */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold block mb-2">Guide Title</label>
              <input
                type="text"
                placeholder="Title of your Pillar Guide..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-transparent border-b border-brand-border/40 focus:border-brand-accent outline-none text-3xl md:text-4xl text-brand-text font-serif placeholder:text-brand-soft/30 pb-2 transition-colors"
              />
            </div>

            {/* Guide Description */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold block mb-2">Short Subtitle / Description</label>
              <textarea
                value={guideDescription}
                onChange={e => setGuideDescription(e.target.value)}
                placeholder="Write a clear sub-headline or high-level outline..."
                className="w-full bg-brand-bg/30 border border-brand-border rounded-xl p-4 text-sm font-sans outline-none focus:border-brand-accent min-h-[70px] resize-y transition-colors"
              />
            </div>

            {/* Guide Overview Rich Editor */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold block mb-2">Guide Overview & Introduction</label>
              <TiptapEditor content={overview} onChange={setOverview} />
            </div>

            {/* STEPS/MODULES MANAGER */}
            <div className="border-t border-brand-border/30 pt-6 mt-2">
              <h3 className="text-base uppercase tracking-widest text-brand-text font-bold mb-4 font-sans flex items-center gap-2">
                📋 Step-by-Step Milestones
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Steps Navigation List */}
                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto no-scrollbar border border-brand-border/30 rounded-2xl p-4 bg-brand-bg/25">
                  <span className="text-[9px] uppercase tracking-widest text-brand-soft font-sans font-bold mb-2">Step Roadmap</span>
                  {steps.map((st, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${activeStepIndex === idx ? 'bg-brand-accent/15 border-brand-accent font-bold' : 'bg-brand-bg/40 border-brand-border/40 hover:bg-brand-bg'}`}>
                      <button type="button" onClick={() => setActiveStepIndex(idx)} className="flex-grow text-left font-serif text-sm text-brand-text truncate pr-2">
                        Step {idx + 1}: {st.title || "Untitled Step"}
                      </button>
                      {steps.length > 1 && (
                        <button type="button" onClick={() => {
                          const updated = steps.filter((_, i) => i !== idx);
                          setSteps(updated);
                          setActiveStepIndex(Math.max(0, idx - 1));
                        }} className="text-red-400 hover:text-red-300 text-xs px-1.5 py-0.5 rounded hover:bg-red-500/10">✕</button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newStep = { title: `Step ${steps.length + 1}`, body: "" };
                      setSteps([...steps, newStep]);
                      setActiveStepIndex(steps.length);
                    }}
                    className="p-3 border border-dashed border-brand-border hover:border-brand-accent rounded-xl text-center text-[10px] uppercase tracking-widest text-brand-soft hover:text-brand-text font-bold transition-colors mt-2"
                  >
                    + Add New Step
                  </button>
                </div>

                {/* Selected Step Editor */}
                <div className="lg:col-span-2 flex flex-col gap-4 border border-brand-border/30 rounded-2xl p-4 md:p-6 bg-brand-bg/10">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold">Step Title</label>
                    <input
                      type="text"
                      value={steps[activeStepIndex]?.title || ""}
                      onChange={(e) => {
                        const updated = [...steps];
                        if (updated[activeStepIndex]) {
                          updated[activeStepIndex].title = e.target.value;
                          setSteps(updated);
                        }
                      }}
                      placeholder={`Step ${activeStepIndex + 1} Action Title`}
                      className="w-full bg-brand-bg/30 border border-brand-border rounded-xl px-4 py-2.5 text-sm font-sans outline-none focus:border-brand-accent transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-brand-soft font-sans font-bold">Step Instructions & Details</label>
                    <TiptapEditor
                      key={activeStepIndex}
                      content={steps[activeStepIndex]?.body || ""}
                      onChange={(val) => {
                        const updated = [...steps];
                        if (updated[activeStepIndex]) {
                          updated[activeStepIndex].body = val;
                          setSteps(updated);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Action Bottom Bar */}
        <div className="fixed sm:absolute bottom-6 left-6 right-6 sm:bottom-12 sm:left-12 sm:right-12 flex justify-between items-center bg-black/90 sm:bg-transparent backdrop-blur-xl sm:backdrop-blur-none p-4 sm:p-0 rounded-2xl sm:rounded-none border sm:border-none border-white/10 z-50 shadow-2xl sm:shadow-none">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-widest text-brand-soft flex items-center gap-2">
              <span className="animate-pulse text-brand-accent">●</span> {saveStatus}
            </span>
            {type !== 'quote' && (
              <span className="text-[9px] text-brand-soft/50 font-sans tracking-widest">
                {content.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            )}
          </div>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="ml-auto px-8 py-4 bg-brand-text text-brand-bg hover:bg-brand-accent hover:text-black rounded-full text-xs uppercase tracking-widest hover:scale-105 transition-all font-bold disabled:opacity-50 shadow-xl"
          >
            {isPublishing ? "Publishing..." : "Publish to Sanctuary"}
          </button>
        </div>
      </div>
    </div>
  );
}
