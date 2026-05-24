"use client";

import { useState } from "react";

export default function SubscribersListClient({ subscribers }: { subscribers: any[] }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const emails = subscribers.map(s => s.subscriber_email).join(", ");
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#121212] border border-white/5 rounded-[2rem] p-8 md:p-12 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-brand-border/50 pb-8 mb-8">
        <div>
          <h2 className="text-3xl font-serif text-white mb-2">Subscribers</h2>
          <p className="text-brand-soft font-sans text-sm">
            You have {subscribers.length} reader(s) waiting for your letters.
          </p>
        </div>
        
        {subscribers.length > 0 && (
          <button
            onClick={handleCopy}
            className="shrink-0 bg-brand-accent text-brand-bg px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold hover:scale-105 transition-transform"
          >
            {copied ? "Copied to Clipboard!" : "Copy All Emails"}
          </button>
        )}
      </div>

      {subscribers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {subscribers.map((sub, idx) => (
            <div key={idx} className="bg-brand-card p-4 rounded-xl border border-brand-border/50 truncate flex items-center gap-3 text-sm text-brand-text">
              <span className="text-brand-soft text-xs">{idx + 1}.</span>
              <span className="truncate">{sub.subscriber_email}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-brand-border/50 rounded-2xl">
          <span className="text-4xl filter grayscale opacity-30 mb-4 block">💌</span>
          <p className="text-brand-soft italic font-serif">No subscribers yet.</p>
        </div>
      )}
      
      {subscribers.length > 0 && (
        <p className="text-xs text-brand-soft/70 mt-8 max-w-2xl">
          <span className="text-brand-accent font-bold">Pro Tip:</span> Click "Copy All Emails" and paste them directly into the "BCC" field of your personal Gmail to send a free newsletter to your entire audience without exposing their email addresses to each other.
        </p>
      )}
    </div>
  );
}
