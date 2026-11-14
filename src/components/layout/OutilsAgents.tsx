"use client";

import { useEffect } from "react";
import { boutique, entreprise, hydrogel } from "@/config/entreprise";
import { lienWhatsApp } from "@/lib/whatsapp";

type Outil = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => Promise<{ content: { type: "text"; text: string }[] }>;
  annotations?: { readOnlyHint?: boolean };
};
type ModelContext = { registerTool?: (o: Outil) => unknown; unregisterTool?: (nom: string) => void };

const texte = (v: unknown) => ({ content: [{ type: "text" as const, text: typeof v === "string" ? v : JSON.stringify(v, null, 2) }] });

/** WebMCP : outils proposés aux agents IA qui naviguent dans le navigateur (navigator.modelContext). */
export function OutilsAgents() {
  useEffect(() => {
    const mc = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
    if (!mc?.registerTool) return;
    const outils: Outil[] = [
      {
        name: "rechercher_produits",
        description: "Cherche dans le catalogue GCS (téléphones reconditionnés, tablettes, accessoires) : nom, prix TTC, état, lien et réservation WhatsApp.",
        inputSchema: {
          type: "object",
          properties: {
            q: { type: "string", description: "Mots-clés, ex. « iPhone 13 », « câble USB-C »" },
            type: { type: "string", enum: ["telephones", "accessoires", ""] },
            prixMax: { type: "number", description: "Prix TTC maximum (€)" },
          },
        },
        annotations: { readOnlyHint: true },
        execute: async (a) => {
          const p = new URLSearchParams();
          if (typeof a.q === "string") p.set("q", a.q);
          if (typeof a.type === "string") p.set("type", a.type);
          if (typeof a.prixMax === "number") p.set("prixMax", String(a.prixMax));
          return texte(await fetch(`/api/catalogue?${p}`).then((r) => r.json()));
        },
      },
      {
        name: "reserver_hydrogel",
        description: "Prépare la réservation WhatsApp d'une protection d'écran hydrogel (transparent ou anti-espion) pour une marque et un modèle de téléphone.",
        inputSchema: {
          type: "object",
          properties: {
            marque: { type: "string" },
            modele: { type: "string" },
            type: { type: "string", enum: hydrogel.types.map((t) => t.id) },
          },
          required: ["modele"],
        },
        execute: async (a) => {
          const t = hydrogel.types.find((x) => x.id === a.type) ?? hydrogel.types[0];
          const msg = `Bonjour GCS, je souhaite réserver :\n• Protection d'écran hydrogel ${t.nom.toLowerCase()}\n• Marque : ${a.marque ?? ""}\n• Modèle : ${a.modele}\n• Prix : ${t.prix.toFixed(2).replace(".", ",")} € TTC\nMerci !`;
          return texte({ prixTtc: t.prix, lienWhatsApp: lienWhatsApp(msg), note: "Ouvrir le lien envoie la demande à la boutique sur WhatsApp." });
        },
      },
      {
        name: "infos_boutique",
        description: "Adresse, téléphone, WhatsApp, horaires et façon de commander chez GCS à Montpellier.",
        inputSchema: { type: "object", properties: {} },
        annotations: { readOnlyHint: true },
        execute: async () =>
          texte({
            adresse: `${entreprise.adresse.rue}, ${entreprise.adresse.codePostal} ${entreprise.adresse.ville}`,
            telephone: entreprise.telephone,
            whatsapp: `https://wa.me/${boutique.whatsapp}`,
            horaires: entreprise.horaires.map((h) => `${h.nom} : ${h.plages.map(([a, b]) => `${a}-${b}`).join(", ") || "fermé"}`),
            commande: `${boutique.delaiTexte}, retrait gratuit ou livraison, réservation sur WhatsApp.`,
          }),
      },
    ];
    for (const o of outils) {
      try {
        mc.registerTool(o);
      } catch {
        /* déjà enregistré */
      }
    }
    return () => outils.forEach((o) => mc.unregisterTool?.(o.name));
  }, []);
  return null;
}
