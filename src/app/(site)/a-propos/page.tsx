import Link from "next/link";
import { HeartHandshake, Leaf, MapPin, Sparkles, Star } from "lucide-react";
import { HeroPage, EnTeteSection } from "@/components/ui/Section";
import { entreprise } from "@/config/entreprise";
import { meta } from "@/lib/seo";

export const metadata = meta({
  titre: "À propos de GCS – Global Connect Services, Montpellier",
  description:
    "GCS (Global Connect Services) est une entreprise montpelliéraine de réparation de smartphones et de création de sites web. Découvrez notre histoire et nos valeurs.",
  chemin: "/a-propos",
});

export default function APropos() {
  return (
    <>
      <HeroPage
        ariane={[{ nom: "Accueil", href: "/" }, { nom: "À propos" }]}
        surtitre="Qui sommes-nous"
        titre="Connecter les gens, les appareils et les entreprises"
        texte={`${entreprise.nomCommercial}, c'est ${entreprise.nomComplet} : une équipe montpelliéraine passionnée de technologie, qui répare vos appareils et construit votre présence en ligne.`}
      />
      <section className="py-20 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5 text-lg leading-relaxed text-ink/85">
            <EnTeteSection surtitre="Notre histoire" titre="Une boutique de quartier, une expertise numérique" />
            <p>
              Tout a commencé avec une conviction simple : un smartphone cassé ne doit pas gâcher votre journée. Nous avons
              ouvert notre boutique à Montpellier pour proposer des réparations rapides, honnêtes et garanties, avec des
              prix affichés clairement.
            </p>
            <p>
              Au fil des échanges avec les commerçants et artisans du quartier, un autre besoin est apparu : beaucoup
              n&apos;avaient pas de site, ou un site qui ne leur apportait aucun client. Nous avons donc mis nos compétences
              techniques au service de leur visibilité, en créant des sites web modernes, rapides et bien référencés.
            </p>
            <p>
              Aujourd&apos;hui, {entreprise.nomCommercial} accompagne les particuliers comme les professionnels, avec la même
              exigence : un travail soigné, des explications claires et un vrai suivi.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: HeartHandshake, t: "Honnêteté", d: "Diagnostic gratuit, prix annoncés, aucune réparation inutile." },
              { icon: Sparkles, t: "Exigence", d: "Pièces testées, sites soignés dans les moindres détails." },
              { icon: Leaf, t: "Durabilité", d: "Réparer et reconditionner plutôt que jeter." },
              { icon: MapPin, t: "Proximité", d: "Une vraie boutique, un interlocuteur que vous connaissez." },
            ].map(({ icon: I, t, d }, i) => (
              <div key={t} className={`rounded-3xl p-6 ${i === 0 ? "bg-ink text-white" : i === 3 ? "bg-brand text-white" : "border border-line bg-white"}`}>
                <I className={`size-7 ${i === 0 || i === 3 ? "text-cyan" : "text-brand"}`} aria-hidden />
                <h3 className="mt-5 text-lg font-semibold">{t}</h3>
                <p className={`mt-1.5 text-sm ${i === 0 || i === 3 ? "text-white/75" : "text-muted"}`}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-20 sm:py-24">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-surface p-8">
            <h2 className="text-2xl font-semibold">Côté réparation</h2>
            <p className="mt-3 text-muted">Écrans, batteries, connecteurs, désoxydation, récupération de données : un atelier équipé pour traiter la grande majorité des pannes sur place.</p>
            <Link href="/reparation-telephone-montpellier" className="btn-dark mt-6">Nos réparations</Link>
          </div>
          <div className="rounded-3xl bg-ink p-8 text-white">
            <h2 className="text-2xl font-semibold">Côté web</h2>
            <p className="mt-3 text-white/75">Sites vitrines, e-commerce, refonte, référencement local, maintenance : nous construisons des outils qui travaillent pour votre entreprise, et nous restons à vos côtés après la mise en ligne.</p>
            <Link href="/creation-site-web-montpellier" className="btn-accent mt-6">Nos offres web</Link>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container-x text-center">
          <Star className="mx-auto size-8 text-brand" aria-hidden />
          <h2 className="mt-4 text-3xl font-semibold">Vous êtes client ? Votre avis compte</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">Partagez votre expérience sur Google : cela aide d&apos;autres Montpelliérains à nous trouver et nous permet de progresser.</p>
          {entreprise.googleAvis ? (
            <a href={entreprise.googleAvis} target="_blank" rel="noopener noreferrer" className="btn-accent mt-6">Laisser un avis Google</a>
          ) : (
            <Link href="/contact" className="btn-accent mt-6">Nous contacter</Link>
          )}
        </div>
      </section>
    </>
  );
}
