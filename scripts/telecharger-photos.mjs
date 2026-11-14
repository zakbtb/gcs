// Télécharge les photos du catalogue dans public/images/catalogue/ (lancé avant chaque build).
// Les adresses sources sont dans data/photos-catalogue.json (généré par scripts/importer-catalogue.py).
// Ne bloque jamais la mise en ligne : une photo qui échoue sera récupérée plus tard par la route /images/catalogue.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const racine = path.resolve(import.meta.dirname, "..");
const dossier = path.join(racine, "public", "images", "catalogue");
let sources = {};
try {
  sources = JSON.parse(readFileSync(path.join(racine, "data", "photos-catalogue.json"), "utf8"));
} catch {
  console.log("photos : aucune liste, rien à télécharger");
  process.exit(0);
}
mkdirSync(dossier, { recursive: true });
const ext = (u) => (/\.(webp|jpe?g|png)(?:$|\?)/i.exec(u)?.[1] ?? "webp").toLowerCase().replace("jpeg", "jpg");
const aFaire = Object.entries(sources).filter(([ref, u]) => !existsSync(path.join(dossier, `${ref}.${ext(u)}`)));
let ok = 0, ko = 0;
async function un([ref, url]) {
  try {
    const rep = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(15000) });
    if (!rep.ok) throw new Error(String(rep.status));
    writeFileSync(path.join(dossier, `${ref}.${ext(url)}`), Buffer.from(await rep.arrayBuffer()));
    ok++;
  } catch {
    ko++;
  }
}
const debut = Date.now();
for (let i = 0; i < aFaire.length && Date.now() - debut < 120000; i += 8) await Promise.all(aFaire.slice(i, i + 8).map(un));
console.log(`photos : ${ok} téléchargées, ${ko} en échec, ${Object.keys(sources).length - aFaire.length} déjà présentes`);
