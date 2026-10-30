import { Check, Search, ShieldCheck, Star } from "lucide-react";

/** Illustration du hero : un site web en construction + un iPhone en réparation (100 % CSS/SVG, aucune image à charger). */
export function VisuelHero() {
  return (
    <div className="relative mx-auto w-full max-w-xl" aria-hidden="true">
      {/* Fenêtre navigateur */}
      <div className="relative rounded-2xl border border-white/15 bg-ink-2/90 shadow-pop backdrop-blur">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="size-2.5 rounded-full bg-rose-400/80" />
          <span className="size-2.5 rounded-full bg-amber-300/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-3 flex h-7 flex-1 items-center gap-2 rounded-full bg-white/5 px-3 text-[0.7rem] text-white/50">
            <ShieldCheck className="size-3.5 text-emerald-400" /> votre-entreprise.fr
          </span>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <span className="h-3 w-20 rounded-full bg-white/80" />
            <span className="flex gap-2">
              <span className="h-2 w-10 rounded-full bg-white/20" />
              <span className="h-2 w-10 rounded-full bg-white/20" />
              <span className="h-2 w-10 rounded-full bg-white/20" />
            </span>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-3 space-y-2.5 pt-2">
              <span className="block h-4 w-full rounded-md bg-gradient-to-r from-brand to-cyan" />
              <span className="block h-4 w-4/5 rounded-md bg-white/70" />
              <span className="block h-2 w-full rounded bg-white/15" />
              <span className="block h-2 w-11/12 rounded bg-white/15" />
              <span className="mt-3 inline-block h-7 w-24 rounded-full bg-accent" />
            </div>
            <div className="col-span-2 rounded-xl bg-gradient-to-br from-brand/60 via-indigo-500/40 to-cyan/40" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <span className="block size-6 rounded-lg bg-white/15" />
                <span className="block h-2 w-4/5 rounded bg-white/30" />
                <span className="block h-2 w-3/5 rounded bg-white/15" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badge Google */}
      <div className="absolute -left-4 top-1/3 hidden items-center gap-3 rounded-2xl border border-line bg-white p-3 pr-4 text-ink shadow-pop sm:flex">
        <span className="grid size-9 place-items-center rounded-xl bg-brand-soft"><Search className="size-4 text-brand" /></span>
        <span className="text-xs leading-tight">
          <span className="block font-semibold">1re page Google</span>
          <span className="text-muted">« … à Montpellier »</span>
        </span>
      </div>

      {/* iPhone en réparation */}
      <div className="absolute -bottom-10 -right-2 w-36 sm:-right-6 sm:w-44">
        <div className="rounded-[2rem] border-[5px] border-ink-3 bg-ink p-2 shadow-pop">
          <div className="mx-auto mb-2 h-4 w-14 rounded-full bg-ink-3" />
          <div className="space-y-2 rounded-[1.4rem] bg-gradient-to-b from-white to-brand-soft p-3 text-ink">
            <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-muted">Réparation</p>
            <p className="font-display text-sm font-bold leading-tight">Écran remplacé</p>
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <span className="block h-full w-full rounded-full bg-success" />
            </div>
            <p className="flex items-center gap-1 text-[0.65rem] font-semibold text-success"><Check className="size-3" /> Prêt en 30 min</p>
            <div className="flex gap-0.5 pt-1">
              {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="size-3 fill-accent text-accent" />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
