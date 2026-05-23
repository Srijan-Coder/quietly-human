import DopamineMenuClient from "@/components/global/DopamineMenuClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Dopamine Menu — Quietly Humans",
  description: "A menu of healthy dopamine hits to prevent doomscrolling and under-stimulation.",
};

export default function DopamineMenuPage() {
  return (
    <div className="pt-20 pb-0">
      <DopamineMenuClient />
    </div>
  );
}
