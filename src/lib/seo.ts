import type { Metadata } from "next";
import { entreprise } from "@/config/entreprise";
import { estACompleter } from "./format";

export function meta({
  titre,
  description,
  chemin,
  image,
  indexer = true,
}: {
  titre: string;
  description: string;
  chemin: string;
  image?: string;
  indexer?: boolean;
}): Metadata {
  return {
    title: titre,
    description,
    alternates: { canonical: chemin },
    openGraph: {
      title: titre,
      description,
      url: chemin,
      siteName: "GCS – Global Connect Services",
      locale: "fr_FR",
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    robots: indexer ? undefined : { index: false, follow: false },
  };
}

const val = (v: string) => (estACompleter(v) ? undefined : v);

/** Données structurées LocalBusiness : aide Google à afficher la fiche (horaires, adresse…) */
export function localBusinessJsonLd() {
  const jours = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const { adresse } = entreprise;
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ElectronicsStore"],
    "@id": `${entreprise.siteUrl}/#entreprise`,
    name: `${entreprise.nomCommercial} – ${entreprise.nomComplet}`,
    legalName: entreprise.raisonSociale,
    description:
      "Réparation de smartphones (iPhone, Samsung…) et création de sites web à Montpellier. Écran, batterie, micro-soudure, désoxydation, sites vitrines et e-commerce.",
    url: entreprise.siteUrl,
    telephone: val(entreprise.telephoneLien),
    email: val(entreprise.email),
    image: `${entreprise.siteUrl}/opengraph-image`,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: val(adresse.rue),
      postalCode: adresse.codePostal,
      addressLocality: adresse.ville,
      addressRegion: "Occitanie",
      addressCountry: "FR",
    },
    ...(adresse.latitude && adresse.longitude
      ? { geo: { "@type": "GeoCoordinates", latitude: adresse.latitude, longitude: adresse.longitude } }
      : {}),
    areaServed: [{ "@type": "City", name: "Montpellier" }, "Hérault", "Occitanie"],
    openingHoursSpecification: entreprise.horaires.flatMap((h) =>
      h.plages.map(([opens, closes]) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${jours[h.jour]}`,
        opens,
        closes,
      })),
    ),
    sameAs: [`https://www.snapchat.com/add/${entreprise.snapchat}`, entreprise.instagram, entreprise.facebook].filter(Boolean),
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Réparation de smartphone", areaServed: "Montpellier" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Création de site web", areaServed: "Montpellier" } },
    ],
  };
}

export function faqJsonLd(faq: { q: string; r: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.r } })),
  };
}

export function arianeJsonLd(items: { nom: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.nom,
      item: `${entreprise.siteUrl}${it.href}`,
    })),
  };
}
