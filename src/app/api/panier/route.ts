import { NextResponse } from "next/server";
import { z } from "zod";
import { evaluerPanier, fraisLivraison } from "@/lib/commandes";
import { getCatalogue, stockDisponible } from "@/lib/produits";

const schema = z.object({
  panier: z
    .array(z.object({ produitId: z.string().max(100), varianteId: z.string().max(100).optional(), quantite: z.number().int().min(1).max(99) }))
    .max(50),
});

/** Recalcule le panier côté serveur : prix et stocks à jour. */
export async function POST(req: Request) {
  const r = schema.safeParse(await req.json().catch(() => null));
  if (!r.success) return NextResponse.json({ ok: false }, { status: 400 });
  const { lignes, problemes, sousTotal } = await evaluerPanier(r.data.panier);
  const { produits } = await getCatalogue();
  const stocks = Object.fromEntries(
    r.data.panier.map((l) => {
      const p = produits.find((x) => x.id === l.produitId);
      return [`${l.produitId}|${l.varianteId ?? ""}`, p ? stockDisponible(p, l.varianteId) : 0];
    }),
  );
  return NextResponse.json({
    ok: true,
    lignes,
    problemes,
    stocks,
    sousTotal,
    fraisLivraison: fraisLivraison("livraison", sousTotal),
    fraisRetrait: fraisLivraison("retrait", sousTotal),
  });
}
