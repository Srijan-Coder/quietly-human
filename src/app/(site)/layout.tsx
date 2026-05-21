import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import CustomCursor from "@/components/global/CustomCursor";
import SmoothScrolling from "@/components/global/SmoothScrolling";

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
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </SmoothScrolling>
  );
}
