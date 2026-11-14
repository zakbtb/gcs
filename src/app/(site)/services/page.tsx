import Link from "next/link";
import { RefreshCcw, Headphones, Check, ArrowRight } from "lucide-react";
import { IconeService } from "@/components/services/IconeService";
import { HeroPage, EnTeteSection } from "@/components/ui/Section";
import { FormulaireDemande } from "@/components/formulaires/FormulaireDemande";
import { boutique, prixVitrine, servicesProximite, type ServiceProximite } from "@/config/entreprise";
import { prixCourt } from "@/lib/format";
import { meta } from "@/lib/seo";

export const metadata = meta({
  titre: "Téléphones reconditionnés, carte grise, recharge, billets, transfert d'argent",
  description:
    "À Montpellier, GCS vend et rachète des téléphones reconditionnés garantis, et s'occupe de vos démarches : carte grise, recharge mobile, transfert de crédit, billets d'avion, bus et train, hôtels, location de voiture, transfert d'argent, point relais.",
  chemin: "/services",
});

const GROUPES: { id: ServiceProximite["groupe"]; surtitre: string; titre: string }[] = [
  { id: "demarches", surtitre: "Démarches & téléphonie", titre: "Carte grise, recharge, crédit : c'est fait en boutique" },
  { id: "voyages", surtitre: "Voyages & billets", titre: "Vols, hôtels, voiture, bus et train, réservés avec vous" },
  { id: "quotidien", surtitre: "Au quotidien", titre: "Argent, colis, cartes prépayées, papiers" },
];

export default function PageServices() {
  const blocs = [
    {
      id: "reconditionnes",
      icon: RefreshCcw,
      titre: "Rachat & vente de téléphones reconditionnés",
      texte: `Vendez votre ancien smartphone au meilleur prix, payé immédiatement, ou repartez avec un téléphone reconditionné testé, nettoyé et garanti${prixVitrine.reconditionnesDes != null ? `, dès ${prixCourt(prixVitrine.reconditionnesDes)}` : ""}.`,
      points: [
        "Estimation gratuite en boutique ou en ligne",
        "Paiement immédiat (pièce d'identité obligatoire)",
        "Reconditionnés testés et contrôlés point par point",
        `Garantie ${boutique.garantieReconditionneMois} mois minimum sur les reconditionnés`,
        "Effacement sécurisé de vos données",
      ],
      lien: { href: "/telephones-reconditionnes", nom: "Voir les iPhone reconditionnés" },
    },
    {
      id: "accessoires",
      icon: Headphones,
      titre: "Accessoires",
      texte: "Coques, verres trempés, chargeurs, câbles, écouteurs, batteries externes : des accessoires sélectionnés pour leur qualité, disponibles en boutique et en ligne.",
      points: [
        ...(prixVitrine.coquesDes != null ? [`Coques dès ${prixCourt(prixVitrine.coquesDes)}`] : []),
        ...(prixVitrine.hydrogel != null ? [`Film hydrogel découpé sur mesure et posé : ${prixCourt(prixVitrine.hydrogel)}${prixVitrine.hydrogelAntiEspion != null ? ` (anti-espion ${prixCourt(prixVitrine.hydrogelAntiEspion)})` : ""}`] : []),
        ...(prixVitrine.batteriesExternesDes != null ? [`Batteries externes dès ${prixCourt(prixVitrine.batteriesExternesDes)}`] : []),
        "Retrait gratuit en boutique",
      ],
      lien: { href: "/boutique", nom: "Voir la boutique en ligne" },
    },
  ];

  return (
    <>
      <HeroPage
        ariane={[{ nom: "Accueil", href: "/" }, { nom: "Téléphones & services" }]}
        surtitre="Téléphones & services · Montpellier"
        titre="Bien plus qu'un réparateur : votre point services du quartier"
        texte="Téléphones reconditionnés, carte grise, recharge, billets, voyages, transfert d'argent, colis : passez nous voir, on s'occupe de vous."
      />
      <section className="py-16 sm:py-24">
        <div className="container-x space-y-6">
          {blocs.map(({ id, icon: I, titre, texte, points, lien }, i) => (
            <article key={id} id={id} className="grid scroll-mt-24 gap-6 rounded-3xl border border-line bg-white p-6 sm:p-10 lg:grid-cols-[auto_1fr_1fr] lg:gap-10">
              <span className={`grid size-14 place-items-center rounded-2xl ${i % 2 ? "bg-accent-soft text-accent-strong" : "bg-brand-soft text-brand"}`}>
                <I className="size-7" aria-hidden />
              </span>
              <div>
                <h2 className="text-2xl font-semibold">{titre}</h2>
                <p className="mt-3 text-muted">{texte}</p>
                {lien && (
                  <Link href={lien.href} className="mt-5 inline-flex items-center gap-2 font-semibold text-brand hover:underline">
                    {lien.nom} <ArrowRight className="size-4" aria-hidden />
                  </Link>
                )}
              </div>
              <ul className="space-y-2.5">
                {points.map((p, k) => (
                  <li key={k} className="flex gap-3"><Check className="mt-0.5 size-5 shrink-0 text-success" aria-hidden /> <span>{p}</span></li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {GROUPES.map((g) => (
        <section key={g.id} className="pb-16 sm:pb-20" aria-labelledby={`t-${g.id}`}>
          <div className="container-x">
            <EnTeteSection id={`t-${g.id}`} surtitre={g.surtitre} titre={g.titre} />
            <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {servicesProximite.filter((sv) => sv.groupe === g.id).map((sv) => (
                <article key={sv.id} id={sv.id} className="relative scroll-mt-24 rounded-3xl border border-line bg-white p-6 sm:p-7">
                  {sv.nouveau && <span className="absolute right-5 top-5 rounded-full bg-ink px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-cyan">Nouveau</span>}
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand"><IconeService icone={sv.icone} className="size-6" /></span>
                  <h3 className="mt-5 text-xl font-semibold">{sv.nom}</h3>
                  <p className="mt-2 text-muted">{sv.texte}</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {sv.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5"><Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden /> <span>{pt}</span></li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section id="estimation" className="scroll-mt-20 bg-white py-20 sm:py-24" aria-labelledby="t-rachat">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <EnTeteSection id="t-rachat" surtitre="Rachat" titre="Faites estimer votre téléphone" texte="Décrivez votre appareil : nous vous envoyons une estimation indicative, confirmée après contrôle en boutique." />
          <div className="card p-6 sm:p-8">
            <FormulaireDemande
              type="rachat"
              libelleBouton="Recevoir mon estimation"
              libelleMessage="État de l'appareil"
              placeholderMessage="Ex. : rayures légères au dos, batterie à 86 %, boîte d'origine, débloqué."
              finalite="estimer la valeur de rachat de votre appareil"
              champs={[
                { nom: "modele", label: "Modèle", type: "text", requis: true, placeholder: "Ex. : iPhone 13, 128 Go" },
                { nom: "etat", label: "État général", type: "select", requis: true, options: ["Comme neuf", "Très bon état", "Bon état", "Écran ou dos fissuré", "Ne s'allume plus"] },
              ]}
            />
          </div>
        </div>
      </section>
    </>
  );
}
