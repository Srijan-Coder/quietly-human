import PremiumGate from "@/components/global/PremiumGate";
import DoneListClient from "@/components/global/DoneListClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The 'Done' List — Quietly Humans",
  description: "A reverse to-do list for low-energy days. Log what you've already accomplished.",
};

export default function DoneListPage() {
  return (
    <PremiumGate>
      <div className="pt-20 pb-0">
      <DoneListClient />
    </div>
    </PremiumGate>
  );
}
