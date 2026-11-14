import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock, Mail, Store, Truck } from "lucide-react";
import { Etapes } from "../Etapes";
import { RecapCommande } from "../RecapCommande";
import { ViderPanier } from "./ViderPanier";
import { Val } from "@/components/ui/Val";
import { boutique, entreprise } from "@/config/entreprise";
import { confirmerPaiement, getCommandeClient, LIBELLES_STATUT } from "@/lib/commandes";
import { getStripe, stripeActif } from "@/lib/stripe";
import { meta } from "@/lib/seo";
import { dateFr } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata = meta({ titre: "Commande confirmée", description: "Confirmation de commande.", chemin: "/commande/confirmation", indexer: false });

export default async function Confirmation({ searchParams }: { searchParams: Promise<{ commande?: string; t?: string; payment_intent?: string }> }) {
  const { commande: id, t, payment_intent } = await searchParams;
  let c = id && t ? await getCommandeClient(id, t) : undefined;
  if (!c) redirect("/");
  const q = `commande=${encodeURIComponent(c.id)}&t=${encodeURIComponent(c.token)}`;

  // Retour de Stripe : on vérifie l'état réel du paiement auprès de Stripe (jamais sur la seule foi de l'URL)
  let enCours = false;
  if (c.statut === "en_attente_paiement" && c.paiement.fournisseur === "stripe" && stripeActif()) {
    const piId = payment_intent ?? c.paiement.reference;
    if (piId?.startsWith("pi_")) {
      const pi = await getStripe().paymentIntents.retrieve(piId);
      if (pi.metadata?.commande === c.id && pi.status === "succeeded") c = (await confirmerPaiement(c.id, pi.id)) ?? c;
      else if (pi.status === "processing") enCours = true;
      else if (payment_intent) redirect(`/commande/paiement-refuse?${q}&raison=${encodeURIComponent(pi.last_payment_error?.message ?? "Le paiement n'a pas abouti.")}`);
    }
  }
  if (c.statut === "en_attente_paiement" && !enCours) redirect(`/commande/paiement?${q}`);

  const payee = c.statut !== "en_attente_paiement" && c.statut !== "annulee";
  return (
    <section className="container-x py-10 sm:py-14">
      {payee && <ViderPanier />}
      <Etapes actuelle={4} />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-line sm:p-10">
            {enCours ? (
              <Clock className="size-12 text-accent-strong" aria-hidden />
            ) : (
              <CheckCircle2 className="size-12 text-success" aria-hidden />
            )}
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
              {enCours ? "Paiement en cours de validation" : `Merci ${c.client.prenom}, votre commande est confirmée !`}
            </h1>
            <p className="mt-3 text-lg text-muted">
              Numéro de commande : <strong className="font-display text-2xl text-ink" data-testid="numero-commande">{c.id}</strong>
            </p>
            <p className="mt-1 text-sm text-muted">Passée le {dateFr(c.creeLe, true)} · Statut : {LIBELLES_STATUT[c.statut]}</p>
            <p className="mt-6 flex items-start gap-3 rounded-2xl bg-surface p-4">
              <Mail className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
              <span>{enCours ? "Vous recevrez un e-mail dès que votre banque aura validé le paiement." : <>Un e-mail de confirmation a été envoyé à <strong>{c.client.email}</strong>. Pensez à vérifier vos courriers indésirables.</>}</span>
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 ring-1 ring-line sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              {c.livraison.mode === "retrait" ? <Store className="size-5 text-brand" aria-hidden /> : <Truck className="size-5 text-brand" aria-hidden />}
              Et maintenant ?
            </h2>
            {c.livraison.mode === "retrait" ? (
              <p className="mt-3 text-muted">
                Nous préparons votre commande ({boutique.retrait.delai.toLowerCase()}). Retrait à la boutique : <strong className="text-ink"><Val v={entreprise.adresse.rue} />, {entreprise.adresse.codePostal} {entreprise.adresse.ville}</strong>, sur présentation de votre numéro de commande.
              </p>
            ) : (
              <p className="mt-3 text-muted">
                Votre colis est livré en {boutique.expeditionSous} (commande passée avant {boutique.heureLimite}). Vous recevrez le suivi par e-mail.
              </p>
            )}
            <p className="mt-4 text-sm text-muted">
              Une question ? Contactez-nous en rappelant votre numéro de commande : <a className="font-medium text-brand" href={`tel:${entreprise.telephoneLien}`}><Val v={entreprise.telephone} /></a> ou Snapchat {entreprise.snapchat}.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/boutique" className="btn-dark">Continuer mes achats</Link>
              <Link href="/" className="btn-ghost">Retour à l&apos;accueil</Link>
            </div>
          </div>
        </div>
        <RecapCommande commande={c} />
      </div>
    </section>
  );
}
