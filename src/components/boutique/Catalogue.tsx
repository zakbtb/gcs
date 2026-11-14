"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Categorie, Produit } from "@/lib/types";
import { CarteProduit } from "./CarteProduit";

const TRIS = {
  pertinence: "Pertinence",
  "prix-asc": "Prix croissant",
  "prix-desc": "Prix décroissant",
  nom: "Nom (A → Z)",
} as const;
type Tri = keyof typeof TRIS;

const TRANCHES = [
  { id: "0-15", nom: "Moins de 15 €", min: 0, max: 15 },
  { id: "15-30", nom: "15 € à 30 €", min: 15, max: 30 },
  { id: "30-50", nom: "30 € à 50 €", min: 30, max: 50 },
  { id: "50+", nom: "Plus de 50 €", min: 50, max: Infinity },
];

const sansAccents = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function stock(p: Produit) {
  return p.variantes.length ? p.variantes.reduce((s, v) => s + v.stock, 0) : p.stock ?? 0;
}

/** Catalogue avec recherche, filtres (catégorie, prix, compatibilité, dispo) et tri. Les filtres sont dans l'URL (partageables). */
export function Catalogue({ produits, categories, prefixe = "", texteRecherche = "Rechercher : coque iPhone 15, chargeur…" }: { produits: Produit[]; categories: Categorie[]; prefixe?: string; texteRecherche?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [filtresOuverts, setFiltresOuverts] = useState(false);

  const q = sp.get(prefixe + "q") ?? "";
  const cat = sp.get(prefixe + "categorie") ?? "";
  const prixF = sp.get(prefixe + "prix") ?? "";
  const compat = sp.get(prefixe + "compatibilite") ?? "";
  const marque = sp.get(prefixe + "marque") ?? "";
  const dispo = sp.get(prefixe + "dispo") === "1";
  const surCommande = produits.every((p) => p.surCommande);
  const tri = (sp.get(prefixe + "tri") as Tri) || "pertinence";

  const maj = (cle: string, valeur: string) => {
    const p = new URLSearchParams(sp.toString());
    if (valeur) p.set(prefixe + cle, valeur);
    else p.delete(prefixe + cle);
    router.replace(`${pathname}${p.size ? `?${p}` : ""}`, { scroll: false });
  };
  const effacer = () => {
    const p = new URLSearchParams(sp.toString());
    for (const k of ["categorie", "prix", "compatibilite", "marque", "dispo"]) p.delete(prefixe + k);
    router.replace(`${pathname}${p.size ? `?${p}` : ""}`, { scroll: false });
  };
  const marques = useMemo(() => [...new Set(produits.map((p) => p.marque).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr")), [produits]);

  const compatibilites = useMemo(() => {
    const s = new Set<string>();
    for (const p of produits) for (const c of p.compatibilite) s.add(c);
    for (const p of produits) for (const o of p.options) if (o.nom === "Modèle") o.valeurs.forEach((v) => s.add(v));
    return [...s].sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));
  }, [produits]);

  const resultat = useMemo(() => {
    const nq = sansAccents(q.trim());
    const tranche = TRANCHES.find((t) => t.id === prixF);
    let liste = produits.filter((p) => {
      if (cat && p.categorie !== cat) return false;
      if (tranche && (p.prix < tranche.min || p.prix >= tranche.max)) return false;
      if (dispo && stock(p) === 0) return false;
      if (marque && p.marque !== marque) return false;
      if (compat) {
        const modeles = p.options.find((o) => o.nom === "Modèle")?.valeurs ?? [];
        if (!p.compatibilite.includes(compat) && !modeles.includes(compat)) return false;
      }
      if (nq) {
        const texte = sansAccents([p.nom, p.description, p.marque, ...p.compatibilite, categories.find((c) => c.id === p.categorie)?.nom ?? ""].join(" "));
        if (!nq.split(/\s+/).every((m) => texte.includes(m))) return false;
      }
      return true;
    });
    if (tri === "prix-asc") liste = [...liste].sort((a, b) => a.prix - b.prix);
    else if (tri === "prix-desc") liste = [...liste].sort((a, b) => b.prix - a.prix);
    else if (tri === "nom") liste = [...liste].sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
    else liste = [...liste].sort((a, b) => Number(stock(b) > 0) - Number(stock(a) > 0) || Number(Boolean(b.misEnAvant)) - Number(Boolean(a.misEnAvant)));
    return liste;
  }, [produits, categories, q, cat, prixF, compat, marque, dispo, tri]);

  const nomCat = Object.fromEntries(categories.map((c) => [c.id, c.nom]));
  const nbFiltres = [cat, prixF, compat, marque, dispo ? "1" : ""].filter(Boolean).length;

  const filtres = (
    <div className="space-y-7">
      <fieldset>
        <legend className="mb-3 text-sm font-semibold uppercase tracking-wider text-subtle">Catégorie</legend>
        <div className="space-y-1">
          {[{ id: "", nom: "Toutes les catégories" }, ...categories].map((c) => (
            <label key={c.id || "toutes"} className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-[0.95rem] transition-colors ${cat === c.id ? "bg-brand-soft font-semibold text-brand-strong" : "hover:bg-surface"}`}>
              <input type="radio" name={`${prefixe}categorie`} className="accent-brand" checked={cat === c.id} onChange={() => maj("categorie", c.id)} />
              <span className="flex-1">{c.nom}</span>
              <span className="text-xs text-muted">{c.id ? produits.filter((p) => p.categorie === c.id).length : produits.length}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-sm font-semibold uppercase tracking-wider text-subtle">Prix</legend>
        <div className="space-y-1">
          {[{ id: "", nom: "Tous les prix" }, ...TRANCHES].map((t) => (
            <label key={t.id || "tous"} className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-[0.95rem] ${prixF === t.id ? "bg-brand-soft font-semibold text-brand-strong" : "hover:bg-surface"}`}>
              <input type="radio" name={`${prefixe}prix`} className="accent-brand" checked={prixF === t.id} onChange={() => maj("prix", t.id)} />
              {t.nom}
            </label>
          ))}
        </div>
      </fieldset>
      {compatibilites.length > 0 && (
        <div>
          <label htmlFor={`${prefixe}filtre-compat`} className="mb-3 block text-sm font-semibold uppercase tracking-wider text-subtle">{surCommande ? "Connectique" : "Compatibilité"}</label>
          <select id={`${prefixe}filtre-compat`} className="field" value={compat} onChange={(e) => maj("compatibilite", e.target.value)}>
            <option value="">{surCommande ? "Toutes" : "Tous les appareils"}</option>
            {compatibilites.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      )}
      {marques.length > 1 && (
        <div>
          <label htmlFor={`${prefixe}filtre-marque`} className="mb-3 block text-sm font-semibold uppercase tracking-wider text-subtle">Marque</label>
          <select id={`${prefixe}filtre-marque`} className="field" value={marque} onChange={(e) => maj("marque", e.target.value)}>
            <option value="">Toutes les marques</option>
            {marques.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
      )}
      {!surCommande && <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 hover:bg-surface">
        <input type="checkbox" className="size-5 accent-brand" checked={dispo} onChange={(e) => maj("dispo", e.target.checked ? "1" : "")} />
        <span className="text-[0.95rem] font-medium">En stock uniquement</span>
      </label>}
      {nbFiltres > 0 && (
        <button type="button" onClick={effacer} className="btn-ghost btn-sm w-full">
          Effacer les filtres
        </button>
      )}
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
      <aside className="hidden lg:block" aria-label="Filtres">
        <div className="sticky top-24">{filtres}</div>
      </aside>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label htmlFor={`${prefixe}recherche`} className="sr-only">Rechercher un produit</label>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-subtle" aria-hidden />
            <input
              id={`${prefixe}recherche`}
              type="search"
              placeholder={texteRecherche}
              defaultValue={q}
              onChange={(e) => maj("q", e.target.value)}
              className="field pl-12"
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setFiltresOuverts(true)} className="btn-ghost flex-1 lg:hidden" aria-haspopup="dialog">
              <SlidersHorizontal className="size-5" aria-hidden /> Filtres {nbFiltres > 0 && <span className="rounded-full bg-brand px-2 text-xs text-white">{nbFiltres}</span>}
            </button>
            <label htmlFor={`${prefixe}tri`} className="sr-only">Trier par</label>
            <select id={`${prefixe}tri`} className="field w-auto flex-1 sm:flex-none" value={tri} onChange={(e) => maj("tri", e.target.value === "pertinence" ? "" : e.target.value)}>
              {Object.entries(TRIS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>

        <p className="mt-5 text-sm text-muted" role="status" aria-live="polite">
          {resultat.length} produit{resultat.length > 1 ? "s" : ""}
          {cat ? ` · ${nomCat[cat]}` : ""}
        </p>

        {resultat.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-line bg-white p-10 text-center">
            <p className="font-semibold">Aucun produit ne correspond à votre recherche.</p>
            <p className="mt-1 text-muted">Essayez d&apos;autres mots-clés ou retirez des filtres. Vous ne trouvez pas ? Nous pouvons le commander pour vous.</p>
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

      {/* Tiroir de filtres mobile */}
      {filtresOuverts && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filtres">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setFiltresOuverts(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-display text-xl font-semibold">Filtres</p>
              <button onClick={() => setFiltresOuverts(false)} className="grid size-11 place-items-center rounded-full hover:bg-surface" aria-label="Fermer les filtres">
                <X className="size-6" aria-hidden />
              </button>
            </div>
            {filtres}
            <button onClick={() => setFiltresOuverts(false)} className="btn-dark mt-6 w-full">
              Voir {resultat.length} produit{resultat.length > 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
