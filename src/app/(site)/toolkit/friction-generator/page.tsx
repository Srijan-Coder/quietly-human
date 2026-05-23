import FrictionGeneratorClient from "@/components/global/FrictionGeneratorClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Friction Generator — Quietly Humans",
  description: "A physical speed bump for your brain to prevent impulsive decisions.",
};

export default function FrictionGeneratorPage() {
  return (
    <div className="pt-20 pb-0">
      <FrictionGeneratorClient />
    </div>
  );
}
