import { rechercherProduits } from "@/lib/agents";

export const dynamic = "force-dynamic";

/** Recherche publique dans le catalogue (utilisée par les outils WebMCP de la page). */
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const prixMax = sp.get("prixMax") ? Number(sp.get("prixMax")) : undefined;
  const res = await rechercherProduits({
    q: sp.get("q") ?? "",
    type: sp.get("type") ?? "",
    prixMax: Number.isFinite(prixMax) ? prixMax : undefined,
    limite: Number(sp.get("limite")) || 10,
  });
  return Response.json(res, { headers: { "Cache-Control": "public, max-age=300" } });
}
