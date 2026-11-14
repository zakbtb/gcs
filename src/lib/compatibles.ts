import type { Produit } from "./types";

/** Connecteur de charge d'un appareil, d'après son modèle. */
export function connecteur(modele: string): "USB-C" | "Lightning" | null {
  if (/watch/i.test(modele)) return null;
  const iphone = /iPhone\s+(\d+)/i.exec(modele);
  if (iphone) return Number(iphone[1]) >= 15 ? "USB-C" : "Lightning";
  if (/iPhone/i.test(modele)) return "Lightning"; // iPhone SE, X, XR, XS
  if (/iPad/i.test(modele)) {
    // iPad avec USB-C : Pro depuis 2018, Air 4e gen et après, mini 6e gen et après, iPad 10e gen et après
    if (/Pro.*(20(1[89]|2\d)|11|12[.,]9.*(3e|4e|5e|6e))|Air.*([4-9]e)|mini.*([6-9]e)|(1\d)e Gen/i.test(modele)) return "USB-C";
    return "Lightning";
  }
  return null;
}

/** Accessoires conseillés sur la fiche d'un téléphone ou d'une tablette : chargeur, câble, chaîne. */
export function accessoiresCompatibles(appareil: Produit, produits: Produit[]): Produit[] {
  if (!appareil.appareil) return [];
  const conn = connecteur(appareil.appareil.modele);
  if (!conn) return [];
  const actifs = produits.filter((p) => p.actif && p.accessoire);
  const moinsCher = (l: Produit[]) => [...l].sort((a, b) => a.prix - b.prix)[0];
  const chargeur =
    actifs.find((p) => p.categorie === "chargeurs" && /apple.*20 ?w/i.test(p.nom)) ??
    moinsCher(actifs.filter((p) => p.categorie === "chargeurs" && /usb-c/i.test(p.nom) && /20 ?w/i.test(p.nom)));
  const cable =
    conn === "Lightning"
      ? moinsCher(actifs.filter((p) => p.categorie === "cables" && /usb-c vers lightning/i.test(p.nom)))
      : moinsCher(actifs.filter((p) => p.categorie === "cables" && /usb-c vers usb-c/i.test(p.nom)));
  const chaine = appareil.categorie === "smartphones" ? moinsCher(actifs.filter((p) => p.categorie === "dragonnes-chaines" && /chaîne/i.test(p.nom))) : undefined;
  return [chargeur, cable, chaine].filter((p): p is Produit => Boolean(p));
}
