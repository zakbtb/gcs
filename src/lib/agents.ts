import "server-only";
import { boutique, entreprise, hydrogel, servicesProximite } from "@/config/entreprise";
import { getCatalogue } from "./produits";
import { plagesTexte } from "./horaires";
import { prix } from "./format";
import { lienWhatsApp, messageReservation } from "./whatsapp";
import type { Produit } from "./types";
import donneesHydrogel from "../../data/hydrogel-modeles.json";

/* Contenus et outils pour les assistants IA (llms.txt, Markdown, WebMCP, serveur MCP).
 * Uniquement des informations publiques : prix TTC, état, délai. Jamais de prix d'achat ni de fournisseur. */

const url = (chemin: string) => `${entreprise.siteUrl}${chemin}`;

export function infosBoutique() {
  return {
    nom: "GCS – Global Connect Services",
    activite: "Réparation de smartphones, consoles et PC ; téléphones reconditionnés ; accessoires ; protection d'écran hydrogel ; services du quotidien (carte grise, recharge, transfert d'argent, point relais).",
    adresse: `${entreprise.adresse.rue}, ${entreprise.adresse.codePostal} ${entreprise.adresse.ville}`,
    telephone: entreprise.telephone,
    whatsapp: `https://wa.me/${boutique.whatsapp}`,
    email: entreprise.email,
    horaires: entreprise.horaires.map((h) => `${h.nom} : ${plagesTexte(h.plages)}`),
    commande: `Produits commandés sur demande, disponibles sous ${boutique.delaiSurCommande}. Retrait gratuit en boutique ou livraison. Réservation sur WhatsApp, paiement à l'arrivée.`,
    garanties: `Téléphones, tablettes et montres : garantie ${boutique.garantieReconditionneMois} mois. Réparations : garantie ${boutique.garantieReparationMois} mois. Accessoires : garantie légale de conformité 2 ans.`,
    site: entreprise.siteUrl,
  };
}

export type ProduitPublic = {
  reference: string;
  nom: string;
  prixTtc: number;
  categorie: string;
  etat?: string;
  grade?: string;
  capacite?: string;
  couleur?: string;
  disponibilite: string;
  url: string;
  reservationWhatsApp: string;
};

function publier(p: Produit, nomsCategories: Record<string, string>): ProduitPublic {
  const reference = p.appareil?.reference ?? p.accessoire?.reference ?? p.id.toUpperCase();
  const options = p.appareil ? [`Capacité : ${p.appareil.capacite}`, p.appareil.couleur ? `Couleur : ${p.appareil.couleur}` : "", `État : ${p.appareil.etat}${p.appareil.grade ? `, grade ${p.appareil.grade}` : ""}`] : [];
  return {
    reference,
    nom: p.nom,
    prixTtc: p.prix,
    categorie: nomsCategories[p.categorie] ?? p.categorie,
    ...(p.appareil ? { etat: p.appareil.etat, grade: p.appareil.grade || undefined, capacite: p.appareil.capacite, couleur: p.appareil.couleur || undefined } : {}),
    disponibilite: p.surCommande ? `Commandé sur demande, disponible sous ${boutique.delaiSurCommande}` : "En boutique",
    url: url(`/boutique/${p.slug}`),
    reservationWhatsApp: lienWhatsApp(messageReservation({ reference, nom: p.nom, options, prixTtc: p.prix })),
  };
}

const sansAccents = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export async function rechercherProduits({ q = "", type = "", prixMax, limite = 10 }: { q?: string; type?: string; prixMax?: number; limite?: number }) {
  const { produits, categories } = await getCatalogue();
  const noms = Object.fromEntries(categories.map((c) => [c.id, c.nom]));
  const mots = sansAccents(q.trim()).split(/\s+/).filter(Boolean);
  const liste = produits
    .filter((p) => p.actif)
    .filter((p) => (type === "telephones" ? p.appareil : type === "accessoires" ? !p.appareil : true))
    .filter((p) => prixMax == null || p.prix <= prixMax)
    .filter((p) => {
      const texte = sansAccents([p.nom, p.marque, p.description, noms[p.categorie] ?? ""].join(" "));
      return mots.every((m) => texte.includes(m));
    })
    .sort((a, b) => a.prix - b.prix);
  return { total: liste.length, produits: liste.slice(0, Math.min(Math.max(1, limite), 50)).map((p) => publier(p, noms)) };
}

export function offreHydrogel(marque = "", modele = "", type = "transparent") {
  const t = hydrogel.types.find((x) => x.id === type) ?? hydrogel.types[0];
  return {
    types: hydrogel.types.map((x) => ({ id: x.id, nom: x.nom, prixTtc: x.prix, ...(hydrogel.afficherPrixBarre ? { prixAvantPromo: x.prixBarre } : {}), detail: x.detail })),
    marques: donneesHydrogel.marques.map((m) => m.nom),
    page: url("/boutique/protection-hydrogel"),
    ...(modele
      ? {
          reservationWhatsApp: lienWhatsApp(messageReservation({
            reference: `GCS-HYDRO-${t.id === "anti-espion" ? "AE" : "TR"}`,
            nom: `Protection d'écran hydrogel ${t.nom.toLowerCase()}`,
            options: [marque ? `Marque : ${marque}` : "", `Modèle : ${modele}`],
            prixTtc: t.prix,
          })),
        }
      : {}),
  };
}

/* ---------------- Markdown ---------------- */

function entete() {
  const i = infosBoutique();
  return [
    `Adresse : ${i.adresse} · Téléphone : ${i.telephone} · WhatsApp : ${i.whatsapp}`,
    "",
    "Horaires :",
    ...i.horaires.map((h) => `- ${h}`),
  ].join("\n");
}

const lignesProduits = (l: ProduitPublic[]) =>
  l.map((p) => `- [${p.nom}](${p.url}) : ${prix(p.prixTtc)} TTC${p.etat ? ` · ${p.etat}${p.grade ? ` grade ${p.grade}` : ""}` : ""} · réf. ${p.reference}`);

export const PAGES_CLES: [string, string, string][] = [
  ["/", "Accueil", "présentation de GCS, horaires, adresse"],
  ["/reparation-telephone-montpellier", "Réparation", "réparation de smartphones, consoles et PC, simulateur de prix"],
  ["/boutique", "Boutique", "téléphones reconditionnés, accessoires, protection hydrogel"],
  ["/boutique/protection-hydrogel", "Protection hydrogel", "film découpé sur mesure, prix et réservation"],
  ["/telephones-reconditionnes", "iPhone reconditionnés", "téléphones et tablettes garantis"],
  ["/services", "Services", "carte grise, recharge, transfert d'argent, point relais…"],
  ["/a-propos", "À propos", "qui est GCS"],
  ["/contact", "Contact", "téléphone, WhatsApp, formulaire, plan d'accès"],
  ["/cgv", "CGV", "conditions générales de vente"],
  ["/mentions-legales", "Mentions légales", "éditeur, hébergeur, médiateur"],
];

export async function markdownPour(chemin: string): Promise<string | null> {
  const i = infosBoutique();
  const c = chemin.replace(/\/$/, "") || "/";
  if (c === "/") {
    return [
      `# ${i.nom} – Montpellier`,
      "",
      i.activite,
      "",
      entete(),
      "",
      "## Ce que vous trouverez",
      `- Réparation de smartphones, consoles et PC, diagnostic gratuit, garantie ${boutique.garantieReparationMois} mois : ${url("/reparation-telephone-montpellier")}`,
      `- Téléphones et tablettes reconditionnés, garantie ${boutique.garantieReconditionneMois} mois, ${boutique.avantagesAppareil.join(" et ").toLowerCase()} offerts : ${url("/boutique#telephones")}`,
      `- Protection d'écran hydrogel dès ${prix(hydrogel.types[0].prix)} : ${url("/boutique/protection-hydrogel")}`,
      `- Accessoires (chargeurs, câbles, écouteurs, batteries…) : ${url("/boutique#accessoires")}`,
      `- Services : ${servicesProximite.map((s) => s.nom).join(", ")} : ${url("/services")}`,
      "",
      "## Commander",
      i.commande,
      "",
      "## Pages",
      ...PAGES_CLES.map(([h, n, d]) => `- [${n}](${url(h)}) : ${d}`),
    ].join("\n");
  }
  if (c === "/boutique" || c === "/telephones-reconditionnes") {
    const tel = await rechercherProduits({ type: "telephones", limite: 50 });
    const acc = c === "/boutique" ? await rechercherProduits({ type: "accessoires", limite: 50 }) : null;
    return [
      `# ${c === "/boutique" ? "Boutique GCS" : "Téléphones reconditionnés GCS"}`,
      "",
      i.commande,
      i.garanties,
      "",
      "## Protection d'écran hydrogel",
      ...hydrogel.types.map((t) => `- ${t.nom} : ${prix(t.prix)} TTC posé. ${t.detail}.`),
      `Choisir son modèle : ${url("/boutique/protection-hydrogel")}`,
      "",
      `## Téléphones & tablettes (${tel.total})`,
      ...lignesProduits(tel.produits),
      ...(tel.total > tel.produits.length ? [`… et ${tel.total - tel.produits.length} autres sur ${url("/boutique#telephones")}`] : []),
      ...(acc
        ? ["", `## Accessoires (${acc.total})`, ...lignesProduits(acc.produits), ...(acc.total > acc.produits.length ? [`… et ${acc.total - acc.produits.length} autres sur ${url("/boutique#accessoires")}`] : [])]
        : []),
    ].join("\n");
  }
  if (c === "/boutique/protection-hydrogel") {
    const o = offreHydrogel();
    return [
      "# Protection d'écran hydrogel – GCS Montpellier",
      "",
      "Film souple découpé sur mesure pour votre téléphone, posé en boutique en quelques minutes.",
      "",
      ...o.types.map((t) => `- ${t.nom} : ${prix(t.prixTtc)} TTC${"prixAvantPromo" in t && t.prixAvantPromo ? ` (au lieu de ${prix(t.prixAvantPromo)})` : ""}. ${t.detail}.`),
      "",
      `Marques : ${o.marques.join(", ")}. Tout modèle est possible.`,
      `Réserver : WhatsApp ${i.whatsapp} en indiquant la marque, le modèle et le type.`,
      "",
      entete(),
    ].join("\n");
  }
  if (c === "/contact" || c === "/a-propos" || c === "/about") {
    return [
      c === "/contact" ? "# Contacter GCS" : "# À propos de GCS",
      "",
      i.activite,
      "",
      entete(),
      "",
      `E-mail : ${i.email}`,
      `Société : Pronet Services Plus (enseigne Global Connect Services), Montpellier.`,
    ].join("\n");
  }
  if (c === "/services") {
    return ["# Services du quotidien – GCS Montpellier", "", ...servicesProximite.map((s) => `## ${s.nom}\n${s.texte}${s.points?.length ? "\n" + s.points.map((p) => `- ${p}`).join("\n") : ""}`), "", entete()].join("\n\n");
  }
  const m = /^\/boutique\/([^/]+)$/.exec(c);
  if (m) {
    const { produits, categories } = await getCatalogue();
    const p = produits.find((x) => x.actif && x.slug === m[1]);
    if (!p) return null;
    const pub = publier(p, Object.fromEntries(categories.map((x) => [x.id, x.nom])));
    return [
      `# ${p.nom}`,
      "",
      `Prix : ${prix(p.prix)} TTC · Référence : ${pub.reference}`,
      pub.disponibilite + ". Retrait gratuit en boutique à Montpellier ou livraison.",
      ...(p.appareil ? [`Garantie ${boutique.garantieReconditionneMois} mois.`, ...(p.categorie === "smartphones" ? [`Offert : ${boutique.avantagesAppareil.join(" + ").toLowerCase()}.`] : [])] : []),
      "",
      p.descriptionLongue,
      "",
      "## Caractéristiques",
      ...Object.entries(p.caracteristiques).map(([k, v]) => `- ${k} : ${v}`),
      "",
      `Réserver sur WhatsApp : ${pub.reservationWhatsApp}`,
    ].join("\n");
  }
  if (c === "/reparation-telephone-montpellier") {
    return [
      "# Réparation de téléphone à Montpellier – GCS",
      "",
      `Réparation de smartphones (écran, batterie, connecteur, caméra…), consoles et PC. Diagnostic gratuit, prix annoncé avant réparation, garantie ${boutique.garantieReparationMois} mois. La plupart des réparations sont faites en 20 à 45 minutes.`,
      `Simulateur de prix : ${url("/reparation-telephone-montpellier#simulateur")}`,
      "",
      entete(),
    ].join("\n");
  }
  return null;
}

export async function llmsTxt() {
  const i = infosBoutique();
  return [
    `# ${i.nom}`,
    "",
    `> Boutique à Montpellier (${i.adresse}) : ${i.activite}`,
    "",
    i.commande,
    i.garanties,
    `Contact : ${i.telephone} · WhatsApp ${i.whatsapp} · ${i.email}`,
    "",
    "Chaque page existe aussi en Markdown : envoyez l'en-tête « Accept: text/markdown ».",
    `Serveur MCP (outils : recherche de produits, hydrogel, infos boutique) : ${url("/mcp")} · fiche : ${url("/.well-known/mcp/server-card.json")}`,
    "",
    "## Pages principales",
    ...PAGES_CLES.map(([h, n, d]) => `- [${n}](${url(h)}): ${d}`),
    "",
    "## Optional",
    `- [Plan du site](${url("/sitemap.xml")})`,
    `- [Conditions reconditionnés](${url("/conditions-reconditionnes")}): états et grades expliqués`,
    `- [Conditions de réparation](${url("/conditions-reparation")})`,
  ].join("\n");
}
