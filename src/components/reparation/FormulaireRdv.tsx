"use client";

import { useEffect, useState } from "react";
import { FormulaireDemande } from "@/components/formulaires/FormulaireDemande";
import type { DemandeRdv } from "./Simulateur";
import { prixCourt } from "@/lib/format";

/** Formulaire de rendez-vous pré-rempli par le simulateur (événement « gcs:rdv » ou paramètres d'URL). */
export function FormulaireRdv({ modeles, reparations }: { modeles: string[]; reparations: string[] }) {
  const [valeurs, setValeurs] = useState<Record<string, string> | undefined>();
  const [message, setMessage] = useState("");

  const appliquer = (d: DemandeRdv) => {
    setValeurs({ modele: d.modele, reparation: d.reparation, qualite: d.qualite ?? "" });
    const prix = d.prix == null ? "sur devis" : prixCourt(d.prix);
    setMessage(`Bonjour, je souhaite réparer mon ${d.modele} : ${d.reparation}${d.qualite ? ` (${d.qualite})` : ""}, prix affiché ${prix}.`);
  };

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const modele = p.get("modele");
    const reparation = p.get("reparation");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique des paramètres d'URL côté navigateur
    if (modele && reparation) appliquer({ modele, reparation, qualite: p.get("qualite") ?? undefined, prix: undefined });
    const ecoute = (e: Event) => appliquer((e as CustomEvent<DemandeRdv>).detail);
    window.addEventListener("gcs:rdv", ecoute);
    return () => window.removeEventListener("gcs:rdv", ecoute);
  }, []);

  return (
    <FormulaireDemande
      key={message /* remonte le formulaire pré-rempli quand le simulateur envoie une nouvelle demande */}
      type="rendez-vous"
      telephoneRequis
      valeursInitiales={valeurs}
      messageInitial={message}
      libelleBouton="Demander mon rendez-vous"
      libelleMessage="Décrivez la panne"
      placeholderMessage="Ex. : écran fissuré après une chute, le tactile fonctionne encore."
      finalite="organiser votre rendez-vous de réparation"
      champs={[
        { nom: "modele", label: "Modèle", type: "select", options: modeles, requis: true },
        { nom: "reparation", label: "Réparation", type: "select", options: reparations, requis: true },
        { nom: "date", label: "Date souhaitée", type: "date" },
        { nom: "creneau", label: "Créneau", type: "select", options: ["Matin (10h–14h)", "Fin de journée (16h–19h)", "Réparation à domicile"] },
      ]}
    />
  );
}
