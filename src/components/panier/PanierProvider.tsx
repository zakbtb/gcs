"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ArticlePanier = {
  produitId: string;
  varianteId?: string;
  quantite: number;
  // Instantané pour l'affichage (les prix sont toujours recalculés côté serveur)
  nom: string;
  slug: string;
  variante?: string;
  prix: number;
  image?: string;
  stock: number;
};

type Ctx = {
  articles: ArticlePanier[];
  pret: boolean;
  nombre: number;
  sousTotal: number;
  ajouter: (a: ArticlePanier) => void;
  changerQuantite: (produitId: string, varianteId: string | undefined, quantite: number) => void;
  retirer: (produitId: string, varianteId: string | undefined) => void;
  remplacer: (articles: ArticlePanier[] | ((actuels: ArticlePanier[]) => ArticlePanier[])) => void;
  vider: () => void;
  dernierAjout: ArticlePanier | null;
  effacerDernierAjout: () => void;
};

const PanierContext = createContext<Ctx | null>(null);
const CLE = "gcs-panier-v1";

const memeLigne = (a: { produitId: string; varianteId?: string }, id: string, vid?: string) =>
  a.produitId === id && (a.varianteId ?? "") === (vid ?? "");

export function PanierProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<ArticlePanier[]>([]);
  const [pret, setPret] = useState(false);
  const [dernierAjout, setDernierAjout] = useState<ArticlePanier | null>(null);

  // Le panier est conservé dans le navigateur (localStorage) : il survit à la fermeture du site.
  useEffect(() => {
    try {
      const brut = localStorage.getItem(CLE);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- le localStorage n'existe que dans le navigateur
      if (brut) setArticles(JSON.parse(brut));
    } catch {}
    setPret(true);
    const sync = (e: StorageEvent) => {
      if (e.key === CLE) {
        try {
          setArticles(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {}
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  useEffect(() => {
    if (!pret) return;
    try {
      localStorage.setItem(CLE, JSON.stringify(articles));
    } catch {}
  }, [articles, pret]);

  const ajouter = useCallback((a: ArticlePanier) => {
    setArticles((liste) => {
      const existant = liste.find((x) => memeLigne(x, a.produitId, a.varianteId));
      if (existant) {
        return liste.map((x) =>
          x === existant ? { ...x, ...a, quantite: Math.min(x.quantite + a.quantite, a.stock, 99) } : x,
        );
      }
      return [...liste, { ...a, quantite: Math.min(a.quantite, a.stock, 99) }];
    });
    setDernierAjout(a);
  }, []);

  const changerQuantite = useCallback((id: string, vid: string | undefined, q: number) => {
    setArticles((liste) =>
      liste.map((x) => (memeLigne(x, id, vid) ? { ...x, quantite: Math.max(1, Math.min(q, x.stock, 99)) } : x)),
    );
  }, []);

  const retirer = useCallback((id: string, vid: string | undefined) => {
    setArticles((liste) => liste.filter((x) => !memeLigne(x, id, vid)));
  }, []);

  const valeur = useMemo<Ctx>(
    () => ({
      articles,
      pret,
      nombre: articles.reduce((s, a) => s + a.quantite, 0),
      sousTotal: Math.round(articles.reduce((s, a) => s + a.prix * a.quantite, 0) * 100) / 100,
      ajouter,
      changerQuantite,
      retirer,
      remplacer: setArticles,
      vider: () => setArticles([]),
      dernierAjout,
      effacerDernierAjout: () => setDernierAjout(null),
    }),
    [articles, pret, ajouter, changerQuantite, retirer, dernierAjout],
  );

  return <PanierContext.Provider value={valeur}>{children}</PanierContext.Provider>;
}

export function usePanier() {
  const ctx = useContext(PanierContext);
  if (!ctx) throw new Error("usePanier doit être utilisé dans <PanierProvider>");
  return ctx;
}
