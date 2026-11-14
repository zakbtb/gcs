import { entreprise } from "@/config/entreprise";

/**
 * robots.txt écrit à la main pour y ajouter la ligne Content-Signal (contentsignals.org) :
 * le site peut être indexé et lu par les assistants IA pour répondre aux clients,
 * mais pas utilisé pour entraîner des modèles.
 */
export function GET() {
  const texte = [
    "User-Agent: *",
    "Content-Signal: search=yes, ai-input=yes, ai-train=no",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /api/",
    "Disallow: /panier",
    "Disallow: /commande",
    "Disallow: /outils/",
    "",
    `Host: ${entreprise.siteUrl}`,
    `Sitemap: ${entreprise.siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(texte, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
