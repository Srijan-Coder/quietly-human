"use client";

import { useAuth, SignInButton } from "@clerk/nextjs";

export function SecureDownloadButton({ fileUrl }: { fileUrl: string }) {
  const { isLoaded, isSignedIn } = useAuth();

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
    <a 
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-8 py-4 bg-brand-text text-brand-bg rounded-full text-sm uppercase tracking-widest hover:bg-brand-accent transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-300"
    >
      Download File
    </a>
  );
}
