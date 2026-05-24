import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import CustomCursor from "@/components/global/CustomCursor";
import SmoothScrolling from "@/components/global/SmoothScrolling";
import { AudioPlayer } from "@/components/global/AudioPlayer";
import QuizFloatingBar from "@/components/global/QuizFloatingBar";
import SiteCompass from "@/components/global/SiteCompass";
import UsernameCheck from "@/components/global/UsernameCheck";
import { AnnouncementBar } from "@/components/global/AnnouncementBar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const announcement = {
    active: true,
    message: "The Sanctuary Pass is now live.",
    linkText: "Learn more",
    linkUrl: "/sanctuary-pass",
    style: "midnight" as const
  };

  return (
    <SmoothScrolling>
      <UsernameCheck>
        <div className="film-grain"></div>
        <CustomCursor />
        <div className="fixed top-0 left-0 w-full z-[60]">
          <AnnouncementBar data={announcement} />
        </div>
        <Navbar />
        <main className="flex-1 flex flex-col w-full overflow-x-hidden min-h-screen pt-12">
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
