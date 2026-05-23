import BrainDumpClient from "@/components/global/BrainDumpClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Brain Dump — Quietly Humans",
  description: "An unreadable canvas. Type everything that is overwhelming you, then wipe it clean.",
};

export default function BrainDumpPage() {
  return (
    <div className="pt-32 pb-20">
      <BrainDumpClient />
    </div>
  );
}
