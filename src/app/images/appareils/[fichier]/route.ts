import { promises as fs } from "node:fs";
import path from "node:path";
import { DATA_DIR, lireJson } from "@/lib/store";

/**
 * Photos des appareils vendus sur commande (/images/appareils/gcs-011.webp).
 * Au premier affichage, la photo est récupérée chez le fournisseur puis gardée sur le serveur :
 * le visiteur ne voit jamais l'adresse du fournisseur. Liste des sources : data/photos-appareils.json.
 */
const DOSSIER = path.join(/*turbopackIgnore: true*/ DATA_DIR, "photos-appareils");
const ENTETES = { "Content-Type": "image/webp", "Cache-Control": "public, max-age=2592000, immutable" };

export async function GET(_req: Request, { params }: { params: Promise<{ fichier: string }> }) {
  const { fichier } = await params;
  const ref = fichier.replace(/\.webp$/, "");
  if (!/^[a-z0-9-]+$/.test(ref)) return new Response("Introuvable", { status: 404 });
  const local = path.join(/*turbopackIgnore: true*/ DOSSIER, `${ref}.webp`);
  try {
    return new Response(new Uint8Array(await fs.readFile(local)), { headers: ENTETES });
  } catch {
    /* pas encore en cache */
  }
  const sources = await lireJson<Record<string, string>>("photos-appareils.json", {});
  const source = sources[ref];
  if (source) {
    try {
      const rep = await fetch(source, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(10000) });
      if (rep.ok) {
        const octets = new Uint8Array(await rep.arrayBuffer());
        await fs.mkdir(DOSSIER, { recursive: true }).catch(() => {});
        await fs.writeFile(local, octets).catch(() => {});
        return new Response(octets, { headers: ENTETES });
      }
    } catch {
      /* fournisseur injoignable : illustration générique */
    }
  }
  return Response.redirect(new URL("/images/appareils-generique.svg", _req.url), 302);
}
