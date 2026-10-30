"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePanier } from "@/components/panier/PanierProvider";

type Pb = { produitId: string; varianteId?: string; nom: string; disponible: number };

export function ListeRupture() {
  const [pbs, setPbs] = useState<Pb[]>([]);
  const { articles, pret, retirer, changerQuantite } = usePanier();
  const [corrige, setCorrige] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage n'existe que dans le navigateur
      setPbs(JSON.parse(sessionStorage.getItem("gcs-rupture") ?? "[]"));
    } catch {}
  }, []);

  const corriger = () => {
    for (const p of pbs) {
      const a = articles.find((x) => x.produitId === p.produitId && (x.varianteId ?? "") === (p.varianteId ?? ""));
      if (!a) continue;
      if (p.disponible <= 0) retirer(p.produitId, p.varianteId);
      else changerQuantite(p.produitId, p.varianteId, p.disponible);
    }
    sessionStorage.removeItem("gcs-rupture");
    setCorrige(true);
  };

  return (
    <>
      {pbs.length > 0 && (
        <ul className="mt-6 space-y-2 text-left">
          {pbs.map((p) => (
            <li key={`${p.produitId}-${p.varianteId ?? ""}`} className="flex justify-between gap-3 rounded-xl bg-surface px-4 py-3 text-sm">
              <span className="font-medium">{p.nom}</span>
              <span className={p.disponible ? "text-accent-strong" : "text-danger"}>{p.disponible ? `${p.disponible} disponible(s)` : "Épuisé"}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {pbs.length > 0 && pret && !corrige ? (
          <button onClick={corriger} className="btn-accent">Ajuster mon panier automatiquement</button>
        ) : (
          <Link href="/panier" className="btn-accent">Voir mon panier</Link>
        )}
        <Link href="/boutique" className="btn-ghost">Retour à la boutique</Link>
      </div>
      {corrige && <p role="status" className="mt-4 text-sm font-medium text-success">Panier ajusté. Vous pouvez reprendre votre commande.</p>}
    </>
  );
}
