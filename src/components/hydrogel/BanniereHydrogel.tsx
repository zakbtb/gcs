import Link from "next/link";
import { Sparkles } from "lucide-react";
import { hydrogel } from "@/config/entreprise";
import { prix } from "@/lib/format";

/** Bannière promo de la protection hydrogel (haut de l'accueil et de la boutique). */
export function BanniereHydrogel() {
  return (
    <Link
      href="/boutique/protection-hydrogel"
      className="group block bg-brand text-white"
      aria-label="Promo protection d'écran hydrogel : voir l'offre"
    >
      <div className="container-x flex flex-wrap items-center gap-x-4 gap-y-2 py-3 text-sm sm:text-[0.95rem]">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-bold tracking-wide text-ink">
          <Sparkles className="size-3.5" aria-hidden /> PROMO
        </span>
        <span className="font-semibold">Protection d&apos;écran hydrogel, découpée sur mesure</span>
        <span className="flex flex-wrap gap-x-4 gap-y-1">
          {hydrogel.types.map((t) => (
            <span key={t.id} className="whitespace-nowrap">
              {t.nom} <strong className="font-display text-base">{prix(t.prix)}</strong>
              {hydrogel.afficherPrixBarre && <span className="ml-1.5 text-white/65 line-through">{prix(t.prixBarre)}</span>}
            </span>
          ))}
        </span>
        <span className="ml-auto hidden font-semibold underline-offset-4 group-hover:underline sm:inline">Choisir mon modèle →</span>
      </div>
    </Link>
  );
}
