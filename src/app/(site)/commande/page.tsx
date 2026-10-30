import { FormulaireCommande } from "./FormulaireCommande";
import { Etapes } from "./Etapes";
import { boutique, entreprise } from "@/config/entreprise";
import { meta } from "@/lib/seo";

export const metadata = meta({ titre: "Commande", description: "Finalisez votre commande.", chemin: "/commande", indexer: false });

export default function Commande() {
  return (
    <section className="container-x py-10 sm:py-14">
      <Etapes actuelle={2} />
      <h1 className="mb-8 mt-6 text-3xl font-semibold sm:text-4xl">Finaliser ma commande</h1>
      <FormulaireCommande
        livraison={boutique.livraison}
        retrait={boutique.retrait}
        adresseBoutique={`${entreprise.adresse.rue}, ${entreprise.adresse.codePostal} ${entreprise.adresse.ville}`}
      />
    </section>
  );
}
