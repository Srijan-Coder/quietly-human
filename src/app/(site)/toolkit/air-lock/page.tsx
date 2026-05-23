import AirLockClient from "@/components/global/AirLockClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Air Lock — Quietly Humans",
  description: "A digital decompression chamber to help you transition from work to rest.",
};

export default function AirLockPage() {
  return (
    <div className="pt-20 pb-0">
      <AirLockClient />
    </div>
  );
}
