import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import CustomCursor from "@/components/global/CustomCursor";
import SmoothScrolling from "@/components/global/SmoothScrolling";
import { AudioPlayer } from "@/components/global/AudioPlayer";
import QuizFloatingBar from "@/components/global/QuizFloatingBar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SmoothScrolling>
      <div className="film-grain"></div>
      <CustomCursor />
      <Navbar />
      <main className="flex-1 flex flex-col">
        <AudioPlayer />
        {children}
      </main>
      <QuizFloatingBar />
      <Footer />
    </SmoothScrolling>
  );
}
