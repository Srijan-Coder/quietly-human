import PremiumGate from "@/components/global/PremiumGate";
import UrgeSurferClient from "@/components/global/UrgeSurferClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Urge Surfing — Quietly Humans",
  description: "A DBT exercise to ride out intense cravings and impulses.",
};

export default function UrgeSurferPage() {
  return (
    <PremiumGate>
      <div className="pt-20 pb-0">
      <UrgeSurferClient />
    </div>
    </PremiumGate>
  );
}
