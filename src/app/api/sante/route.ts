import { promises as fs } from "node:fs";
import path from "node:path";
import { DATA_DIR } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Vérifie que le serveur peut enregistrer les commandes et messages (écrit puis efface un fichier test). */
export async function GET() {
  let ecriture = false;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const test = path.join(/*turbopackIgnore: true*/ DATA_DIR, `.test-${Date.now()}`);
    await fs.writeFile(test, "ok");
    await fs.unlink(test);
    ecriture = true;
  } catch {
    /* dossier non inscriptible */
  }
  return Response.json(
    {
      ok: ecriture,
      donnees: ecriture ? "enregistrement possible" : "IMPOSSIBLE d'enregistrer commandes et messages",
      paiement: process.env.STRIPE_SECRET_KEY ? "Stripe branché" : "Stripe non branché",
      emails: process.env.SMTP_HOST ? "SMTP branché" : "SMTP non branché",
      admin: process.env.ADMIN_PASSWORD && (process.env.ADMIN_SECRET ?? "").length >= 16 ? "admin configuré" : "admin non configuré",
    },
    { status: ecriture ? 200 : 500, headers: { "X-Robots-Tag": "noindex", "Cache-Control": "no-store" } },
  );
}
