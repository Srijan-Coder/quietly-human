import PremiumGate from "@/components/global/PremiumGate";
import CognitiveCourtroomClient from "@/components/global/CognitiveCourtroomClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Cognitive Courtroom — Quietly Humans",
  description: "Separate anxious stories from objective facts using CBT techniques.",
};

export default function CognitiveCourtroomPage() {
  return (
    <PremiumGate>
      <div className="pt-20 pb-0">
      <CognitiveCourtroomClient />
    </div>
    </PremiumGate>
  );
}
