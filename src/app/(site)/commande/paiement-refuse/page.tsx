import Link from "next/link";
import { XCircle } from "lucide-react";
import { entreprise } from "@/config/entreprise";
import { Val } from "@/components/ui/Val";
import { meta } from "@/lib/seo";

export const metadata = meta({ titre: "Paiement refusé", description: "Le paiement n'a pas abouti.", chemin: "/commande/paiement-refuse", indexer: false });

export default async function PaiementRefuse({ searchParams }: { searchParams: Promise<{ commande?: string; t?: string; raison?: string }> }) {
  const { commande, t, raison } = await searchParams;
  const retry = commande && t ? `/commande/paiement?commande=${encodeURIComponent(commande)}&t=${encodeURIComponent(t)}` : "/panier";
  return (
    <section className="container-x py-16 sm:py-24">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center ring-1 ring-line sm:p-12">
        <XCircle className="mx-auto size-14 text-danger" aria-hidden />
        <h1 className="mt-5 text-3xl font-semibold">Paiement refusé</h1>
        <p className="mt-3 text-muted">{raison ? raison.slice(0, 200) : "Votre paiement n'a pas pu être effectué."} Aucun montant n&apos;a été débité.</p>
        <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm text-muted">
          <li>• Vérifiez le numéro, la date d&apos;expiration et le code de sécurité.</li>
          <li>• Assurez-vous que votre plafond de paiement n&apos;est pas atteint.</li>
          <li>• Essayez une autre carte ou contactez votre banque.</li>
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={retry} className="btn-accent">Réessayer le paiement</Link>
          <Link href="/panier" className="btn-ghost">Retour au panier</Link>
        </div>
        <p className="mt-6 text-sm text-muted">Besoin d&apos;aide ? <Val v={entreprise.telephone} /> · Snapchat {entreprise.snapchat}</p>
      </div>
    </section>
  );
}
