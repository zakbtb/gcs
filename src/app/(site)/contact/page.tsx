import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { HeroPage } from "@/components/ui/Section";
import { FormulaireDemande } from "@/components/formulaires/FormulaireDemande";
import { Carte } from "@/components/ui/Carte";
import { StatutOuverture } from "@/components/ui/StatutOuverture";
import { Val } from "@/components/ui/Val";
import { entreprise } from "@/config/entreprise";
import { horairesSemaine, plagesTexte } from "@/lib/horaires";
import { meta } from "@/lib/seo";
import { estACompleter } from "@/lib/format";

export const metadata = meta({
  titre: "Contact – Boutique GCS à Montpellier (horaires, accès, Snapchat)",
  description:
    "Contactez GCS à Montpellier : formulaire, téléphone, Snapchat gcs34070, horaires d'ouverture et plan d'accès de la boutique de réparation et création web.",
  chemin: "/contact",
});

export default function Contact() {
  const adresse = `${estACompleter(entreprise.adresse.rue) ? "" : entreprise.adresse.rue + ", "}${entreprise.adresse.codePostal} ${entreprise.adresse.ville}`;
  return (
    <>
      <HeroPage
        ariane={[{ nom: "Accueil", href: "/" }, { nom: "Contact" }]}
        surtitre="Contact"
        titre="Parlons-en, en boutique ou en ligne"
        texte="Une question sur une réparation, un projet de site web, une commande ? Écrivez-nous, appelez-nous ou passez directement nous voir."
      />
      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-4">
            <div className="card p-6">
              <ul className="space-y-5">
                <li className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"><MapPin className="size-5" aria-hidden /></span>
                  <span>
                    <span className="block text-sm text-muted">Adresse</span>
                    <span className="font-semibold"><Val v={entreprise.adresse.rue} />, {entreprise.adresse.codePostal} {entreprise.adresse.ville}</span>
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"><Phone className="size-5" aria-hidden /></span>
                  <span>
                    <span className="block text-sm text-muted">Téléphone</span>
                    <a href={`tel:${entreprise.telephoneLien}`} className="font-semibold hover:text-brand"><Val v={entreprise.telephone} /></a>
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"><Mail className="size-5" aria-hidden /></span>
                  <span className="min-w-0">
                    <span className="block text-sm text-muted">E-mail</span>
                    <a href={`mailto:${entreprise.email}`} className="break-all font-semibold hover:text-brand"><Val v={entreprise.email} /></a>
                  </span>
                </li>
              </ul>
            </div>
            <a
              href={`https://www.snapchat.com/add/${entreprise.snapchat}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-3xl bg-[#fffc00] p-6 text-ink transition-transform hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="size-12 shrink-0" aria-hidden>
                <path fill="#fff" stroke="#0b1020" strokeWidth="1.2" d="M12 2.2c2.6 0 4.9 1.5 5.4 4.5.2 1.1 0 2.4 0 3.4.4.2 1 .1 1.4-.1.5-.2 1 .3.8.8-.3.6-1.3.9-2 1.2-.3.1-.4.4-.3.7.7 1.6 2 2.9 3.6 3.4.4.1.5.6.1.9-.7.4-1.7.5-2.4.7-.2.3-.2.9-.6 1-.8.2-1.7-.3-2.9 0-1 .3-1.8 1.6-3.7 1.6s-2.7-1.3-3.7-1.6c-1.2-.3-2.1.2-2.9 0-.4-.1-.4-.7-.6-1-.7-.2-1.7-.3-2.4-.7-.4-.3-.3-.8.1-.9 1.6-.5 2.9-1.8 3.6-3.4.1-.3 0-.6-.3-.7-.7-.3-1.7-.6-2-1.2-.2-.5.3-1 .8-.8.4.2 1 .3 1.4.1 0-1-.2-2.3 0-3.4C7.1 3.7 9.4 2.2 12 2.2z" />
              </svg>
              <span>
                <span className="block text-sm font-medium">Écrivez-nous sur Snapchat</span>
                <span className="font-display text-2xl font-bold">{entreprise.snapchat}</span>
                <span className="block text-sm">Envoyez une photo, on vous répond vite !</span>
              </span>
            </a>
            <div className="card p-6">
              <p className="flex items-center gap-2 font-semibold"><Clock className="size-5 text-brand" aria-hidden /> Horaires d&apos;ouverture</p>
              <StatutOuverture className="mt-2 text-sm font-medium text-muted" />
              <table className="mt-4 w-full text-sm">
                <caption className="sr-only">Horaires d&apos;ouverture de la boutique</caption>
                <tbody>
                  {horairesSemaine().map((h) => (
                    <tr key={h.jour} className="border-t border-line first:border-0">
                      <th scope="row" className="py-2.5 text-left font-medium">{h.nom}</th>
                      <td className={`py-2.5 text-right ${h.plages.length ? "" : "text-muted"}`}>{plagesTexte(h.plages)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">Envoyer un message</h2>
            <p className="mt-1 text-muted">Réponse sous 24 h ouvrées.</p>
            <div className="mt-6">
              <FormulaireDemande
                type="contact"
                finalite="répondre à votre message"
                champs={[
                  { nom: "sujet", label: "Sujet", type: "select", requis: true, options: ["Réparation", "Création de site web", "Commande boutique", "Rachat / reconditionné", "Autre"] },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="container-x mt-8">
          <h2 className="sr-only">Plan d&apos;accès</h2>
          <Carte adresse={`${adresse}, France`} />
        </div>
      </section>
    </>
  );
}
