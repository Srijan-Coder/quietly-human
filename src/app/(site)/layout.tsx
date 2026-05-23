import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import CustomCursor from "@/components/global/CustomCursor";
import SmoothScrolling from "@/components/global/SmoothScrolling";
import { AudioPlayer } from "@/components/global/AudioPlayer";
import QuizFloatingBar from "@/components/global/QuizFloatingBar";
import SiteCompass from "@/components/global/SiteCompass";
import UsernameCheck from "@/components/global/UsernameCheck";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SmoothScrolling>
      <UsernameCheck>
        <div className="film-grain"></div>
        <CustomCursor />
        <Navbar />
        <main className="flex-1 flex flex-col">
          <AudioPlayer />
          {children}
        </main>
        <SiteCompass />
        <QuizFloatingBar />
        <Footer />
      </UsernameCheck>
    </SmoothScrolling>
  );
}
