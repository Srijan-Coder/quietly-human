import PremiumGate from "@/components/global/PremiumGate";
import EnergyBatteryClient from "@/components/global/EnergyBatteryClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Energy Battery — Quietly Humans",
  description: "A tool based on Spoon Theory to manage chronic fatigue and prevent burnout.",
};

export default function EnergyBatteryPage() {
  return (
    <PremiumGate>
      <div className="pt-20 pb-0">
      <EnergyBatteryClient />
    </div>
    </PremiumGate>
  );
}
