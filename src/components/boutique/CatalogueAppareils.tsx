"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import type { Categorie, Produit } from "@/lib/types";
import { CarteProduit } from "./CarteProduit";

const TRANCHES = [
  { id: "250", nom: "Moins de 250 €", min: 0, max: 250 },
  { id: "250-500", nom: "250 € à 500 €", min: 250, max: 500 },
  { id: "500-800", nom: "500 € à 800 €", min: 500, max: 800 },
  { id: "800+", nom: "Plus de 800 €", min: 800, max: Infinity },
];
const TRIS = { "prix-asc": "Prix croissant", "prix-desc": "Prix décroissant", recents: "Modèles récents d'abord" } as const;
type Tri = keyof typeof TRIS;

const ordreGo = (c: string) => parseInt(c, 10) || 0;
/** Ordre approximatif des modèles, du plus récent au plus ancien, à partir du nom. */
function rangModele(m: string) {
  const n = m.match(/\d+/);
  let r = n ? Number(n[0]) : 0;
  if (/XS|XR|\bX\b/.test(m)) r = 10;
  if (/SE/.test(m)) r = /3e/.test(m) ? 13 : 11;
  if (/iPad/.test(m)) r -= 100;
  return r + (/Pro Max/.test(m) ? 0.3 : /Pro/.test(m) ? 0.2 : /Plus/.test(m) ? 0.1 : 0);
}

/** Catalogue des téléphones et tablettes : filtres catégorie, modèle, capacité, état, grade, prix (dans l'URL). */
export function CatalogueAppareils({ produits, categories, prefixe = "" }: { produits: Produit[]; categories: Categorie[]; prefixe?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [ouvert, setOuvert] = useState(false);

  const f = {
    categorie: sp.get(prefixe + "categorie") ?? "",
    modele: sp.get(prefixe + "modele") ?? "",
    capacite: sp.get(prefixe + "capacite") ?? "",
    etat: sp.get(prefixe + "etat") ?? "",
    grade: sp.get(prefixe + "grade") ?? "",
    prix: sp.get(prefixe + "prix") ?? "",
  };
  const tri = (sp.get(prefixe + "tri") as Tri) || "prix-asc";

  const aller = (p: URLSearchParams) => router.replace(`${pathname}${p.size ? `?${p}` : ""}`, { scroll: false });
  const maj = (cle: string, valeur: string) => {
    const p = new URLSearchParams(sp.toString());
    if (valeur && p.get(prefixe + cle) !== valeur) p.set(prefixe + cle, valeur);
    else p.delete(prefixe + cle);
    if (cle === "categorie") p.delete(prefixe + "modele");
    aller(p);
  };
  const effacer = () => {
    const p = new URLSearchParams(sp.toString());
    for (const k of ["categorie", "modele", "capacite", "etat", "grade", "prix", "tri"]) p.delete(prefixe + k);
    aller(p);
  };

  const valeurs = useMemo(() => {
    const base = f.categorie ? produits.filter((p) => p.categorie === f.categorie) : produits;
    const uniq = (k: "modele" | "capacite" | "etat" | "grade") => [...new Set(base.map((p) => p.appareil![k]).filter(Boolean))];
    return {
      modele: uniq("modele").sort((a, b) => rangModele(b) - rangModele(a)),
      capacite: uniq("capacite").sort((a, b) => ordreGo(a) - ordreGo(b)),
      etat: uniq("etat").sort(),
      grade: uniq("grade").sort(),
    };
  }, [produits, f.categorie]);

  const resultat = useMemo(() => {
    const tranche = TRANCHES.find((t) => t.id === f.prix);
    const liste = produits.filter((p) => {
      const a = p.appareil!;
      if (f.categorie && p.categorie !== f.categorie) return false;
      if (f.modele && a.modele !== f.modele) return false;
      if (f.capacite && a.capacite !== f.capacite) return false;
      if (f.etat && a.etat !== f.etat) return false;
      if (f.grade && a.grade !== f.grade) return false;
      if (tranche && (p.prix < tranche.min || p.prix >= tranche.max)) return false;
      return true;
    });
    if (tri === "prix-desc") return liste.sort((a, b) => b.prix - a.prix);
    if (tri === "recents") return liste.sort((a, b) => rangModele(b.appareil!.modele) - rangModele(a.appareil!.modele) || a.prix - b.prix);
    return liste.sort((a, b) => a.prix - b.prix);
  }, [produits, f.categorie, f.modele, f.capacite, f.etat, f.grade, f.prix, tri]);

  const nomCat = Object.fromEntries(categories.map((c) => [c.id, c.nom]));
  const nbFiltres = Object.values(f).filter(Boolean).length;

  const puces = (cle: keyof typeof f, titre: string, options: { id: string; nom: string }[]) => (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold uppercase tracking-wider text-subtle">{titre}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={f[cle] === o.id}
            onClick={() => maj(cle, o.id)}
            className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${f[cle] === o.id ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}
          >
            {o.nom}
          </button>
        ))}
      </div>
    </fieldset>
  );

  const filtres = (
    <div className="space-y-7">
      {categories.length > 1 && puces("categorie", "Catégorie", categories.map((c) => ({ id: c.id, nom: c.nom })))}
      <div>
        <label htmlFor={`${prefixe}filtre-modele`} className="mb-3 block text-sm font-semibold uppercase tracking-wider text-subtle">Modèle</label>
        <select id={`${prefixe}filtre-modele`} className="field" value={f.modele} onChange={(e) => maj("modele", e.target.value)}>
          <option value="">Tous les modèles</option>
          {valeurs.modele.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>
      {puces("prix", "Prix", TRANCHES)}
      {puces("etat", "État", valeurs.etat.map((v) => ({ id: v, nom: v })))}
      {puces("grade", "Grade", valeurs.grade.map((v) => ({ id: v, nom: v.length === 1 ? `Grade ${v}` : "Au hasard" })))}
      {puces("capacite", "Capacité", valeurs.capacite.map((v) => ({ id: v, nom: v })))}
      {nbFiltres > 0 && (
        <button type="button" onClick={effacer} className="btn-ghost btn-sm w-full">
          Effacer les filtres
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
      <aside className="hidden lg:block" aria-label="Filtres">
        <div className="sticky top-24">{filtres}</div>
      </aside>
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            aria-pressed={f.prix === "250"}
            onClick={() => maj("prix", "250")}
            className={`min-h-11 rounded-full px-5 text-sm font-bold transition-colors ${f.prix === "250" ? "bg-ink text-cyan" : "bg-cyan text-ink hover:brightness-95"}`}
          >
            Moins de 250 €
          </button>
          <button type="button" onClick={() => setOuvert(true)} className="btn-ghost lg:hidden" aria-haspopup="dialog">
            <SlidersHorizontal className="size-5" aria-hidden /> Filtres {nbFiltres > 0 && <span className="rounded-full bg-brand px-2 text-xs text-white">{nbFiltres}</span>}
          </button>
          <label htmlFor="tri-appareils" className="sr-only">Trier par</label>
          <select id="tri-appareils" className="field ml-auto w-auto" value={tri} onChange={(e) => maj("tri", e.target.value === "prix-asc" ? "" : e.target.value)}>
            {Object.entries(TRIS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>

        <p className="mt-5 text-sm text-muted" role="status" aria-live="polite">
          {resultat.length} appareil{resultat.length > 1 ? "s" : ""}
        </p>

        {resultat.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-line bg-white p-10 text-center">
            <p className="font-semibold">Aucun appareil ne correspond à ces filtres.</p>
            <p className="mt-1 text-muted">Retirez un filtre, ou appelez-nous : nous pouvons chercher le modèle qu&apos;il vous faut.</p>
          </div>
        ) : (
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
            {resultat.map((p) => (
              <li key={p.id} className="flex">
                <div className="w-full"><CarteProduit produit={p} nomCategorie={nomCat[p.categorie]} /></div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {ouvert && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filtres">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOuvert(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-display text-xl font-semibold">Filtres</p>
              <button onClick={() => setOuvert(false)} className="grid size-11 place-items-center rounded-full hover:bg-surface" aria-label="Fermer les filtres">
                <X className="size-6" aria-hidden />
              </button>
            </div>
            {filtres}
            <button onClick={() => setOuvert(false)} className="btn-dark mt-6 w-full">
              Voir {resultat.length} appareil{resultat.length > 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
