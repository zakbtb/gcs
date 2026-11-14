import { NextResponse, type NextRequest } from "next/server";

/**
 * Agents IA : quand une page est demandée avec « Accept: text/markdown », on sert sa version Markdown
 * (beaucoup plus légère que le HTML). Les navigateurs n'envoient jamais cet en-tête.
 */
export function proxy(req: NextRequest) {
  const accept = req.headers.get("accept") ?? "";
  if (accept.includes("text/markdown")) {
    const cible = req.nextUrl.clone();
    cible.pathname = `/md${req.nextUrl.pathname === "/" ? "" : req.nextUrl.pathname}`;
    return NextResponse.rewrite(cible);
  }
  const rep = NextResponse.next();
  rep.headers.set("Vary", "Accept");
  return rep;
}

export const config = {
  // Pages uniquement : pas les fichiers, l'API, l'admin ni les routes déjà textuelles
  matcher: ["/((?!api|_next|admin|md|mcp|images|marque|outils|\\.well-known|llms\\.txt|robots\\.txt|sitemap\\.xml|favicon|icon|opengraph-image|.*\\.[a-z0-9]+$).*)"],
};
