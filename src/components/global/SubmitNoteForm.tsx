"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SubmitNoteForm() {
  const [isOpen, setIsOpen] = useState(false);
  
  const [submissionType, setSubmissionType] = useState<"note" | "blog" | "letter">("note");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [coverImageBase64, setCoverImageBase64] = useState<string | null>(null);
  
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Image must be smaller than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageBase64(reader.result as string);
        setErrorMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !bodyText) return;
    if ((submissionType === "blog" || submissionType === "letter") && !title) {
      setErrorMessage("Title is required for Blogs and Letters.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/submit-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: submissionType,
          name, 
          email, 
          title,
          bodyText,
          coverImageBase64
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setTitle("");
      setBodyText("");
      setCoverImageBase64(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Auto-close after a few seconds
      setTimeout(() => {
        setIsOpen(false);
        setStatus("idle");
      }, 5000);

    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "Failed to submit. Please try again later.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-16 mb-24 flex flex-col items-center border-t border-brand-border/50 pt-16">
      
      <span className="text-[10px] uppercase tracking-widest text-brand-soft mb-4">Leave a Trace</span>
      <h2 className="text-3xl font-serif text-brand-text mb-6">Community Submissions</h2>
      <p className="text-brand-soft text-center max-w-lg mb-8">
        Share a fleeting thought, a midnight letter, or a full blog post with the Quietly Humans community. 
        It will be sent to the studio for review before gently appearing on the website.
      </p>

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="px-8 py-3 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors"
        >
          Share Something
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full overflow-hidden"
          >
            {status === "success" ? (
              <div className="bg-brand-accent/10 border border-brand-accent rounded-2xl p-8 text-center mt-4">
                <span className="text-2xl mb-4 block">💌</span>
                <h3 className="font-serif text-xl text-brand-text mb-2">Safely Received.</h3>
                <p className="text-brand-soft text-sm">
                  Thank you for sharing your thoughts. Your submission has been securely delivered to the studio and is awaiting review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-brand-card border border-brand-border rounded-2xl p-6 md:p-8 flex flex-col gap-6 mt-4">
                
                {/* Type Selection */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-brand-soft">What are you sharing?</span>
                  <div className="flex gap-2 bg-brand-bg/50 p-1 rounded-lg">
                    <button type="button" onClick={() => setSubmissionType("note")} className={`flex-1 py-2 text-xs rounded-md transition-colors ${submissionType === "note" ? "bg-brand-card text-brand-text shadow border border-brand-border" : "text-brand-soft"}`}>Reader Note</button>
                    <button type="button" onClick={() => setSubmissionType("letter")} className={`flex-1 py-2 text-xs rounded-md transition-colors ${submissionType === "letter" ? "bg-brand-card text-brand-text shadow border border-brand-border" : "text-brand-soft"}`}>Midnight Letter</button>
                    <button type="button" onClick={() => setSubmissionType("blog")} className={`flex-1 py-2 text-xs rounded-md transition-colors ${submissionType === "blog" ? "bg-brand-card text-brand-text shadow border border-brand-border" : "text-brand-soft"}`}>Full Blog</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-brand-soft">Your Name *</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-brand-text text-sm focus:outline-none focus:border-brand-accent transition-colors"
                      placeholder="Jane Doe or Anonymous"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-brand-soft">Your Email (Private)</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-brand-text text-sm focus:outline-none focus:border-brand-accent transition-colors"
                      placeholder="Only seen by Admin"
                    />
                  </div>
                </div>

                {(submissionType === "blog" || submissionType === "letter") && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-brand-soft">Title / Subject *</label>
                    <input 
                      type="text" 
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-brand-text text-sm focus:outline-none focus:border-brand-accent transition-colors"
                      placeholder={submissionType === "blog" ? "Blog Title" : "Letter Subject"}
                    />
                  </div>
                )}

                {submissionType === "blog" && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-brand-soft">Cover Image (Optional)</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="text-xs text-brand-soft file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:bg-brand-bg file:text-brand-text hover:file:bg-brand-border transition-colors cursor-pointer"
                    />
                    {coverImageBase64 && (
                      <div className="w-full h-32 relative mt-2 rounded-lg overflow-hidden border border-brand-border">
                        <img src={coverImageBase64} alt="Cover Preview" className="w-full h-full object-cover opacity-80" />
                        <button type="button" onClick={() => { setCoverImageBase64(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-soft">
                    {submissionType === "blog" ? "Blog Body *" : submissionType === "letter" ? "Letter Body *" : "Your Note *"}
                  </label>
                  <textarea 
                    required
                    rows={submissionType === "note" ? 4 : 8}
                    value={bodyText}
                    onChange={(e) => setBodyText(e.target.value)}
                    className="bg-brand-bg border border-brand-border rounded-lg px-4 py-3 text-brand-text text-sm focus:outline-none focus:border-brand-accent transition-colors resize-none"
                    placeholder={`Write your ${submissionType} here...`}
                  />
                </div>

                {status === "error" && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 text-xs text-center font-medium leading-relaxed">{errorMessage}</p>
                  </div>
                )}

                <div className="flex justify-end gap-4 mt-2">
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 text-xs uppercase tracking-widest text-brand-soft hover:text-brand-text transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={status === "submitting"}
                    className="px-8 py-3 bg-brand-text text-brand-bg rounded-full text-xs uppercase tracking-widest hover:bg-brand-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "submitting" ? "Sending..." : "Submit to Studio"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
