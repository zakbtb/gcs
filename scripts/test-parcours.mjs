/**
 * Test de bout en bout du site GCS (parcours d'achat complet + admin + formulaires).
 *
 * Prérequis : le site tourne (npm run dev ou npm start) en MODE DÉMO (sans clés Stripe),
 * et Playwright est installé :  npm i -D playwright && npx playwright install chromium
 *
 * Lancement :  BASE_URL=http://localhost:3000 ADMIN_PASSWORD=xxx npm run test:parcours
 *
 * ⚠️ Le test passe de vraies commandes (simulées) : il sauvegarde puis restaure data/produits.json
 * et supprime les commandes/messages qu'il a créés.
 */
import { chromium } from "playwright";
import { promises as fs } from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const DATA = process.env.DATA_DIR || path.join(process.cwd(), "data");
const PRODUITS = path.join(DATA, "produits.json");

let ok = 0;
const echecs = [];
async function etape(nom, fn) {
  try {
    await fn();
    ok++;
    console.log(`  ✓ ${nom}`);
  } catch (e) {
    echecs.push(nom);
    console.log(`  ✗ ${nom}\n    → ${e.message.split("\n")[0]}`);
    if (process.env.CAPTURES) await page?.screenshot({ path: path.join(process.env.CAPTURES, `echec-${echecs.length}.png`), fullPage: true }).catch(() => {});
  }
}
function attendu(cond, msg) {
  if (!cond) throw new Error(msg);
}
const lireJson = async (f, d) => {
  try {
    return JSON.parse(await fs.readFile(f, "utf8"));
  } catch {
    return d;
  }
};
const stockVariante = async (pid, vid) => {
  const cat = await lireJson(PRODUITS, {});
  const p = cat.produits.find((x) => x.id === pid);
  return vid ? p.variantes.find((v) => v.id === vid).stock : p.stock;
};

const sauvegardeProduits = await fs.readFile(PRODUITS, "utf8");
const commandesAvant = (await lireJson(path.join(DATA, "commandes.json"), [])).map((c) => c.id);
const messagesAvant = (await lireJson(path.join(DATA, "messages.json"), [])).map((m) => m.id);
const outboxAvant = new Set(await fs.readdir(path.join(DATA, "outbox")).catch(() => []));

const navigateur = await chromium.launch();
const ctx = await navigateur.newContext({ viewport: { width: 390, height: 844 }, locale: "fr-FR" }); // mobile d'abord
const page = await ctx.newPage();
const erreursJs = [];
page.on("pageerror", (e) => erreursJs.push(e.message));

let numero = "";

try {
  console.log("\n▶ Cookies (CNIL)");
  await etape("Le bandeau s'affiche et aucun cookie non essentiel n'est déposé avant le choix", async () => {
    await page.goto(BASE + "/");
    await page.getByRole("dialog", { name: /cookies/i }).waitFor();
    const cookies = await ctx.cookies();
    attendu(!cookies.some((c) => /^_ga|^NID|^_gid/.test(c.name)), "cookie non essentiel présent");
    attendu(!cookies.some((c) => c.name === "gcs_consentement"), "consentement déjà enregistré");
  });
  await etape("« Tout refuser » enregistre le refus et ferme le bandeau", async () => {
    await page.getByRole("button", { name: "Tout refuser" }).click();
    const c = (await ctx.cookies()).find((x) => x.name === "gcs_consentement");
    attendu(c && decodeURIComponent(c.value).includes('"tiers":false'), "refus non mémorisé");
    attendu(!(await page.getByRole("dialog", { name: /cookies/i }).isVisible()), "bandeau encore visible");
  });
  await etape("« Gérer les cookies » rouvre le panneau depuis le pied de page", async () => {
    await page.getByRole("button", { name: "Gérer les cookies" }).first().click();
    await page.getByRole("dialog", { name: /cookies/i }).waitFor();
    await page.getByRole("button", { name: "Tout refuser" }).click();
  });

  console.log("\n▶ Simulateur de prix réparation");
  await etape("Choix du modèle + pièce → prix affiché, bouton réserver pré-remplit le formulaire", async () => {
    await page.goto(BASE + "/reparation-telephone-montpellier");
    await page.locator("#sim-modele").selectOption({ label: "iPhone 13" });
    await page.getByRole("button", { name: /^Batterie/ }).click();
    const aside = page.getByRole("complementary", { name: "Votre estimation" });
    await aside.getByText(/\d+\s?€/).first().waitFor();
    await aside.getByRole("button", { name: /Réserver cette réparation/ }).click();
    const msg = page.locator("#rendez-vous textarea");
    await page.waitForFunction(() => document.querySelector("#rendez-vous textarea")?.value.includes("iPhone 13"));
    attendu((await msg.inputValue()).includes("Batterie"), "message non pré-rempli");
  });
  await etape("Écran : choix de la qualité (compatible / origine) modifie le prix", async () => {
    await page.getByRole("button", { name: /^Écran/ }).click();
    const aside = page.getByRole("complementary", { name: "Votre estimation" });
    const prix1 = await aside.locator("p.text-5xl").innerText();
    await aside.getByLabel(/Qualité origine/).check();
    const prix2 = await aside.locator("p.text-5xl").innerText();
    attendu(prix1 !== prix2, `prix identique (${prix1})`);
  });

  console.log("\n▶ Boutique : catalogue, filtres, recherche");
  await etape("Recherche « chargeur » filtre le catalogue", async () => {
    await page.goto(BASE + "/boutique");
    await page.locator("#recherche").fill("chargeur");
    await page.waitForURL(/q=chargeur/);
    const n = await page.locator("main ul li article").count();
    attendu(n >= 3 && n <= 6, `${n} résultats`);
  });
  await etape("Filtre catégorie + tri par prix croissant", async () => {
    await page.goto(BASE + "/boutique?categorie=coques&tri=prix-asc");
    await page.getByText(/^4 produits/).waitFor();
    const prix = await page.locator("main ul li article .font-display").allInnerTexts();
    const nombres = prix.map((p) => parseFloat(p.replace(/[^\d,]/g, "").replace(",", ".")));
    attendu(nombres.length === 4, `${nombres.length} coques`);
    attendu(nombres.every((v, i) => i === 0 || v >= nombres[i - 1]), "tri incorrect");
  });

  console.log("\n▶ Fiche produit et panier");
  const stockAvant = await stockVariante("coque-silicone", "bleu-iphone15");
  await etape("Fiche produit : variante (couleur + modèle), quantité, ajout au panier", async () => {
    await page.goto(BASE + "/boutique/coque-silicone");
    await page.getByRole("button", { name: "Bleu", exact: true }).click();
    await page.getByRole("button", { name: "iPhone 15", exact: true }).click();
    await page.getByRole("button", { name: "Augmenter la quantité" }).click();
    await page.getByRole("button", { name: "Ajouter au panier" }).click();
    await page.getByText("Ajouté au panier !").waitFor();
    await page.getByRole("link", { name: /Panier : 2 articles/ }).waitFor();
  });
  await etape("Variante en rupture signalée (Rose · iPhone 13)", async () => {
    await page.getByRole("button", { name: "Rose", exact: false }).first().click();
    await page.getByRole("button", { name: /iPhone 13/ }).first().click();
    await page.getByText(/Rupture de stock/).waitFor();
  });
  await etape("Produit en rupture : pas de bouton d'ajout", async () => {
    await page.goto(BASE + "/boutique/chargeur-magsafe-15w");
    await page.getByText(/momentanément indisponible/).waitFor();
    attendu((await page.getByRole("button", { name: "Ajouter au panier" }).count()) === 0, "bouton présent");
  });
  await etape("Ajout d'un second produit sans variante", async () => {
    await page.goto(BASE + "/boutique/film-hydrogel-ecran");
    await page.getByRole("button", { name: "Ajouter au panier" }).click();
    await page.getByRole("link", { name: /Panier : 3 articles/ }).waitFor();
  });
  await etape("Panier : modification de quantité, suppression, sous-total", async () => {
    await page.goto(BASE + "/panier");
    await page.getByRole("button", { name: /Augmenter la quantité de Film hydrogel/ }).click();
    await page.getByRole("link", { name: /Panier : 4 articles/ }).waitFor();
    await page.getByRole("button", { name: /Diminuer la quantité de Film hydrogel/ }).click();
    const st = await page.getByRole("complementary", { name: "Récapitulatif" }).innerText();
    attendu(st.includes("54,70"), `sous-total inattendu : ${st.slice(0, 120)}`); // 2 × 19,90 + 14,90
  });
  await etape("Panier conservé après fermeture/réouverture de la page", async () => {
    const p2 = await ctx.newPage();
    await p2.goto(BASE + "/panier");
    await p2.getByText("Coque silicone douce").waitFor();
    await p2.close();
  });
  await etape("Suppression d'un article", async () => {
    await page.goto(BASE + "/boutique/cable-3-en-1");
    await page.getByRole("button", { name: "Ajouter au panier" }).click();
    await page.goto(BASE + "/panier");
    const ligne = page.locator("main ul.divide-y > li", { hasText: "Câble 3 en 1" });
    await ligne.waitFor();
    await ligne.getByRole("button", { name: "Supprimer" }).click();
    await ligne.waitFor({ state: "detached" });
    await page.getByRole("link", { name: /Panier : 3 articles/ }).waitFor();
  });

  console.log("\n▶ Commande et paiement");
  await etape("Formulaire de commande : erreurs affichées si champs vides / CGV non cochées", async () => {
    await page.goto(BASE + "/commande");
    await page.locator('input[name="prenom"]').waitFor();
    await page.getByRole("button", { name: "Continuer vers le paiement" }).click();
    await page.getByRole("alert").first().waitFor();
    await page.getByText("Vous devez accepter les conditions générales de vente.").waitFor();
    attendu(!(await page.locator('input[name="cgv"]').isChecked()), "CGV pré-cochées !");
  });
  await etape("Livraison à domicile : offerte au-delà du seuil (54,70 € ≥ 49 €)", async () => {
    await page.locator('input[name="prenom"]').fill("Camille");
    await page.locator('input[name="nom"]').fill("Test");
    await page.locator('input[name="email"]').fill("camille.test@example.com");
    await page.locator('input[name="telephone"]').fill("06 12 34 56 78");
    await page.locator('input[name="mode"][value="livraison"]').check();
    await page.locator('input[name="adresse"]').fill("1 rue de la Loge");
    await page.locator('input[name="codePostal"]').fill("34000");
    await page.locator('input[name="ville"]').fill("Montpellier");
    const recap = await page.getByRole("complementary", { name: /Récapitulatif/ }).innerText();
    attendu(recap.includes("Gratuit") && recap.includes("54,70"), `total livraison inattendu : ${recap.replace(/\n/g, " | ")}`);
    await page.locator('input[name="cgv"]').check();
    await page.getByRole("button", { name: "Continuer vers le paiement" }).click();
    await page.waitForURL(/\/commande\/paiement\?/);
  });
  await etape("Carte refusée (4000 0000 0000 0002) → page « Paiement refusé »", async () => {
    await page.getByText(/Mode démo/).waitFor();
    await page.locator("#cb-numero").fill("4000000000000002");
    await page.locator("#cb-exp").fill("1230");
    await page.locator("#cb-cvc").fill("123");
    await page.getByRole("button", { name: /Payer 54,70/ }).click();
    await page.waitForURL(/paiement-refuse/);
    await page.getByRole("heading", { name: "Paiement refusé" }).waitFor();
  });
  await etape("Aucun stock décrémenté après un refus", async () => {
    attendu((await stockVariante("coque-silicone", "bleu-iphone15")) === stockAvant, "stock modifié");
  });
  await etape("Nouvel essai avec 4242 4242 4242 4242 → confirmation + numéro de commande", async () => {
    await page.getByRole("link", { name: "Réessayer le paiement" }).click();
    await page.getByText(/Tentative précédente refusée/).waitFor();
    await page.locator("#cb-numero").fill("4242424242424242");
    await page.locator("#cb-exp").fill("1230");
    await page.locator("#cb-cvc").fill("123");
    await page.getByRole("button", { name: /Payer/ }).click();
    await page.waitForURL(/\/commande\/confirmation/);
    numero = (await page.getByTestId("numero-commande").innerText()).trim();
    attendu(/^GCS-\d{6}-[A-Z0-9]{4}$/.test(numero), `numéro invalide : ${numero}`);
  });
  await etape("Panier vidé après la commande", async () => {
    await page.getByRole("link", { name: /Panier vide/ }).waitFor();
  });
  await etape("Stock décrémenté (coque bleue iPhone 15 : -2)", async () => {
    attendu((await stockVariante("coque-silicone", "bleu-iphone15")) === stockAvant - 2, "stock non décrémenté");
  });
  await etape("E-mail de confirmation envoyé au client (data/outbox)", async () => {
    const nouveaux = (await fs.readdir(path.join(DATA, "outbox"))).filter((f) => !outboxAvant.has(f) && f.includes("camille.test"));
    attendu(nouveaux.length >= 1, "aucun e-mail");
    const html = await fs.readFile(path.join(DATA, "outbox", nouveaux[0]), "utf8");
    attendu(html.includes(numero) && html.includes("54,70"), "contenu de l'e-mail incorrect");
  });
  await etape("La page de confirmation reste consultable via le lien de l'e-mail et ne recrédite rien", async () => {
    await page.reload();
    await page.getByTestId("numero-commande").waitFor();
    attendu((await stockVariante("coque-silicone", "bleu-iphone15")) === stockAvant - 2, "double décrément");
  });
  await etape("Une commande ne peut pas être consultée sans son jeton secret", async () => {
    const r = await page.goto(`${BASE}/commande/confirmation?commande=${numero}&t=mauvais`);
    attendu(!page.url().includes("confirmation"), `accès non protégé (${r.status()})`);
  });

  console.log("\n▶ Rupture de stock pendant la commande");
  await etape("Produit épuisé entre l'ajout au panier et la commande → page rupture", async () => {
    await page.goto(BASE + "/boutique/batterie-externe-20000");
    await page.getByRole("button", { name: "Ajouter au panier" }).click();
    // Un autre client achète le dernier exemplaire : on simule en mettant le stock à 0
    const cat = await lireJson(PRODUITS, {});
    cat.produits.find((p) => p.id === "batterie-externe-20000").stock = 0;
    await fs.writeFile(PRODUITS, JSON.stringify(cat, null, 2));
    await page.goto(BASE + "/commande");
    await page.locator('input[name="prenom"]').waitFor();
    await page.locator('input[name="prenom"]').fill("Alex");
    await page.locator('input[name="nom"]').fill("Rupture");
    await page.locator('input[name="email"]').fill("alex.rupture@example.com");
    await page.locator('input[name="telephone"]').fill("0612345678");
    await page.locator('input[name="cgv"]').check();
    await page.getByRole("button", { name: "Continuer vers le paiement" }).click();
    await page.waitForURL(/\/commande\/rupture/);
    await page.getByText(/Épuisé/).waitFor();
    await page.getByRole("button", { name: /Ajuster mon panier/ }).click();
    await page.getByRole("link", { name: /Panier vide/ }).waitFor();
  });

  await etape("Produit épuisé entre la commande et le paiement → page rupture, aucun paiement", async () => {
    await page.goto(BASE + "/boutique/ecouteurs-filaires-usb-c");
    await page.getByRole("button", { name: "Ajouter au panier" }).click();
    await page.goto(BASE + "/commande");
    await page.locator('input[name="prenom"]').waitFor();
    await page.locator('input[name="prenom"]').fill("Alex");
    await page.locator('input[name="nom"]').fill("Rupture");
    await page.locator('input[name="email"]').fill("alex.rupture@example.com");
    await page.locator('input[name="telephone"]').fill("0612345678");
    await page.locator('input[name="cgv"]').check();
    await page.getByRole("button", { name: "Continuer vers le paiement" }).click();
    await page.waitForURL(/\/commande\/paiement\?/);
    const cat = await lireJson(PRODUITS, {});
    cat.produits.find((p) => p.id === "ecouteurs-filaires-usb-c").stock = 0;
    await fs.writeFile(PRODUITS, JSON.stringify(cat, null, 2));
    await page.locator("#cb-numero").fill("4242424242424242");
    await page.locator("#cb-exp").fill("1230");
    await page.locator("#cb-cvc").fill("123");
    await page.getByRole("button", { name: /Payer/ }).click();
    await page.waitForURL(/\/commande\/rupture/);
    const cmds = await lireJson(path.join(DATA, "commandes.json"), []);
    attendu(!cmds.some((c) => c.client.email === "alex.rupture@example.com" && c.statut === "payee"), "commande payée malgré la rupture");
    await page.getByRole("button", { name: /Ajuster mon panier/ }).click();
  });

  console.log("\n▶ Formulaires");
  await etape("Demande de devis site web : validation + envoi + accusé de réception", async () => {
    await page.goto(BASE + "/creation-site-web-montpellier#devis");
    const form = page.locator("#devis form");
    await form.getByRole("button", { name: /Recevoir mon devis/ }).click();
    await form.getByText("Indiquez votre nom.").waitFor();
    await form.getByLabel(/Nom et prénom/).fill("Sam Artisan");
    await form.getByLabel(/^E-mail/).fill("sam.artisan@example.com");
    await form.getByLabel(/Type de projet/).selectOption("Site vitrine");
    await form.getByLabel(/Votre projet/).fill("Je suis plombier et je veux un site vitrine.");
    await form.getByRole("button", { name: /Recevoir mon devis/ }).click();
    await page.getByText("Merci, votre demande est bien envoyée !").waitFor();
  });
  await etape("Les formulaires portent la mention RGPD et aucune case pré-cochée", async () => {
    await page.goto(BASE + "/contact");
    await page.getByText(/Les informations recueillies sont traitées par Pronet Services Plus/).waitFor();
    attendu((await page.locator('main input[type="checkbox"]:checked').count()) === 0, "case pré-cochée");
  });
  await etape("Carte Google Maps bloquée tant que les contenus tiers sont refusés", async () => {
    attendu((await page.locator('iframe[src*="google.com/maps"]').count()) === 0, "carte chargée sans consentement");
    await page.getByRole("button", { name: "Afficher la carte" }).click();
    await page.locator('iframe[src*="google.com/maps"]').waitFor({ state: "attached" });
  });

  console.log("\n▶ Admin");
  await etape("Accès admin refusé sans connexion", async () => {
    await page.goto(BASE + "/admin/commandes");
    await page.waitForURL(/\/admin\/connexion/);
  });
  await etape("Mauvais mot de passe refusé", async () => {
    await page.getByLabel("Mot de passe").fill("mauvais-mot-de-passe");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await page.getByText("Mot de passe incorrect.").waitFor();
  });
  if (ADMIN_PASSWORD) {
    await etape("Connexion admin + commande visible", async () => {
      await page.getByLabel("Mot de passe").fill(ADMIN_PASSWORD);
      await page.getByRole("button", { name: "Se connecter" }).click();
      await page.waitForURL(BASE + "/admin");
      await page.getByText(numero).first().waitFor();
    });
    await etape("Changement de statut de la commande → « Expédiée »", async () => {
      await page.goto(`${BASE}/admin/commandes/${numero}`);
      await page.locator("#statut").selectOption("expediee");
      await page.locator("#note").fill("Colissimo 6A123");
      await page.getByRole("button", { name: "Enregistrer" }).click();
      await page.getByText("Colissimo 6A123").waitFor();
    });
    await etape("Modification d'un produit (prix) depuis l'admin, visible en boutique", async () => {
      await page.goto(`${BASE}/admin/produits/cable-3-en-1`);
      await page.locator("#prix").fill("11.90");
      await page.getByRole("button", { name: "Enregistrer le produit" }).click();
      await page.waitForURL(/\/admin\/produits\?ok=/);
      await page.goto(`${BASE}/boutique/cable-3-en-1`);
      await page.getByText("11,90 €").first().waitFor();
    });
    await etape("Création d'un nouveau produit depuis l'admin", async () => {
      await page.goto(`${BASE}/admin/produits/nouveau`);
      await page.locator("#nom").fill("Support voiture magnétique test");
      await page.locator("#categorie").selectOption("chargeurs");
      await page.locator("#prix").fill("15");
      await page.locator("#stock").fill("4");
      await page.getByRole("button", { name: "Enregistrer le produit" }).click();
      await page.waitForURL(/\/admin\/produits\?ok=/);
      await page.goto(`${BASE}/boutique/support-voiture-magnetique-test`);
      await page.getByRole("heading", { name: "Support voiture magnétique test" }).waitFor();
    });
    await etape("Message de devis visible dans l'admin", async () => {
      await page.goto(`${BASE}/admin/messages`);
      await page.getByText("Sam Artisan").waitFor();
    });
  } else {
    console.log("  (ADMIN_PASSWORD non fourni : tests admin connectés ignorés)");
  }

  console.log("\n▶ Divers");
  await etape("Page 404 personnalisée", async () => {
    const r = await page.goto(BASE + "/cette-page-n-existe-pas");
    attendu(r.status() === 404, `statut ${r.status()}`);
    await page.getByRole("heading", { name: "Cette page est introuvable" }).waitFor();
  });
  await etape("Produit inexistant → 404", async () => {
    const r = await page.goto(BASE + "/boutique/produit-fantome");
    attendu(r.status() === 404, `statut ${r.status()}`);
  });
  await etape("Aucune erreur JavaScript pendant le parcours", async () => {
    attendu(erreursJs.length === 0, erreursJs.join(" | "));
  });
} finally {
  await navigateur.close();
  // Nettoyage : catalogue restauré, commandes/messages/e-mails de test supprimés
  await fs.writeFile(PRODUITS, sauvegardeProduits);
  const cmd = path.join(DATA, "commandes.json");
  const cmds = await lireJson(cmd, null);
  if (cmds) await fs.writeFile(cmd, JSON.stringify(cmds.filter((c) => commandesAvant.includes(c.id)), null, 2));
  const msg = path.join(DATA, "messages.json");
  const msgs = await lireJson(msg, null);
  if (msgs) await fs.writeFile(msg, JSON.stringify(msgs.filter((m) => messagesAvant.includes(m.id)), null, 2));
  for (const f of await fs.readdir(path.join(DATA, "outbox")).catch(() => [])) {
    if (!outboxAvant.has(f)) await fs.unlink(path.join(DATA, "outbox", f));
  }
}

console.log(`\n${ok} réussi(s), ${echecs.length} échec(s)`);
if (echecs.length) {
  console.log("Échecs :\n - " + echecs.join("\n - "));
  process.exit(1);
}
