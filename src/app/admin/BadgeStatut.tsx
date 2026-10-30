import { LIBELLES_STATUT } from "@/lib/commandes";
import type { StatutCommande } from "@/lib/types";

const COULEURS: Record<StatutCommande, string> = {
  en_attente_paiement: "bg-yellow-100 text-yellow-900",
  payee: "bg-brand-soft text-brand-strong",
  en_preparation: "bg-accent-soft text-accent-strong",
  expediee: "bg-cyan/15 text-cyan-800",
  prete_retrait: "bg-cyan/15 text-cyan-800",
  livree: "bg-success-soft text-success",
  annulee: "bg-line text-muted",
  paiement_refuse: "bg-danger-soft text-danger",
};

export function BadgeStatut({ statut }: { statut: StatutCommande }) {
  return <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${COULEURS[statut]}`}>{LIBELLES_STATUT[statut]}</span>;
}
