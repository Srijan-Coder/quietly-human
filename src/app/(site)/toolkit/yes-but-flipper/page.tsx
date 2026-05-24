import PremiumGate from "@/components/global/PremiumGate";
import YesButFlipperClient from "@/components/global/YesButFlipperClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The 'Yes, But' Flipper — Quietly Humans",
  description: "Combat black-and-white thinking by forcing your brain to find the nuance.",
};

export default function YesButFlipperPage() {
  return (
    <PremiumGate>
      <div className="pt-20 pb-0">
      <YesButFlipperClient />
    </div>
    </PremiumGate>
  );
}
