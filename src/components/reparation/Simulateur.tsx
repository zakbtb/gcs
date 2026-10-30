"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Smartphone, Battery, Camera, ScanFace, Aperture, Plug, Layers, Volume2, Ear, ToggleRight, Droplets, Cpu,
  Check, Clock, ShieldCheck, CalendarCheck, Wrench,
} from "lucide-react";
import type { PrixReparation, Tarifs } from "@/lib/types";
import { prixCourt } from "@/lib/format";

const ICONES: Record<string, React.ComponentType<{ className?: string }>> = {
  smartphone: Smartphone, battery: Battery, camera: Camera, "scan-face": ScanFace, aperture: Aperture, plug: Plug,
  layers: Layers, "volume-2": Volume2, ear: Ear, "toggle-right": ToggleRight, droplets: Droplets, cpu: Cpu,
};

export type DemandeRdv = { modele: string; reparation: string; qualite?: string; prix?: number | null };

/** Prix minimum affichable d'une réparation (pour « dès … ») */
function prixMin(p: PrixReparation | undefined): number | null | undefined {
  if (p === undefined) return undefined;
  if (p === null) return null;
  if (typeof p === "number") return p;
  return Math.min(...Object.values(p));
}

/** Regroupe les modèles par génération pour la liste déroulante */
function generation(nom: string) {
  const m = nom.match(/iPhone (\d+|X[SR]?|SE|Air)/);
  if (!m) return "Autres";
  if (m[1] === "SE") return "iPhone SE";
  if (m[1].startsWith("X")) return "iPhone X / XS / XR";
  if (m[1] === "Air") return "iPhone Air";
  return `iPhone ${m[1]}`;
}

export function Simulateur({
  tarifs,
  compact = false,
  garantieMois,
}: {
  tarifs: Tarifs;
  compact?: boolean;
  garantieMois: number;
}) {
  const marques = tarifs.marques;
  const [marqueId, setMarqueId] = useState(marques[0]?.id ?? "");
  const marque = marques.find((m) => m.id === marqueId);
  const [modeleId, setModeleId] = useState("");
  const modele = marque?.modeles.find((m) => m.id === modeleId);
  const [repId, setRepId] = useState("");
  const [qualite, setQualite] = useState<string>("");
  // Masque le résumé mobile quand le bloc « Votre estimation » ou la section simulateur n'est pas concerné
  const refEstimation = useRef<HTMLElement>(null);
  const [estimationVisible, setEstimationVisible] = useState(false);
  useEffect(() => {
    const el = refEstimation.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setEstimationVisible(e.isIntersecting), { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [compact]);

  const groupesMap = new Map<string, { id: string; nom: string }[]>();
  for (const m of marque?.modeles ?? []) {
    const k = generation(m.nom);
    groupesMap.set(k, [...(groupesMap.get(k) ?? []), m]);
  }
  const groupes = [...groupesMap.entries()];

  const reparations = Object.entries(tarifs.reparations).filter(([id]) => !modele || modele.prix[id] !== undefined);
  const prixBrut = modele && repId ? modele.prix[repId] : undefined;
  const qualites = prixBrut && typeof prixBrut === "object" ? Object.entries(prixBrut) : [];
  const qualiteChoisie = qualites.length > 0 ? qualite || qualites[0][0] : undefined;
  const prixFinal: number | null | undefined =
    prixBrut === undefined ? undefined : prixBrut === null ? null : typeof prixBrut === "number" ? prixBrut : prixBrut[qualiteChoisie!];
  const rep = repId ? tarifs.reparations[repId] : undefined;

  const demanderRdv = () => {
    if (!modele || !rep) return;
    const detail: DemandeRdv = { modele: modele.nom, reparation: rep.nom, qualite: qualiteChoisie, prix: prixFinal };
    window.dispatchEvent(new CustomEvent<DemandeRdv>("gcs:rdv", { detail }));
    document.getElementById("rendez-vous")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const lienRdv =
    modele && rep
      ? `/reparation-telephone-montpellier?modele=${encodeURIComponent(modele.nom)}&reparation=${encodeURIComponent(rep.nom)}${qualiteChoisie ? `&qualite=${encodeURIComponent(qualiteChoisie)}` : ""}#rendez-vous`
      : "/reparation-telephone-montpellier#simulateur";

  /* ---------- Version compacte (page d'accueil) ---------- */
  if (compact) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white p-5 text-ink shadow-pop sm:p-7">
        <p className="flex items-center gap-2 font-display text-lg font-semibold">
          <Wrench className="size-5 text-brand" aria-hidden /> Combien coûte ma réparation ?
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sim-c-modele" className="field-label">Mon iPhone</label>
            <select id="sim-c-modele" className="field" value={modeleId} onChange={(e) => (setModeleId(e.target.value), setQualite(""))}>
              <option value="">Choisir le modèle…</option>
              {groupes.map(([g, ms]) => (
                <optgroup key={g} label={g}>
                  {ms.map((m) => <option key={m.id} value={m.id}>{m.nom}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sim-c-rep" className="field-label">La panne</label>
            <select id="sim-c-rep" className="field" value={repId} onChange={(e) => (setRepId(e.target.value), setQualite(""))} disabled={!modele}>
              <option value="">{modele ? "Choisir la réparation…" : "Choisissez d'abord le modèle"}</option>
              {reparations.map(([id, r]) => <option key={id} value={id}>{r.nom}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-surface p-4 sm:flex-row sm:items-center sm:justify-between" aria-live="polite">
          <div>
            <p className="text-sm text-muted">{modele && rep ? `${rep.nom} · ${modele.nom}` : "Prix TTC, pièce et main-d'œuvre incluses"}</p>
            <p className="font-display text-3xl font-bold">
              {prixFinal === undefined ? "— €" : prixFinal === null ? "Sur devis" : qualites.length > 1 ? `dès ${prixCourt(Math.min(...qualites.map((q) => q[1])))}` : prixCourt(prixFinal)}
            </p>
          </div>
          <Link href={lienRdv} className="btn-accent">
            {modele && rep ? "Réserver" : "Voir tous les tarifs"}
          </Link>
        </div>
      </div>
    );
  }

  /* ---------- Version complète (page Réparation) ---------- */
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
      <div className="space-y-8">
        {/* Étape 1 : marque */}
        <fieldset>
          <legend className="flex items-center gap-3 font-display text-lg font-semibold">
            <span className="grid size-8 place-items-center rounded-full bg-ink text-sm text-white">1</span> Marque
          </legend>
          <div className="mt-4 flex flex-wrap gap-2">
            {marques.map((m) => (
              <button
                key={m.id}
                type="button"
                disabled={m.bientot || m.modeles.length === 0}
                onClick={() => (setMarqueId(m.id), setModeleId(""), setRepId(""))}
                aria-pressed={marqueId === m.id}
                className={`min-h-12 rounded-full border px-5 text-sm font-semibold transition-colors ${marqueId === m.id ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"} disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {m.nom}
                {(m.bientot || m.modeles.length === 0) && <span className="ml-2 text-xs font-medium">bientôt</span>}
              </button>
            ))}
          </div>
          {marques.some((m) => m.bientot) && (
            <p className="mt-2 text-sm text-muted">
              Samsung, Xiaomi, Huawei… : nous les réparons déjà ! Demandez votre devis gratuit en boutique ou via le formulaire.
            </p>
          )}
        </fieldset>

        {/* Étape 2 : modèle */}
        <fieldset>
          <legend className="flex items-center gap-3 font-display text-lg font-semibold">
            <span className="grid size-8 place-items-center rounded-full bg-ink text-sm text-white">2</span> Modèle
          </legend>
          <div className="mt-4 max-w-md">
            <label htmlFor="sim-modele" className="sr-only">Modèle de téléphone</label>
            <select
              id="sim-modele"
              className="field"
              value={modeleId}
              onChange={(e) => (setModeleId(e.target.value), setQualite(""), setRepId((r) => (r && marque?.modeles.find((m) => m.id === e.target.value)?.prix[r] !== undefined ? r : "")))}
            >
              <option value="">Choisir votre {marque?.nom === "Apple" ? "iPhone" : "modèle"}…</option>
              {groupes.map(([g, ms]) => (
                <optgroup key={g} label={g}>
                  {ms.map((m) => <option key={m.id} value={m.id}>{m.nom}</option>)}
                </optgroup>
              ))}
            </select>
            <p className="field-hint">Astuce : Réglages › Général › Informations › Nom du modèle.</p>
          </div>
        </fieldset>

        {/* Étape 3 : réparation */}
        <fieldset>
          <legend className="flex items-center gap-3 font-display text-lg font-semibold">
            <span className="grid size-8 place-items-center rounded-full bg-ink text-sm text-white">3</span> Pièce à remplacer
          </legend>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {reparations.map(([id, r]) => {
              const Icone = ICONES[r.icone] ?? Wrench;
              const pm = modele ? prixMin(modele.prix[id]) : undefined;
              const choisi = repId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => (setRepId(id), setQualite(""))}
                  aria-pressed={choisi}
                  className={`group flex min-h-20 items-start gap-3 rounded-2xl border p-4 text-left transition-[border-color,box-shadow,background-color] ${choisi ? "border-brand bg-brand-soft ring-2 ring-brand" : "border-line bg-white hover:border-ink"}`}
                >
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${choisi ? "bg-brand text-white" : "bg-surface text-ink"}`}>
                    <Icone className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold">{r.nom}</span>
                      {modele && (
                        <span className="shrink-0 text-sm font-semibold text-brand-strong">
                          {pm === null ? "Devis" : pm !== undefined ? (typeof modele.prix[id] === "object" ? `dès ${prixCourt(pm)}` : prixCourt(pm)) : ""}
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-muted">{r.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      {/* Résumé collant sur mobile : le prix reste visible sans faire défiler la liste */}
      {modele && rep && !estimationVisible && (
        <div className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 flex items-center justify-between gap-3 rounded-2xl bg-ink p-3 pl-4 text-white shadow-pop lg:hidden">
          <div className="min-w-0">
            <p className="truncate text-xs text-white/70">{rep.nom} · {modele.nom}</p>
            <p className="font-display text-2xl font-bold leading-tight">
              {prixFinal === undefined ? "— €" : prixFinal === null ? "Sur devis" : prixCourt(prixFinal)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => document.getElementById("estimation")?.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="btn-accent btn-sm shrink-0"
          >
            {qualites.length > 1 ? "Choisir la qualité" : "Réserver"}
          </button>
        </div>
      )}

      {/* Résultat */}
      <aside ref={refEstimation} id="estimation" className="scroll-mt-24 lg:sticky lg:top-24" aria-live="polite" aria-label="Votre estimation">
        <div className="overflow-hidden rounded-3xl bg-ink text-white shadow-pop">
          <div className="p-6">
            <p className="text-sm text-white/60">Votre estimation</p>
            <p className="mt-1 font-display text-lg font-semibold">
              {modele ? modele.nom : "Choisissez un modèle"}
            </p>
            <p className="text-white/80">{rep ? rep.nom : "et une réparation"}</p>

            {qualites.length > 1 && (
              <fieldset className="mt-5">
                <legend className="mb-2 text-sm font-semibold">Qualité de la pièce</legend>
                <div className="grid gap-2">
                  {qualites.map(([q, p]) => (
                    <label key={q} className={`flex min-h-12 cursor-pointer items-center justify-between rounded-xl border px-4 py-2 text-sm transition-colors ${qualiteChoisie === q ? "border-cyan bg-white/10" : "border-white/15 hover:border-white/40"}`}>
                      <span className="flex items-center gap-2">
                        <input type="radio" name="qualite" value={q} checked={qualiteChoisie === q} onChange={() => setQualite(q)} className="accent-cyan" />
                        {q}
                      </span>
                      <span className="font-semibold">{prixCourt(p)}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs text-white/55">
                  « Origine » : pièce d&apos;origine constructeur ou équivalente. « Compatible » : pièce neuve de qualité, non d&apos;origine. Détails dans nos conditions de réparation.
                </p>
              </fieldset>
            )}

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-sm text-white/60">Prix TTC pièce + main-d&apos;œuvre</p>
              <p className="font-display text-5xl font-bold tracking-tight">
                {prixFinal === undefined ? "— €" : prixFinal === null ? "Sur devis" : prixCourt(prixFinal)}
              </p>
              {prixFinal === null && <p className="mt-1 text-sm text-white/70">Diagnostic gratuit en boutique, devis immédiat sans engagement.</p>}
            </div>
            {rep && (
              <ul className="mt-5 space-y-2 text-sm text-white/80">
                <li className="flex items-center gap-2"><Clock className="size-4 text-cyan" aria-hidden /> Durée : {rep.duree}</li>
                <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-cyan" aria-hidden /> Garantie {garantieMois} mois pièces et main-d&apos;œuvre</li>
                <li className="flex items-center gap-2"><Check className="size-4 text-cyan" aria-hidden /> Diagnostic gratuit, sans engagement</li>
              </ul>
            )}
          </div>
          <div className="space-y-2 bg-white/5 p-4">
            <button type="button" onClick={demanderRdv} disabled={!modele || !rep} className="btn-accent w-full">
              <CalendarCheck className="size-5" aria-hidden /> Réserver cette réparation
            </button>
            <p className="text-center text-xs text-white/55">Sans rendez-vous aussi, aux horaires d&apos;ouverture.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
