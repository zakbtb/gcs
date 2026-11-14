import { entreprise } from "@/config/entreprise";
import { OUTILS } from "@/lib/outils-mcp";

/** Fiche du serveur MCP (SEP-1649), pour que les agents découvrent /mcp sans s'y connecter. */
export function GET() {
  return Response.json(
    {
      $schema: "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
      version: "1.0",
      protocolVersion: "2025-06-18",
      name: "gcs-montpellier",
      title: "GCS Montpellier",
      description: "Catalogue, prix et infos de la boutique GCS à Montpellier (réparation, téléphones reconditionnés, accessoires, protection hydrogel). Lecture seule.",
      serverInfo: { name: "gcs-montpellier", title: "GCS Montpellier", version: "1.0.0" },
      websiteUrl: entreprise.siteUrl,
      endpoint: `${entreprise.siteUrl}/mcp`,
      transport: { type: "streamable-http", endpoint: `${entreprise.siteUrl}/mcp` },
      remotes: [{ type: "streamable-http", url: `${entreprise.siteUrl}/mcp` }],
      capabilities: { tools: { listChanged: false } },
      authentication: { required: false },
      tools: OUTILS.map(({ name, title, description }) => ({ name, title, description })),
    },
    { headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=3600" } },
  );
}
