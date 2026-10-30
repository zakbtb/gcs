"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, FlaskConical, Loader2, Lock } from "lucide-react";
import { prix } from "@/lib/format";

/** Formulaire de carte SIMULÉ, utilisé tant que Stripe n'est pas configuré. Aucun débit n'a lieu. */
export function PaiementDemo({ commande, token, total }: { commande: string; token: string; total: number }) {
  const router = useRouter();
  const [numero, setNumero] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const q = `commande=${encodeURIComponent(commande)}&t=${encodeURIComponent(token)}`;

  const formatNumero = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
  const formatExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
  };

  async function payer(e: React.FormEvent) {
    e.preventDefault();
    const d = exp.replace(/\D/g, "");
    if (numero.replace(/\D/g, "").length !== 16) return setErreur("Le numéro de carte doit comporter 16 chiffres.");
    if (d.length !== 4 || Number(d.slice(0, 2)) < 1 || Number(d.slice(0, 2)) > 12) return setErreur("Date d'expiration invalide (MM / AA).");
    if (cvc.replace(/\D/g, "").length < 3) return setErreur("Le code de sécurité (CVC) comporte 3 chiffres.");
    setErreur("");
    setEnvoi(true);
    const res = await fetch("/api/paiement/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commande, t: token, numero }),
    });
    const json = await res.json();
    if (json.ok) return router.push(`/commande/confirmation?${q}`);
    if (json.erreur === "rupture") {
      sessionStorage.setItem("gcs-rupture", JSON.stringify(json.problemes ?? []));
      return router.push("/commande/rupture");
    }
    router.push(`/commande/paiement-refuse?${q}&raison=${encodeURIComponent(json.raison ?? "Paiement refusé")}`);
  }

  return (
    <form onSubmit={payer} noValidate className="space-y-5">
      <div className="flex gap-3 rounded-2xl border border-accent/40 bg-accent-soft p-4 text-sm">
        <FlaskConical className="size-5 shrink-0 text-accent-strong" aria-hidden />
        <div>
          <p className="font-semibold">Mode démo : paiement simulé, aucun débit</p>
          <p className="mt-1">Stripe n&apos;est pas encore configuré. Cartes de test : <strong>4242 4242 4242 4242</strong> (acceptée), <strong>4000 0000 0000 0002</strong> (refusée), <strong>4000 0000 0000 9995</strong> (fonds insuffisants).</p>
        </div>
      </div>
      <div>
        <label htmlFor="cb-numero" className="field-label">Numéro de carte</label>
        <div className="relative">
          <input id="cb-numero" inputMode="numeric" autoComplete="cc-number" placeholder="1234 1234 1234 1234" value={numero} onChange={(e) => setNumero(formatNumero(e.target.value))} className="field pr-12 tracking-wider" />
          <CreditCard className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-subtle" aria-hidden />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="cb-exp" className="field-label">Expiration</label>
          <input id="cb-exp" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / AA" value={exp} onChange={(e) => setExp(formatExp(e.target.value))} className="field" />
        </div>
        <div>
          <label htmlFor="cb-cvc" className="field-label">CVC</label>
          <input id="cb-cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))} className="field" />
        </div>
      </div>
      {erreur && <p role="alert" className="field-error">{erreur}</p>}
      <button type="submit" disabled={envoi} className="btn-accent w-full text-base">
        {envoi ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Lock className="size-4" aria-hidden />}
        {envoi ? "Paiement en cours…" : `Payer ${prix(total)}`}
      </button>
    </form>
  );
}
