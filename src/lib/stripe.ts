import "server-only";
import Stripe from "stripe";

/**
 * Paiement :
 * - si STRIPE_SECRET_KEY est défini → paiement réel via Stripe (clé sk_test_… = mode test, sk_live_… = paiement réel) ;
 * - sinon → « mode démo » : paiement simulé pour tester le parcours, aucun débit.
 */
export function stripeActif(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PUBLISHABLE_KEY);
}

export function modeTestStripe(): boolean {
  return (process.env.STRIPE_SECRET_KEY ?? "").startsWith("sk_test_");
}

let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY manquant");
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY, { appInfo: { name: "GCS Boutique" } });
  return client;
}

/** Montant en centimes pour Stripe */
export function centimes(euros: number): number {
  return Math.round(euros * 100);
}

/**
 * Le mode démo (paiement simulé) n'est disponible que si Stripe n'est pas configuré.
 * En production, il faut en plus l'autoriser explicitement avec PAIEMENT_DEMO=1 (à ne jamais laisser sur le site public).
 */
export function demoAutorise(): boolean {
  if (stripeActif()) return false;
  return process.env.NODE_ENV !== "production" || process.env.PAIEMENT_DEMO === "1";
}
