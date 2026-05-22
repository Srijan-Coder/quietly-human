import { Metadata } from "next";

export const metadata: Metadata = {
  title: "When things feel heavy",
  description: "A safe, quiet space for when you are panicking, cannot sleep, or feel alone.",
  robots: "noindex, nofollow", // Keep this space private and out of search engines
};

export default function HeavyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#050505] text-[#e0e0e0] min-h-screen w-full selection:bg-white/10 selection:text-white">
      {children}
    </div>
  );
}
