import type { ReactNode } from "react";
import { HeroPage } from "@/components/ui/Section";

/** Gabarit commun des pages légales : titre, date de mise à jour, sommaire, contenu. */
export function PageLegale({
  titre,
  intro,
  majLe,
  sommaire,
  children,
}: {
  titre: string;
  intro?: ReactNode;
  majLe: string;
  sommaire?: { id: string; titre: string }[];
  children: ReactNode;
}) {
  return (
    <>
      <HeroPage ariane={[{ nom: "Accueil", href: "/" }, { nom: titre }]} titre={titre} texte={intro} />
      <div className="container-x grid gap-10 py-12 sm:py-16 lg:grid-cols-[16rem_1fr]">
        {sommaire && (
          <nav aria-label="Sommaire" className="no-print hidden lg:block">
            <div className="sticky top-24">
              <p className="text-sm font-semibold uppercase tracking-wider text-subtle">Sommaire</p>
              <ol className="mt-3 space-y-1 text-sm">
                {sommaire.map((s) => (
                  <li key={s.id}><a href={`#${s.id}`} className="block rounded-lg px-2 py-1.5 text-muted hover:bg-white hover:text-ink">{s.titre}</a></li>
                ))}
              </ol>
            </div>
          </nav>
        )}
        <article className="prose-legal rounded-3xl bg-white p-6 ring-1 ring-line sm:p-10">
          <p className="text-sm text-muted">Dernière mise à jour : {majLe}</p>
          {children}
        </article>
      </div>
    </>
  );
}
