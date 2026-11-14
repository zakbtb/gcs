import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

/**
 * Stockage simple en fichiers JSON (dossier `data/`).
 * - lecture à chaque requête : une modification du fichier est visible immédiatement ;
 * - écriture atomique (fichier temporaire + renommage) ;
 * - verrou en mémoire pour sérialiser les écritures concurrentes d'un même fichier.
 */
const DATA_INITIAL = path.join(/*turbopackIgnore: true*/ process.cwd(), "data");

// Sur Vercel, seul /tmp est inscriptible : les données y sont copiées à la première écriture
// (elles ne survivent pas aux redémarrages ; une vraie base de données sera nécessaire pour la boutique).
export const DATA_DIR = process.env.DATA_DIR || (process.env.VERCEL ? "/tmp/gcs-data" : DATA_INITIAL);

const verrous = new Map<string, Promise<unknown>>();

export function cheminData(fichier: string) {
  return path.join(/*turbopackIgnore: true*/ DATA_DIR, fichier);
}

export async function lireJson<T>(fichier: string, defaut: T): Promise<T> {
  try {
    const brut = await fs.readFile(/*turbopackIgnore: true*/ cheminData(fichier), "utf8");
    return JSON.parse(brut) as T;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    if (DATA_DIR === DATA_INITIAL) return defaut;
    // Fichier pas encore copié dans DATA_DIR : on lit la version livrée avec le site
    try {
      const brut = await fs.readFile(/*turbopackIgnore: true*/ path.join(DATA_INITIAL, fichier), "utf8");
      return JSON.parse(brut) as T;
    } catch {
      return defaut;
    }
  }
}

async function ecrireJson(fichier: string, donnees: unknown) {
  const cible = cheminData(fichier);
  await fs.mkdir(path.dirname(cible), { recursive: true });
  const tmp = `${cible}.${crypto.randomBytes(4).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(donnees, null, 2) + "\n", "utf8");
  await fs.rename(tmp, cible);
}

/** Lit, modifie et réécrit un fichier JSON de façon sérialisée. */
export async function modifierJson<T, R = void>(
  fichier: string,
  defaut: T,
  modif: (donnees: T) => R | Promise<R>,
): Promise<R> {
  const precedent = verrous.get(fichier) ?? Promise.resolve();
  let resultat!: R;
  const suivant = precedent
    .catch(() => {})
    .then(async () => {
      const donnees = await lireJson<T>(fichier, defaut);
      resultat = await modif(donnees);
      await ecrireJson(fichier, donnees);
    });
  verrous.set(fichier, suivant);
  try {
    await suivant;
  } finally {
    if (verrous.get(fichier) === suivant) verrous.delete(fichier);
  }
  return resultat;
}

export function idAleatoire(longueur = 4) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const octets = crypto.randomBytes(longueur);
  return Array.from(octets, (o) => alphabet[o % alphabet.length]).join("");
}

export function jeton() {
  return crypto.randomBytes(18).toString("base64url");
}
