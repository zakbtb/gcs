import { Suspense } from "react";
import Link from "next/link";
import { Store, ShieldCheck, MessageCircle, CalendarClock, ArrowRight, Sparkles } from "lucide-react";
import { HeroPage } from "@/components/ui/Section";
import { Catalogue } from "@/components/boutique/Catalogue";
import { CatalogueAppareils } from "@/components/boutique/CatalogueAppareils";
import { AccessoiresEnBoutique } from "@/components/boutique/AccessoiresEnBoutique";
import { BanniereHydrogel } from "@/components/hydrogel/BanniereHydrogel";
import { boutique, hydrogel } from "@/config/entreprise";
import { getCatalogue } from "@/lib/produits";
import { meta } from "@/lib/seo";
import { prix, prixCourt } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata = meta({
  titre: "Boutique GCS Montpellier – iPhone reconditionnés, accessoires, protection hydrogel",
  description: `iPhone et iPad reconditionnés garantis ${boutique.garantieReconditionneMois} mois, chargeurs, câbles, écouteurs, batteries externes et protection d'écran hydrogel dès ${prixCourt(hydrogel.types[0].prix)}. Retrait gratuit à Montpellier ou livraison.`,
  chemin: "/boutique",
});

export default async function Boutique() {
  const { produits, categories } = await getCatalogue();
  const actifs = produits.filter((p) => p.actif);
  const appareils = actifs.filter((p) => p.appareil);
  const accessoires = actifs.filter((p) => !p.appareil);
  const catsAppareils = categories.filter((c) => appareils.some((p) => p.categorie === c.id));
  const catsAccessoires = categories.filter((c) => accessoires.some((p) => p.categorie === c.id));

  return (
    <>
      <BanniereHydrogel />
      <HeroPage
        ariane={[{ nom: "Accueil", href: "/" }, { nom: "Boutique" }]}
        surtitre="Boutique"
        titre="Téléphones, accessoires et protections"
        texte={`Commandé sur demande, disponible sous ${boutique.delaiSurCommande} : retrait gratuit à la boutique de Montpellier ou livraison. Réservez sur WhatsApp, vous payez à l'arrivée.`}
      >
        <ul className="mt-10 hidden max-w-4xl grid-cols-2 gap-3 text-sm sm:grid lg:grid-cols-4">
          {[
            { i: CalendarClock, t: `Disponible sous ${boutique.delaiSurCommande}` },
            { i: Store, t: "Retrait gratuit en boutique" },
            { i: ShieldCheck, t: `Téléphones garantis ${boutique.garantieReconditionneMois} mois` },
            { i: MessageCircle, t: "Réservation sur WhatsApp" },
          ].map(({ i: I, t }) => (
            <li key={t} className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 font-medium">
              <I className="size-5 shrink-0 text-cyan" aria-hidden /> {t}
            </li>
          ))}
        </ul>
        <nav aria-label="Rayons" className="mt-6 flex flex-wrap gap-2 text-sm">
          {[["#hydrogel", "Protection hydrogel"], ["#telephones", "Téléphones & tablettes"], ["#accessoires", "Accessoires"]].map(([h, n]) => (
            <a key={h} href={h} className="rounded-full border border-white/20 px-4 py-2 font-semibold hover:bg-white/10">{n}</a>
          ))}
        </nav>
      </HeroPage>

      {/* ============ 1. HYDROGEL ============ */}
      <section id="hydrogel" className="scroll-mt-24 py-10 sm:py-14" aria-labelledby="t-hydrogel">
        <div className="container-x">
          <h2 id="t-hydrogel" className="text-2xl font-semibold sm:text-3xl">Protection d&apos;écran hydrogel</h2>
          <Link href="/boutique/protection-hydrogel" className="mt-6 grid gap-6 overflow-hidden rounded-[2rem] bg-brand p-6 text-white transition-transform hover:-translate-y-0.5 sm:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-ink"><Sparkles className="size-3.5" aria-hidden /> PROMO</span>
              <p className="mt-4 font-display text-2xl font-semibold sm:text-3xl">Découpée sur mesure pour votre téléphone, posée en quelques minutes</p>
              <p className="mt-3 text-white/80">iPhone, Samsung, Xiaomi, Redmi, Oppo, Pixel… tous les modèles. Choisissez le vôtre en 3 étapes.</p>
              <span className="btn-accent mt-6">Choisir mon modèle <ArrowRight className="size-5" aria-hidden /></span>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {hydrogel.types.map((t) => (
                <li key={t.id} className="rounded-2xl bg-white/10 p-4">
                  <p className="font-semibold">{t.nom}</p>
                  <p className="mt-1">
                    <span className="font-display text-3xl font-bold">{prix(t.prix)}</span>
                    {hydrogel.afficherPrixBarre && <span className="ml-2 text-white/60 line-through">{prix(t.prixBarre)}</span>}
                  </p>
                  <p className="mt-1 text-sm text-white/75">{t.detail}</p>
                </li>
              ))}
            </ul>
          </Link>
        </div>
      </section>

      {/* ============ 2. TÉLÉPHONES & TABLETTES ============ */}
      {appareils.length > 0 && (
        <section id="telephones" className="scroll-mt-24 bg-white py-10 sm:py-14" aria-labelledby="t-telephones">
          <div className="container-x">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="t-telephones" className="text-2xl font-semibold sm:text-3xl">Téléphones & tablettes</h2>
                <p className="mt-2 text-muted">
                  Garantie {boutique.garantieReconditionneMois} mois · {boutique.avantagesAppareil.join(" + ").toLowerCase()} avec chaque téléphone.
                </p>
              </div>
              <Link href="/conditions-reconditionnes#etat" className="text-sm font-semibold text-brand underline underline-offset-4">États et grades expliqués</Link>
            </div>
            <div className="mt-8">
              <Suspense fallback={<p className="text-muted">Chargement…</p>}>
                <CatalogueAppareils produits={appareils} categories={catsAppareils} />
              </Suspense>
            </div>
          </div>
        </section>
      )}

      {/* ============ 3. ACCESSOIRES ============ */}
      <section id="accessoires" className="scroll-mt-24 py-10 sm:py-14" aria-labelledby="t-accessoires">
        <div className="container-x">
          <h2 id="t-accessoires" className="text-2xl font-semibold sm:text-3xl">Accessoires</h2>
          <p className="mt-2 text-muted">Chargeurs, câbles, écouteurs, enceintes, batteries externes, chaînes… de grandes marques.</p>
          <div className="mt-8">
            <Suspense fallback={<p className="text-muted">Chargement…</p>}>
              {accessoires.length > 0 ? (
                <Catalogue produits={accessoires} categories={catsAccessoires} prefixe="acc-" texteRecherche="Rechercher : chargeur 20W, câble Lightning…" />
              ) : (
                <AccessoiresEnBoutique />
              )}
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
