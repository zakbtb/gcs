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
    latitude: null as number | null,
    longitude: null as number | null,
  },
  telephone: "[À COMPLÉTER : téléphone, ex. 04 00 00 00 00]",
  // Format international sans espace, utilisé pour les liens « Appeler »
  telephoneLien: "[À COMPLÉTER : ex. +33400000000]",
  email: "[À COMPLÉTER : e-mail de contact, ex. contact@gcs-montpellier.fr]",
  emailDonneesPersonnelles: "[À COMPLÉTER : e-mail pour les demandes RGPD (peut être le même)]",

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
    nom: "[À COMPLÉTER : nom de l'hébergeur, ex. Vercel Inc. / OVH SAS / Hostinger]",
    adresse: "[À COMPLÉTER : adresse postale de l'hébergeur]",
    telephone: "[À COMPLÉTER : téléphone de l'hébergeur]",
    site: "[À COMPLÉTER : site web de l'hébergeur]",
  },

  /* ---------- Médiateur de la consommation (obligatoire pour la vente aux particuliers) ---------- */
  mediateur: {
    nom: "[À COMPLÉTER : nom du médiateur de la consommation auquel vous adhérez]",
    adresse: "[À COMPLÉTER : adresse postale du médiateur]",
    site: "[À COMPLÉTER : site web du médiateur]",
  },

  /* ---------- Assurance (recommandé pour les prestations web) ---------- */
  assuranceRcPro: "[À COMPLÉTER : assureur RC Pro et zone couverte (facultatif, recommandé)]",

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
    nom: "Livraison à domicile (Colissimo suivi)",
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
    prixDepuis: 690,
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
    prixDepuis: 1490,
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
