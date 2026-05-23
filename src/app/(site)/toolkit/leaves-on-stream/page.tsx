import LeavesOnStreamClient from "@/components/global/LeavesOnStreamClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaves on a Stream — Quietly Humans",
  description: "An ACT therapy exercise for letting go of intrusive thoughts.",
};

export default function LeavesOnStreamPage() {
  return (
    <div className="pt-20 pb-0">
      <LeavesOnStreamClient />
    </div>
  );
}
