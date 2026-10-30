import Link from "next/link";
import {
  ArrowRight, BadgeCheck, Clock, Gift, ShieldCheck, Smartphone, Battery, Cpu, Droplets, Unlock, Database,
  Layers, Home as HomeIcon, Stethoscope, RefreshCcw, Banknote, Package, CreditCard, FileText, Headphones,
} from "lucide-react";
import { VisuelHero } from "@/components/accueil/VisuelHero";
import { BentoWeb } from "@/components/accueil/BentoWeb";
import { Simulateur } from "@/components/reparation/Simulateur";
import { CarteProduit } from "@/components/boutique/CarteProduit";
import { Accordeon } from "@/components/ui/Accordeon";
import { EnTeteSection } from "@/components/ui/Section";
import { JsonLd } from "@/components/ui/JsonLd";
import { StatutOuverture } from "@/components/ui/StatutOuverture";
import { Val } from "@/components/ui/Val";
import { boutique, entreprise, offresWeb } from "@/config/entreprise";
import { getTarifs } from "@/lib/tarifs";
import { getCatalogue } from "@/lib/produits";
import { faqJsonLd, meta } from "@/lib/seo";
import { prixCourt } from "@/lib/format";
import { horairesSemaine, plagesTexte } from "@/lib/horaires";

export const dynamic = "force-dynamic";

export const metadata = meta({
  titre: "Réparation de téléphone & création de sites web à Montpellier",
  description:
    "GCS à Montpellier : réparation de smartphones en 30 min (écran, batterie, micro-soudure, désoxydation), diagnostic gratuit, et création de sites web vitrines et e-commerce pour les professionnels.",
  chemin: "/",
});

const faq = [
  { q: "Combien de temps dure la réparation d'un iPhone ?", r: "La plupart des réparations (écran, batterie, connecteur) sont réalisées en 20 à 45 minutes, pendant que vous patientez ou faites une course. Les interventions plus techniques (micro-soudure, désoxydation) demandent 24 à 48 h." },
  { q: "Le diagnostic est-il vraiment gratuit ?", r: "Oui. Nous examinons votre appareil gratuitement et sans engagement, puis nous vous annonçons un prix ferme avant toute intervention." },
  { q: "Combien coûte la création d'un site web ?", r: `Un site vitrine démarre à partir de ${prixCourt(offresWeb[0].prixDepuis ?? 0)} et une boutique en ligne à partir de ${prixCourt(offresWeb[1].prixDepuis ?? 0)}. Chaque projet fait l'objet d'un devis gratuit et détaillé, sans surprise.` },
  { q: "Je n'y connais rien au web, est-ce un problème ?", r: "Pas du tout : nous nous occupons de tout (nom de domaine, hébergement, textes, photos, référencement) et vous formons à la mise à jour de votre site. Vous gardez un interlocuteur unique, à Montpellier." },
  { q: "Mes données sont-elles en sécurité pendant la réparation ?", r: "Nous n'accédons à vos données que si c'est indispensable et avec votre accord. Nous vous conseillons toutefois de faire une sauvegarde avant toute réparation ; nous pouvons aussi la réaliser pour vous." },
];

const servicesRep = [
  { icon: Smartphone, nom: "Écran" },
  { icon: Battery, nom: "Batterie" },
  { icon: Cpu, nom: "Micro-soudure" },
  { icon: Droplets, nom: "Désoxydation" },
  { icon: Unlock, nom: "Déblocage opérateur" },
  { icon: Database, nom: "Récupération de données" },
  { icon: Layers, nom: "Films hydrogel" },
  { icon: HomeIcon, nom: "Réparation à domicile" },
];

const autres = [
  { icon: RefreshCcw, nom: "Rachat & vente de reconditionnés", href: "/services#reconditionnes" },
  { icon: Headphones, nom: "Accessoires", href: "/boutique" },
  { icon: Banknote, nom: "Transfert d'argent", href: "/services#transfert-argent" },
  { icon: Package, nom: "Point relais colis", href: "/services#point-relais" },
  { icon: CreditCard, nom: "Cartes PCS", href: "/services#cartes-pcs" },
  { icon: FileText, nom: "Aide administrative", href: "/services#aide-administrative" },
];

export default async function Accueil() {
  const [tarifs, catalogue] = await Promise.all([getTarifs(), getCatalogue()]);
  const vedettes = catalogue.produits.filter((p) => p.actif && p.misEnAvant).slice(0, 4);
  const nomCat = Object.fromEntries(catalogue.categories.map((c) => [c.id, c.nom]));

  return (
    <>
      <JsonLd data={faqJsonLd(faq.map((f) => ({ q: f.q, r: f.r })))} />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" aria-hidden />
        <div className="absolute -left-40 top-20 size-[30rem] rounded-full bg-brand/35 blur-[120px]" aria-hidden />
        <div className="absolute -right-20 bottom-0 size-[22rem] rounded-full bg-cyan/20 blur-[100px]" aria-hidden />
        <div className="container-x relative grid items-center gap-14 pb-24 pt-14 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:pb-32 lg:pt-24">
          <div className="animate-fade-up">
            <p className="eyebrow text-cyan">Montpellier · Réparation & création web</p>
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.04] sm:text-6xl lg:text-[4.25rem]">
              Votre téléphone réparé.
              <br />
              <span className="text-gradient">Votre entreprise en ligne.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75 sm:text-xl">
              GCS répare votre smartphone en 30 minutes et crée des sites web qui font venir des clients.
              Un seul interlocuteur, à deux pas de chez vous.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/creation-site-web-montpellier#devis" className="btn-accent">
                Demander un devis site web <ArrowRight className="size-5" aria-hidden />
              </Link>
              <Link href="/reparation-telephone-montpellier#simulateur" className="btn-ghost-dark">
                Estimer ma réparation
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-white/80 sm:flex sm:flex-wrap">
              {[
                { i: Stethoscope, t: "Diagnostic gratuit" },
                { i: Clock, t: "Réparation dès 30 min" },
                { i: ShieldCheck, t: `Garantie ${boutique.garantieReparationMois} mois` },
                { i: Gift, t: "Devis web gratuit sous 48 h" },
              ].map(({ i: I, t }) => (
                <li key={t} className="flex items-center gap-2"><I className="size-4 text-cyan" aria-hidden /> {t}</li>
              ))}
            </ul>
          </div>
          <VisuelHero />
        </div>
      </section>

      {/* ============ CRÉATION WEB (activité mise en avant) ============ */}
      <section className="relative py-20 sm:py-28" aria-labelledby="titre-web">
        <div className="container-x">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <EnTeteSection
              id="titre-web"
              surtitre="Création de sites web à Montpellier"
              titre={<>Votre site web professionnel, <span className="text-brand">clé en main.</span></>}
              texte="Artisans, commerçants, restaurateurs, indépendants : nous concevons des sites rapides, élégants et bien référencés, qui travaillent pour vous 24 h/24."
            />
            <Link href="/creation-site-web-montpellier" className="btn-ghost shrink-0">
              Découvrir nos offres web <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-12">
            <BentoWeb />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {offresWeb.map((o) => (
              <Link key={o.id} href="/creation-site-web-montpellier#offres" className={`flex items-center justify-between rounded-2xl px-5 py-4 transition-colors ${o.misEnAvant ? "bg-ink text-white hover:bg-ink-3" : "bg-white ring-1 ring-line hover:ring-ink"}`}>
                <span>
                  <span className="block font-semibold">{o.nom}</span>
                  <span className={`text-sm ${o.misEnAvant ? "text-white/70" : "text-muted"}`}>{o.delai}</span>
                </span>
                <span className="text-right">
                  <span className={`block text-xs ${o.misEnAvant ? "text-white/60" : "text-muted"}`}>{o.prixDepuis ? "à partir de" : ""}</span>
                  <span className="font-display text-xl font-bold">{o.prixDepuis ? prixCourt(o.prixDepuis) : "Sur devis"}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ RÉPARATION ============ */}
      <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-28" aria-labelledby="titre-rep">
        <div className="absolute right-0 top-0 size-[36rem] translate-x-1/3 -translate-y-1/3 rounded-full bg-brand/30 blur-[120px]" aria-hidden />
        <div className="container-x relative grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <EnTeteSection
              id="titre-rep"
              sombre
              surtitre="Réparation de smartphones"
              titre="Écran cassé ? Batterie à plat ? On s'en occupe aujourd'hui."
              texte="Pièces de qualité, techniciens équipés pour la micro-soudure, prix affichés à l'avance. Avec ou sans rendez-vous."
            />
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {servicesRep.map(({ icon: I, nom }) => (
                <li key={nom} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium">
                  <I className="size-5 shrink-0 text-cyan" aria-hidden /> {nom}
                </li>
              ))}
            </ul>
            <Link href="/reparation-telephone-montpellier" className="btn-ghost-dark mt-8">
              Tous les détails réparation <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <Simulateur tarifs={tarifs} compact garantieMois={boutique.garantieReparationMois} />
        </div>
      </section>

      {/* ============ ENGAGEMENTS ============ */}
      <section className="py-20 sm:py-24" aria-labelledby="titre-engagements">
        <div className="container-x">
          <EnTeteSection id="titre-engagements" centre surtitre="Pourquoi GCS" titre="Des engagements simples, tenus à chaque fois." />
          <ol className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              { n: "01", t: "Un prix annoncé avant d'intervenir", d: "Diagnostic gratuit, devis clair. Vous décidez en connaissance de cause, sans frais cachés." },
              { n: "02", t: "Rapide, sans sacrifier la qualité", d: "Pièces sélectionnées et testées, réparations courantes en moins d'une heure, sites livrés dans les délais annoncés." },
              { n: "03", t: "Garanti et accompagné", d: `Réparations garanties ${boutique.garantieReparationMois} mois, sites maintenus et suivis. Un interlocuteur que vous connaissez, joignable en boutique ou sur Snapchat.` },
            ].map((e) => (
              <li key={e.n} className="card p-7">
                <span className="font-display text-4xl font-bold text-brand/25">{e.n}</span>
                <h3 className="mt-4 text-xl font-semibold">{e.t}</h3>
                <p className="mt-2 text-muted">{e.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ BOUTIQUE ============ */}
      {vedettes.length > 0 && (
        <section className="bg-white py-20 sm:py-24" aria-labelledby="titre-boutique">
          <div className="container-x">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <EnTeteSection id="titre-boutique" surtitre="Boutique en ligne" titre="Les accessoires indispensables" texte={`Commandez en ligne, faites-vous livrer ou retirez gratuitement en boutique.${boutique.livraison.gratuiteDes ? ` Livraison offerte dès ${prixCourt(boutique.livraison.gratuiteDes)}.` : ""}`} />
              <Link href="/boutique" className="btn-ghost shrink-0">Voir toute la boutique <ArrowRight className="size-4" aria-hidden /></Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {vedettes.map((p) => <CarteProduit key={p.id} produit={p} nomCategorie={nomCat[p.categorie]} />)}
            </div>
          </div>
        </section>
      )}

      {/* ============ AUTRES SERVICES ============ */}
      <section className="py-20 sm:py-24" aria-labelledby="titre-autres">
        <div className="container-x">
          <EnTeteSection id="titre-autres" surtitre="Et aussi, en boutique" titre="Tous vos services de proximité au même endroit" />
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {autres.map(({ icon: I, nom, href }) => (
              <li key={nom}>
                <Link href={href} className="group flex h-full items-center gap-4 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-ink sm:p-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong"><I className="size-5" aria-hidden /></span>
                  <span className="text-sm font-semibold sm:text-base">{nom}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="bg-white py-20 sm:py-24" aria-labelledby="titre-faq">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <EnTeteSection id="titre-faq" surtitre="Questions fréquentes" titre="Vous vous posez une question ?" texte={<>Pas de réponse ici ? <Link href="/contact" className="font-semibold text-brand underline underline-offset-2">Contactez-nous</Link> ou écrivez-nous sur Snapchat ({entreprise.snapchat}).</>} />
          <Accordeon items={faq} />
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <div className="relative grid gap-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand to-brand-strong p-8 text-white sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div className="bg-grid absolute inset-0 opacity-60 [mask-image:linear-gradient(to_left,black,transparent)]" aria-hidden />
            <div className="relative">
              <h2 className="text-3xl font-semibold sm:text-4xl">Prêt à lancer votre site web ?</h2>
              <p className="mt-3 max-w-xl text-lg text-white/85">Parlez-nous de votre projet : devis gratuit et personnalisé sous 48 h, sans engagement.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/creation-site-web-montpellier#devis" className="btn bg-white text-ink hover:bg-accent">Demander mon devis gratuit</Link>
                <Link href="/contact" className="btn-ghost-dark">Nous contacter</Link>
              </div>
            </div>
            <div className="relative rounded-2xl bg-ink/30 p-6 backdrop-blur">
              <p className="flex items-center gap-2 font-semibold"><BadgeCheck className="size-5 text-cyan" aria-hidden /> Boutique GCS</p>
              <p className="mt-2 text-sm text-white/80"><Val v={entreprise.adresse.rue} />, {entreprise.adresse.codePostal} {entreprise.adresse.ville}</p>
              <StatutOuverture className="mt-3 text-sm" />
              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                {horairesSemaine().map((h) => (
                  <div key={h.jour} className="contents">
                    <dt className="text-white/70">{h.nom}</dt>
                    <dd className="text-right">{plagesTexte(h.plages)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
