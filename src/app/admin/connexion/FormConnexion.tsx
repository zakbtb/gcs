"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { connexion } from "../actions";

export function FormConnexion() {
  const [etat, action, enCours] = useActionState(connexion, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      <div>
        <label htmlFor="mdp" className="field-label">Mot de passe</label>
        <input id="mdp" name="motDePasse" type="password" autoComplete="current-password" required className="field" aria-invalid={Boolean(etat.erreur)} aria-describedby={etat.erreur ? "mdp-err" : undefined} />
        {etat.erreur && <p id="mdp-err" role="alert" className="field-error">{etat.erreur}</p>}
      </div>
      <button className="btn-dark w-full" disabled={enCours}>
        {enCours && <Loader2 className="size-5 animate-spin" aria-hidden />} Se connecter
      </button>
    </form>
  );
}
