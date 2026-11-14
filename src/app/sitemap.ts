import type { MetadataRoute } from "next";
import { entreprise } from "@/config/entreprise";
import { getProduitsActifs } from "@/lib/produits";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = entreprise.siteUrl;
  const pages: [string, number][] = [
    ["/", 1],
    ["/creation-site-web-montpellier", 1],
    ["/reparation-telephone-montpellier", 0.9],
    ["/boutique", 0.8],
    ["/telephones-reconditionnes", 0.9],
    ["/services", 0.7],
    ["/a-propos", 0.5],
    ["/contact", 0.7],
    ["/mentions-legales", 0.2],
    ["/confidentialite", 0.2],
    ["/cookies", 0.2],
    ["/cgv", 0.3],
    ["/conditions-reparation", 0.3],
    ["/conditions-reconditionnes", 0.2],
    ["/conditions-sites-web", 0.3],
  ];
  const produits = await getProduitsActifs();
  return [
    ...pages.map(([chemin, priority]) => ({ url: `${base}${chemin}`, lastModified: new Date(), priority })),
    ...produits.map((p) => ({ url: `${base}/boutique/${p.slug}`, lastModified: new Date(), priority: 0.6 })),
  ];
}
