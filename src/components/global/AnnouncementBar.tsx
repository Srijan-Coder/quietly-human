"use client";

// imports
import { useLocalStorage } from "@/hooks/useLocalStorage";
import Link from "next/link";

interface AnnouncementData {
  active: boolean;
  message?: string;
  linkText?: string;
  linkUrl?: string;
  style?: "warm" | "dark" | "accent" | "midnight";
}

const styleMap = {
  warm: "bg-brand-muted text-brand-text border-brand-border",
  dark: "bg-brand-card text-brand-text border-brand-border",
  accent: "bg-brand-accent text-white border-brand-accent",
  midnight: "bg-[#0F0D0B] text-brand-soft border-transparent",
};

export function AnnouncementBar({ data }: { data: AnnouncementData | null }) {
  const [dismissed, setDismissed] = useLocalStorage("announcement-dismissed", false);

  if (!data?.active || dismissed || !data.message) return null;

  const style = styleMap[data.style || "warm"];

  return (
    <div className={`w-full border-b text-xs py-2.5 px-6 flex items-center justify-center gap-4 relative ${style}`}>
      <span>{data.message}</span>
      {data.linkText && data.linkUrl && (
        <Link
          href={data.linkUrl}
          className="underline underline-offset-2 font-medium hover:opacity-70 transition-opacity"
        >
          {data.linkText}
        </Link>
      )}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity text-base leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
