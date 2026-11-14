import "server-only";
import { infosBoutique, offreHydrogel, rechercherProduits } from "./agents";

/** Outils exposés aux agents IA par le serveur MCP (/mcp). Lecture seule, informations publiques. */
export const OUTILS = [
  {
    name: "rechercher_produits",
    title: "Rechercher un produit",
    description: "Cherche dans le catalogue GCS (téléphones et tablettes reconditionnés, accessoires). Renvoie nom, prix TTC, état, lien et lien de réservation WhatsApp.",
    inputSchema: {
      type: "object",
      properties: {
        q: { type: "string", description: "Mots-clés, ex. « iPhone 13 128 Go », « chargeur 20W »" },
        type: { type: "string", enum: ["telephones", "accessoires", ""], description: "Limiter aux téléphones/tablettes ou aux accessoires" },
        prixMax: { type: "number", description: "Prix TTC maximum en euros" },
        limite: { type: "number", description: "Nombre de résultats (1 à 50, 10 par défaut)" },
      },
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: "protection_hydrogel",
    title: "Protection d'écran hydrogel",
    description: "Prix et types de la protection d'écran hydrogel découpée sur mesure. Avec une marque et un modèle, renvoie aussi le lien de réservation WhatsApp.",
    inputSchema: {
      type: "object",
      properties: {
        marque: { type: "string", description: "Ex. Apple, Samsung, Xiaomi" },
        modele: { type: "string", description: "Ex. iPhone 15 Pro, Galaxy S24" },
        type: { type: "string", enum: ["transparent", "anti-espion"] },
      },
    },
    annotations: { readOnlyHint: true },
  },
  {
    name: "infos_boutique",
    title: "Infos de la boutique",
    description: "Adresse, horaires, téléphone, WhatsApp, façon de commander et garanties de GCS à Montpellier.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
  },
] as const;

export async function appelerOutil(nom: string, args: Record<string, unknown> = {}) {
  const s = (k: string) => (typeof args[k] === "string" ? (args[k] as string) : undefined);
  const n = (k: string) => (typeof args[k] === "number" ? (args[k] as number) : undefined);
  switch (nom) {
    case "rechercher_produits":
      return rechercherProduits({ q: s("q"), type: s("type"), prixMax: n("prixMax"), limite: n("limite") });
    case "protection_hydrogel":
      return offreHydrogel(s("marque"), s("modele"), s("type"));
    case "infos_boutique":
      return infosBoutique();
    default:
      return null;
  }
}
