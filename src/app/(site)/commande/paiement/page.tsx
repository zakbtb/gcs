import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";
import { Etapes } from "../Etapes";
import { PaiementStripe } from "./PaiementStripe";
import { PaiementDemo } from "./PaiementDemo";
import { RecapCommande } from "../RecapCommande";
import { getCommandeClient } from "@/lib/commandes";
import { demoAutorise, modeTestStripe, stripeActif } from "@/lib/stripe";
import { meta } from "@/lib/seo";
import { prix } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = meta({ titre: "Paiement sécurisé", description: "Paiement de votre commande.", chemin: "/commande/paiement", indexer: false });

export default async function Paiement({ searchParams }: { searchParams: Promise<{ commande?: string; t?: string }> }) {
  const { commande: id, t } = await searchParams;
  const c = id && t ? await getCommandeClient(id, t) : undefined;
  if (!c) redirect("/panier");
  const lien = `commande=${encodeURIComponent(c.id)}&t=${encodeURIComponent(c.token)}`;
  if (c.statut !== "en_attente_paiement") redirect(`/commande/confirmation?${lien}`);

  const stripe = stripeActif();
  return (
    <section className="container-x py-10 sm:py-14">
      <Etapes actuelle={3} />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
        <div className="rounded-3xl bg-white p-6 ring-1 ring-line sm:p-8">
          <h1 className="flex items-center gap-3 text-2xl font-semibold sm:text-3xl"><Lock className="size-6 text-success" aria-hidden /> Paiement sécurisé</h1>
          <p className="mt-2 text-muted">Commande <strong className="text-ink">{c.id}</strong> · Montant à régler : <strong className="text-ink">{prix(c.total)}</strong></p>
          {c.paiement.erreur && (
            <p role="alert" className="mt-4 rounded-2xl border border-danger/30 bg-danger-soft p-4 text-sm font-medium text-danger">
              Tentative précédente refusée : {c.paiement.erreur} Vous pouvez réessayer avec une autre carte.
            </p>
          )}
          <div className="mt-6">
            {stripe ? (
              <>
                {modeTestStripe() && (
                  <p className="mb-5 rounded-2xl bg-accent-soft p-4 text-sm">
                    <strong>Stripe en mode test</strong> : aucun débit réel. Carte acceptée : 4242 4242 4242 4242 · refusée : 4000 0000 0000 0002 · date future, CVC au choix.
                  </p>
                )}
                <PaiementStripe
                  commande={c.id}
                  token={c.token}
                  total={c.total}
                  email={c.client.email}
                  cle={process.env.STRIPE_PUBLISHABLE_KEY!}
                />
              </>
            ) : demoAutorise() ? (
              <PaiementDemo commande={c.id} token={c.token} total={c.total} />
            ) : (
              <p className="rounded-2xl bg-danger-soft p-4 text-danger">Le paiement en ligne n&apos;est pas encore activé. <Link href="/contact" className="underline">Contactez-nous</Link>.</p>
            )}
          </div>
          <p className="mt-6 flex items-start gap-2 text-xs text-muted">
            <ShieldCheck className="size-4 shrink-0 text-success" aria-hidden />
            Paiement chiffré et traité par Stripe, certifié PCI-DSS. GCS n&apos;a jamais accès à vos coordonnées bancaires. Authentification 3-D Secure selon votre banque.
          </p>
        </div>
        <RecapCommande commande={c} />
      </div>
    </section>
  );
}
