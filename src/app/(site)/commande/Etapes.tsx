import { Check } from "lucide-react";

const ETAPES = ["Panier", "Coordonnées", "Paiement", "Confirmation"];

export function Etapes({ actuelle }: { actuelle: 1 | 2 | 3 | 4 }) {
  return (
    <nav aria-label="Étapes de la commande">
      <ol className="flex items-center gap-2 text-sm">
        {ETAPES.map((e, i) => {
          const n = i + 1;
          const fait = n < actuelle;
          const encours = n === actuelle;
          return (
            <li key={e} className="flex flex-1 items-center gap-2" aria-current={encours ? "step" : undefined}>
              <span className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${fait ? "bg-success text-white" : encours ? "bg-ink text-white" : "bg-line text-muted"}`}>
                {fait ? <Check className="size-4" aria-hidden /> : n}
              </span>
              <span className={`hidden sm:inline ${encours ? "font-semibold" : "text-muted"}`}>{e}</span>
              {n < ETAPES.length && <span className={`h-px flex-1 ${fait ? "bg-success" : "bg-line"}`} aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
