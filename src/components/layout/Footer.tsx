import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Val } from "@/components/ui/Val";
import { entreprise } from "@/config/entreprise";
import { horairesSemaine, plagesTexte } from "@/lib/horaires";
import { BoutonCookies } from "./BoutonCookies";

const colonnes = [
  {
    titre: "Réparation & boutique",
    liens: [
      { href: "/reparation-telephone-montpellier", nom: "Réparation smartphone, console, PC" },
      { href: "/reparation-telephone-montpellier#simulateur", nom: "Simulateur de prix" },
      { href: "/boutique", nom: "Boutique accessoires" },
      { href: "/telephones-reconditionnes", nom: "iPhone reconditionnés" },
    ],
  },
  {
    titre: "Services",
    liens: [
      { href: "/services#carte-grise", nom: "Carte grise" },
      { href: "/services#recharge-mobile", nom: "Recharge mobile" },
      { href: "/services#billets-avion", nom: "Voyages & billets" },
      { href: "/services#transfert-argent", nom: "Transfert d'argent" },
      { href: "/creation-site-web-montpellier", nom: "Création de sites web" },
    ],
  },
  {
    titre: "Informations légales",
    liens: [
      { href: "/mentions-legales", nom: "Mentions légales" },
      { href: "/confidentialite", nom: "Politique de confidentialité" },
      { href: "/cookies", nom: "Politique cookies" },
      { href: "/cgv", nom: "CGV boutique" },
      { href: "/cgv#retractation", nom: "Formulaire de rétractation" },
      { href: "/conditions-reparation", nom: "Conditions de réparation" },
      { href: "/conditions-reconditionnes", nom: "Conditions reconditionnés" },
      { href: "/conditions-sites-web", nom: "Conditions création de sites" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="no-print bg-ink pb-24 text-white/75 lg:pb-0">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div className="space-y-5">
          <Logo dark />
          <p className="max-w-sm text-sm leading-relaxed">
            Réparation de smartphones, consoles et PC, accessoires et téléphones reconditionnés à Montpellier. Et vos
            démarches du quotidien : carte grise, recharge, billets, transfert d&apos;argent.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden />
              <span>
                <Val v={entreprise.adresse.rue} />, {entreprise.adresse.codePostal} {entreprise.adresse.ville}
              </span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden />
              <a href={`tel:${entreprise.telephoneLien}`} className="hover:text-white"><Val v={entreprise.telephone} /></a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden />
              <a href={`mailto:${entreprise.email}`} className="break-all hover:text-white"><Val v={entreprise.email} /></a>
            </li>
            <li className="flex gap-3">
              <svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0 fill-cyan" aria-hidden>
                <path d="M12 2.2c2.6 0 4.9 1.5 5.4 4.5.2 1.1 0 2.4 0 3.4.4.2 1 .1 1.4-.1.5-.2 1 .3.8.8-.3.6-1.3.9-2 1.2-.3.1-.4.4-.3.7.7 1.6 2 2.9 3.6 3.4.4.1.5.6.1.9-.7.4-1.7.5-2.4.7-.2.3-.2.9-.6 1-.8.2-1.7-.3-2.9 0-1 .3-1.8 1.6-3.7 1.6s-2.7-1.3-3.7-1.6c-1.2-.3-2.1.2-2.9 0-.4-.1-.4-.7-.6-1-.7-.2-1.7-.3-2.4-.7-.4-.3-.3-.8.1-.9 1.6-.5 2.9-1.8 3.6-3.4.1-.3 0-.6-.3-.7-.7-.3-1.7-.6-2-1.2-.2-.5.3-1 .8-.8.4.2 1 .3 1.4.1 0-1-.2-2.3 0-3.4C7.1 3.7 9.4 2.2 12 2.2z" />
              </svg>
              <a href={`https://www.snapchat.com/add/${entreprise.snapchat}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Snapchat : <strong className="text-white">{entreprise.snapchat}</strong>
              </a>
            </li>
          </ul>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">
            <p className="mb-2 flex items-center gap-2 font-semibold text-white">
              <Clock className="size-4 text-cyan" aria-hidden /> Horaires
            </p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              {horairesSemaine().map((h) => (
                <div key={h.jour} className="contents">
                  <dt>{h.nom}</dt>
                  <dd className="text-right text-white/90">{plagesTexte(h.plages)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="grid gap-10 sm:grid-cols-3">
          {colonnes.map((c) => (
            <nav key={c.titre} aria-label={c.titre}>
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-white">{c.titre}</h2>
              <ul className="mt-4 space-y-1">
                {c.liens.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-block py-1.5 text-sm hover:text-white hover:underline hover:underline-offset-4">
                      {l.nom}
                    </Link>
                  </li>
                ))}
                {c.titre === "Informations légales" && (
                  <li>
                    <BoutonCookies />
                  </li>
                )}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {entreprise.nomCommercial} – {entreprise.nomComplet} · {entreprise.raisonSociale}. Tous droits réservés.
          </p>
          <p>Prix TTC · Paiement sécurisé · Site conforme RGPD</p>
        </div>
      </div>
    </footer>
  );
}
