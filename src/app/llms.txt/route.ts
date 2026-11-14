import { llmsTxt } from "@/lib/agents";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(await llmsTxt(), { headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
