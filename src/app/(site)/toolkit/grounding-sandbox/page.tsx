import GroundingSandboxClient from "@/components/global/GroundingSandboxClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Grounding Sandbox — Quietly Humans",
  description: "A calming physics sandbox to distract your hands and ground your mind.",
};

export default function GroundingSandboxPage() {
  return (
    <div className="pt-0 pb-0 w-full h-screen">
      <GroundingSandboxClient />
    </div>
  );
}
