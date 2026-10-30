"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Loader2, Lock, Store, Truck } from "lucide-react";
import { usePanier } from "@/components/panier/PanierProvider";
import { prix } from "@/lib/format";

type Props = {
  livraison: { nom: string; delai: string; prix: number; gratuiteDes: number | null };
  retrait: { nom: string; delai: string };
  adresseBoutique: string;
};

export function FormulaireCommande({ livraison, retrait, adresseBoutique }: Props) {
  const { articles, pret } = usePanier();
  const router = useRouter();
  const base = useId();
  const [mode, setMode] = useState<"livraison" | "retrait">("retrait");
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [erreurGlobale, setErreurGlobale] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const resume = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pret && articles.length === 0) router.replace("/panier");
  }, [pret, articles.length, router]);

  const sousTotal = Math.round(articles.reduce((s, a) => s + a.prix * a.quantite, 0) * 100) / 100;
  const frais = mode === "retrait" ? 0 : livraison.gratuiteDes != null && sousTotal >= livraison.gratuiteDes ? 0 : livraison.prix;
  const total = Math.round((sousTotal + frais) * 100) / 100;

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const err: Record<string, string> = {};
    if (!v("prenom")) err.prenom = "Indiquez votre prénom.";
    if (!v("nom")) err.nom = "Indiquez votre nom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) err.email = "Indiquez une adresse e-mail valide.";
    if (v("telephone").replace(/\D/g, "").length < 9) err.telephone = "Indiquez un numéro de téléphone valide.";
    if (mode === "livraison") {
      if (v("adresse").length < 4) err.adresse = "Indiquez votre adresse.";
      if (!/^\d{5}$|^2[AB]\d{3}$/i.test(v("codePostal"))) err.codePostal = "Code postal invalide (5 chiffres).";
      if (v("ville").length < 2) err.ville = "Indiquez votre ville.";
    }
    if (!fd.get("cgv")) err.cgv = "Vous devez accepter les conditions générales de vente.";
    setErreurs(err);
    if (Object.keys(err).length) {
      setErreurGlobale(`Merci de corriger ${Object.keys(err).length} champ${Object.keys(err).length > 1 ? "s" : ""}.`);
      setTimeout(() => resume.current?.focus(), 0);
      return;
    }
    setEnvoi(true);
    setErreurGlobale("");
    try {
      const res = await fetch("/api/commandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: { prenom: v("prenom"), nom: v("nom"), email: v("email"), telephone: v("telephone") },
          livraison: { mode, adresse: v("adresse"), complement: v("complement"), codePostal: v("codePostal"), ville: v("ville") },
          note: v("note"),
          cgv: true,
          panier: articles.map(({ produitId, varianteId, quantite }) => ({ produitId, varianteId, quantite })),
        }),
      });
      const json = await res.json();
      if (json.ok) {
        router.push(`/commande/paiement?commande=${encodeURIComponent(json.id)}&t=${encodeURIComponent(json.token)}`);
        return;
      }
      if (json.erreur === "rupture") {
        sessionStorage.setItem("gcs-rupture", JSON.stringify(json.problemes ?? []));
        router.push("/commande/rupture");
        return;
      }
      setErreurs(json.champs ?? {});
      setErreurGlobale(json.erreur === "panier_vide" ? "Votre panier est vide." : json.erreur ?? "Une erreur est survenue.");
      setEnvoi(false);
      setTimeout(() => resume.current?.focus(), 0);
    } catch {
      setErreurGlobale("Connexion impossible. Vérifiez votre réseau puis réessayez.");
      setEnvoi(false);
    }
  }

  if (!pret || articles.length === 0) return <div className="h-96 animate-pulse rounded-3xl bg-white" aria-hidden />;

  const champ = (nom: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, requis = true) => (
    <div>
      <label htmlFor={`${base}-${nom}`} className="field-label">
        {label} {requis ? <span className="text-danger" aria-hidden>*</span> : <span className="font-normal text-muted">(facultatif)</span>}
      </label>
      <input
        id={`${base}-${nom}`}
        name={nom}
        className="field"
        aria-required={requis}
        aria-invalid={Boolean(erreurs[nom])}
        aria-describedby={erreurs[nom] ? `${base}-${nom}-e` : undefined}
        {...props}
      />
      {erreurs[nom] && <p id={`${base}-${nom}-e`} className="field-error">{erreurs[nom]}</p>}
    </div>
  );

  return (
    <form
      onSubmit={envoyer}
      onChange={(e) => {
        const nom = (e.target as unknown as HTMLInputElement).name;
        if (nom && erreurs[nom]) setErreurs((err) => Object.fromEntries(Object.entries(err).filter(([k]) => k !== nom)));
      }}
      noValidate
      className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start"
    >
      <div className="space-y-6">
        {erreurGlobale && (
          <div ref={resume} tabIndex={-1} role="alert" className="rounded-2xl border border-danger/30 bg-danger-soft p-4 font-medium text-danger outline-none">
            {erreurGlobale}
          </div>
        )}

        <fieldset className="rounded-3xl bg-white p-6 ring-1 ring-line sm:p-8">
          <legend className="sr-only">Vos coordonnées</legend>
          <h2 className="text-xl font-semibold" aria-hidden>1. Vos coordonnées</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {champ("prenom", "Prénom", { autoComplete: "given-name" })}
            {champ("nom", "Nom", { autoComplete: "family-name" })}
            {champ("email", "E-mail", { type: "email", inputMode: "email", autoComplete: "email" })}
            {champ("telephone", "Téléphone", { type: "tel", inputMode: "tel", autoComplete: "tel" })}
          </div>
          <p className="mt-3 text-sm text-muted">Votre e-mail sert à vous envoyer la confirmation ; votre téléphone, à vous prévenir en cas de souci de livraison ou quand votre commande est prête.</p>
        </fieldset>

        <fieldset className="rounded-3xl bg-white p-6 ring-1 ring-line sm:p-8">
          <legend className="sr-only">Mode de livraison</legend>
          <h2 className="text-xl font-semibold" aria-hidden>2. Livraison ou retrait</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { id: "retrait" as const, icon: Store, nom: retrait.nom, delai: retrait.delai, prix: "Gratuit" },
              { id: "livraison" as const, icon: Truck, nom: livraison.nom, delai: livraison.delai, prix: frais === 0 && mode === "livraison" ? "Offerte" : prix(livraison.prix) },
            ].map((o) => (
              <label key={o.id} className={`flex cursor-pointer gap-3 rounded-2xl border-2 p-4 transition-colors ${mode === o.id ? "border-brand bg-brand-soft" : "border-line hover:border-ink"}`}>
                <input type="radio" name="mode" value={o.id} checked={mode === o.id} onChange={() => setMode(o.id)} className="mt-1 size-4 accent-brand" />
                <span className="flex-1">
                  <span className="flex items-center justify-between gap-2 font-semibold">
                    <span className="flex items-center gap-2"><o.icon className="size-5 text-brand" aria-hidden />{o.id === "retrait" ? "Retrait en boutique" : "Livraison"}</span>
                    <span>{o.prix}</span>
                  </span>
                  <span className="mt-1 block text-sm text-muted">{o.nom}</span>
                  <span className="block text-sm text-muted">{o.delai}</span>
                </span>
              </label>
            ))}
          </div>
          {mode === "retrait" ? (
            <p className="mt-4 rounded-2xl bg-surface p-4 text-sm">
              <strong>Adresse de retrait :</strong> {adresseBoutique}. Vous recevez un e-mail quand votre commande est prête. Présentez votre numéro de commande.
            </p>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">{champ("adresse", "Adresse", { autoComplete: "address-line1" })}</div>
              <div className="sm:col-span-2">{champ("complement", "Complément d'adresse", { autoComplete: "address-line2", placeholder: "Bâtiment, étage, digicode…" }, false)}</div>
              {champ("codePostal", "Code postal", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 5 })}
              {champ("ville", "Ville", { autoComplete: "address-level2" })}
              <p className="text-sm text-muted sm:col-span-2">Livraison en France métropolitaine uniquement.</p>
            </div>
          )}
          <div className="mt-5">
            <label htmlFor={`${base}-note`} className="field-label">Remarque pour la commande <span className="font-normal text-muted">(facultatif)</span></label>
            <textarea id={`${base}-note`} name="note" rows={2} maxLength={1000} className="field" />
          </div>
        </fieldset>
      </div>

      <aside className="rounded-3xl bg-white p-6 ring-1 ring-line lg:sticky lg:top-24" aria-label="Récapitulatif de la commande">
        <h2 className="text-xl font-semibold">Récapitulatif</h2>
        <ul className="mt-5 space-y-3">
          {articles.map((a) => (
            <li key={`${a.produitId}-${a.varianteId ?? ""}`} className="flex gap-3 text-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.image} alt="" width={56} height={56} className="size-14 rounded-xl bg-surface object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block font-medium">{a.nom}</span>
                {a.variante && <span className="block text-muted">{a.variante}</span>}
                <span className="text-muted">Qté : {a.quantite}</span>
              </span>
              <span className="font-semibold">{prix(a.prix * a.quantite)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[0.95rem]">
          <div className="flex justify-between"><dt className="text-muted">Sous-total</dt><dd>{prix(sousTotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">{mode === "retrait" ? "Retrait en boutique" : "Livraison"}</dt><dd>{frais === 0 ? "Gratuit" : prix(frais)}</dd></div>
          <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold"><dt>Total TTC</dt><dd className="font-display text-2xl font-bold">{prix(total)}</dd></div>
        </dl>

        <div className="mt-5">
          <label className="flex cursor-pointer gap-3 text-sm">
            <input type="checkbox" name="cgv" className="mt-0.5 size-5 shrink-0 accent-brand" aria-invalid={Boolean(erreurs.cgv)} aria-describedby={erreurs.cgv ? `${base}-cgv-e` : undefined} />
            <span>
              J&apos;ai lu et j&apos;accepte les{" "}
              <Link href="/cgv" target="_blank" className="font-semibold text-brand underline underline-offset-2">conditions générales de vente</Link>, notamment les conditions de rétractation. <span className="text-danger" aria-hidden>*</span>
            </span>
          </label>
          {erreurs.cgv && <p id={`${base}-cgv-e`} className="field-error">{erreurs.cgv}</p>}
        </div>

        <button type="submit" disabled={envoi} className="btn-accent mt-5 w-full">
          {envoi ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Lock className="size-4" aria-hidden />}
          {envoi ? "Validation…" : "Continuer vers le paiement"}
        </button>
        <p className="mt-3 text-center text-xs text-muted">Commande avec obligation de paiement à l&apos;étape suivante.</p>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Vos données sont traitées par Pronet Services Plus (GCS) pour gérer votre commande, la livraison et le service après-vente
          (base légale : exécution du contrat), et conservées pendant la durée légale (10 ans pour les pièces comptables). Vous disposez
          de droits d&apos;accès, de rectification, d&apos;effacement, d&apos;opposition, de limitation et de portabilité.{" "}
          <Link href="/confidentialite" className="font-medium text-brand underline underline-offset-2">En savoir plus</Link>.
        </p>
      </aside>
    </form>
  );
}
