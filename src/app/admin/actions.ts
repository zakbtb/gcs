"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  adminConfigure, exigerAdmin, fermerSession, ouvrirSession, tropDeTentatives, verifierMotDePasse,
} from "@/lib/admin-auth";
import { enregistrerProduit, getCatalogue, supprimerProduit } from "@/lib/produits";
import { changerStatut, LIBELLES_STATUT } from "@/lib/commandes";
import { marquerLu, supprimerMessage } from "@/lib/messages";
import type { OptionProduit, Produit, StatutCommande, Variante } from "@/lib/types";

/* ---------------- Connexion ---------------- */
export async function connexion(_: unknown, fd: FormData): Promise<{ erreur?: string }> {
  if (!adminConfigure()) return { erreur: "Admin non configuré : définissez ADMIN_PASSWORD et ADMIN_SECRET dans .env.local." };
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "local";
  if (tropDeTentatives(ip)) return { erreur: "Trop de tentatives. Réessayez dans 15 minutes." };
  if (!verifierMotDePasse(String(fd.get("motDePasse") ?? ""), ip)) return { erreur: "Mot de passe incorrect." };
  await ouvrirSession();
  redirect("/admin");
}

export async function deconnexion() {
  await fermerSession();
  redirect("/admin/connexion");
}

/* ---------------- Produits ---------------- */
const slugifier = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

const liste = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(/\n|,/)
    .map((x) => x.trim())
    .filter(Boolean);

export async function sauverProduit(_: unknown, fd: FormData): Promise<{ erreur?: string }> {
  await exigerAdmin();
  const ancienId = String(fd.get("ancienId") ?? "") || undefined;
  const nom = String(fd.get("nom") ?? "").trim();
  const prix = Number(String(fd.get("prix") ?? "").replace(",", "."));
  const prixBarreBrut = String(fd.get("prixBarre") ?? "").replace(",", ".").trim();
  const categorie = String(fd.get("categorie") ?? "");
  if (nom.length < 2) return { erreur: "Le nom est obligatoire." };
  if (!Number.isFinite(prix) || prix <= 0) return { erreur: "Le prix doit être un nombre positif (ex. 19.90)." };

  const id = ancienId ?? (slugifier(String(fd.get("slug") || nom)) || `produit-${Date.now()}`);
  const { produits, categories } = await getCatalogue();
  if (!categories.some((c) => c.id === categorie)) return { erreur: "Catégorie invalide." };
  if (!ancienId && produits.some((p) => p.id === id)) return { erreur: `Un produit avec l'identifiant « ${id} » existe déjà : changez le nom.` };

  // Caractéristiques : une par ligne au format « Clé : valeur »
  const caracteristiques: Record<string, string> = {};
  for (const l of String(fd.get("caracteristiques") ?? "").split("\n")) {
    const [k, ...v] = l.split(":");
    if (k?.trim() && v.join(":").trim()) caracteristiques[k.trim()] = v.join(":").trim();
  }

  // Options → variantes (une variante par combinaison couleur × modèle)
  const options: OptionProduit[] = [];
  const couleurs = liste(fd.get("couleurs"));
  const modeles = liste(fd.get("modeles"));
  if (couleurs.length) options.push({ nom: "Couleur", valeurs: couleurs });
  if (modeles.length) options.push({ nom: "Modèle", valeurs: modeles });
  const images = liste(fd.get("images"));

  const ancien = produits.find((p) => p.id === ancienId);
  let variantes: Variante[] = [];
  if (options.length) {
    const combos = options.reduce<Record<string, string>[]>(
      (acc, o) => acc.flatMap((a) => o.valeurs.map((v) => ({ ...a, [o.nom]: v }))),
      [{}],
    );
    const stockDefaut = Math.max(0, Math.floor(Number(fd.get("stock") ?? 0)));
    variantes = combos.map((opts) => {
      const existante = ancien?.variantes.find((v) => Object.entries(opts).every(([k, val]) => v.options[k] === val));
      const vid = existante?.id ?? slugifier(Object.values(opts).join("-"));
      const champStock = fd.get(`stock_${vid}`);
      const ci = couleurs.indexOf(opts["Couleur"] ?? "");
      return {
        id: vid,
        options: opts,
        stock: champStock != null && champStock !== "" ? Math.max(0, Math.floor(Number(champStock))) : existante?.stock ?? stockDefaut,
        ...(existante?.prix ? { prix: existante.prix } : {}),
        ...(ci >= 0 && images.length ? { image: images[Math.min(ci, images.length - 1)] } : {}),
      };
    });
  }

  const compat = liste(fd.get("compatibilite"));
  const produit: Produit = {
    id,
    slug: id,
    nom,
    categorie,
    marque: String(fd.get("marque") ?? "").trim() || "GCS",
    prix: Math.round(prix * 100) / 100,
    ...(prixBarreBrut && Number(prixBarreBrut) > prix ? { prixBarre: Math.round(Number(prixBarreBrut) * 100) / 100 } : {}),
    description: String(fd.get("description") ?? "").trim(),
    descriptionLongue: String(fd.get("descriptionLongue") ?? "").trim(),
    images: images.length ? images : ["/images/produits/chargeur-usb-c-20w-1.svg"],
    compatibilite: compat.length ? compat : ancien?.appareil ? [] : ["Universel"],
    caracteristiques,
    options,
    variantes,
    ...(options.length ? {} : { stock: Math.max(0, Math.floor(Number(fd.get("stock") ?? 0))) }),
    misEnAvant: fd.get("misEnAvant") === "on",
    // Champs des appareils sur commande (importés depuis le catalogue fournisseur) : conservés tels quels
    ...(ancien?.surCommande ? { surCommande: true } : {}),
    ...(ancien?.appareil ? { appareil: ancien.appareil } : {}),
    ...(ancien?.accessoire ? { accessoire: ancien.accessoire } : {}),
    // Produit ajouté à la main dans l'admin : gardé quand le catalogue est réimporté
    ...(!ancien || ancien.manuel ? { manuel: true } : {}),
    actif: fd.get("actif") === "on",
  };
  await enregistrerProduit(produit, ancienId);
  revalidatePath("/", "layout");
  redirect(`/admin/produits?ok=${encodeURIComponent(produit.nom)}`);
}

export async function effacerProduit(fd: FormData) {
  await exigerAdmin();
  await supprimerProduit(String(fd.get("id")));
  revalidatePath("/", "layout");
  redirect("/admin/produits");
}

/* ---------------- Commandes ---------------- */
export async function majStatutCommande(fd: FormData) {
  await exigerAdmin();
  const id = String(fd.get("id"));
  const statut = String(fd.get("statut")) as StatutCommande;
  if (!(statut in LIBELLES_STATUT)) return;
  await changerStatut(id, statut, String(fd.get("note") ?? "").trim() || undefined);
  revalidatePath(`/admin/commandes/${id}`);
}

/* ---------------- Messages ---------------- */
export async function basculerLu(fd: FormData) {
  await exigerAdmin();
  await marquerLu(String(fd.get("id")), fd.get("lu") === "1");
  revalidatePath("/admin/messages");
}

export async function effacerMessage(fd: FormData) {
  await exigerAdmin();
  await supprimerMessage(String(fd.get("id")));
  revalidatePath("/admin/messages");
}
