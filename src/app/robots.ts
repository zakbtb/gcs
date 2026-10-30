import type { MetadataRoute } from "next";
import { entreprise } from "@/config/entreprise";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/panier", "/commande"] }],
    sitemap: `${entreprise.siteUrl}/sitemap.xml`,
    host: entreprise.siteUrl,
  };
}
