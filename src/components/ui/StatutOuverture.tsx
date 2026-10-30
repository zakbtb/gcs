"use client";

import { useEffect, useState } from "react";
import { etatOuverture, type EtatOuverture } from "@/lib/horaires";

/** « Ouvert · ferme à 19h » calculé dans le navigateur (heure de Montpellier), mis à jour chaque minute. */
export function StatutOuverture({ className = "" }: { className?: string }) {
  const [etat, setEtat] = useState<EtatOuverture | null>(null);
  useEffect(() => {
    const maj = () => setEtat(etatOuverture());
    maj();
    const t = setInterval(maj, 60_000);
    return () => clearInterval(t);
  }, []);
  if (!etat) return <span className={`inline-block h-5 w-36 ${className}`} aria-hidden />;
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`relative flex size-2.5`} aria-hidden>
        {etat.ouvert && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />}
        <span className={`relative inline-flex size-2.5 rounded-full ${etat.ouvert ? "bg-emerald-400" : "bg-rose-400"}`} />
      </span>
      {etat.texte}
    </span>
  );
}
