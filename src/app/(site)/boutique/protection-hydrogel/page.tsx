import { ShieldCheck, Clock, Scissors, EyeOff } from "lucide-react";
import { HeroPage } from "@/components/ui/Section";
import { JsonLd } from "@/components/ui/JsonLd";
import { ChoixHydrogel } from "@/components/hydrogel/ChoixHydrogel";
import { entreprise, hydrogel } from "@/config/entreprise";
import { meta } from "@/lib/seo";
import { prixCourt } from "@/lib/format";
import donnees from "../../../../../data/hydrogel-modeles.json";

export const metadata = meta({
  titre: `Protection d'écran hydrogel à Montpellier – dès ${prixCourt(hydrogel.types[0].prix)} posée`,
  description: `Film hydrogel découpé sur mesure pour iPhone, Samsung, Xiaomi, Redmi, Oppo, Pixel… Transparent ${prixCourt(hydrogel.types[0].prix)}, anti-espion ${prixCourt(hydrogel.types[1].prix)}, pose en boutique GCS à Montpellier.`,
  chemin: "/boutique/protection-hydrogel",
});

export default function ProtectionHydrogel() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Protection d'écran hydrogel sur mesure",
          brand: { "@type": "Brand", name: "GCS" },
          offers: hydrogel.types.map((t) => ({
            "@type": "Offer",
            name: `Hydrogel ${t.nom}`,
            priceCurrency: "EUR",
            price: t.prix,
            availability: "https://schema.org/InStock",
            seller: { "@id": `${entreprise.siteUrl}/#entreprise` },
          })),
        }}
      />
      <HeroPage
        ariane={[{ nom: "Accueil", href: "/" }, { nom: "Boutique", href: "/boutique" }, { nom: "Protection hydrogel" }]}
        surtitre="Promo"
        titre="Protection d'écran hydrogel"
        texte="Un film souple découpé sur mesure pour votre téléphone, posé en boutique en quelques minutes. Il épouse les bords incurvés et protège des rayures et des chocs du quotidien."
      >
        <ul className="mt-10 hidden max-w-4xl grid-cols-2 gap-3 text-sm sm:grid lg:grid-cols-4">
          {[
            { i: Scissors, t: "Découpé sur mesure" },
            { i: Clock, t: "Posé en quelques minutes" },
            { i: ShieldCheck, t: "Bords incurvés couverts" },
            { i: EyeOff, t: "Option anti-espion" },
          ].map(({ i: I, t }) => (
            <li key={t} className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 font-medium">
              <I className="size-5 shrink-0 text-cyan" aria-hidden /> {t}
            </li>
          ))}
        </ul>
      </HeroPage>
      <section className="py-10 sm:py-14">
        <div className="container-x">
          <ChoixHydrogel marques={donnees.marques} />
        </div>
      </section>
    </>
  );
}
