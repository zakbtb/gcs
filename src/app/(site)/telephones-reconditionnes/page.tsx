import { Suspense } from "react";
import { CalendarClock, Store, ShieldCheck, Gift } from "lucide-react";
import { boutique } from "@/config/entreprise";
import { HeroPage } from "@/components/ui/Section";
import { CatalogueAppareils } from "@/components/boutique/CatalogueAppareils";
import { getCatalogue } from "@/lib/produits";
import { meta } from "@/lib/seo";
import { prixCourt } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = meta({
  titre: `iPhone reconditionnés et d'occasion à Montpellier – garantis ${boutique.garantieReconditionneMois} mois`,
  description:
    `iPhone et iPad reconditionnés ou d'occasion testés, garantis ${boutique.garantieReconditionneMois} mois. Retrait gratuit à la boutique GCS de Montpellier ou livraison, disponibles sous 2 à 4 jours ouvrés.`,
  chemin: "/telephones-reconditionnes",
});

const ETATS = [
  { t: "Reconditionné", d: "Testé et remis en état par un professionnel. Le grade indique l'aspect." },
  { t: "Fonctionnel", d: "Occasion testée et 100 % fonctionnelle. L'aspect dépend du grade (A, B ou C)." },
  { t: "Neuf", d: "Jamais utilisé, dans sa boîte d'origine." },
];
const GRADES = [
  { t: "Grade A", d: "Très bon état : micro-rayures à peine visibles." },
  { t: "Grade B", d: "Bon état : rayures légères visibles de près." },
  { t: "Grade C", d: "État correct : traces d'usage visibles, fonctionne parfaitement." },
  { t: "Au hasard", d: "Grade A, B ou C et couleur attribués selon l'arrivage, d'où le petit prix." },
];

export default async function TelephonesReconditionnes() {
  const { produits, categories } = await getCatalogue();
  const appareils = produits.filter((p) => p.actif && p.appareil);
  const cats = categories.filter((c) => appareils.some((p) => p.categorie === c.id));
  const min = appareils.length ? Math.min(...appareils.map((p) => p.prix)) : 0;
  return (
    <>
      <HeroPage
        ariane={[{ nom: "Accueil", href: "/" }, { nom: "Téléphones reconditionnés" }]}
        surtitre="Téléphones reconditionnés"
        titre={<>iPhone reconditionnés{min ? <> dès <span className="text-cyan">{prixCourt(min)}</span></> : null}</>}
        texte={`Des iPhone et iPad testés et garantis ${boutique.garantieReconditionneMois} mois, à prix juste, avec ${boutique.avantagesAppareil.join(" et ").toLowerCase()} offerts. Réservez sur WhatsApp ou par téléphone, puis récupérez-le en boutique à Montpellier ou faites-vous livrer.`}
      >
        <ul className="mt-10 hidden max-w-4xl grid-cols-2 gap-3 text-sm sm:grid lg:grid-cols-4">
          {[
            { i: ShieldCheck, t: `Garantie ${boutique.garantieReconditionneMois} mois` },
            { i: Gift, t: boutique.avantagesAppareil.join(" + ") },
            { i: CalendarClock, t: "Disponible sous 2 à 4 jours" },
            { i: Store, t: "Retrait gratuit à Montpellier" },
          ].map(({ i: I, t }) => (
            <li key={t} className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 font-medium">
              <I className="size-5 shrink-0 text-cyan" aria-hidden /> {t}
            </li>
          ))}
        </ul>
      </HeroPage>

      <section className="py-10 sm:py-14">
        <div className="container-x">
          <Suspense fallback={<p className="text-muted">Chargement…</p>}>
            <CatalogueAppareils produits={appareils} categories={cats} />
          </Suspense>
        </div>
      </section>

      <section className="bg-white py-16" aria-labelledby="t-etats">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <h2 id="t-etats" className="text-2xl font-semibold sm:text-3xl">États et grades, en clair</h2>
            <dl className="mt-6 space-y-4">
              {ETATS.map((e) => (
                <div key={e.t}>
                  <dt className="font-semibold">{e.t}</dt>
                  <dd className="text-muted">{e.d}</dd>
                </div>
              ))}
            </dl>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {GRADES.map((g) => (
                <div key={g.t} className="rounded-2xl bg-surface p-4">
                  <dt className="font-semibold">{g.t}</dt>
                  <dd className="mt-1 text-sm text-muted">{g.d}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Comment ça se passe</h2>
            <ol className="mt-6 space-y-4">
              {[
                ["Vous choisissez", "Réservez sur WhatsApp ou par téléphone depuis la fiche de l'appareil : rien à payer avant son arrivée."],
                ["Nous le commandons", "L'appareil est commandé sur demande : il est disponible sous 2 à 4 jours ouvrés."],
                ["Vous le récupérez", "Retrait gratuit à la boutique GCS, 5 rue des Catalpas à Montpellier, ou livraison à domicile."],
                ["Vous êtes couvert", `Garantie GCS de ${boutique.garantieReconditionneMois} mois sur l'appareil, en plus de la garantie légale de conformité. Pour un achat en ligne, 14 jours pour changer d'avis.`],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand font-bold text-white">{i + 1}</span>
                  <div>
                    <p className="font-semibold">{t}</p>
                    <p className="text-muted">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
