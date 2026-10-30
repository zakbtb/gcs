import { estACompleter } from "@/lib/format";

/** Affiche une valeur de configuration ; surligne en jaune les champs « [À COMPLÉTER …] ». */
export function Val({ v }: { v: string | number | null | undefined }) {
  const s = v == null ? "" : String(v);
  if (estACompleter(s)) return <mark className="a-completer">{s || "[À COMPLÉTER]"}</mark>;
  return <>{s}</>;
}
