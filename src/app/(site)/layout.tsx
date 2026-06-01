import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import UsernameCheck from "@/components/global/UsernameCheck";
import ClientInteractiveModules from "@/components/global/ClientInteractiveModules";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UsernameCheck>
      <Navbar />
      <main className="flex-1 flex flex-col w-full overflow-x-hidden min-h-screen pt-12">
        {children}
      </main>
      <ClientInteractiveModules />
      <Footer />
    </UsernameCheck>
  );
}
