import { NextResponse } from "next/server";
import { z } from "zod";
import { creerCommande } from "@/lib/commandes";
import { demoAutorise, stripeActif } from "@/lib/stripe";

const tel = z.string().trim().min(8, "Indiquez un numéro de téléphone valide").max(30).regex(/^[+0-9 ().-]+$/, "Numéro de téléphone invalide");

const schema = z
  .object({
    client: z.object({
      prenom: z.string().trim().min(1, "Indiquez votre prénom").max(80),
      nom: z.string().trim().min(1, "Indiquez votre nom").max(80),
      email: z.email("Adresse e-mail invalide").max(200),
      telephone: tel,
    }),
    livraison: z.object({
      mode: z.enum(["livraison", "retrait"]),
      adresse: z.string().trim().max(200).optional(),
      complement: z.string().trim().max(200).optional(),
      codePostal: z.string().trim().max(10).optional(),
      ville: z.string().trim().max(100).optional(),
    }),
    note: z.string().trim().max(1000).optional(),
    cgv: z.literal(true, { error: "Vous devez accepter les CGV pour commander" }),
    panier: z
      .array(z.object({ produitId: z.string().max(100), varianteId: z.string().max(100).optional(), quantite: z.number().int().min(1).max(99) }))
      .min(1, "Votre panier est vide")
      .max(50),
  })
  .superRefine((d, ctx) => {
    if (d.livraison.mode === "livraison") {
      if (!d.livraison.adresse || d.livraison.adresse.length < 4) ctx.addIssue({ code: "custom", path: ["adresse"], message: "Indiquez votre adresse" });
      if (!/^(0[1-9]|[1-8]\d|9[0-5]|2[AB])\d{3}$/i.test(d.livraison.codePostal ?? "")) ctx.addIssue({ code: "custom", path: ["codePostal"], message: "Code postal de France métropolitaine invalide" });
      if (!d.livraison.ville || d.livraison.ville.length < 2) ctx.addIssue({ code: "custom", path: ["ville"], message: "Indiquez votre ville" });
    }
  });

export async function POST(req: Request) {
  if (!stripeActif() && !demoAutorise()) {
    return NextResponse.json({ ok: false, erreur: "Le paiement en ligne n'est pas encore activé. Contactez-nous pour commander." }, { status: 503 });
  }
  const r = schema.safeParse(await req.json().catch(() => null));
  if (!r.success) {
    const champs: Record<string, string> = {};
    for (const i of r.error.issues) champs[String(i.path[i.path.length - 1])] ??= i.message;
    return NextResponse.json({ ok: false, erreur: "Merci de vérifier les champs indiqués.", champs }, { status: 422 });
  }
  const d = r.data;
  const livraison =
    d.livraison.mode === "retrait"
      ? { mode: "retrait" as const }
      : { mode: "livraison" as const, adresse: d.livraison.adresse, complement: d.livraison.complement || undefined, codePostal: d.livraison.codePostal, ville: d.livraison.ville };

  const res = await creerCommande({
    client: d.client,
    livraison,
    note: d.note || undefined,
    panier: d.panier,
    fournisseur: stripeActif() ? "stripe" : "demo",
  });
  if (!res.ok) {
    return NextResponse.json({ ok: false, erreur: res.erreur, problemes: res.problemes }, { status: 409 });
  }
  return NextResponse.json({ ok: true, id: res.commande.id, token: res.commande.token });
}
