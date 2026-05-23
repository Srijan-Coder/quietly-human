import PanicRedirectorClient from "@/components/global/PanicRedirectorClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panic Redirector | Soft Toolkit",
  description: "A guided 5-4-3-2-1 exercise to break thought spirals and return to the present moment.",
};

export default function PanicRedirectorPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-brand-bg relative overflow-hidden">
      <PanicRedirectorClient />
    </div>
  );
}
