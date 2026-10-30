import { PagePanier } from "./PagePanier";
import { boutique } from "@/config/entreprise";
import { meta } from "@/lib/seo";

export const metadata = meta({ titre: "Mon panier", description: "Votre panier GCS.", chemin: "/panier", indexer: false });

export default function Panier() {
  return (
    <section className="container-x py-10 sm:py-14">
      <h1 className="mb-8 text-3xl font-semibold sm:text-4xl">Mon panier</h1>
      <PagePanier seuilGratuit={boutique.livraison.gratuiteDes} />
    </section>
  );
}
