import { NextResponse } from "next/server";
import { evaluerPanier, getCommandeClient, majCommande } from "@/lib/commandes";
import { centimes, getStripe, stripeActif } from "@/lib/stripe";

/** Crée (ou réutilise) le PaymentIntent Stripe d'une commande et renvoie son client_secret. */
export async function POST(req: Request) {
  if (!stripeActif()) return NextResponse.json({ ok: false, erreur: "Stripe non configuré" }, { status: 503 });
  const { commande: id, t } = (await req.json().catch(() => ({}))) as { commande?: string; t?: string };
  const c = id && t ? await getCommandeClient(id, t) : undefined;
  if (!c) return NextResponse.json({ ok: false, erreur: "Commande introuvable" }, { status: 404 });
  if (c.statut !== "en_attente_paiement") return NextResponse.json({ ok: false, erreur: "deja_payee" }, { status: 409 });

  // Dernière vérification du stock avant de payer
  const { problemes } = await evaluerPanier(c.lignes);
  if (problemes.length > 0) return NextResponse.json({ ok: false, erreur: "rupture", problemes }, { status: 409 });

  const stripe = getStripe();
  const montant = centimes(c.total);
  try {
    if (c.paiement.reference?.startsWith("pi_")) {
      const pi = await stripe.paymentIntents.retrieve(c.paiement.reference);
      if (pi.status !== "succeeded" && pi.status !== "canceled") {
        if (pi.amount !== montant) await stripe.paymentIntents.update(pi.id, { amount: montant });
        return NextResponse.json({ ok: true, clientSecret: pi.client_secret });
      }
    }
    const pi = await stripe.paymentIntents.create(
      {
        amount: montant,
        currency: "eur",
        automatic_payment_methods: { enabled: true },
        receipt_email: c.client.email,
        description: `Commande ${c.id} – GCS Montpellier`,
        metadata: { commande: c.id },
      },
      { idempotencyKey: `pi-${c.id}-${montant}` },
    );
    await majCommande(c.id, (x) => {
      x.paiement.reference = pi.id;
    });
    return NextResponse.json({ ok: true, clientSecret: pi.client_secret });
  } catch (e) {
    console.error("[stripe] création PaymentIntent", e);
    return NextResponse.json({ ok: false, erreur: "Le service de paiement est momentanément indisponible." }, { status: 502 });
  }
}
