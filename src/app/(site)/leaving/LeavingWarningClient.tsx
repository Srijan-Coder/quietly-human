"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LeavingWarningClient() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const [isValidUrl, setIsValidUrl] = useState(false);

  useEffect(() => {
    if (url) {
      try {
        new URL(url); // Validates it is a proper URL
        setIsValidUrl(true);
      } catch (e) {
        setIsValidUrl(false);
      }
    }
  }, [url]);

  if (!url || !isValidUrl) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-red-400 text-sm">Invalid link provided.</p>
        <Link 
          href="/"
          className="w-full block bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest transition-colors font-bold"
        >
          Return to Sanctuary
        </Link>
      </div>
    );
  }

  // Display a truncated version of the URL to prevent UI breaking
  const displayUrl = url.length > 50 ? url.substring(0, 47) + "..." : url;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-black/50 border border-brand-border rounded-xl p-4 mb-4 break-all">
        <span className="text-brand-soft text-xs font-mono">{displayUrl}</span>
      </div>

      <a 
        href={url}
        rel="noopener noreferrer"
        className="w-full block bg-brand-accent text-brand-bg px-6 py-3 rounded-full text-xs uppercase tracking-widest font-bold hover:scale-105 transition-transform"
      >
        Continue to Site
      </a>
      
      <button 
        onClick={() => window.history.back()}
        className="w-full block text-brand-soft hover:text-white px-6 py-3 rounded-full text-xs uppercase tracking-widest transition-colors"
      >
        Go Back
      </button>
    </div>
  );
}
