"use client";

import { usePathname } from "next/navigation";
import { SaveToCollectionButton } from "@/components/global/SaveToCollectionButton";

export default function ToolkitLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isToolkitIndex = pathname === "/toolkit";

  // Derive title from pathname, e.g. /toolkit/panic-redirector -> Panic Redirector
  const slug = pathname.split("/").pop() || "";
  const title = slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  return (
    <div className="relative min-h-screen">
      {!isToolkitIndex && (
        <div className="fixed bottom-8 right-8 z-50 bg-brand-bg/80 backdrop-blur-md border border-brand-border px-4 py-2 rounded-full shadow-2xl">
          <SaveToCollectionButton 
            item={{
              id: pathname,
              title: title,
              type: "Tool",
              url: pathname
            }}
          />
        </div>
      )}
      {children}
    </div>
  );
}
