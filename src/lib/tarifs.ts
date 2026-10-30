import "server-only";
import { lireJson } from "./store";
import type { Tarifs } from "./types";

/** Lit data/tarifs-reparation.json à chaque requête : vos changements de prix sont visibles immédiatement. */
export async function getTarifs(): Promise<Tarifs> {
  return lireJson<Tarifs>("tarifs-reparation.json", { devise: "EUR", reparations: {}, marques: [] });
}
