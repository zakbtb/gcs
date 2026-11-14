import { Suspense } from "react";
import Link from "next/link";
import { Truck, Store, ShieldCheck, RotateCcw } from "lucide-react";
import { HeroPage } from "@/components/ui/Section";
import { Catalogue } from "@/components/boutique/Catalogue";
import { AccessoiresEnBoutique } from "@/components/boutique/AccessoiresEnBoutique";
import { boutique } from "@/config/entreprise";
import { getCatalogue } from "@/lib/produits";
import { meta } from "@/lib/seo";
import { prixCourt } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = meta({
  titre: "Boutique accessoires téléphone à Montpellier – coques, chargeurs, verres trempés",
  description:
    "Accessoires de téléphone à Montpellier : coques, films hydrogel posés, chargeurs, câbles, batteries externes, écouteurs. Et des iPhone reconditionnés à commander en ligne.",
  chemin: "/boutique",
});

export default async function Boutique() {
  const { produits, categories } = await getCatalogue();
  // Les téléphones et tablettes ont leur propre page (/telephones-reconditionnes)
  const actifs = produits.filter((p) => p.actif && !p.appareil);
  const cats = categories.filter((c) => actifs.some((p) => p.categorie === c.id));
  return (
    <>
      <HeroPage
        ariane={[{ nom: "Accueil", href: "/" }, { nom: "Boutique" }]}
        surtitre={actifs.length ? "Boutique en ligne" : "Boutique"}
        titre="Accessoires pour smartphone"
        texte={
          actifs.length
            ? "Une sélection d'accessoires fiables, au juste prix. Commandez en ligne, faites-vous livrer ou retirez gratuitement en boutique à Montpellier."
            : "Coques, films hydrogel posés sur place, chargeurs, batteries externes : tout est en boutique à Montpellier. Nos iPhone reconditionnés se commandent en ligne."
        }
      >
        <ul className={`mt-10 hidden max-w-4xl grid-cols-2 gap-3 text-sm lg:grid-cols-4 ${actifs.length ? "sm:grid" : ""}`}>
          {[
            { i: Truck, t: boutique.livraison.gratuiteDes ? `Livraison offerte dès ${prixCourt(boutique.livraison.gratuiteDes)}` : "Livraison rapide" },
            { i: Store, t: "Retrait gratuit en boutique" },
            { i: ShieldCheck, t: "Paiement 100 % sécurisé" },
            { i: RotateCcw, t: "14 jours pour changer d'avis" },
          ].map(({ i: I, t }) => (
            <li key={t} className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 font-medium">
              <I className="size-5 shrink-0 text-cyan" aria-hidden /> {t}
            </li>
          ))}
        </ul>
      </HeroPage>
      <section className="py-10 sm:py-14">
        <div className="container-x">
          <Suspense fallback={<p className="text-muted">Chargement du catalogue…</p>}>
            <Link href="/telephones-reconditionnes" className="mb-8 flex flex-col gap-3 rounded-3xl bg-ink p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <span>
              <span className="block font-display text-xl font-semibold">Vous cherchez un téléphone ?</span>
              <span className="text-white/75">iPhone reconditionnés garantis {boutique.garantieReconditionneMois} mois, retrait à Montpellier.</span>
            </span>
            <span className="btn-accent shrink-0">Voir les iPhone</span>
          </Link>
          {actifs.length > 0 ? <Catalogue produits={actifs} categories={cats} /> : <AccessoiresEnBoutique />}
          </Suspense>
        </div>
      </section>
    </>
  );
}
