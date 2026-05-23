import ControlSorterClient from "@/components/global/ControlSorterClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Control Sorter — Quietly Humans",
  description: "Sort your anxieties into what you can and cannot control.",
};

export default function ControlSorterPage() {
  return (
    <div className="pt-32 pb-20">
      <ControlSorterClient />
    </div>
  );
}
