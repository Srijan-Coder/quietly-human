"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("./CustomCursor"), {
  ssr: false,
});
const AudioPlayer = dynamic(
  () => import("./AudioPlayer").then((mod) => mod.AudioPlayer),
  { ssr: false }
);
const QuizFloatingBar = dynamic(
  () => import("./QuizFloatingBar"),
  { ssr: false }
);
const SiteCompass = dynamic(() => import("./SiteCompass"), {
  ssr: false,
});

export default function ClientInteractiveModules() {
  return (
    <>
      <CustomCursor />
      <AudioPlayer />
      <SiteCompass />
      <QuizFloatingBar />
    </>
  );
}
