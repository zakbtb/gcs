import type { ReactNode } from "react";

export function EnTeteSection({
  surtitre,
  titre,
  texte,
  centre = false,
  sombre = false,
  id,
}: {
  surtitre?: string;
  titre: ReactNode;
  texte?: ReactNode;
  centre?: boolean;
  sombre?: boolean;
  id?: string;
}) {
  return (
    <div className={`max-w-2xl ${centre ? "mx-auto text-center" : ""}`}>
      {surtitre && <p className={`eyebrow ${sombre ? "text-cyan" : "text-brand"}`}>{surtitre}</p>}
      <h2 id={id} className={`mt-4 text-3xl font-semibold sm:text-4xl lg:text-[2.75rem] ${sombre ? "text-white" : "text-ink"}`}>
        {titre}
      </h2>
      {texte && <p className={`mt-4 text-lg ${sombre ? "text-white/70" : "text-muted"}`}>{texte}</p>}
    </div>
  );
}

export function FilAriane({ items }: { items: { nom: string; href?: string }[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1.5 text-current/70">
        {items.map((it, i) => (
          <li key={it.nom} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {it.href ? (
              <a href={it.href} className="underline-offset-2 hover:underline">{it.nom}</a>
            ) : (
              <span aria-current="page" className="font-medium text-current">{it.nom}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Bandeau de titre des pages intérieures */
export function HeroPage({
  surtitre,
  titre,
  texte,
  ariane,
  children,
}: {
  surtitre?: string;
  titre: ReactNode;
  texte?: ReactNode;
  ariane: { nom: string; href?: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" aria-hidden />
      <div className="absolute -right-32 -top-40 size-[28rem] rounded-full bg-brand/40 blur-3xl" aria-hidden />
      <div className="container-x relative py-14 sm:py-20">
        <div className="text-white/80"><FilAriane items={ariane} /></div>
        {surtitre && <p className="eyebrow mt-8 text-cyan">{surtitre}</p>}
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold sm:text-5xl lg:text-6xl">{titre}</h1>
        {texte && <p className="mt-5 max-w-2xl text-lg text-white/75">{texte}</p>}
        {children}
      </div>
    </section>
  );
}
