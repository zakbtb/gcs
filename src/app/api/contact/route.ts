import { NextResponse } from "next/server";
import { z } from "zod";
import { enregistrerMessage } from "@/lib/messages";
import { envoyerNotificationMessage } from "@/lib/emails";

const schema = z.object({
  type: z.enum(["contact", "devis-web", "rendez-vous", "rachat"]),
  nom: z.string().trim().min(2, "Indiquez votre nom").max(100),
  email: z.email("Adresse e-mail invalide").max(200),
  telephone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+0-9 ().-]*$/, "Numéro de téléphone invalide")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(5, "Votre message est trop court").max(5000),
  details: z.record(z.string(), z.string().max(300)).optional(),
  // Champ piège invisible pour les robots
  site: z.string().max(0).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, erreur: "Requête invalide" }, { status: 400 });
  }
  const r = schema.safeParse(body);
  if (!r.success) {
    const champs: Record<string, string> = {};
    for (const i of r.error.issues) champs[String(i.path[0])] ??= i.message;
    return NextResponse.json({ ok: false, erreur: "Merci de vérifier les champs indiqués.", champs }, { status: 422 });
  }
  if (r.data.site) return NextResponse.json({ ok: true }); // robot : on ignore silencieusement

  const msg = await enregistrerMessage({
    type: r.data.type,
    nom: r.data.nom,
    email: r.data.email,
    telephone: r.data.telephone || undefined,
    contenu: r.data.message,
    details: r.data.details,
  });
  try {
    await envoyerNotificationMessage(msg);
  } catch (e) {
    console.error("[contact] e-mail non envoyé", e);
  }
  return NextResponse.json({ ok: true, id: msg.id });
}
