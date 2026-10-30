import { PackageX } from "lucide-react";
import { ListeRupture } from "./ListeRupture";
import { meta } from "@/lib/seo";

export const metadata = meta({ titre: "Produit en rupture de stock", description: "Un produit de votre panier n'est plus disponible.", chemin: "/commande/rupture", indexer: false });

export default function Rupture() {
  return (
    <section className="container-x py-16 sm:py-24">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center ring-1 ring-line sm:p-12">
        <PackageX className="mx-auto size-14 text-accent-strong" aria-hidden />
        <h1 className="mt-5 text-3xl font-semibold">Oups, un produit vient d&apos;être épuisé</h1>
        <p className="mt-3 text-muted">Pendant votre commande, un ou plusieurs articles ont été achetés par d&apos;autres clients. Aucun paiement n&apos;a été effectué.</p>
        <ListeRupture />
      </div>
    </section>
  );
}
