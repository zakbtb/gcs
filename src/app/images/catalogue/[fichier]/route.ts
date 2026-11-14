import { promises as fs } from "node:fs";
import path from "node:path";
import { DATA_DIR, lireJson } from "@/lib/store";

/**
 * Photos du catalogue (/images/catalogue/gcs-011.webp).
 * Normalement servies depuis public/images/catalogue/, remplies pendant la mise en ligne par
 * scripts/telecharger-photos.mjs. Si une photo manque encore, elle est récupérée ici côté serveur
 * puis gardée : le visiteur ne voit jamais l'adresse du fournisseur. Sources : data/photos-catalogue.json.
 */
const DOSSIER = path.join(/*turbopackIgnore: true*/ DATA_DIR, "photos-catalogue");
const TYPES: Record<string, string> = { webp: "image/webp", jpg: "image/jpeg", png: "image/png" };

export async function GET(req: Request, { params }: { params: Promise<{ fichier: string }> }) {
  const { fichier } = await params;
  const m = /^([a-z0-9-]+)\.(webp|jpg|png)$/.exec(fichier);
  if (!m) return new Response("Introuvable", { status: 404 });
  const [, ref, ext] = m;
  const entetes = { "Content-Type": TYPES[ext], "Cache-Control": "public, max-age=2592000, immutable" };
  const local = path.join(/*turbopackIgnore: true*/ DOSSIER, fichier);
  try {
    return new Response(new Uint8Array(await fs.readFile(local)), { headers: entetes });
  } catch {
    /* pas encore en cache */
  }
  const sources = await lireJson<Record<string, string>>("photos-catalogue.json", {});
  const source = sources[ref];
  if (source) {
    try {
      const rep = await fetch(source, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(10000) });
      if (rep.ok) {
        const octets = new Uint8Array(await rep.arrayBuffer());
        await fs.mkdir(DOSSIER, { recursive: true }).catch(() => {});
        await fs.writeFile(local, octets).catch(() => {});
        return new Response(octets, { headers: entetes });
      }
    } catch {
      /* fournisseur injoignable : illustration générique */
    }
  }
  return Response.redirect(new URL("/images/appareils-generique.svg", req.url), 302);
}
