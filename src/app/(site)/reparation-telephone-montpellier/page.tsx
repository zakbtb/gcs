import Link from "next/link";
import {
  Smartphone, Battery, Gamepad2, Laptop, Droplets, Unlock, Stethoscope, Database, Layers, Home as HomeIcon,
  ShieldCheck, Clock, BadgeEuro, PackageCheck, ArrowRight,
} from "lucide-react";
import { HeroPage, EnTeteSection } from "@/components/ui/Section";
import { Simulateur } from "@/components/reparation/Simulateur";
import { FormulaireRdv } from "@/components/reparation/FormulaireRdv";
import { Accordeon } from "@/components/ui/Accordeon";
import { JsonLd } from "@/components/ui/JsonLd";
import { boutique, entreprise } from "@/config/entreprise";
import { getTarifs } from "@/lib/tarifs";
import { arianeJsonLd, faqJsonLd, meta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = meta({
  titre: "Réparation téléphone Montpellier – iPhone, écran, batterie en 30 min",
  description:
    "Réparation de téléphone à Montpellier : écran, batterie, caméra, connecteur, désoxydation, consoles et PC. Prix affichés en ligne, diagnostic gratuit, réparation iPhone en 30 min, garantie.",
  chemin: "/reparation-telephone-montpellier",
});

const services = [
  { icon: Smartphone, t: "Remplacement d'écran", d: "Vitre fissurée, tactile défaillant, écran noir : remplacement en 30 à 45 minutes, au choix en qualité compatible ou origine." },
  { icon: Battery, t: "Changement de batterie", d: "Autonomie en chute libre ou batterie gonflée ? Une batterie neuve et votre iPhone retrouve sa journée complète." },
  { icon: Gamepad2, t: "Réparation de consoles", d: "PS5, PS4, Xbox, Switch : manette qui dérive, port HDMI, surchauffe, lecteur. Diagnostic gratuit et devis avant intervention." },
  { icon: Laptop, t: "PC & tablettes", d: "Écran, batterie, clavier, lenteurs, nettoyage : on remet votre ordinateur ou votre tablette en forme." },
  { icon: Droplets, t: "Désoxydation", d: "Chute dans l'eau, café renversé : éteignez votre téléphone, ne le chargez pas et apportez-le vite. Nettoyage aux ultrasons." },
  { icon: Unlock, t: "Déblocage opérateur", d: "Libérez votre téléphone pour l'utiliser avec n'importe quelle carte SIM, dans le respect des conditions de l'opérateur." },
  { icon: Stethoscope, t: "Diagnostic gratuit", d: "Vous ne savez pas d'où vient la panne ? Nous testons votre appareil gratuitement et vous annonçons un prix ferme." },
  { icon: Database, t: "Transfert & récupération de données", d: "Transfert vers un nouveau téléphone, sauvegarde, récupération de photos et contacts sur appareil endommagé." },
  { icon: Layers, t: "Films hydrogel", d: "Protection découpée sur mesure pour votre modèle exact, posée en boutique en quelques minutes. Autocicatrisante." },
  { icon: HomeIcon, t: "Réparation à domicile", d: `Pas le temps de vous déplacer ? Nous intervenons chez vous ou sur votre lieu de travail (${entreprise.zoneDomicile}).` },
];

const faq = [
  { q: "Faut-il prendre rendez-vous ?", r: "Non, vous pouvez venir sans rendez-vous aux horaires d'ouverture. Réserver permet toutefois de garantir la disponibilité de la pièce et de réduire l'attente." },
  { q: "Quelle est la différence entre qualité « compatible » et « origine » ?", r: "Une pièce d'origine provient du fabricant (ou d'un fournisseur équivalent) et offre un rendu identique à l'écran initial. Une pièce compatible est neuve, testée, et offre un excellent rapport qualité-prix avec de légères différences possibles (luminosité, colorimétrie). Nous vous indiquons toujours la qualité utilisée, conformément à la loi." },
  { q: "Ma réparation est-elle garantie ?", r: `Oui : toutes nos réparations sont garanties ${boutique.garantieReparationMois} mois, pièces et main-d'œuvre, hors casse, oxydation ou intervention d'un tiers après notre passage.` },
  { q: "Vais-je perdre mes données ?", r: "Dans la grande majorité des réparations (écran, batterie, connecteur…), vos données restent intactes. Nous recommandons toutefois une sauvegarde préalable, que nous pouvons réaliser pour vous." },
  { q: "Réparez-vous les autres marques (Samsung, Xiaomi…) ?", r: "Oui, nous réparons la plupart des smartphones Android et tablettes. Les tarifs en ligne concernent les iPhone ; pour les autres modèles, demandez un devis gratuit." },
  { q: "Les prix affichés sont-ils définitifs ?", r: "Les prix du simulateur sont nos tarifs TTC pièce et main-d'œuvre incluses. Si le diagnostic révèle une autre panne, nous vous présentons un devis complémentaire avant toute intervention : rien n'est fait sans votre accord." },
];

export default async function PageReparation() {
  const tarifs = await getTarifs();
  const modeles = tarifs.marques.flatMap((m) => m.modeles.map((x) => x.nom));
  const reparations = Object.values(tarifs.reparations).map((r) => r.nom);
  const ariane = [{ nom: "Accueil", href: "/" }, { nom: "Réparation", href: "/reparation-telephone-montpellier" }];

  return (
    <>
      <JsonLd data={faqJsonLd(faq)} />
      <JsonLd data={arianeJsonLd(ariane)} />
      <HeroPage
        ariane={[{ nom: "Accueil", href: "/" }, { nom: "Réparation" }]}
        surtitre="Réparation de smartphones · Montpellier"
        titre="Réparation de téléphone à Montpellier, rapide et garantie"
        texte="Écran, batterie, caméra, connecteur, carte mère : nos techniciens réparent votre smartphone en boutique, souvent en moins d'une heure. Consultez le prix exact en 3 clics."
      >
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="#simulateur" className="btn-accent">Calculer le prix de ma réparation</Link>
          <Link href="#rendez-vous" className="btn-ghost-dark">Prendre rendez-vous</Link>
        </div>
        <ul className="mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { i: Stethoscope, t: "Diagnostic gratuit" },
            { i: Clock, t: "Dès 30 minutes" },
            { i: ShieldCheck, t: `Garantie ${boutique.garantieReparationMois} mois` },
            { i: BadgeEuro, t: "Prix affichés" },
          ].map(({ i: I, t }) => (
            <li key={t} className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-medium">
              <I className="size-5 shrink-0 text-cyan" aria-hidden /> {t}
            </li>
          ))}
        </ul>
      </HeroPage>

      <section id="simulateur" className="scroll-mt-20 py-16 sm:py-24" aria-labelledby="t-sim">
        <div className="container-x">
          <EnTeteSection id="t-sim" surtitre="Simulateur de prix" titre="Combien coûte ma réparation ?" texte="Sélectionnez votre modèle et la pièce à remplacer : le prix TTC s'affiche instantanément." />
          <div className="mt-12">
            <Simulateur tarifs={tarifs} garantieMois={boutique.garantieReparationMois} />
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24" aria-labelledby="t-services-rep">
        <div className="container-x">
          <EnTeteSection id="t-services-rep" surtitre="Nos réparations" titre="Toutes les pannes, une seule adresse" />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(({ icon: I, t, d }) => (
              <li key={t} className="flex gap-4 rounded-3xl border border-line bg-surface p-6">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-brand shadow-card"><I className="size-6" strokeWidth={1.75} aria-hidden /></span>
                <span>
                  <h3 className="text-lg font-semibold">{t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{d}</p>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 sm:py-24" aria-labelledby="t-pieces">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <EnTeteSection id="t-pieces" surtitre="Transparence" titre="Des pièces de qualité, et vous savez lesquelles" texte="Conformément au Code de la consommation, nous vous informons de la nature des pièces utilisées et vous proposons, lorsqu'elles sont disponibles, des pièces issues de l'économie circulaire." />
            <Link href="/conditions-reparation" className="btn-ghost mt-8">Conditions de réparation <ArrowRight className="size-4" aria-hidden /></Link>
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {[
              { t: "Pièce d'origine", d: "Fournie par le constructeur ou de qualité équivalente. Rendu et performances identiques." },
              { t: "Pièce compatible neuve", d: "Pièce neuve de fabricant tiers, testée avant pose. Le meilleur rapport qualité-prix." },
              { t: "Pièce de réemploi", d: "Pièce d'occasion ou reconditionnée, contrôlée, pour une réparation plus économique et écologique." },
              { t: "Toujours votre choix", d: "La qualité et le prix sont annoncés avant intervention et figurent sur votre facture." },
            ].map((x) => (
              <div key={x.t} className="card p-6">
                <dt className="flex items-center gap-2 font-semibold"><PackageCheck className="size-5 text-success" aria-hidden /> {x.t}</dt>
                <dd className="mt-2 text-sm text-muted">{x.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="rendez-vous" className="scroll-mt-20 bg-white py-20 sm:py-24" aria-labelledby="t-rdv">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <EnTeteSection id="t-rdv" surtitre="Rendez-vous" titre="Réservez votre réparation" texte="Indiquez votre modèle et vos disponibilités : nous vous confirmons le créneau par téléphone ou SMS et commandons la pièce si nécessaire." />
            <div className="mt-8 rounded-3xl bg-ink p-6 text-white">
              <p className="font-semibold">Plus rapide : écrivez-nous sur Snapchat</p>
              <p className="mt-1 text-white/70">Envoyez une photo de votre téléphone, on vous répond avec un prix.</p>
              <a href={`https://www.snapchat.com/add/${entreprise.snapchat}`} target="_blank" rel="noopener noreferrer" className="btn mt-4 bg-[#fffc00] text-ink hover:bg-yellow-300">
                Ajouter {entreprise.snapchat}
              </a>
            </div>
          </div>
          <div className="card p-6 sm:p-8">
            <FormulaireRdv modeles={[...modeles, "Autre modèle (préciser dans le message)"]} reparations={[...reparations, "Diagnostic / je ne sais pas"]} />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24" aria-labelledby="t-faq-rep">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <EnTeteSection id="t-faq-rep" surtitre="FAQ réparation" titre="Questions fréquentes" />
          <Accordeon items={faq} />
        </div>
      </section>
    </>
  );
}
