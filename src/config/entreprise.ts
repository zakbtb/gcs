/**
 * ============================================================================
 *  FICHIER DE CONFIGURATION UNIQUE DE L'ENTREPRISE
 * ============================================================================
 *  Toutes les informations de la société utilisées sur le site (en-tête,
 *  pied de page, pages légales, SEO, e-mails…) viennent de ce fichier.
 *
 *  ➜ Chaque valeur qui commence par "[À COMPLÉTER" doit être remplie.
 *    Astuce : cherchez « À COMPLÉTER » dans ce fichier (Ctrl+F).
 *    Tant qu'un champ n'est pas rempli, il s'affiche surligné en jaune sur
 *    le site pour que vous le repériez facilement.
 * ============================================================================
 */

export const A_COMPLETER = "[À COMPLÉTER";

export const entreprise = {
  /* ---------- Identité ---------- */
  nomCommercial: "GCS",
  nomComplet: "Global Connect Services",
  raisonSociale: "Pronet Services Plus",
  formeJuridique: "SASU",
  capitalSocial: "1 000 €",
  siret: "938 754 488 00014",
  rcs: "RCS Montpellier 938 754 488",
  tvaIntracom: "FR08 938754488",
  codeApe: "4742Z",
  directeurPublication: "Zakarya BOUTOUB, Président",

  /* ---------- Coordonnées ---------- */
  adresse: {
    rue: "5 rue des Catalpas",
    codePostal: "34070",
    ville: "Montpellier",
    pays: "France",
    // Coordonnées GPS de la boutique (pour Google et la carte). Laisser null si inconnu.
    latitude: 43.592316 as number | null, // Base Adresse Nationale (api-adresse.data.gouv.fr)
    longitude: 3.884157 as number | null,
  },
  telephone: "06 15 98 75 93",
  // Format international sans espace, utilisé pour les liens « Appeler »
  telephoneLien: "+33615987593",
  email: "gcs.34070@gmail.com",
  emailDonneesPersonnelles: "gcs.34070@gmail.com",

  /* ---------- Réseaux sociaux ---------- */
  snapchat: "gcs34070",
  instagram: "", // ex. "https://instagram.com/xxx" (laisser vide si aucun)
  facebook: "",
  googleAvis: "", // lien « Laisser un avis Google » de votre fiche Google Business Profile

  /* ---------- Site ---------- */
  // Adresse définitive du site (sans / final). Sert au SEO, au sitemap et aux e-mails.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://www.gcs-montpellier.fr",

  /* ---------- Horaires ----------
   * jour : 0 = dimanche, 1 = lundi … 6 = samedi
   * plages au format "HH:MM"
   */
  horaires: [
    { jour: 1, nom: "Lundi", plages: [["10:00", "14:00"], ["16:00", "19:00"]] },
    { jour: 2, nom: "Mardi", plages: [["10:00", "14:00"], ["16:00", "19:00"]] },
    { jour: 3, nom: "Mercredi", plages: [["10:00", "14:00"], ["16:00", "19:00"]] },
    { jour: 4, nom: "Jeudi", plages: [["10:00", "14:00"], ["16:00", "19:00"]] },
    { jour: 5, nom: "Vendredi", plages: [["10:00", "13:00"], ["16:00", "19:00"]] },
    { jour: 6, nom: "Samedi", plages: [["10:00", "14:00"], ["16:00", "19:00"]] },
    { jour: 0, nom: "Dimanche", plages: [] },
  ] as { jour: number; nom: string; plages: [string, string][] }[],

  /* ---------- Hébergeur du site (obligatoire dans les mentions légales) ---------- */
  hebergeur: {
    nom: "Hostinger International Ltd",
    adresse: "61 Lordou Vironos Street, 6023 Larnaca, Chypre",
    telephone: "Formulaire de contact : hostinger.fr/contact",
    site: "https://www.hostinger.fr",
  },

  /* ---------- Médiateur de la consommation (obligatoire pour la vente aux particuliers) ---------- */
  mediateur: {
    // CM2C, référencé par la CECMC. Saisine en ligne : https://www.cm2c.net/declarer-un-litige.php
    nom: "CM2C (Centre de la médiation de la consommation de conciliateurs de justice)",
    adresse: "49 rue de Ponthieu, 75008 Paris",
    site: "https://www.cm2c.net",
  },

  /* ---------- Assurance (recommandé pour les prestations web) ---------- */
  // Facultatif : nom de l'assureur RC Pro et zone couverte. Vide = la phrase n'est pas affichée.
  assuranceRcPro: "",

  /* ---------- Services complémentaires ---------- */
  partenaireTransfertArgent: "Ria",
  partenairePointRelais: "Mondial Relay",
  zoneDomicile: "Montpellier et communes limitrophes", // zone de réparation à domicile
};

/* ============================================================================
 *  BOUTIQUE : livraison, garanties, paiement
 * ========================================================================== */
export const boutique = {
  devise: "EUR",
  livraison: {
    nom: "Livraison à domicile (Colis Privé, suivi)",
    delai: "2 à 4 jours ouvrés après expédition",
    prix: 4.9, // € TTC
    gratuiteDes: 49, // € TTC : livraison offerte à partir de ce montant (null pour désactiver)
    zones: "France métropolitaine",
  },
  retrait: {
    nom: "Retrait gratuit en boutique à Montpellier",
    delai: "Prêt sous 24 h ouvrées (vous recevez un e-mail)",
    prix: 0,
  },
  expeditionSous: "1 à 2 jours ouvrés",
  // Garantie commerciale sur les réparations (en mois). Indiquez la vôtre.
  garantieReparationMois: 6,
  // Garantie commerciale sur les téléphones reconditionnés (en mois), en plus de la garantie légale de conformité de 2 ans.
  garantieReconditionneMois: 12,
  // Avantages GCS offerts avec chaque téléphone, tablette ou montre (liste vide pour ne rien afficher)
  avantagesAppareil: ["Film hydrogel offert", "Transfert de données offert"],
  // Paiement par carte sur le site : false = bouton « Réserver » sur WhatsApp seulement.
  // Passer à true quand Stripe est branché (clés dans les variables d'environnement) : le panier réapparaît.
  paiementEnLigne: false,
  // Numéro WhatsApp (format international sans +) pour les réservations
  whatsapp: "33615987593",
  // Délai des produits commandés sur demande
  delaiSurCommande: "2 à 4 jours ouvrés",
};

/* ============================================================================
 *  COOKIES / MESURE D'AUDIENCE
 *  Mettez `active: true` uniquement si vous installez un outil de statistiques
 *  qui dépose des cookies (Google Analytics…). La catégorie apparaîtra alors
 *  dans le bandeau cookies et l'outil ne sera chargé qu'après consentement.
 * ========================================================================== */
export const mesureAudience = {
  active: false,
  nomOutil: "[À COMPLÉTER : ex. Google Analytics 4]",
};

/* ============================================================================
 *  OFFRES « CRÉATION DE SITES WEB » (prix indicatifs « à partir de »)
 * ========================================================================== */
export const offresWeb = [
  {
    id: "vitrine",
    nom: "Site vitrine",
    accroche: "Être trouvé et contacté facilement",
    prixDepuis: 250,
    delai: "2 à 3 semaines",
    inclus: [
      "Jusqu'à 5 pages sur mesure",
      "Design responsive mobile-first",
      "Formulaire de contact & carte",
      "Référencement local de base (Google)",
      "Fiche Google Business Profile optimisée",
      "Mentions légales & bandeau cookies RGPD",
      "Formation à la prise en main",
    ],
    misEnAvant: false,
  },
  {
    id: "ecommerce",
    nom: "Boutique en ligne",
    accroche: "Vendre 24 h/24, même quand vous êtes fermé",
    prixDepuis: 850,
    delai: "4 à 6 semaines",
    inclus: [
      "Catalogue produits, variantes & stocks",
      "Paiement sécurisé par carte (Stripe, SumUp…)",
      "Livraison & retrait en boutique",
      "Espace d'administration simple",
      "E-mails de commande automatiques",
      "CGV, rétractation & conformité RGPD",
      "Optimisation SEO des fiches produits",
    ],
    misEnAvant: true,
  },
  {
    id: "sur-mesure",
    nom: "Sur mesure",
    accroche: "Réservation, espace client, application web",
    prixDepuis: null, // null = « Sur devis »
    delai: "Selon le projet",
    inclus: [
      "Analyse de vos besoins et cahier des charges",
      "Prise de rendez-vous en ligne",
      "Espace membre / client",
      "Connexion à vos outils (agenda, CRM, caisse…)",
      "Hébergement et maintenance dédiés",
      "Accompagnement dans la durée",
    ],
    misEnAvant: false,
  },
];

export const forfaitMaintenance = {
  prixMensuel: 39, // € TTC / mois
  inclus: [
    "Hébergement, nom de domaine & certificat HTTPS",
    "Sauvegardes et mises à jour de sécurité",
    "Petites modifications de contenu (jusqu'à 1 h / mois)",
    "Suivi de la visibilité Google",
  ],
};

/* ============================================================================
 *  PROTECTION D'ÉCRAN HYDROGEL (produit phare, découpé sur mesure en boutique)
 *  Liste des marques et modèles : data/hydrogel-modeles.json
 *  prixBarre : ancien prix affiché barré. La loi impose qu'il soit le prix le plus bas
 *  pratiqué dans les 30 jours précédant la promo. afficherPrixBarre: false = « PROMO » sans prix barré.
 * ========================================================================== */
export const hydrogel = {
  afficherPrixBarre: true,
  types: [
    { id: "transparent", nom: "Transparent", detail: "Invisible, protège des rayures et des chocs du quotidien", prix: 14.9, prixBarre: 24.9 },
    { id: "anti-espion", nom: "Anti-espion", detail: "Personne ne lit votre écran : il paraît noir vu de côté", prix: 19.9, prixBarre: 34.9 },
  ],
};

/* ============================================================================
 *  PRIX AFFICHÉS EN VITRINE (donnés par GCS, novembre 2026)
 *  Mettre null pour masquer un prix.
 * ========================================================================== */
export const prixVitrine = {
  reconditionnesDes: 119 as number | null, // smartphones reconditionnés, « dès »
  simPrepayee: 10 as number | null, // cartes SIM prépayées 200 Go
  coquesDes: 9.9 as number | null,
  hydrogel: 14.9 as number | null, // film hydrogel transparent posé
  hydrogelAntiEspion: 19.9 as number | null,
  batteriesExternesDes: 14.9 as number | null,
};

/* ============================================================================
 *  SERVICES DU QUOTIDIEN (page /services et accueil)
 *  nouveau: true affiche une pastille « Nouveau ».
 *  Les tarifs de carte grise ne sont volontairement pas affichés (annoncés en boutique).
 * ========================================================================== */
export type ServiceProximite = {
  id: string;
  icone: "carte-grise" | "recharge" | "credit" | "avion" | "hotel" | "voiture" | "bus" | "argent" | "colis" | "pcs" | "admin" | "sim";
  nom: string;
  texte: string;
  points: string[];
  nouveau?: boolean;
  groupe: "demarches" | "voyages" | "quotidien";
};

export const servicesProximite: ServiceProximite[] = [
  {
    id: "carte-grise", icone: "carte-grise", groupe: "demarches", nouveau: true,
    nom: "Carte grise",
    texte: "Vos démarches de carte grise faites en boutique, avec vous, sans passer des heures sur internet. Tarif annoncé avant de commencer.",
    points: ["Changement de titulaire", "Changement d'adresse", "Duplicata", "Déclaration de cession", "Déclaration d'achat (professionnels)", "Immatriculation WW"],
  },
  {
    id: "recharge-mobile", icone: "recharge", groupe: "demarches", nouveau: true,
    nom: "Recharge mobile",
    texte: "Rechargez votre forfait ou votre carte prépayée en quelques secondes, en boutique.",
    points: ["SFR, Orange, Free, La Poste Mobile", "Lebara, Lyca, Syma, Libon", "Talk Home, White Calling"],
  },
  {
    id: "transfert-credit", icone: "credit", groupe: "demarches", nouveau: true,
    nom: "Transfert de crédit",
    texte: "Envoyez du crédit téléphone à vos proches, en France et à l'étranger.",
    points: ["Crédit reçu en quelques instants", "Vers de nombreux pays et opérateurs"],
  },
  {
    id: "cartes-sim", icone: "sim", groupe: "demarches",
    nom: "Cartes SIM prépayées",
    texte: "Repartez avec une carte SIM prépayée prête à l'emploi : Orange, Free, SFR.",
    points: ["Packs avec beaucoup de data (jusqu'à 200 Go)", "Activation sur place avec vous"],
  },
  {
    id: "billets-avion", icone: "avion", groupe: "voyages", nouveau: true,
    nom: "Billets d'avion",
    texte: "On cherche et on réserve votre vol avec vous, en boutique.",
    points: ["Comparaison des vols et des horaires", "Paiement et billet sur place"],
  },
  {
    id: "hotels", icone: "hotel", groupe: "voyages", nouveau: true,
    nom: "Hôtels & séjours",
    texte: "On réserve votre hôtel ou votre séjour avec vous.",
    points: ["Pour les vacances ou le travail", "Réservation confirmée sur place"],
  },
  {
    id: "location-voiture", icone: "voiture", groupe: "voyages", nouveau: true,
    nom: "Location de voiture",
    texte: "Une voiture pour les vacances ou le travail, réservée en boutique.",
    points: ["Comparaison des offres", "Réservation sur place"],
  },
  {
    id: "bus-train", icone: "bus", groupe: "voyages", nouveau: true,
    nom: "Billets de bus & train",
    texte: "Vos billets de bus et de train, imprimés ou envoyés sur votre téléphone.",
    points: ["BlaBlaCar Bus", "RegioJet", "CFF (trains suisses)"],
  },
  {
    id: "transfert-argent", icone: "argent", groupe: "quotidien",
    nom: "Transfert d'argent",
    texte: "Envoyez et recevez de l'argent en France et à l'international, en tant qu'agent d'un établissement agréé.",
    points: ["Envoi vers de nombreux pays", "Pièce d'identité en cours de validité obligatoire", `Réseau : ${entreprise.partenaireTransfertArgent}`],
  },
  {
    id: "point-relais", icone: "colis", groupe: "quotidien",
    nom: "Point relais colis",
    texte: "Récupérez et déposez vos colis en boutique, pendant nos horaires d'ouverture.",
    points: ["Retrait avec le code et une pièce d'identité", "Dépôt de vos envois et retours", `Réseau : ${entreprise.partenairePointRelais}`],
  },
  {
    id: "cartes-pcs", icone: "pcs", groupe: "quotidien",
    nom: "Cartes PCS",
    texte: "Achat et rechargement de cartes prépayées PCS Mastercard, pour payer sans compte bancaire.",
    points: ["Vente de cartes et recharges", "Pièce d'identité requise selon le montant"],
  },
  {
    id: "aide-administrative", icone: "admin", groupe: "quotidien",
    nom: "Aide administrative",
    texte: "Démarches en ligne, impressions, scans, envoi de documents : on vous accompagne.",
    points: ["Accompagnement aux démarches en ligne", "Impression, scan et photocopie", "Création d'adresse e-mail et de comptes"],
  },
];
