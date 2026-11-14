import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BarreMobile } from "@/components/layout/BarreMobile";
import { BoutonWhatsApp } from "@/components/layout/BoutonWhatsApp";
import { JsonLd } from "@/components/ui/JsonLd";
import { localBusinessJsonLd } from "@/lib/seo";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <Header />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <Footer />
      <BarreMobile />
      <BoutonWhatsApp />
    </>
  );
}
