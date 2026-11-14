import "server-only";
import { boutique } from "@/config/entreprise";
import { arrondi } from "./format";
import {
  decrementerStocks,
  getCatalogue,
  getVariante,
  libelleVariante,
  prixVariante,
  stockDisponible,
} from "./produits";
import { idAleatoire, jeton, lireJson, modifierJson } from "./store";
import type { Commande, LigneCommande, LignePanier, ModeLivraison, StatutCommande } from "./types";
import { envoyerConfirmationCommande } from "./emails";

const FICHIER = "commandes.json";

export const LIBELLES_STATUT: Record<StatutCommande, string> = {
  en_attente_paiement: "En attente de paiement",
  payee: "Payée",
  en_preparation: "En préparation",
  expediee: "Expédiée",
  prete_retrait: "Prête à retirer",
  livree: "Livrée / retirée",
  annulee: "Annulée",
  paiement_refuse: "Paiement refusé",
};

export function fraisLivraison(mode: ModeLivraison, sousTotal: number): number {
  if (mode === "retrait") return boutique.retrait.prix;
  const seuil = boutique.livraison.gratuiteDes;
  if (seuil != null && sousTotal >= seuil) return 0;
  return boutique.livraison.prix;
}

export type ProblemeStock = { produitId: string; varianteId?: string; nom: string; disponible: number };

/** Recalcule le panier côté serveur à partir du catalogue (on ne fait jamais confiance aux prix envoyés par le navigateur). */
export async function evaluerPanier(panier: LignePanier[]) {
  const { produits } = await getCatalogue();
  const lignes: LigneCommande[] = [];
  const problemes: ProblemeStock[] = [];

  for (const item of panier) {
    const quantite = Math.max(1, Math.min(99, Math.floor(Number(item.quantite) || 0)));
    const p = produits.find((x) => x.id === item.produitId && x.actif);
    if (!p) {
      problemes.push({ produitId: item.produitId, nom: "Produit indisponible", disponible: 0 });
      continue;
    }
    const v = getVariante(p, item.varianteId);
    if (p.variantes.length > 0 && !v) {
      problemes.push({ produitId: p.id, nom: p.nom, disponible: 0 });
      continue;
    }
    const dispo = stockDisponible(p, v?.id);
    const nom = v ? `${p.nom} (${libelleVariante(v)})` : p.nom;
    if (dispo < quantite) problemes.push({ produitId: p.id, varianteId: v?.id, nom, disponible: dispo });
    const pu = prixVariante(p, v?.id);
    lignes.push({
      produitId: p.id,
      varianteId: v?.id,
      nom: p.nom,
      // Appareils sur commande : la référence sert à GCS pour le commander chez le fournisseur
      variante: p.appareil ? `Réf. ${p.appareil.reference} · commandé sur demande, en 24 h` : libelleVariante(v),
      image: v?.image ?? p.images[0],
      prixUnitaire: pu,
      quantite,
      total: arrondi(pu * quantite),
    });
  }
  const sousTotal = arrondi(lignes.reduce((s, l) => s + l.total, 0));
  return { lignes, problemes, sousTotal };
}

export type DonneesCommande = {
  client: Commande["client"];
  livraison: Commande["livraison"];
  note?: string;
  panier: LignePanier[];
  fournisseur: "stripe" | "demo";
};

export async function creerCommande(d: DonneesCommande) {
  const { lignes, problemes, sousTotal } = await evaluerPanier(d.panier);
  if (lignes.length === 0) return { ok: false as const, erreur: "panier_vide" as const, problemes };
  if (problemes.length > 0) return { ok: false as const, erreur: "rupture" as const, problemes };

  const frais = fraisLivraison(d.livraison.mode, sousTotal);
  const maintenant = new Date();
  const ymd = maintenant.toISOString().slice(2, 10).replace(/-/g, "");
  const commande: Commande = {
    id: `GCS-${ymd}-${idAleatoire(4)}`,
    token: jeton(),
    creeLe: maintenant.toISOString(),
    majLe: maintenant.toISOString(),
    statut: "en_attente_paiement",
    client: d.client,
    livraison: d.livraison,
    note: d.note,
    lignes,
    sousTotal,
    fraisLivraison: frais,
    total: arrondi(sousTotal + frais),
    paiement: { fournisseur: d.fournisseur },
    historique: [{ date: maintenant.toISOString(), statut: "en_attente_paiement" }],
  };
  await modifierJson<Commande[]>(FICHIER, [], (liste) => {
    liste.push(commande);
  });
  return { ok: true as const, commande };
}

export async function getCommandes(): Promise<Commande[]> {
  const liste = await lireJson<Commande[]>(FICHIER, []);
  return liste.sort((a, b) => b.creeLe.localeCompare(a.creeLe));
}

export async function getCommande(id: string): Promise<Commande | undefined> {
  const liste = await lireJson<Commande[]>(FICHIER, []);
  return liste.find((c) => c.id === id);
}

/** Récupère une commande uniquement si le jeton secret correspond (accès client sans compte). */
export async function getCommandeClient(id: string, token: string): Promise<Commande | undefined> {
  const c = await getCommande(id);
  if (!c || !token || c.token.length !== token.length) return undefined;
  const crypto = await import("node:crypto");
  return crypto.timingSafeEqual(Buffer.from(c.token), Buffer.from(token)) ? c : undefined;
}

export async function majCommande(id: string, modif: (c: Commande) => void) {
  return modifierJson<Commande[], Commande | undefined>(FICHIER, [], (liste) => {
    const c = liste.find((x) => x.id === id);
    if (!c) return undefined;
    modif(c);
    c.majLe = new Date().toISOString();
    return structuredClone(c);
  });
}

export async function changerStatut(id: string, statut: StatutCommande, note?: string) {
  return majCommande(id, (c) => {
    c.statut = statut;
    c.historique.push({ date: new Date().toISOString(), statut, note });
  });
}

/**
 * Marque une commande comme payée. Idempotent : peut être appelée par le webhook
 * Stripe ET par la page de confirmation sans double décrément de stock ni double e-mail.
 */
export async function confirmerPaiement(id: string, reference: string) {
  let aTraiter = false;
  const c = await majCommande(id, (c) => {
    if (c.statut === "en_attente_paiement" || c.statut === "paiement_refuse") {
      c.statut = "payee";
      c.paiement.reference = reference;
      c.paiement.payeLe = new Date().toISOString();
      c.paiement.erreur = undefined;
      c.historique.push({ date: c.paiement.payeLe, statut: "payee" });
      aTraiter = !c.stockDecremente;
      c.stockDecremente = true; // réservé immédiatement pour éviter un double traitement concurrent
    }
  });
  if (!c || !aTraiter) return c;

  const ok = await decrementerStocks(c.lignes);
  if (!ok) {
    await majCommande(id, (x) => {
      x.historique.push({
        date: new Date().toISOString(),
        statut: x.statut,
        note: "⚠️ Stock insuffisant au moment du paiement : vérifier la disponibilité ou rembourser le client.",
      });
    });
  }
  try {
    await envoyerConfirmationCommande(c);
    await majCommande(id, (x) => {
      x.emailEnvoye = true;
    });
  } catch (e) {
    console.error("[commande] échec envoi e-mail", e);
  }
  return getCommande(id);
}

export async function signalerPaiementRefuse(id: string, erreur: string) {
  return majCommande(id, (c) => {
    if (c.statut !== "en_attente_paiement") return;
    c.paiement.erreur = erreur;
    c.historique.push({ date: new Date().toISOString(), statut: "en_attente_paiement", note: `Paiement refusé : ${erreur}` });
  });
}
