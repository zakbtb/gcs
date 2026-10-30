const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });

/** 19.9 → « 19,90 € » */
export function prix(montant: number): string {
  return euros.format(montant);
}

/** Prix « rond » sans centimes inutiles : 690 → « 690 € », 19.9 → « 19,90 € » */
export function prixCourt(montant: number): string {
  return Number.isInteger(montant)
    ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(montant)
    : euros.format(montant);
}

/** Arrondi monétaire au centime */
export function arrondi(montant: number): number {
  return Math.round(montant * 100) / 100;
}

export function dateFr(iso: string, avecHeure = false): string {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    ...(avecHeure ? { timeStyle: "short" } : {}),
    timeZone: "Europe/Paris",
  }).format(new Date(iso));
}

export function estACompleter(valeur: string | null | undefined): boolean {
  return !valeur || valeur.startsWith("[À COMPLÉTER");
}
