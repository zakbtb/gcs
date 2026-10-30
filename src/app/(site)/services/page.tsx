import Link from "next/link";
import { RefreshCcw, Headphones, Banknote, Package, CreditCard, FileText, Check, ArrowRight } from "lucide-react";
import { HeroPage, EnTeteSection } from "@/components/ui/Section";
import { FormulaireDemande } from "@/components/formulaires/FormulaireDemande";
import { Val } from "@/components/ui/Val";
import { boutique, entreprise } from "@/config/entreprise";
import { meta } from "@/lib/seo";

export const metadata = meta({
  titre: "Téléphones reconditionnés, rachat, transfert d'argent, point relais",
  description:
    "À Montpellier, GCS rachète et vend des téléphones reconditionnés garantis, propose accessoires, transfert d'argent, point relais colis, cartes PCS et aide administrative.",
  chemin: "/services",
});

export default function PageServices() {
  const blocs = [
    {
      id: "reconditionnes",
      icon: RefreshCcw,
      titre: "Rachat & vente de téléphones reconditionnés",
      texte: "Vendez votre ancien smartphone au meilleur prix, payé immédiatement, ou repartez avec un téléphone reconditionné testé, nettoyé et garanti.",
      points: [
        "Estimation gratuite en boutique ou en ligne",
        "Paiement immédiat (pièce d'identité obligatoire)",
        "Reconditionnés testés et contrôlés point par point",
        `Garantie ${boutique.garantieReconditionneMois} mois minimum sur les reconditionnés`,
        "Effacement sécurisé de vos données",
      ],
      lien: { href: "/conditions-reconditionnes", nom: "Conditions reconditionnés" },
    },
    {
      id: "accessoires",
      icon: Headphones,
      titre: "Accessoires",
      texte: "Coques, verres trempés, chargeurs, câbles, écouteurs, batteries externes : des accessoires sélectionnés pour leur qualité, disponibles en boutique et en ligne.",
      points: ["Pose de protection d'écran offerte", "Films hydrogel découpés sur mesure", "Retrait gratuit en boutique"],
      lien: { href: "/boutique", nom: "Voir la boutique en ligne" },
    },
    {
      id: "transfert-argent",
      icon: Banknote,
      titre: "Transfert d'argent",
      texte: "Envoyez et recevez de l'argent en France et à l'international, rapidement et en toute sécurité, en tant qu'agent d'un établissement agréé.",
      points: ["Envoi vers de nombreux pays", "Pièce d'identité en cours de validité obligatoire", <>Réseau partenaire : <Val v={entreprise.partenaireTransfertArgent} /></>],
    },
    {
      id: "point-relais",
      icon: Package,
      titre: "Point relais colis",
      texte: "Faites-vous livrer vos colis en boutique et récupérez-les quand vous le souhaitez, pendant nos horaires d'ouverture. Dépôt de colis possible également.",
      points: ["Retrait sur présentation du code et d'une pièce d'identité", "Dépôt de vos envois et retours", <>Réseau(x) : <Val v={entreprise.partenairePointRelais} /></>],
    },
    {
      id: "cartes-pcs",
      icon: CreditCard,
      titre: "Cartes PCS",
      texte: "Achat et rechargement de cartes prépayées PCS Mastercard : payez en magasin et en ligne sans compte bancaire.",
      points: ["Vente de cartes et recharges", "Pièce d'identité requise selon le montant", "Conseils pour l'activation"],
    },
    {
      id: "aide-administrative",
      icon: FileText,
      titre: "Aide administrative",
      texte: "Démarches en ligne, création de comptes, impressions, scans, envoi de documents : nous vous accompagnons dans vos formalités numériques du quotidien.",
      points: ["Accompagnement aux démarches en ligne", "Impression, scan et photocopie", "Création d'adresse e-mail et de comptes"],
    },
  ];

  return (
    <>
      <HeroPage
        ariane={[{ nom: "Accueil", href: "/" }, { nom: "Autres services" }]}
        surtitre="Services de proximité · Montpellier"
        titre="Bien plus qu'un réparateur : votre point services du quartier"
        texte="Téléphones reconditionnés, rachat, accessoires, transfert d'argent, colis, cartes prépayées, démarches : passez nous voir, on s'occupe de vous."
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
