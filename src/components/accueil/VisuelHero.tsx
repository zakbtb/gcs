import { Check, ShieldCheck, Star } from "lucide-react";
import { prixVitrine } from "@/config/entreprise";
import { prixCourt } from "@/lib/format";

/** Illustration du hero : un iPhone réparé + étiquettes prix de la boutique (100 % CSS, aucune image à charger). */
export function VisuelHero() {
  const etiquettes = [
    prixVitrine.reconditionnesDes != null && { t: "Smartphones reconditionnés", p: `dès ${prixCourt(prixVitrine.reconditionnesDes)}` },
    prixVitrine.coquesDes != null && { t: "Coques", p: `dès ${prixCourt(prixVitrine.coquesDes)}` },
    prixVitrine.hydrogel != null && { t: "Film hydrogel posé", p: prixCourt(prixVitrine.hydrogel) },
  ].filter(Boolean) as { t: string; p: string }[];

  return (
    <div className="mx-auto flex w-full max-w-lg items-center justify-center gap-5" aria-hidden="true">
      {/* Téléphone réparé */}
      <div className="order-2 w-52 shrink-0 sm:w-60">
        <div className="flex aspect-[9/18] flex-col rounded-[2.4rem] border-[6px] border-ink-3 bg-ink p-2.5 shadow-pop">
          <div className="mx-auto mb-3 h-5 w-20 rounded-full bg-ink-3" />
          <div className="flex-1 space-y-4 rounded-[1.8rem] bg-gradient-to-b from-white to-brand-soft p-5 pt-8 text-ink">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">Réparation GCS</p>
            <p className="font-display text-2xl font-bold leading-tight">Écran remplacé</p>
            <div className="h-2 overflow-hidden rounded-full bg-line">
              <span className="block h-full w-full rounded-full bg-brand" />
            </div>
            <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-strong"><Check className="size-4" /> Prêt en 30 min</p>
            <p className="flex items-center gap-1.5 text-sm text-muted"><ShieldCheck className="size-4 text-brand" /> Garantie incluse</p>
            <div className="flex gap-1 pt-1">
              {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="size-4 fill-brand text-brand" />)}
            </div>
          </div>
        </div>
      </div>

      {/* Étiquettes prix */}
      <ul className="order-1 hidden space-y-3 sm:block">
        {etiquettes.map((e) => (
          <li key={e.t} className="rounded-2xl bg-accent px-4 py-2.5 text-ink shadow-pop odd:-rotate-2 even:rotate-2">
            <span className="block text-[0.7rem] font-semibold uppercase tracking-wide">{e.t}</span>
            <span className="font-display text-lg font-bold">{e.p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
