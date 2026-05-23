"use client";

import { useAuth, useUser, SignInButton } from "@clerk/nextjs";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SecureDownloadButton({ fileUrl, title }: { fileUrl: string, title: string }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleDownloadClick = () => {
    // Let the native anchor tag do the download in a new tab, but also reveal the prompt
    setHasDownloaded(true);
  };

  const handleSendEmail = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;
    
    setEmailStatus("sending");
    try {
      const res = await fetch("/api/email/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "download",
          title: title,
          url: fileUrl,
          userEmail: user.primaryEmailAddress.emailAddress,
        }),
      });

      if (res.ok) {
        setEmailStatus("sent");
      } else {
        setEmailStatus("error");
        setTimeout(() => setEmailStatus("idle"), 3000);
      }
    } catch (e) {
      setEmailStatus("error");
      setTimeout(() => setEmailStatus("idle"), 3000);
    }
  };

  if (!isLoaded) {
    return (
      <button disabled className="px-8 py-4 bg-brand-text/50 text-brand-bg rounded-full text-sm uppercase tracking-widest cursor-not-allowed">
        Loading...
      </button>
    );
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button className="px-8 py-4 bg-brand-accent text-white rounded-full text-sm uppercase tracking-widest hover:bg-brand-text transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300">
          Sign in to Download
        </button>
      </SignInButton>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-start">
      <a 
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleDownloadClick}
        className="inline-block px-8 py-4 bg-brand-text text-brand-bg rounded-full text-sm uppercase tracking-widest hover:bg-brand-accent transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
      >
        Download File
      </a>

      <AnimatePresence>
        {hasDownloaded && emailStatus !== "sent" && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-brand-card border border-brand-border rounded-lg p-4 max-w-sm"
          >
            <p className="text-sm text-brand-soft mb-3">
              File accessed. Would you like a backup copy sent to your email?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={handleSendEmail}
                disabled={emailStatus === "sending"}
                className="px-4 py-2 bg-brand-text text-brand-bg text-xs uppercase tracking-widest rounded disabled:opacity-50 hover:bg-brand-accent transition-colors"
              >
                {emailStatus === "sending" ? "Sending..." : "Yes, Email Me"}
              </button>
              <button 
                onClick={() => setHasDownloaded(false)}
                className="px-4 py-2 border border-brand-border text-brand-soft text-xs uppercase tracking-widest rounded hover:text-brand-text transition-colors"
              >
                No Thanks
              </button>
            </div>
            {emailStatus === "error" && <p className="text-red-400 text-xs mt-2">Error sending email. Please try again later.</p>}
          </motion.div>
        )}

        {emailStatus === "sent" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-brand-accent uppercase tracking-widest mt-2"
          >
            ✓ Sent to your inbox.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
