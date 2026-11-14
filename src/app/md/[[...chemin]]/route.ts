import { markdownPour, llmsTxt } from "@/lib/agents";
import { entreprise } from "@/config/entreprise";

export const dynamic = "force-dynamic";

/** Version Markdown des pages, servie quand un agent demande « Accept: text/markdown » (voir src/proxy.ts). */
export async function GET(_req: Request, { params }: { params: Promise<{ chemin?: string[] }> }) {
  const { chemin = [] } = await params;
  const page = "/" + chemin.join("/");
  const md =
    (await markdownPour(page)) ??
    `# ${entreprise.nomCommercial}\n\nCette page n'a pas encore de version Markdown : ${entreprise.siteUrl}${page}\n\n${await llmsTxt()}`;
  return new Response(md + "\n", {
    headers: { "Content-Type": "text/markdown; charset=utf-8", Vary: "Accept", "Cache-Control": "public, max-age=600" },
  });
}
