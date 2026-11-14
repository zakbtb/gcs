import { boutique } from "@/config/entreprise";
import { prix } from "./format";

/** Lien WhatsApp vers la boutique avec un message déjà écrit. */
export function lienWhatsApp(message: string) {
  return `https://wa.me/${boutique.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Message de réservation d'un produit : référence GCS, nom, options, prix TTC. */
export function messageReservation({ reference, nom, options = [], prixTtc, mode }: {
  reference: string;
  nom: string;
  options?: string[];
  prixTtc: number;
  mode?: "retrait" | "livraison";
}) {
  return [
    "Bonjour GCS, je souhaite réserver :",
    `• ${nom}`,
    `• Réf. ${reference}`,
    ...options.filter(Boolean).map((o) => `• ${o}`),
    `• Prix : ${prix(prixTtc)} TTC`,
    mode ? `• ${mode === "retrait" ? "Retrait à la boutique" : "Livraison à domicile"}` : "",
    "Merci !",
  ].filter(Boolean).join("\n");
}
