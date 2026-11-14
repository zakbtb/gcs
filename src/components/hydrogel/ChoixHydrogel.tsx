"use client";

import { useMemo, useState } from "react";
import { Check, MessageCircle, Search } from "lucide-react";
import { hydrogel } from "@/config/entreprise";
import { prix } from "@/lib/format";
import { lienWhatsApp, messageReservation } from "@/lib/whatsapp";

type Marque = { id: string; nom: string; modeles: string[] };
const sansAccents = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Sélecteur en 3 étapes : marque, modèle, type de film. Réservation sur WhatsApp. */
export function ChoixHydrogel({ marques }: { marques: Marque[] }) {
  const [marqueId, setMarqueId] = useState("");
  const [modele, setModele] = useState("");
  const [recherche, setRecherche] = useState("");
  const [libre, setLibre] = useState(false);
  const [modeleLibre, setModeleLibre] = useState("");
  const [typeId, setTypeId] = useState(hydrogel.types[0].id);

  const marque = marques.find((m) => m.id === marqueId);
  const saisieLibre = libre || (marque && marque.modeles.length === 0);
  const modeleFinal = (saisieLibre ? modeleLibre : modele).trim();
  const type = hydrogel.types.find((t) => t.id === typeId)!;

  const liste = useMemo(() => {
    const q = sansAccents(recherche.trim());
    return (marque?.modeles ?? []).filter((m) => !q || q.split(/\s+/).every((mot) => sansAccents(m).includes(mot)));
  }, [marque, recherche]);

  const choisirMarque = (id: string) => {
    setMarqueId(id);
    setModele("");
    setRecherche("");
    setLibre(false);
  };

  const pret = Boolean(marque && modeleFinal.length >= 2);
  const message = messageReservation({
    reference: `GCS-HYDRO-${type.id === "anti-espion" ? "AE" : "TR"}`,
    nom: `Protection d'écran hydrogel ${type.nom.toLowerCase()}`,
    options: [`Marque : ${marque?.nom ?? ""}`, `Modèle : ${modeleFinal}`],
    prixTtc: type.prix,
  });

  const titre = (n: number, t: string, fait: boolean) => (
    <h2 className="flex items-center gap-3 text-xl font-semibold">
      <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${fait ? "bg-success text-white" : "bg-ink text-white"}`}>
        {fait ? <Check className="size-4" aria-hidden /> : n}
      </span>
      {t}
    </h2>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="space-y-6">
        {/* 1. Marque */}
        <section className="rounded-3xl bg-white p-5 ring-1 ring-line sm:p-6">
          {titre(1, "Votre marque", Boolean(marque))}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {marques.map((m) => (
              <button key={m.id} type="button" aria-pressed={marqueId === m.id} onClick={() => choisirMarque(m.id)}
                className={`min-h-12 rounded-2xl border px-3 text-sm font-semibold transition-colors ${marqueId === m.id ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}>
                {m.nom}
              </button>
            ))}
          </div>
        </section>

        {/* 2. Modèle */}
        <section className={`rounded-3xl bg-white p-5 ring-1 ring-line sm:p-6 ${marque ? "" : "opacity-50"}`}>
          {titre(2, "Votre modèle", pret)}
          {!marque ? (
            <p className="mt-3 text-sm text-muted">Choisissez d&apos;abord la marque.</p>
          ) : (
            <div className="mt-4">
              {!saisieLibre && (
                <>
                  <div className="relative">
                    <label htmlFor="hydro-recherche" className="sr-only">Rechercher un modèle</label>
                    <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-subtle" aria-hidden />
                    <input id="hydro-recherche" type="search" className="field pl-12" placeholder={`Rechercher un modèle ${marque.nom}…`} value={recherche} onChange={(e) => setRecherche(e.target.value)} />
                  </div>
                  <label htmlFor="hydro-modele" className="sr-only">Modèle</label>
                  <select id="hydro-modele" className="field mt-2" size={Math.min(8, Math.max(3, liste.length))} value={modele} onChange={(e) => setModele(e.target.value)}>
                    {liste.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  {liste.length === 0 && <p className="mt-2 text-sm text-muted">Aucun modèle ne correspond à « {recherche} ».</p>}
                </>
              )}
              {marque.modeles.length > 0 && (
                <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
                  <input type="checkbox" className="size-5 accent-brand" checked={libre} onChange={(e) => setLibre(e.target.checked)} />
                  Mon modèle n&apos;est pas dans la liste
                </label>
              )}
              {saisieLibre && (
                <div className="mt-2">
                  <label htmlFor="hydro-libre" className="mb-1.5 block text-sm font-semibold">Écrivez votre modèle</label>
                  <input id="hydro-libre" className="field" placeholder="Ex. : Galaxy A57, Nothing Phone (3a)…" value={modeleLibre} onChange={(e) => setModeleLibre(e.target.value)} />
                  <p className="mt-1.5 text-xs text-muted">Le film est découpé sur mesure : tous les modèles sont possibles.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* 3. Type */}
        <section className="rounded-3xl bg-white p-5 ring-1 ring-line sm:p-6">
          {titre(3, "Votre protection", false)}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {hydrogel.types.map((t) => (
              <button key={t.id} type="button" aria-pressed={typeId === t.id} onClick={() => setTypeId(t.id)}
                className={`rounded-2xl border-2 p-4 text-left transition-colors ${typeId === t.id ? "border-brand bg-brand-soft" : "border-line bg-white hover:border-ink"}`}>
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold">{t.nom}</span>
                  <span>
                    <span className="font-display text-lg font-bold">{prix(t.prix)}</span>
                    {hydrogel.afficherPrixBarre && <span className="ml-1.5 text-sm text-subtle line-through">{prix(t.prixBarre)}</span>}
                  </span>
                </span>
                <span className="mt-1 block text-sm text-muted">{t.detail}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Récapitulatif */}
      <aside className="rounded-3xl bg-ink p-6 text-white lg:sticky lg:top-24" aria-live="polite">
        <p className="inline-flex rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-ink">PROMO</p>
        <p className="mt-4 text-sm text-white/70">Votre protection</p>
        <p className="font-semibold">{marque ? `${marque.nom}${modeleFinal ? ` · ${modeleFinal}` : ""}` : "Choisissez votre téléphone"}</p>
        <p className="mt-1 text-white/85">Hydrogel {type.nom.toLowerCase()}</p>
        <p className="mt-4 flex items-baseline gap-2">
          <span className="font-display text-4xl font-bold">{prix(type.prix)}</span>
          {hydrogel.afficherPrixBarre && <span className="text-lg text-white/60 line-through">{prix(type.prixBarre)}</span>}
          <span className="text-sm text-white/70">TTC, pose comprise</span>
        </p>
        {pret ? (
          <a href={lienWhatsApp(message)} target="_blank" rel="noopener noreferrer" className="btn-accent mt-5 w-full">
            <MessageCircle className="size-5" aria-hidden /> Réserver
          </a>
        ) : (
          <button type="button" disabled className="btn-accent mt-5 w-full opacity-50">
            <MessageCircle className="size-5" aria-hidden /> Réserver
          </button>
        )}
        <p className="mt-3 text-xs text-white/70">{pret ? "La réservation s'envoie sur WhatsApp. Pose en boutique, en quelques minutes." : "Choisissez la marque et le modèle pour réserver."}</p>
      </aside>
    </div>
  );
}
