import Link from "next/link";
import {
  ArrowRight, Check, LayoutTemplate, ShoppingCart, RefreshCw, Wrench, Search, MapPinned, Server, PenTool,
  MessagesSquare, Palette, Code2, Rocket, LineChart, Smartphone, Gauge, ShieldCheck, KeyRound,
} from "lucide-react";
import { HeroPage, EnTeteSection } from "@/components/ui/Section";
import { Accordeon } from "@/components/ui/Accordeon";
import { JsonLd } from "@/components/ui/JsonLd";
import { FormulaireDemande } from "@/components/formulaires/FormulaireDemande";
import { forfaitMaintenance, offresWeb, entreprise } from "@/config/entreprise";
import { arianeJsonLd, faqJsonLd, meta } from "@/lib/seo";
import { prixCourt } from "@/lib/format";

export const metadata = meta({
  titre: "Création de site web à Montpellier – vitrine, e-commerce, refonte",
  description:
    `Création de sites web à Montpellier pour artisans, commerçants et PME : site vitrine dès ${prixCourt(offresWeb[0].prixDepuis ?? 0)}, boutique en ligne, refonte, maintenance et référencement local Google. Devis gratuit sous 48 h.`,
  chemin: "/creation-site-web-montpellier",
});

const services = [
  { icon: LayoutTemplate, t: "Création de site vitrine", d: "Présentez votre activité, vos services et vos horaires avec un site moderne qui inspire confiance et génère des appels." },
  { icon: ShoppingCart, t: "Boutique en ligne (e-commerce)", d: "Catalogue, paiement par carte, gestion des stocks, livraison ou retrait : vendez sur internet en toute simplicité." },
  { icon: RefreshCw, t: "Refonte de site existant", d: "Design daté, site lent ou illisible sur mobile ? Nous le reconstruisons en conservant votre référencement acquis." },
  { icon: Search, t: "Référencement naturel (SEO)", d: "Structure technique, contenus optimisés, mots-clés locaux : soyez visible sur « votre métier + Montpellier »." },
  { icon: MapPinned, t: "Fiche Google Business Profile", d: "Création et optimisation de votre fiche Google Maps : horaires, photos, avis, catégories. Indispensable en local." },
  { icon: Wrench, t: "Maintenance & évolutions", d: "Mises à jour, sauvegardes, sécurité, petites modifications : votre site reste rapide, sûr et à jour." },
  { icon: Server, t: "Hébergement & nom de domaine", d: "Nous réservons votre adresse (.fr, .com), configurons l'hébergement, le HTTPS et vos adresses e-mail pro." },
  { icon: PenTool, t: "Identité & contenus", d: "Logo simple, choix des couleurs, rédaction des textes et mise en valeur de vos photos : un site cohérent avec votre image." },
];

const etapes = [
  { icon: MessagesSquare, t: "Échange & devis", d: "On discute de votre activité, de vos objectifs et de votre budget. Devis gratuit et détaillé sous 48 h." },
  { icon: Palette, t: "Maquette", d: "Nous vous présentons le design de votre page d'accueil. Vous validez ou demandez des ajustements." },
  { icon: Code2, t: "Développement", d: "Intégration des pages, des textes, des photos, des formulaires. Vous suivez l'avancement en temps réel." },
  { icon: Rocket, t: "Mise en ligne", d: "Tests sur mobile et ordinateur, référencement de base, mise en ligne sur votre nom de domaine." },
  { icon: LineChart, t: "Suivi", d: "Formation à la prise en main, puis maintenance et conseils pour faire grandir votre visibilité." },
];

const faq = [
  { q: "Combien de temps faut-il pour créer un site ?", r: "Comptez en général 2 à 3 semaines pour un site vitrine et 4 à 6 semaines pour une boutique en ligne, à partir du moment où nous disposons de vos contenus (textes, photos, logo)." },
  { q: "Serai-je propriétaire de mon site ?", r: "Oui. Une fois le site payé, vous êtes propriétaire de son contenu, de votre nom de domaine et de vos données. Vous êtes libre de changer de prestataire à tout moment ; nous vous remettons alors les accès et fichiers nécessaires." },
  { q: "Pourrai-je modifier mon site moi-même ?", r: "Oui, nous vous formons à la mise à jour de vos textes, photos et produits. Et si vous préférez ne pas y toucher, notre forfait maintenance inclut les petites modifications." },
  { q: "Mon site sera-t-il bien positionné sur Google ?", r: "Chaque site est livré avec les fondations d'un bon référencement : structure technique propre, rapidité, balises optimisées, données structurées et contenus ciblant votre zone. Personne ne peut garantir honnêtement une 1re place, mais nous mettons toutes les chances de votre côté et suivons vos résultats." },
  { q: "Le site sera-t-il conforme au RGPD ?", r: "Oui : mentions légales, politique de confidentialité, bandeau cookies conforme aux recommandations de la CNIL, formulaires avec mention d'information et, pour les boutiques, CGV et formulaire de rétractation." },
  { q: "Proposez-vous un paiement en plusieurs fois ?", r: "Oui, un acompte est demandé au lancement puis le solde à la mise en ligne. Un échelonnement peut être étudié selon le projet : parlons-en lors du devis." },
];

export default function PageWeb() {
  const ariane = [{ nom: "Accueil", href: "/" }, { nom: "Création de sites web", href: "/creation-site-web-montpellier" }];
  return (
    <>
      <JsonLd data={faqJsonLd(faq)} />
      <JsonLd data={arianeJsonLd(ariane)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Création de site web",
          name: "Création de sites web à Montpellier",
          provider: { "@id": `${entreprise.siteUrl}/#entreprise` },
          areaServed: { "@type": "City", name: "Montpellier" },
          offers: offresWeb
            .filter((o) => o.prixDepuis)
            .map((o) => ({ "@type": "Offer", name: o.nom, price: o.prixDepuis, priceCurrency: "EUR" })),
        }}
      />

      <HeroPage
        ariane={[{ nom: "Accueil", href: "/" }, { nom: "Création de sites web" }]}
        surtitre="Agence web de proximité · Montpellier"
        titre={<>Création de sites web à Montpellier qui <span className="text-gradient">font venir des clients</span></>}
        texte="Sites vitrines, boutiques en ligne, refonte, maintenance et référencement local : nous construisons votre présence en ligne de A à Z, avec un interlocuteur unique que vous pouvez venir voir en boutique."
      >
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link href="#devis" className="btn-accent">Demander mon devis gratuit <ArrowRight className="size-5" aria-hidden /></Link>
          <Link href="#offres" className="btn-ghost-dark">Voir les offres et tarifs</Link>
        </div>
        <ul className="mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { i: Smartphone, t: "100 % responsive" },
            { i: Gauge, t: "Rapide & optimisé SEO" },
            { i: ShieldCheck, t: "Conforme RGPD" },
            { i: KeyRound, t: "Vous êtes propriétaire" },
          ].map(({ i: I, t }) => (
            <li key={t} className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-medium">
              <I className="size-5 shrink-0 text-cyan" aria-hidden /> {t}
            </li>
          ))}
        </ul>
      </HeroPage>

      {/* Offres */}
      <section id="offres" className="scroll-mt-24 py-20 sm:py-28" aria-labelledby="t-offres">
        <div className="container-x">
          <EnTeteSection id="t-offres" centre surtitre="Offres & tarifs" titre="Une formule pour chaque ambition" texte="Des prix clairs « à partir de », puis un devis précis et gratuit selon vos besoins réels. Aucun frais caché." />
          <div className="mt-14 grid gap-5 lg:grid-cols-3 lg:items-stretch">
            {offresWeb.map((o) => (
              <article
                key={o.id}
                className={`relative flex flex-col rounded-3xl p-7 sm:p-8 ${o.misEnAvant ? "bg-ink text-white shadow-pop lg:-my-4 lg:py-12" : "border border-line bg-white"}`}
              >
                {o.misEnAvant && (
                  <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">Le plus demandé</span>
                )}
                <h3 className="text-2xl font-semibold">{o.nom}</h3>
                <p className={`mt-1 ${o.misEnAvant ? "text-white/70" : "text-muted"}`}>{o.accroche}</p>
                <p className="mt-6">
                  {o.prixDepuis ? (
                    <>
                      <span className={`block text-sm ${o.misEnAvant ? "text-white/60" : "text-muted"}`}>à partir de</span>
                      <span className="font-display text-5xl font-bold tracking-tight">{prixCourt(o.prixDepuis)}</span>
                      <span className={`ml-1 text-sm ${o.misEnAvant ? "text-white/60" : "text-muted"}`}>TTC</span>
                    </>
                  ) : (
                    <span className="font-display text-5xl font-bold tracking-tight">Sur devis</span>
                  )}
                </p>
                <p className={`mt-2 text-sm ${o.misEnAvant ? "text-cyan" : "text-brand-strong"}`}>Délai indicatif : {o.delai}</p>
                <ul className="mt-7 flex-1 space-y-3">
                  {o.inclus.map((x) => (
                    <li key={x} className="flex gap-3 text-[0.95rem]">
                      <Check className={`mt-0.5 size-5 shrink-0 ${o.misEnAvant ? "text-cyan" : "text-success"}`} aria-hidden /> {x}
                    </li>
                  ))}
                </ul>
                <Link href={`#devis`} className={`mt-8 ${o.misEnAvant ? "btn-accent" : "btn-dark"}`}>
                  Demander un devis
                </Link>
              </article>
            ))}
          </div>
          <div id="maintenance" className="mt-10 flex scroll-mt-24 flex-col gap-6 rounded-3xl border border-line bg-white p-7 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow text-brand">Option sérénité</p>
              <h3 className="mt-3 text-2xl font-semibold">Maintenance & hébergement : {prixCourt(forfaitMaintenance.prixMensuel)} TTC / mois</h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {forfaitMaintenance.inclus.map((x) => (
                  <li key={x} className="flex gap-2 text-muted"><Check className="mt-0.5 size-5 shrink-0 text-success" aria-hidden /> {x}</li>
                ))}
              </ul>
            </div>
            <Link href="#devis" className="btn-ghost shrink-0">J&apos;en parle lors du devis</Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="scroll-mt-24 bg-white py-20 sm:py-28" aria-labelledby="t-services">
        <div className="container-x">
          <EnTeteSection id="t-services" surtitre="Nos services web" titre="Tout ce qu'il faut pour réussir en ligne" texte="Nous gérons la technique pour que vous puissiez vous concentrer sur votre métier." />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map(({ icon: I, t, d }) => (
              <li key={t} className="rounded-3xl border border-line bg-surface p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-white text-brand shadow-card"><I className="size-6" strokeWidth={1.75} aria-hidden /></span>
                <h3 className="mt-5 text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Méthode */}
      <section className="relative overflow-hidden bg-ink py-20 text-white sm:py-28" aria-labelledby="t-methode">
        <div className="absolute -left-40 bottom-0 size-[30rem] rounded-full bg-brand/30 blur-[120px]" aria-hidden />
        <div className="container-x relative">
          <EnTeteSection id="t-methode" sombre surtitre="Notre méthode" titre="De l'idée à la mise en ligne, en 5 étapes" />
          <ol className="mt-14 grid gap-4 md:grid-cols-5">
            {etapes.map(({ icon: I, t, d }, i) => (
              <li key={t} className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <span className="font-display text-sm font-semibold text-cyan">Étape {i + 1}</span>
                <I className="mt-4 size-7 text-white" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pour qui */}
      <section className="py-20 sm:py-24" aria-labelledby="t-pourqui">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <EnTeteSection
            id="t-pourqui"
            surtitre="Pour qui ?"
            titre="Pour les pros de Montpellier qui veulent plus de clients"
            texte="Nous connaissons le tissu local et les habitudes de recherche de vos clients. Votre site parle leur langage et répond à leurs questions avant même qu'ils ne vous appellent."
          />
          <ul className="flex flex-wrap gap-2.5">
            {["Artisans du bâtiment", "Restaurants & snacks", "Coiffeurs & instituts", "Commerces de proximité", "Professions libérales", "Associations", "Auto-entrepreneurs", "Coachs & formateurs", "Garages", "Food-trucks", "Boutiques de mode", "Startups"].map((x) => (
              <li key={x} className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-medium">{x}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 sm:py-24" aria-labelledby="t-faq-web">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <EnTeteSection id="t-faq-web" surtitre="FAQ création de site" titre="Les réponses à vos questions" />
          <Accordeon items={faq} />
        </div>
      </section>

      {/* Devis */}
      <section id="devis" className="scroll-mt-20 py-20 sm:py-28" aria-labelledby="t-devis">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <EnTeteSection id="t-devis" surtitre="Devis gratuit" titre="Parlons de votre projet" texte="Décrivez votre besoin en quelques lignes : nous vous recontactons sous 48 h ouvrées avec des conseils et un devis détaillé, gratuit et sans engagement." />
            <ul className="mt-8 space-y-3">
              {["Réponse sous 48 h ouvrées", "Rendez-vous possible en boutique ou en visio", "Devis clair, poste par poste", "Aucun engagement"].map((x) => (
                <li key={x} className="flex gap-3 font-medium"><Check className="mt-0.5 size-5 text-success" aria-hidden /> {x}</li>
              ))}
            </ul>
          </div>
          <div className="card p-6 sm:p-8">
            <FormulaireDemande
              type="devis-web"
              libelleBouton="Recevoir mon devis gratuit"
              libelleMessage="Votre projet"
              placeholderMessage="Ex. : je suis plombier à Montpellier et je souhaite un site pour présenter mes services et recevoir des demandes d'intervention."
              finalite="établir votre devis et vous recontacter au sujet de votre projet web"
              champs={[
                { nom: "projet", label: "Type de projet", type: "select", requis: true, options: ["Site vitrine", "Boutique en ligne", "Refonte d'un site existant", "Maintenance / hébergement", "Référencement (SEO)", "Autre / je ne sais pas encore"] },
                { nom: "budget", label: "Budget envisagé", type: "select", options: ["Moins de 1 000 €", "1 000 € – 2 000 €", "2 000 € – 5 000 €", "Plus de 5 000 €", "À définir ensemble"] },
                { nom: "entreprise", label: "Entreprise / activité", type: "text", placeholder: "Ex. : Plomberie Martin" },
                { nom: "siteActuel", label: "Site actuel (s'il existe)", type: "text", placeholder: "www.exemple.fr" },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
