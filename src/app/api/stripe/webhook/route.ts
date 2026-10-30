import { NextResponse } from "next/server";
import { confirmerPaiement, signalerPaiementRefuse } from "@/lib/commandes";
import { getStripe } from "@/lib/stripe";

/**
 * Webhook Stripe : confirme les commandes même si le client ferme la page avant la redirection.
 * À déclarer dans le tableau de bord Stripe : https://VOTRE-DOMAINE/api/stripe/webhook
 * Événements : payment_intent.succeeded, payment_intent.payment_failed
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) return NextResponse.json({ ok: false }, { status: 400 });

  const corps = await req.text();
  let event;
  try {
    event = getStripe().webhooks.constructEvent(corps, signature, secret);
  } catch (e) {
    console.error("[stripe] signature webhook invalide", e);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;
    if (pi.metadata?.commande) await confirmerPaiement(pi.metadata.commande, pi.id);
  } else if (event.type === "payment_intent.payment_failed") {
    const pi = event.data.object;
    if (pi.metadata?.commande) await signalerPaiementRefuse(pi.metadata.commande, pi.last_payment_error?.message ?? "Paiement refusé");
  }
  return NextResponse.json({ received: true });
}
