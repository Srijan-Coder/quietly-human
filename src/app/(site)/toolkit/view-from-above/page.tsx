import ViewFromAboveClient from "@/components/global/ViewFromAboveClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The View From Above — Quietly Humans",
  description: "A stoic visualization to put your stress into cosmic perspective.",
};

export default function ViewFromAbovePage() {
  return (
    <div className="pt-20 pb-0">
      <ViewFromAboveClient />
    </div>
  );
}
