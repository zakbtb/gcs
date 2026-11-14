import { OUTILS, appelerOutil } from "@/lib/outils-mcp";

export const dynamic = "force-dynamic";

/**
 * Serveur MCP minimal (transport « streamable HTTP », sans session, réponses JSON).
 * Outils en lecture seule : catalogue, hydrogel, infos boutique. Fiche : /.well-known/mcp/server-card.json
 */
const VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26"];
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type, mcp-protocol-version, accept", "Access-Control-Allow-Methods": "POST, GET, OPTIONS" };

type Requete = { jsonrpc: "2.0"; id?: string | number | null; method: string; params?: Record<string, unknown> };

async function traiter(r: Requete) {
  const ok = (result: unknown) => ({ jsonrpc: "2.0", id: r.id ?? null, result });
  const erreur = (code: number, message: string) => ({ jsonrpc: "2.0", id: r.id ?? null, error: { code, message } });
  switch (r.method) {
    case "initialize": {
      const demandee = String(r.params?.protocolVersion ?? "");
      return ok({
        protocolVersion: VERSIONS.includes(demandee) ? demandee : VERSIONS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "gcs-montpellier", title: "GCS Montpellier", version: "1.0.0" },
        instructions: "Boutique GCS à Montpellier : réparation, téléphones reconditionnés, accessoires, protection hydrogel. Les commandes se réservent sur WhatsApp (liens fournis par les outils).",
      });
    }
    case "ping":
      return ok({});
    case "tools/list":
      return ok({ tools: OUTILS });
    case "tools/call": {
      const nom = String(r.params?.name ?? "");
      const res = await appelerOutil(nom, (r.params?.arguments as Record<string, unknown>) ?? {});
      if (res === null) return erreur(-32602, `Outil inconnu : ${nom}`);
      return ok({ content: [{ type: "text", text: JSON.stringify(res, null, 2) }], structuredContent: res, isError: false });
    }
    default:
      return erreur(-32601, `Méthode non prise en charge : ${r.method}`);
  }
}

export async function POST(req: Request) {
  let corps: Requete | Requete[];
  try {
    corps = await req.json();
  } catch {
    return Response.json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "JSON invalide" } }, { status: 400, headers: CORS });
  }
  const liste = Array.isArray(corps) ? corps : [corps];
  const reponses = [];
  for (const r of liste) if (r && r.id !== undefined && r.id !== null) reponses.push(await traiter(r));
  // Notifications seules (ex. notifications/initialized) : pas de réponse
  if (reponses.length === 0) return new Response(null, { status: 202, headers: CORS });
  return Response.json(Array.isArray(corps) ? reponses : reponses[0], { headers: CORS });
}

export function GET() {
  return new Response("Serveur MCP GCS : envoyez des requêtes JSON-RPC en POST. Fiche : /.well-known/mcp/server-card.json", { status: 405, headers: { ...CORS, Allow: "POST" } });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
