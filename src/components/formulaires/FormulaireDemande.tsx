"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import type { TypeMessage } from "@/lib/types";

export type ChampSupp =
  | { nom: string; label: string; type: "select"; options: string[]; requis?: boolean; aide?: string }
  | { nom: string; label: string; type: "text" | "date"; requis?: boolean; aide?: string; placeholder?: string };

type Props = {
  type: TypeMessage;
  champs?: ChampSupp[];
  libelleMessage?: string;
  placeholderMessage?: string;
  libelleBouton?: string;
  telephoneRequis?: boolean;
  /** Valeurs initiales des champs supplémentaires (ex. modèle choisi dans le simulateur) */
  valeursInitiales?: Record<string, string>;
  messageInitial?: string;
  finalite: string;
};

export function FormulaireDemande({
  type,
  champs = [],
  libelleMessage = "Votre message",
  placeholderMessage,
  libelleBouton = "Envoyer ma demande",
  telephoneRequis = false,
  valeursInitiales,
  messageInitial = "",
  finalite,
}: Props) {
  const base = useId();
  const [etat, setEtat] = useState<"idle" | "envoi" | "ok" | "erreur">("idle");
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [erreurGlobale, setErreurGlobale] = useState("");
  const [details, setDetails] = useState<Record<string, string>>(valeursInitiales ?? {});
  const [message, setMessage] = useState(messageInitial);
  const resume = useRef<HTMLDivElement>(null);
  const succes = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (etat === "ok") succes.current?.focus();
  }, [etat]);

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const err: Record<string, string> = {};
    const nom = String(fd.get("nom") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const telephone = String(fd.get("telephone") ?? "").trim();
    if (nom.length < 2) err.nom = "Indiquez votre nom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err.email = "Indiquez une adresse e-mail valide (ex. nom@exemple.fr).";
    if (telephoneRequis && telephone.length < 8) err.telephone = "Indiquez un numéro pour que nous puissions vous rappeler.";
    if (message.trim().length < 5) err.message = "Décrivez votre demande en quelques mots.";
    for (const c of champs) if (c.requis && !details[c.nom]) err[c.nom] = `Ce champ est requis.`;
    setErreurs(err);
    if (Object.keys(err).length > 0) {
      setErreurGlobale("Merci de corriger les champs indiqués.");
      setTimeout(() => resume.current?.focus(), 0);
      return;
    }
    setEtat("envoi");
    setErreurGlobale("");
    const detailsLibelles = Object.fromEntries(
      champs.filter((c) => details[c.nom]).map((c) => [c.label, details[c.nom]]),
    );
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, nom, email, telephone, message, details: detailsLibelles, site: fd.get("site") }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErreurs(json.champs ?? {});
        setErreurGlobale(json.erreur ?? "Une erreur est survenue. Réessayez ou appelez-nous.");
        setEtat("erreur");
        setTimeout(() => resume.current?.focus(), 0);
        return;
      }
      setEtat("ok");
    } catch {
      setErreurGlobale("Connexion impossible. Vérifiez votre réseau puis réessayez.");
      setEtat("erreur");
    }
  }

  if (etat === "ok") {
    return (
      <div ref={succes} tabIndex={-1} role="status" className="rounded-2xl border border-success/30 bg-success-soft p-6 text-ink outline-none">
        <CheckCircle2 className="size-8 text-success" aria-hidden />
        <p className="mt-3 font-display text-xl font-semibold">Merci, votre demande est bien envoyée !</p>
        <p className="mt-1 text-muted">Nous vous répondons rapidement, généralement sous 24 h ouvrées. Un e-mail de confirmation vient de vous être envoyé.</p>
      </div>
    );
  }

  const aide = (nom: string) => (erreurs[nom] ? `${base}-${nom}-err` : undefined);

  return (
    <form onSubmit={envoyer} noValidate className="space-y-5">
      {erreurGlobale && (
        <div ref={resume} tabIndex={-1} role="alert" className="rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm font-medium text-danger outline-none">
          {erreurGlobale}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${base}-nom`} className="field-label">Nom et prénom <span aria-hidden className="text-danger">*</span></label>
          <input id={`${base}-nom`} name="nom" autoComplete="name" required aria-required="true" aria-invalid={Boolean(erreurs.nom)} aria-describedby={aide("nom")} className="field" />
          {erreurs.nom && <p id={`${base}-nom-err`} className="field-error">{erreurs.nom}</p>}
        </div>
        <div>
          <label htmlFor={`${base}-email`} className="field-label">E-mail <span aria-hidden className="text-danger">*</span></label>
          <input id={`${base}-email`} name="email" type="email" inputMode="email" autoComplete="email" required aria-required="true" aria-invalid={Boolean(erreurs.email)} aria-describedby={aide("email")} className="field" />
          {erreurs.email && <p id={`${base}-email-err`} className="field-error">{erreurs.email}</p>}
        </div>
        <div>
          <label htmlFor={`${base}-tel`} className="field-label">
            Téléphone {telephoneRequis ? <span aria-hidden className="text-danger">*</span> : <span className="font-normal text-muted">(facultatif)</span>}
          </label>
          <input id={`${base}-tel`} name="telephone" type="tel" inputMode="tel" autoComplete="tel" aria-required={telephoneRequis} aria-invalid={Boolean(erreurs.telephone)} aria-describedby={aide("telephone")} className="field" />
          {erreurs.telephone && <p id={`${base}-telephone-err`} className="field-error">{erreurs.telephone}</p>}
        </div>
        {champs.map((c) => (
          <div key={c.nom}>
            <label htmlFor={`${base}-${c.nom}`} className="field-label">
              {c.label} {c.requis ? <span aria-hidden className="text-danger">*</span> : <span className="font-normal text-muted">(facultatif)</span>}
            </label>
            {c.type === "select" ? (
              <select
                id={`${base}-${c.nom}`}
                className="field"
                value={details[c.nom] ?? ""}
                onChange={(e) => setDetails({ ...details, [c.nom]: e.target.value })}
                aria-invalid={Boolean(erreurs[c.nom])}
                aria-describedby={aide(c.nom)}
              >
                <option value="">Choisir…</option>
                {c.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input
                id={`${base}-${c.nom}`}
                type={c.type}
                className="field"
                placeholder={c.placeholder}
                value={details[c.nom] ?? ""}
                min={c.type === "date" ? new Date().toISOString().slice(0, 10) : undefined}
                onChange={(e) => setDetails({ ...details, [c.nom]: e.target.value })}
                aria-invalid={Boolean(erreurs[c.nom])}
                aria-describedby={aide(c.nom)}
              />
            )}
            {c.aide && !erreurs[c.nom] && <p className="field-hint">{c.aide}</p>}
            {erreurs[c.nom] && <p id={`${base}-${c.nom}-err`} className="field-error">{erreurs[c.nom]}</p>}
          </div>
        ))}
        <div className="sm:col-span-2">
          <label htmlFor={`${base}-msg`} className="field-label">{libelleMessage} <span aria-hidden className="text-danger">*</span></label>
          <textarea
            id={`${base}-msg`}
            name="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholderMessage}
            required
            aria-required="true"
            aria-invalid={Boolean(erreurs.message)}
            aria-describedby={aide("message")}
            className="field min-h-32 resize-y"
          />
          {erreurs.message && <p id={`${base}-message-err`} className="field-error">{erreurs.message}</p>}
        </div>
      </div>
      {/* Champ piège anti-robots, invisible pour les humains */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${base}-site`}>Ne pas remplir</label>
        <input id={`${base}-site`} name="site" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" disabled={etat === "envoi"} className="btn-accent w-full sm:w-auto">
        {etat === "envoi" ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Send className="size-5" aria-hidden />}
        {etat === "envoi" ? "Envoi en cours…" : libelleBouton}
      </button>
      <p className="text-xs leading-relaxed text-muted">
        <span aria-hidden className="text-danger">*</span> Champs obligatoires. Les informations recueillies sont traitées par Pronet Services Plus
        (GCS) pour {finalite}. Base légale : mesures précontractuelles prises à votre demande. Elles sont destinées à notre
        équipe uniquement et conservées 3 ans à compter de notre dernier échange. Vous pouvez exercer vos droits d&apos;accès,
        de rectification, d&apos;effacement, d&apos;opposition, de limitation et de portabilité à tout moment.{" "}
        <Link href="/confidentialite" className="font-medium text-brand underline underline-offset-2">Politique de confidentialité</Link>.
      </p>
    </form>
  );
}
