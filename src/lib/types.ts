/* ---------- Boutique ---------- */
export type Categorie = { id: string; nom: string; description: string };

export type OptionProduit = { nom: string; valeurs: string[] };

export type Variante = {
  id: string;
  options: Record<string, string>;
  stock: number;
  prix?: number;
  image?: string;
};

export type Produit = {
  id: string;
  slug: string;
  nom: string;
  categorie: string;
  marque: string;
  prix: number;
  prixBarre?: number;
  description: string;
  descriptionLongue: string;
  images: string[];
  compatibilite: string[];
  caracteristiques: Record<string, string>;
  options: OptionProduit[];
  variantes: Variante[];
  stock?: number;
  misEnAvant?: boolean;
  actif: boolean;
};

export type Catalogue = { _aide?: string; categories: Categorie[]; produits: Produit[] };

export type LignePanier = { produitId: string; varianteId?: string; quantite: number };

/* ---------- Commandes ---------- */
export type ModeLivraison = "livraison" | "retrait";

export type StatutCommande =
  | "en_attente_paiement"
  | "payee"
  | "en_preparation"
  | "expediee"
  | "prete_retrait"
  | "livree"
  | "annulee"
  | "paiement_refuse";

export type LigneCommande = {
  produitId: string;
  varianteId?: string;
  nom: string;
  variante?: string;
  image?: string;
  prixUnitaire: number;
  quantite: number;
  total: number;
};

export type Commande = {
  id: string; // numéro de commande lisible, ex. GCS-261027-4F7K
  token: string; // jeton secret pour consulter la commande sans compte
  creeLe: string;
  majLe: string;
  statut: StatutCommande;
  client: {
    prenom: string;
    nom: string;
    email: string;
    telephone: string;
  };
  livraison: {
    mode: ModeLivraison;
    adresse?: string;
    complement?: string;
    codePostal?: string;
    ville?: string;
  };
  note?: string;
  lignes: LigneCommande[];
  sousTotal: number;
  fraisLivraison: number;
  total: number;
  paiement: {
    fournisseur: "stripe" | "demo";
    reference?: string;
    payeLe?: string;
    erreur?: string;
  };
  stockDecremente?: boolean;
  emailEnvoye?: boolean;
  historique: { date: string; statut: StatutCommande; note?: string }[];
};

/* ---------- Tarifs réparation ---------- */
export type PrixReparation = number | Record<string, number> | null;

export type ModeleTarif = {
  id: string;
  nom: string;
  annee?: number;
  prix: Record<string, PrixReparation>;
};

export type MarqueTarif = { id: string; nom: string; bientot?: boolean; modeles: ModeleTarif[] };

export type TypeReparation = { nom: string; description: string; duree: string; icone: string };

export type Tarifs = {
  devise: string;
  reparations: Record<string, TypeReparation>;
  marques: MarqueTarif[];
};

/* ---------- Messages (contact, devis, rendez-vous, rachat) ---------- */
export type TypeMessage = "contact" | "devis-web" | "rendez-vous" | "rachat";

export type Message = {
  id: string;
  type: TypeMessage;
  creeLe: string;
  lu: boolean;
  nom: string;
  email: string;
  telephone?: string;
  sujet?: string;
  contenu: string;
  details?: Record<string, string>;
};
