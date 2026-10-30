# Site GCS – Global Connect Services

Site complet de **GCS (Pronet Services Plus)**, Montpellier : création de sites web (activité mise en avant), réparation de smartphones avec simulateur de prix, boutique e-commerce avec paiement Stripe, espace admin et pages légales.

Technologies : **Next.js 16** (React 19), **Tailwind CSS 4**, **Stripe**, données en **fichiers JSON** (pas de base de données à installer).

---

## 1. Lancer le site en local

Prérequis : [Node.js](https://nodejs.org) 20 ou plus récent.

```bash
npm install                    # installe les dépendances (une seule fois)
cp .env.example .env.local     # crée votre fichier de réglages, puis ouvrez-le pour le compléter
npm run dev                    # lance le site sur http://localhost:3000
```

- Le site : http://localhost:3000
- L'admin : http://localhost:3000/admin (mot de passe = `ADMIN_PASSWORD` dans `.env.local`)

Sans clés Stripe, la boutique fonctionne en **mode démo** (paiement simulé, aucun débit) avec les cartes de test :

| Carte | Résultat |
|---|---|
| `4242 4242 4242 4242` | paiement accepté |
| `4000 0000 0000 0002` | carte refusée |
| `4000 0000 0000 9995` | fonds insuffisants |

(date d'expiration future et CVC quelconques)

Sans SMTP, les e-mails (confirmation de commande, accusés de réception) sont enregistrés dans `data/outbox/` : ouvrez les fichiers `.html` dans votre navigateur pour les voir.

---

## 2. Où modifier quoi ?

| Je veux modifier… | Fichier |
|---|---|
| Nom, adresse, téléphone, SIRET, horaires, hébergeur, médiateur… | `src/config/entreprise.ts` |
| Frais de livraison, seuil de livraison offerte, garanties | `src/config/entreprise.ts` (bloc `boutique`) |
| Offres et prix « à partir de » des sites web | `src/config/entreprise.ts` (bloc `offresWeb`) |
| **Prix des réparations** | `data/tarifs-reparation.json` |
| **Produits de la boutique** | espace admin `/admin/produits` **ou** `data/produits.json` |
| Photos des produits | dossier `public/images/produits/` |
| Textes des pages | `src/app/(site)/…/page.tsx` |

> Les champs non remplis de `src/config/entreprise.ts` commencent par `[À COMPLÉTER` et s'affichent **surlignés en jaune** sur le site pour que vous les repériez.

### 2.1 Modifier les prix des réparations

Ouvrez `data/tarifs-reparation.json`. Chaque modèle ressemble à ceci :

```json
{
  "id": "iphone-13",
  "nom": "iPhone 13",
  "annee": 2021,
  "prix": {
    "ecran": { "Qualité compatible": 129, "Qualité origine": 229 },
    "batterie": 64,
    "micro-soudure": null
  }
}
```

- un **nombre** = un prix unique en euros TTC ;
- un **objet** = plusieurs qualités au choix (le client choisit dans le simulateur) ;
- `null` = affiché « Sur devis » ;
- pour retirer une réparation d'un modèle, supprimez la ligne.

Les noms, descriptions et durées des réparations sont dans le bloc `"reparations"` en haut du fichier.

**Ajouter un modèle** : copiez un bloc modèle, changez `id`, `nom` et les prix.
**Ajouter une marque (Samsung…)** : dans `"marques"`, remplissez le bloc `samsung` (retirez `"bientot": true`) ou copiez le bloc `apple` en changeant `id`, `nom` et `modeles`.

Les modifications sont visibles **immédiatement**, sans redémarrage (pensez à garder un JSON valide : guillemets doubles, virgules entre les éléments ; un validateur comme [jsonlint.com](https://jsonlint.com) aide).

> ⚠️ Les prix fournis sont **fictifs** : remplacez-les par vos vrais tarifs avant la mise en ligne. Les modèles iPhone 18 Pro / 18 Pro Max ont été ajoutés par anticipation : vérifiez qu'ils correspondent bien aux modèles commercialisés et ajoutez les éventuels autres modèles sortis récemment.

### 2.2 Gérer les produits

**Le plus simple : l'espace admin** (`/admin/produits`) permet d'ajouter, modifier, masquer ou supprimer un produit, de gérer les couleurs/modèles et le stock de chaque variante.

Pour les photos : déposez vos fichiers (JPG, PNG, WebP, carrés de préférence, ~1000 × 1000 px) dans `public/images/produits/`, puis indiquez leur adresse dans le produit, par exemple `/images/produits/coque-noire.jpg`. Les images fournies sont des illustrations provisoires à remplacer.

Vous pouvez aussi éditer `data/produits.json` directement (même structure que celle visible dans l'admin).

### 2.3 Commandes et messages

- `/admin/commandes` : liste des commandes, détail, changement de statut (payée → en préparation → expédiée / prête à retirer → livrée). Indiquez le n° de suivi dans la note.
- `/admin/messages` : demandes de devis web, rendez-vous réparation, estimations de rachat et messages de contact.
- Les données sont stockées dans `data/commandes.json` et `data/messages.json` : **sauvegardez le dossier `data/` régulièrement**.

---

## 3. Paiement Stripe

### 3.1 Tester avec Stripe (mode test)

1. Créez un compte sur [stripe.com](https://dashboard.stripe.com/register) (gratuit).
2. Dans le tableau de bord, restez en **mode test** et copiez vos clés depuis *Développeurs › Clés API* :
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
3. Redémarrez le site. La page de paiement affiche maintenant le formulaire Stripe (bandeau « Stripe en mode test ») : utilisez `4242 4242 4242 4242` pour un paiement accepté, `4000 0000 0000 0002` pour un refus, `4000 0025 0000 3155` pour tester l'authentification 3-D Secure.
4. **Webhook** (recommandé, confirme les commandes même si le client ferme la page après avoir payé) :
   - en local : installez la [Stripe CLI](https://docs.stripe.com/stripe-cli) puis `stripe listen --forward-to localhost:3000/api/stripe/webhook` et copiez le secret `whsec_...` affiché dans `STRIPE_WEBHOOK_SECRET` ;
   - en ligne : *Développeurs › Webhooks › Ajouter un endpoint* : `https://votre-domaine.fr/api/stripe/webhook`, événements `payment_intent.succeeded` et `payment_intent.payment_failed`, puis copiez le secret de signature.

### 3.2 Passer en paiement réel

1. Dans Stripe, **activez votre compte** (informations sur l'entreprise, SIRET, IBAN pour les virements, pièce d'identité du dirigeant).
2. Basculez le tableau de bord en **mode live** et récupérez les clés `sk_live_...` et `pk_live_...`.
3. Recréez le webhook en mode live (même adresse) et récupérez son nouveau secret `whsec_...`.
4. Remplacez les trois valeurs chez votre hébergeur (`STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`) et redémarrez.
5. Faites un vrai achat de quelques euros avec votre propre carte, vérifiez la commande dans `/admin` et l'e-mail reçu, puis remboursez-vous depuis Stripe.
6. Vérifiez que `PAIEMENT_DEMO` **n'est pas** défini en production.

Le bandeau en haut de l'admin indique toujours le mode actif : *MODE DÉMO*, *Stripe MODE TEST* ou *Stripe EN PRODUCTION*.

> Sécurité : le mode démo est automatiquement **désactivé en production** (sauf si `PAIEMENT_DEMO=1`), et dès que des clés Stripe sont présentes. Les prix sont toujours recalculés côté serveur et le paiement est vérifié auprès de Stripe : un client ne peut pas modifier le montant.

**SumUp** : l'intégration est faite avec Stripe (le plus simple et le mieux documenté). Votre terminal SumUp reste utilisable en boutique ; si vous préférez SumUp en ligne, le code de paiement est isolé dans `src/lib/stripe.ts`, `src/app/api/paiement/` et `src/app/(site)/commande/paiement/`.

---

## 4. E-mails

Renseignez dans `.env.local` (ou chez votre hébergeur) les accès SMTP de votre messagerie professionnelle (OVH, Gmail Workspace, Brevo, etc.) :

```
SMTP_HOST=ssl0.ovh.net
SMTP_PORT=465
SMTP_USER=contact@votre-domaine.fr
SMTP_PASS=********
MAIL_FROM="GCS Montpellier <contact@votre-domaine.fr>"
MAIL_ADMIN=contact@votre-domaine.fr        # reçoit les nouvelles commandes et demandes
```

E-mails envoyés : confirmation de commande au client (+ copie à `MAIL_ADMIN`), accusé de réception des formulaires (+ notification à `MAIL_ADMIN`).

---

## 5. Mettre le site en ligne

Le site a besoin d'un **hébergement Node.js avec un disque persistant** (les commandes, messages et modifications de produits sont écrits dans le dossier `data/`).

**Options recommandées :**

| Hébergeur | Pourquoi | Points d'attention |
|---|---|---|
| **Railway** ou **Render** | déploiement depuis GitHub en quelques clics, HTTPS automatique | ajouter un *volume* / *disque persistant* monté sur `/data` et définir `DATA_DIR=/data` (copiez-y le contenu de votre dossier `data/` au premier lancement) |
| **VPS** (OVH, Hostinger, Scaleway… ~5 €/mois) | contrôle total, données en France possible | installer Node.js, `pm2`, Nginx et un certificat HTTPS Let's Encrypt (Certbot) |
| Hébergement mutualisé avec Node.js (o2switch, Hostinger…) | prix tout compris, souvent avec e-mails | vérifier la prise en charge de Node 20+ |

> ⚠️ **Vercel / Netlify** ne conviennent pas tels quels : leur système de fichiers n'est pas persistant, les commandes et modifications de l'admin seraient perdues. (Possible en remplaçant `src/lib/store.ts` par une base de données.)

**Étapes générales :**

```bash
# sur le serveur (ou via l'interface de l'hébergeur)
npm install
npm run build        # NEXT_PUBLIC_SITE_URL doit être défini AVANT cette étape
npm start            # sert le site sur le port 3000 (variable PORT pour en changer)
```

Variables d'environnement à définir chez l'hébergeur : toutes celles de `.env.example` (`NEXT_PUBLIC_SITE_URL=https://www.votre-domaine.fr`, `ADMIN_PASSWORD`, `ADMIN_SECRET`, clés Stripe, SMTP, `DATA_DIR`).

**HTTPS** : obligatoire. Il est fourni automatiquement par Railway/Render, ou via Let's Encrypt sur un VPS. Le site envoie l'en-tête `Strict-Transport-Security` pour forcer le HTTPS.

**Après la mise en ligne :**
1. Faites pointer votre nom de domaine vers l'hébergeur.
2. Déclarez le site dans [Google Search Console](https://search.google.com/search-console) et envoyez le plan du site : `https://votre-domaine.fr/sitemap.xml`.
3. Créez/optimisez votre fiche **Google Business Profile** avec le lien du site (essentiel pour « réparation téléphone Montpellier »), et collez le lien « Laisser un avis » dans `googleAvis` du fichier de configuration.
4. Renseignez l'hébergeur choisi dans `src/config/entreprise.ts` (mentions légales).

> Après une modification de `src/config/entreprise.ts` ou des textes, relancez `npm run build` puis redémarrez. Les modifications des fichiers `data/*.json` et de l'admin, elles, sont immédiates.

---

## 6. Tester le parcours d'achat

Un test automatique vérifie 39 points : bandeau cookies CNIL, simulateur, catalogue/filtres, variantes, panier persistant, commande, carte refusée puis acceptée, stock décrémenté, e-mail de confirmation, ruptures de stock, formulaires, admin, 404…

```bash
npm i -D playwright && npx playwright install chromium   # une seule fois
npm run dev                                              # dans un premier terminal
ADMIN_PASSWORD=votre-mot-de-passe npm run test:parcours  # dans un second terminal
```

Le test fonctionne en mode démo ; il restaure le catalogue et supprime les commandes de test à la fin.

---

## 7. Conformité légale : ce qui est en place

- Mentions légales, politique de confidentialité RGPD, politique cookies, CGV boutique (avec formulaire de rétractation), conditions de réparation, conditions reconditionnés & rachat, conditions de création de sites web : liens dans le pied de page de chaque page.
- Bandeau cookies : rien de non essentiel avant consentement, « Tout refuser » aussi visible que « Tout accepter », choix par catégorie, modifiable à tout moment (« Gérer les cookies »), choix conservé 6 mois. La carte Google Maps ne se charge qu'après consentement. Polices hébergées localement (aucun appel à Google Fonts).
- Formulaires : mention d'information RGPD sous chacun, aucune case pré-cochée, seules les données utiles sont demandées.
- Prix TTC, encadré officiel des garanties légales, information sur la nature des pièces de réparation, bouton de paiement explicite.

**À faire de votre côté** : compléter les informations manquantes (liste ci-dessous), **adhérer à un médiateur de la consommation** (obligatoire pour vendre aux particuliers), et faire relire les pages légales par un professionnel du droit si vous avez un doute, notamment si votre activité de transfert d'argent ou de cartes PCS est soumise à des mentions spécifiques de votre partenaire.

### Informations à compléter dans `src/config/entreprise.ts`

- Forme juridique, capital social, SIRET, RCS, n° de TVA intracommunautaire, code APE
- Nom du directeur de la publication
- Adresse de la boutique (n° et rue) et, si possible, coordonnées GPS
- Téléphone (affiché et format international pour les liens)
- E-mail de contact et e-mail pour les demandes RGPD
- Hébergeur : nom, adresse, téléphone, site
- Médiateur de la consommation : nom, adresse, site
- Assurance RC Pro (facultatif, recommandé)
- Réseau partenaire de transfert d'argent et réseau(x) point relais
- Liens Instagram / Facebook / avis Google (facultatifs)
- Vos vrais tarifs de réparation (`data/tarifs-reparation.json`), vos produits et photos, vos prix de création de sites (`offresWeb`, `forfaitMaintenance`), vos garanties et frais de livraison (`boutique`)
