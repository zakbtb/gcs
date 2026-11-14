import type { Metadata, Viewport } from "next";
import "./globals.css";
import { entreprise } from "@/config/entreprise";
import { PanierProvider } from "@/components/panier/PanierProvider";
import { ConsentementProvider } from "@/components/cookies/Consentement";

export const metadata: Metadata = {
  metadataBase: new URL(entreprise.siteUrl),
  title: {
    default: "GCS Montpellier – Réparation de téléphone, accessoires & reconditionnés",
    template: "%s | GCS Montpellier",
  },
  description:
    "GCS (Global Connect Services) à Montpellier : réparation de smartphones, consoles et PC dès 30 min, accessoires, téléphones reconditionnés, carte grise, recharge, billets et transfert d'argent. Diagnostic gratuit.",
  applicationName: "GCS – Global Connect Services",
  formatDetection: { telephone: false },
  openGraph: { siteName: "GCS – Global Connect Services", locale: "fr_FR", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#160c33",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="flex min-h-full flex-col">
        <ConsentementProvider>
          <PanierProvider>{children}</PanierProvider>
        </ConsentementProvider>
      </body>
    </html>
  );
}
