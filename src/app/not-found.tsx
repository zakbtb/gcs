import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Page404 } from "@/components/ui/Page404";

export const metadata: Metadata = { title: "Page introuvable", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenu" className="flex-1"><Page404 /></main>
      <Footer />
    </>
  );
}
