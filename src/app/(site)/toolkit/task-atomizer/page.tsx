import TaskAtomizerClient from "@/components/global/TaskAtomizerClient";
import { Metadata } from "next";
import PremiumGate from "@/components/global/PremiumGate";

export const metadata: Metadata = {
  title: "The Task Atomizer — Quietly Humans",
  description: "Cure task paralysis by visually shattering overwhelming tasks into micro-steps.",
};

export default function TaskAtomizerPage() {
  return (
    <div className="pt-20 pb-0">
      <PremiumGate>
        <TaskAtomizerClient />
      </PremiumGate>
    </div>
  );
}
