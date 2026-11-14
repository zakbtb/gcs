import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";

/**
 * Stockage simple en fichiers JSON (dossier `data/`).
 * - lecture à chaque requête : une modification du fichier est visible immédiatement ;
 * - écriture atomique (fichier temporaire + renommage) ;
 * - verrou en mémoire pour sérialiser les écritures concurrentes d'un même fichier.
 */
const DATA_INITIAL = path.join(/*turbopackIgnore: true*/ process.cwd(), "data");

// Où sont gardées les données qui changent (commandes, messages, stocks) :
// - DATA_DIR si la variable est définie ;
// - sur Vercel, /tmp (non durable) ;
// - en production ailleurs (Hostinger), un dossier « gcs-data » dans le dossier personnel du compte,
//   HORS du dossier du site : chaque mise à jour du site remplace le dossier du site, pas celui-ci ;
// - en développement, le dossier data/ du projet.
export const DATA_DIR =
  process.env.DATA_DIR ||
  (process.env.VERCEL
    ? "/tmp/gcs-data"
    : process.env.NODE_ENV === "production"
      ? path.join(/*turbopackIgnore: true*/ os.homedir(), "gcs-data")
      : DATA_INITIAL);

/**
 * Fichiers livrés avec le site ET modifiés en ligne (produits.json : stocks, édition dans /admin).
 * Quand une nouvelle version du fichier est livrée (nouveau catalogue), la copie en ligne est refaite
 * à partir de la version livrée, en gardant les stocks en ligne et les produits créés dans /admin.
 */
type CatalogueBrut = { _source?: string; produits?: { id: string; manuel?: boolean; stock?: number; variantes?: { id: string; stock: number }[] }[] };
const FUSIONS: Record<string, (livre: CatalogueBrut, enLigne: CatalogueBrut) => CatalogueBrut> = {
  "produits.json": (livre, enLigne) => {
    const anciens = new Map((enLigne.produits ?? []).map((p) => [p.id, p]));
    const idsLivres = new Set((livre.produits ?? []).map((p) => p.id));
    const produits = (livre.produits ?? []).map((p) => {
      const a = anciens.get(p.id);
      if (!a) return p;
      return {
        ...p,
        ...(p.stock != null && a.stock != null ? { stock: a.stock } : {}),
        ...(p.variantes
          ? { variantes: p.variantes.map((v) => ({ ...v, stock: a.variantes?.find((x) => x.id === v.id)?.stock ?? v.stock })) }
          : {}),
      };
    });
    // Seuls les produits ajoutés à la main dans l'admin survivent à un nouvel import du catalogue
    const creesEnLigne = (enLigne.produits ?? []).filter((p) => !idsLivres.has(p.id) && p.manuel);
    return { ...livre, produits: [...produits, ...creesEnLigne] };
  },
};
const empreinte = (texte: string) => crypto.createHash("sha256").update(texte).digest("hex").slice(0, 16);

const verrous = new Map<string, Promise<unknown>>();

export function cheminData(fichier: string) {
  return path.join(/*turbopackIgnore: true*/ DATA_DIR, fichier);
}

export async function lireJson<T>(fichier: string, defaut: T): Promise<T> {
  try {
    const brut = await fs.readFile(/*turbopackIgnore: true*/ cheminData(fichier), "utf8");
    const fusion = FUSIONS[fichier];
    if (fusion && DATA_DIR !== DATA_INITIAL) {
      const enLigne = JSON.parse(brut) as CatalogueBrut;
      const brutLivre = await fs.readFile(/*turbopackIgnore: true*/ path.join(DATA_INITIAL, fichier), "utf8").catch(() => null);
      if (brutLivre) {
        const source = empreinte(brutLivre);
        if (enLigne._source !== source) return { ...fusion(JSON.parse(brutLivre), enLigne), _source: source } as T;
      }
      return enLigne as T;
    }
    return JSON.parse(brut) as T;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    if (DATA_DIR === DATA_INITIAL) return defaut;
    // Fichier pas encore copié dans DATA_DIR : on lit la version livrée avec le site
    try {
      const brut = await fs.readFile(/*turbopackIgnore: true*/ path.join(DATA_INITIAL, fichier), "utf8");
      return (FUSIONS[fichier] ? { ...JSON.parse(brut), _source: empreinte(brut) } : JSON.parse(brut)) as T;
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
