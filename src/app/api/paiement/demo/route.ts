import { NextResponse } from "next/server";
import { confirmerPaiement, evaluerPanier, getCommandeClient, signalerPaiementRefuse } from "@/lib/commandes";
import { demoAutorise } from "@/lib/stripe";

/**
 * Paiement SIMULÉ (mode démo, sans Stripe) – reproduit les cartes de test Stripe :
 *  4242 4242 4242 4242 → paiement accepté
 *  4000 0000 0000 0002 → carte refusée
 *  4000 0000 0000 9995 → fonds insuffisants
 */
export async function POST(req: Request) {
  if (!demoAutorise()) return NextResponse.json({ ok: false, erreur: "Mode démo désactivé" }, { status: 403 });
  const { commande: id, t, numero } = (await req.json().catch(() => ({}))) as { commande?: string; t?: string; numero?: string };
  const c = id && t ? await getCommandeClient(id, t) : undefined;
  if (!c) return NextResponse.json({ ok: false, erreur: "Commande introuvable" }, { status: 404 });
  if (c.statut !== "en_attente_paiement") return NextResponse.json({ ok: true, statut: c.statut });

  const { problemes } = await evaluerPanier(c.lignes);
  if (problemes.length > 0) return NextResponse.json({ ok: false, erreur: "rupture", problemes }, { status: 409 });

  const n = (numero ?? "").replace(/\D/g, "");
  if (n === "4242424242424242") {
    await confirmerPaiement(c.id, `demo_${Date.now()}`);
    return NextResponse.json({ ok: true, statut: "payee" });
  }
  const raison =
    n === "4000000000009995" ? "Fonds insuffisants." : n === "4000000000000002" ? "Votre carte a été refusée." : "Numéro de carte invalide (mode démo : utilisez une carte de test).";
  await signalerPaiementRefuse(c.id, raison);
  return NextResponse.json({ ok: false, erreur: "refuse", raison }, { status: 402 });
}
