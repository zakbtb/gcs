"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Lock, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { usePanier } from "@/components/panier/PanierProvider";
import { prix, prixCourt } from "@/lib/format";

type Evaluation = {
  sousTotal: number;
  fraisLivraison: number;
  fraisRetrait: number;
  problemes: { produitId: string; varianteId?: string; nom: string; disponible: number }[];
};

export function PagePanier({ seuilGratuit }: { seuilGratuit: number | null }) {
  const { articles, pret, changerQuantite, retirer, remplacer } = usePanier();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [alerte, setAlerte] = useState("");
  const synchronise = useRef(false);

  // Resynchronise prix et stocks avec le serveur
  useEffect(() => {
    if (!pret) return;
    if (articles.length === 0) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/panier", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ panier: articles.map(({ produitId, varianteId, quantite }) => ({ produitId, varianteId, quantite })) }),
          signal: ctrl.signal,
        });
        const json = await res.json();
        if (!json.ok) return;
        setEvaluation(json);
        // Au premier chargement : mise à jour des prix/stocks mémorisés et correction des quantités
        if (!synchronise.current) {
          synchronise.current = true;
          // Ajuste un article d'après la réponse du serveur (null = à retirer)
          const ajuster = (a: (typeof articles)[number]) => {
            const cle = `${a.produitId}|${a.varianteId ?? ""}`;
            if (!(cle in json.stocks)) return a; // ajouté après la requête : inchangé
            const ligne = json.lignes.find((l: { produitId: string; varianteId?: string }) => l.produitId === a.produitId && (l.varianteId ?? "") === (a.varianteId ?? ""));
            const stock = json.stocks[cle] ?? 0;
            if (!ligne || stock <= 0) return null;
            return { ...a, quantite: Math.min(a.quantite, stock), prix: ligne.prixUnitaire, stock };
          };
          const modifie = articles.some((a) => {
            const b = ajuster(a);
            return !b || b.quantite !== a.quantite || b.prix !== a.prix;
          });
          // Mise à jour fonctionnelle : on part de l'état le plus récent (l'utilisateur a pu modifier le panier entre-temps)
          remplacer((actuels) => actuels.flatMap((a) => ajuster(a) ?? []));
          if (modifie) setAlerte("Votre panier a été mis à jour : certains prix ou disponibilités ont changé depuis votre dernière visite.");
        }
      } catch {}
    }, 250);
    return () => {
      ctrl.abort();
      clearTimeout(t);
    };
  }, [articles, pret, remplacer]);

  if (!pret) return <div className="h-64 animate-pulse rounded-3xl bg-white" aria-hidden />;

  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-line bg-white p-10 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-surface"><ShoppingBag className="size-8 text-subtle" aria-hidden /></span>
        <h2 className="mt-5 text-2xl font-semibold">Votre panier est vide</h2>
        <p className="mt-2 text-muted">Découvrez nos coques, chargeurs et protections d&apos;écran.</p>
        <Link href="/boutique" className="btn-accent mt-6">Aller à la boutique</Link>
      </div>
    );
  }

  const sousTotal = evaluation?.sousTotal ?? articles.reduce((s, a) => s + a.prix * a.quantite, 0);
  const livraison = evaluation?.fraisLivraison;
  const reste = seuilGratuit != null ? seuilGratuit - sousTotal : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-start">
      <div>
        {alerte && (
          <p role="status" className="mb-4 flex gap-3 rounded-2xl border border-accent/30 bg-accent-soft p-4 text-sm font-medium">
            <AlertTriangle className="size-5 shrink-0 text-accent-strong" aria-hidden /> {alerte}
          </p>
        )}
        {reste != null && (
          <div className="mb-4 rounded-2xl bg-white p-4 ring-1 ring-line">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Truck className="size-5 text-brand" aria-hidden />
              {reste > 0 ? <>Plus que <strong>{prix(reste)}</strong> pour profiter de la livraison offerte.</> : <>Bravo, la livraison est <strong>offerte</strong> !</>}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface" aria-hidden>
              <div className="h-full rounded-full bg-success transition-[width] duration-500" style={{ width: `${Math.min(100, (sousTotal / (seuilGratuit || 1)) * 100)}%` }} />
            </div>
          </div>
        )}
        <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white">
          {articles.map((a) => {
            const pb = evaluation?.problemes.find((p) => p.produitId === a.produitId && (p.varianteId ?? "") === (a.varianteId ?? ""));
            return (
              <li key={`${a.produitId}-${a.varianteId ?? ""}`} className="flex gap-4 p-4 sm:p-5">
                <Link href={`/boutique/${a.slug}`} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.image} alt="" width={96} height={96} className="size-20 rounded-2xl bg-surface object-cover sm:size-24" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/boutique/${a.slug}`} className="font-semibold hover:text-brand">{a.nom}</Link>
                      {a.variante && <p className="text-sm text-muted">{a.variante}</p>}
                      <p className="text-sm text-muted">{prix(a.prix)} l&apos;unité</p>
                    </div>
                    <p className="shrink-0 font-display text-lg font-bold">{prix(a.prix * a.quantite)}</p>
                  </div>
                  {pb && <p className="mt-1 text-sm font-medium text-danger">Stock insuffisant : {pb.disponible} disponible{pb.disponible > 1 ? "s" : ""}.</p>}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex h-11 items-center rounded-full border border-line">
                      <button type="button" onClick={() => changerQuantite(a.produitId, a.varianteId, a.quantite - 1)} disabled={a.quantite <= 1} className="grid size-11 place-items-center disabled:opacity-40" aria-label={`Diminuer la quantité de ${a.nom}`}>
                        <Minus className="size-4" aria-hidden />
                      </button>
                      <span className="w-8 text-center font-semibold" aria-live="polite" aria-label={`Quantité : ${a.quantite}`}>{a.quantite}</span>
                      <button type="button" onClick={() => changerQuantite(a.produitId, a.varianteId, a.quantite + 1)} disabled={a.quantite >= a.stock} className="grid size-11 place-items-center disabled:opacity-40" aria-label={`Augmenter la quantité de ${a.nom}`}>
                        <Plus className="size-4" aria-hidden />
                      </button>
                    </div>
                    <button type="button" onClick={() => retirer(a.produitId, a.varianteId)} className="flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted hover:bg-danger-soft hover:text-danger">
                      <Trash2 className="size-4" aria-hidden /> Supprimer
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <Link href="/boutique" className="mt-5 inline-block font-semibold text-brand hover:underline">← Continuer mes achats</Link>
      </div>

      <aside className="rounded-3xl bg-white p-6 ring-1 ring-line lg:sticky lg:top-24" aria-label="Récapitulatif">
        <h2 className="text-xl font-semibold">Récapitulatif</h2>
        <dl className="mt-5 space-y-3 text-[0.95rem]">
          <div className="flex justify-between"><dt className="text-muted">Sous-total</dt><dd className="font-semibold">{prix(sousTotal)}</dd></div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Livraison à domicile</dt>
            <dd className="text-right font-semibold">{livraison === undefined ? "…" : livraison === 0 ? "Offerte" : prix(livraison)}</dd>
          </div>
          <div className="flex justify-between"><dt className="text-muted">Retrait en boutique</dt><dd className="font-semibold text-success">Gratuit</dd></div>
          <div className="flex justify-between border-t border-line pt-4 text-lg">
            <dt className="font-semibold">Total TTC</dt>
            <dd className="font-display text-2xl font-bold">
              {prix(sousTotal)}
              <span className="block text-right text-xs font-normal text-muted">+ livraison selon le mode choisi</span>
            </dd>
          </div>
        </dl>
        {evaluation && evaluation.problemes.length > 0 ? (
          <p className="mt-5 rounded-xl bg-danger-soft p-3 text-sm font-medium text-danger" role="alert">Ajustez les quantités en rupture pour continuer.</p>
        ) : null}
        <Link
          href="/commande"
          aria-disabled={Boolean(evaluation?.problemes.length)}
          className={`btn-accent mt-6 w-full ${evaluation?.problemes.length ? "pointer-events-none opacity-50" : ""}`}
        >
          <Lock className="size-4" aria-hidden /> Passer la commande
        </Link>
        <p className="mt-3 text-center text-xs text-muted">Paiement sécurisé par carte · Prix TTC{seuilGratuit ? ` · Livraison offerte dès ${prixCourt(seuilGratuit)}` : ""}</p>
      </aside>
    </div>
  );
}
