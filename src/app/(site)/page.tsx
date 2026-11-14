import Link from "next/link";
import {
  ArrowRight, BadgeCheck, Clock, ShieldCheck, Smartphone, Battery, Droplets, Unlock, Database,
  Home as HomeIcon, Stethoscope, Gamepad2, Laptop, Store, RefreshCcw, Code2,
} from "lucide-react";
import { VisuelHero } from "@/components/accueil/VisuelHero";
import { Simulateur } from "@/components/reparation/Simulateur";
import { CarteProduit } from "@/components/boutique/CarteProduit";
import { IconeService } from "@/components/services/IconeService";
import { Accordeon } from "@/components/ui/Accordeon";
import { EnTeteSection } from "@/components/ui/Section";
import { JsonLd } from "@/components/ui/JsonLd";
import { StatutOuverture } from "@/components/ui/StatutOuverture";
import { Val } from "@/components/ui/Val";
import { boutique, entreprise, prixVitrine, servicesProximite } from "@/config/entreprise";
import { getTarifs } from "@/lib/tarifs";
import { getCatalogue } from "@/lib/produits";
import { faqJsonLd, meta } from "@/lib/seo";
import { prixCourt } from "@/lib/format";
import { horairesSemaine, plagesTexte } from "@/lib/horaires";

export const dynamic = "force-dynamic";

export const metadata = meta({
  titre: "Réparation de téléphone, accessoires et smartphones reconditionnés à Montpellier",
  description:
    "GCS à Montpellier : réparation de smartphones, consoles et PC dès 30 min, diagnostic gratuit, accessoires, smartphones reconditionnés, et services du quotidien (carte grise, recharge mobile, billets, transfert d'argent, point relais).",
  chemin: "/",
});

const faq = [
  { q: "Combien de temps dure la réparation d'un iPhone ?", r: "La plupart des réparations (écran, batterie, connecteur) sont réalisées en 20 à 45 minutes, pendant que vous patientez ou faites une course. Les interventions plus longues (désoxydation, consoles, PC) demandent 24 à 48 h." },
  { q: "Le diagnostic est-il vraiment gratuit ?", r: "Oui. Nous examinons votre appareil gratuitement et sans engagement, puis nous vous annonçons un prix ferme avant toute intervention." },
  { q: "Vos téléphones reconditionnés sont-ils garantis ?", r: `Oui : chaque téléphone est testé point par point, nettoyé et garanti ${boutique.garantieReconditionneMois} mois, en plus de la garantie légale de conformité.` },
  { q: "Pouvez-vous faire ma carte grise ?", r: "Oui, en boutique : changement de titulaire, changement d'adresse, duplicata, déclaration de cession… Passez avec vos documents, on vous dit tout de suite ce qu'il faut et combien ça coûte." },
  { q: "Mes données sont-elles en sécurité pendant la réparation ?", r: "Nous n'accédons à vos données que si c'est indispensable et avec votre accord. Nous vous conseillons toutefois de faire une sauvegarde avant toute réparation ; nous pouvons aussi la réaliser pour vous." },
];

const servicesRep = [
  { icon: Smartphone, nom: "Écran" },
  { icon: Battery, nom: "Batterie" },
  { icon: Gamepad2, nom: "Consoles" },
  { icon: Laptop, nom: "PC & tablettes" },
  { icon: Droplets, nom: "Désoxydation" },
  { icon: Unlock, nom: "Déblocage opérateur" },
  { icon: Database, nom: "Transfert de données" },
  { icon: HomeIcon, nom: "Réparation à domicile" },
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
            <p className="eyebrow text-cyan">Montpellier · Réparation · Accessoires · Téléphones</p>
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.04] sm:text-6xl lg:text-[4.25rem]">
              Votre téléphone réparé.
              <br />
              <span className="text-gradient">Et tout pour le garder.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/75 sm:text-xl">
              Réparation de smartphones, consoles et PC, accessoires, téléphones reconditionnés garantis.
              Et en plus : carte grise, recharge, billets, transfert d&apos;argent. Tout au même endroit.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/reparation-telephone-montpellier#simulateur" className="btn-accent">
                Estimer ma réparation <ArrowRight className="size-5" aria-hidden />
              </Link>
              <Link href="/boutique" className="btn-ghost-dark">
                Voir la boutique
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-white/80 sm:flex sm:flex-wrap">
              {[
                { i: Stethoscope, t: "Diagnostic gratuit" },
                { i: Clock, t: "Réparation dès 30 min" },
                { i: ShieldCheck, t: `Garantie ${boutique.garantieReparationMois} mois` },
                { i: Store, t: "Retrait gratuit en boutique" },
              ].map(({ i: I, t }) => (
                <li key={t} className="flex items-center gap-2"><I className="size-4 text-cyan" aria-hidden /> {t}</li>
              ))}
            </ul>
          </div>
          <VisuelHero />
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
              surtitre="Réparation smartphones, consoles & PC"
              titre="Écran cassé ? Batterie à plat ? On s'en occupe aujourd'hui."
              texte="Pièces de qualité, diagnostic gratuit, prix annoncé avant de toucher à votre appareil. Avec ou sans rendez-vous."
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

      {/* ============ BOUTIQUE ============ */}
      {vedettes.length > 0 && (
        <section className="py-20 sm:py-24" aria-labelledby="titre-boutique">
          <div className="container-x">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <EnTeteSection id="titre-boutique" surtitre="Boutique accessoires" titre="Coques, protections, chargeurs : tout pour votre téléphone" texte={`Commandez en ligne, faites-vous livrer ou retirez gratuitement en boutique.${boutique.livraison.gratuiteDes ? ` Livraison offerte dès ${prixCourt(boutique.livraison.gratuiteDes)}.` : ""}`} />
              <Link href="/boutique" className="btn-ghost shrink-0">Voir toute la boutique <ArrowRight className="size-4" aria-hidden /></Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {vedettes.map((p) => <CarteProduit key={p.id} produit={p} nomCategorie={nomCat[p.categorie]} />)}
            </div>
          </div>
        </section>
      )}

      {/* ============ TÉLÉPHONES RECONDITIONNÉS ============ */}
      <section className="pb-20 sm:pb-24" aria-labelledby="titre-reco">
        <div className="container-x">
          <div className="grid gap-8 overflow-hidden rounded-[2rem] bg-ink p-8 text-white sm:p-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <p className="eyebrow text-cyan">Téléphones</p>
              <h2 id="titre-reco" className="mt-4 text-3xl font-semibold sm:text-4xl">
                Smartphones reconditionnés{prixVitrine.reconditionnesDes != null && <><br /><span className="text-gradient">dès {prixCourt(prixVitrine.reconditionnesDes)}</span></>}
              </h2>
              <p className="mt-4 max-w-xl text-white/75">Testés point par point, nettoyés, garantis {boutique.garantieReconditionneMois} mois. On rachète aussi votre ancien téléphone, payé tout de suite.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/services#reconditionnes" className="btn-accent">Voir les téléphones <ArrowRight className="size-5" aria-hidden /></Link>
                <Link href="/services#estimation" className="btn-ghost-dark">Faire estimer mon téléphone</Link>
              </div>
            </div>
            <ul className="grid gap-3 text-sm">
              {[
                { i: RefreshCcw, t: "Rachat de votre ancien téléphone", d: "Estimation gratuite, paiement immédiat" },
                { i: ShieldCheck, t: `Garantie ${boutique.garantieReconditionneMois} mois`, d: "En plus de la garantie légale de conformité" },
                ...(prixVitrine.simPrepayee != null ? [{ i: Smartphone, t: `Cartes SIM prépayées dès ${prixCourt(prixVitrine.simPrepayee)}`, d: "Orange, Free, SFR, jusqu'à 200 Go" }] : []),
              ].map(({ i: I, t, d }) => (
                <li key={t} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <I className="mt-0.5 size-5 shrink-0 text-cyan" aria-hidden />
                  <span><span className="block font-semibold">{t}</span><span className="text-white/65">{d}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ SERVICES DU QUOTIDIEN ============ */}
      <section className="py-20 sm:py-24" aria-labelledby="titre-autres">
        <div className="container-x">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <EnTeteSection id="titre-autres" surtitre="Nouveau en boutique" titre="Carte grise, recharge, billets : vos démarches au même endroit" />
            <Link href="/services" className="btn-ghost shrink-0">Tous les services <ArrowRight className="size-4" aria-hidden /></Link>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {servicesProximite.map((sv) => (
              <li key={sv.id}>
                <Link href={`/services#${sv.id}`} className="group relative flex h-full flex-col gap-3 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-ink sm:p-5">
                  {sv.nouveau && <span className="absolute right-3 top-3 rounded-full bg-ink px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-cyan">Nouveau</span>}
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"><IconeService icone={sv.icone} className="size-5" /></span>
                  <span className="text-sm font-semibold sm:text-base">{sv.nom}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ ENGAGEMENTS ============ */}
      <section className="bg-white py-20 sm:py-24" aria-labelledby="titre-engagements">
        <div className="container-x">
          <EnTeteSection id="titre-engagements" centre surtitre="Pourquoi GCS" titre="Des engagements simples, tenus à chaque fois." />
          <ol className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              { n: "01", t: "Un prix annoncé avant d'intervenir", d: "Diagnostic gratuit, devis clair. Vous décidez en connaissance de cause, sans frais cachés." },
              { n: "02", t: "Rapide, sans sacrifier la qualité", d: "Pièces sélectionnées et testées, réparations courantes en moins d'une heure." },
              { n: "03", t: "Garanti et accompagné", d: `Réparations garanties ${boutique.garantieReparationMois} mois, téléphones reconditionnés garantis ${boutique.garantieReconditionneMois} mois. Une équipe que vous connaissez, joignable en boutique ou sur Snapchat.` },
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

      {/* ============ FAQ ============ */}
      <section className="bg-white py-20 sm:py-24" aria-labelledby="titre-faq">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <EnTeteSection id="titre-faq" surtitre="Questions fréquentes" titre="Vous vous posez une question ?" texte={<>Pas de réponse ici ? <Link href="/contact" className="font-semibold text-brand underline underline-offset-2">Contactez-nous</Link> ou écrivez-nous sur Snapchat ({entreprise.snapchat}).</>} />
          <Accordeon items={faq} />
        </div>
      </section>

      {/* ============ SITES WEB (discret) ============ */}
      <section className="pb-4">
        <div className="container-x">
          <Link href="/creation-site-web-montpellier" className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-ink sm:flex-row sm:items-center sm:justify-between">
            <span className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"><Code2 className="size-5" aria-hidden /></span>
              <span><span className="block font-semibold">Vous êtes un professionnel ?</span><span className="text-sm text-muted">On crée aussi des sites web pour les commerces et artisans de Montpellier.</span></span>
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand">En savoir plus <ArrowRight className="size-4" aria-hidden /></span>
          </Link>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <div className="relative grid gap-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand to-brand-strong p-8 text-white sm:p-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div className="bg-grid absolute inset-0 opacity-60 [mask-image:linear-gradient(to_left,black,transparent)]" aria-hidden />
            <div className="relative">
              <h2 className="text-3xl font-semibold sm:text-4xl">Un téléphone en panne ? Passez nous voir.</h2>
              <p className="mt-3 max-w-xl text-lg text-white/85">Diagnostic gratuit, avec ou sans rendez-vous. Le prix vous est annoncé avant toute intervention.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/reparation-telephone-montpellier#simulateur" className="btn bg-white text-ink hover:bg-accent">Estimer ma réparation</Link>
                <a href={`tel:${entreprise.telephoneLien}`} className="btn-ghost-dark">Appeler la boutique</a>
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
