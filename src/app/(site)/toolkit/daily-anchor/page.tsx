import DailyAnchorClient from "@/components/global/DailyAnchorClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Daily Anchor | Soft Toolkit",
  description: "Set a single word as your intention for the day, carved into digital stone.",
};

export default function DailyAnchorPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-brand-bg">
      {/* Very subtle noise/texture overlay to feel like stone */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      <DailyAnchorClient />
    </div>
  );
}
