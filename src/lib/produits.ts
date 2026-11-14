import "server-only";
import { lireJson, modifierJson } from "./store";
import type { Catalogue, Produit, Variante } from "./types";

const FICHIER = "produits.json";
const VIDE: Catalogue = { categories: [], produits: [] };

export async function getCatalogue(): Promise<Catalogue> {
  return lireJson<Catalogue>(FICHIER, VIDE);
}

export async function getProduitsActifs(): Promise<Produit[]> {
  const { produits } = await getCatalogue();
  return produits.filter((p) => p.actif);
}

export async function getProduit(slug: string): Promise<Produit | undefined> {
  const { produits } = await getCatalogue();
  return produits.find((p) => p.slug === slug || p.id === slug);
}

export function getVariante(produit: Produit, varianteId?: string): Variante | undefined {
  if (!varianteId) return undefined;
  return produit.variantes.find((v) => v.id === varianteId);
}

/** Stock disponible pour un produit (ou une de ses variantes). */
export function stockDisponible(produit: Produit, varianteId?: string): number {
  if (produit.variantes.length > 0) {
    const v = getVariante(produit, varianteId);
    return v ? v.stock : 0;
  }
  return produit.stock ?? 0;
}

export function stockTotal(produit: Produit): number {
  return produit.variantes.length > 0
    ? produit.variantes.reduce((s, v) => s + v.stock, 0)
    : produit.stock ?? 0;
}

export function prixVariante(produit: Produit, varianteId?: string): number {
  return getVariante(produit, varianteId)?.prix ?? produit.prix;
}

export function libelleVariante(v?: Variante): string | undefined {
  return v ? Object.values(v.options).join(" · ") : undefined;
}

export async function enregistrerProduit(produit: Produit, ancienId?: string) {
  await modifierJson<Catalogue>(FICHIER, VIDE, (cat) => {
    const idx = cat.produits.findIndex((p) => p.id === (ancienId ?? produit.id));
    if (idx >= 0) cat.produits[idx] = produit;
    else cat.produits.push(produit);
  });
}

export async function supprimerProduit(id: string) {
  await modifierJson<Catalogue>(FICHIER, VIDE, (cat) => {
    cat.produits = cat.produits.filter((p) => p.id !== id);
  });
}

/** Décrémente les stocks ; retourne false si une ligne n'a plus assez de stock (rien n'est modifié). */
export async function decrementerStocks(
  lignes: { produitId: string; varianteId?: string; quantite: number }[],
): Promise<boolean> {
  return modifierJson<Catalogue, boolean>(FICHIER, VIDE, (cat) => {
    for (const l of lignes) {
      const p = cat.produits.find((x) => x.id === l.produitId);
      if (!p || stockDisponible(p, l.varianteId) < l.quantite) return false;
    }
    for (const l of lignes) {
      const p = cat.produits.find((x) => x.id === l.produitId)!;
      if (p.surCommande) continue; // commandé chez le fournisseur : pas de stock à décompter
      if (p.variantes.length > 0) {
        const v = p.variantes.find((x) => x.id === l.varianteId)!;
        v.stock -= l.quantite;
      } else {
        p.stock = (p.stock ?? 0) - l.quantite;
      }
    }
    return true;
  });
}
