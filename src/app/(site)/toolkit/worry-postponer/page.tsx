import PremiumGate from "@/components/global/PremiumGate";
import WorryPostponerClient from "@/components/global/WorryPostponerClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Worry Postponer — Quietly Humans",
  description: "Schedule your worries for later so you can focus on the present.",
};

export default function WorryPostponerPage() {
  return (
    <PremiumGate>
      <div className="pt-20 pb-0">
      <WorryPostponerClient />
    </div>
    </PremiumGate>
  );
}
