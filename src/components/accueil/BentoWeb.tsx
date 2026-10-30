import Link from "next/link";
import { ArrowUpRight, LayoutTemplate, ShoppingCart, RefreshCw, Wrench, MapPinned, Gauge } from "lucide-react";

/**
 * Grille « bento » des services web – inspirée du composant « Bento Feature Grid » de 21st.dev (@ln-dev7),
 * étendue en grille asymétrique avec une tuile vedette.
 */
const tuiles = [
  { icon: LayoutTemplate, titre: "Sites vitrines", texte: "Un site clair, rapide et beau qui présente votre activité et transforme les visiteurs en clients.", href: "/creation-site-web-montpellier#offres" },
  { icon: ShoppingCart, titre: "E-commerce", texte: "Vendez en ligne avec paiement sécurisé, gestion des stocks et retrait en boutique.", href: "/creation-site-web-montpellier#offres" },
  { icon: RefreshCw, titre: "Refonte", texte: "Votre site a vieilli ? On le modernise sans perdre votre référencement.", href: "/creation-site-web-montpellier#services" },
  { icon: MapPinned, titre: "Référencement local", texte: "Apparaissez quand on cherche votre métier à Montpellier : SEO et fiche Google.", href: "/creation-site-web-montpellier#services" },
  { icon: Wrench, titre: "Maintenance", texte: "Hébergement, sauvegardes, mises à jour, modifications : on s'occupe de tout.", href: "/creation-site-web-montpellier#maintenance" },
];

export function BentoWeb() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Tuile vedette */}
      <div className="relative overflow-hidden rounded-3xl bg-brand p-7 text-white md:col-span-2 lg:row-span-2 md:p-9">
        <div className="absolute -right-16 -top-16 size-64 rounded-full bg-cyan/30 blur-3xl" aria-hidden />
        <Gauge className="size-9" aria-hidden />
        <h3 className="mt-6 text-2xl font-semibold sm:text-3xl">Des sites pensés pour rapporter des clients, pas juste pour être jolis.</h3>
        <ul className="mt-6 space-y-3 text-white/90">
          {["Pensés mobile d'abord : là où se trouvent vos clients", "Chargement rapide et bonnes pratiques Google", "Conformes RGPD : mentions, cookies, CGV", "Vous restez propriétaire de votre site et de votre domaine"].map((t) => (
            <li key={t} className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan" aria-hidden />{t}</li>
          ))}
        </ul>
        <Link href="/creation-site-web-montpellier#devis" className="btn mt-8 bg-white text-ink hover:bg-accent">
          Demander mon devis gratuit
        </Link>
      </div>
      {tuiles.map(({ icon: Icon, titre, texte, href }, i) => (
        <Link
          key={titre}
          href={href}
          className={`group relative flex flex-col gap-4 rounded-3xl border border-line bg-white p-6 transition-[border-color,box-shadow] hover:border-ink hover:shadow-card ${i === 4 ? "md:col-span-2 lg:col-span-4 sm:flex-row sm:items-center" : ""}`}
        >
          <span className="flex items-center justify-between">
            <span className="grid size-11 place-items-center rounded-2xl bg-brand-soft text-brand">
              <Icon className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
            <ArrowUpRight className="size-5 text-subtle transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
          </span>
          <span>
            <span className="block font-display text-lg font-semibold">{titre}</span>
            <span className="mt-1 block text-sm leading-relaxed text-muted">{texte}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
