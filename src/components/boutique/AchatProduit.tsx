"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Minus, Plus, ShoppingBag, Truck, Store, AlertCircle, Phone, MessageCircle, Info, ShieldCheck } from "lucide-react";
import { entreprise } from "@/config/entreprise";
import type { Produit } from "@/lib/types";
import { prix } from "@/lib/format";
import { usePanier } from "@/components/panier/PanierProvider";

/** Galerie + choix des variantes + quantité + ajout au panier */
export function AchatProduit({ produit, livraisonTexte }: { produit: Produit; livraisonTexte: string }) {
  const { ajouter, articles } = usePanier();
  const aVariantes = produit.variantes.length > 0;

  // Sélection initiale : première combinaison en stock
  const initiale = useMemo(() => {
    const v = produit.variantes.find((x) => x.stock > 0) ?? produit.variantes[0];
    return v ? { ...v.options } : {};
  }, [produit]);
  const [choix, setChoix] = useState<Record<string, string>>(initiale);
  const [quantiteSaisie, setQuantite] = useState(1);
  const [imageIdx, setImageIdx] = useState(0);
  const [ajoute, setAjoute] = useState(false);

  const variante = aVariantes
    ? produit.variantes.find((v) => Object.entries(v.options).every(([k, val]) => choix[k] === val))
    : undefined;
  const stock = aVariantes ? variante?.stock ?? 0 : produit.stock ?? 0;
  const prixActuel = variante?.prix ?? produit.prix;
  const dejaAuPanier = articles.find((a) => a.produitId === produit.id && (a.varianteId ?? "") === (variante?.id ?? ""))?.quantite ?? 0;
  const maxAjout = Math.max(0, stock - dejaAuPanier);
  const quantite = Math.max(1, Math.min(quantiteSaisie, maxAjout || 1));

  /** Change une option ; l'image suit la couleur choisie */
  const choisir = (nomOption: string, valeur: string) => {
    const nouveau = { ...choix, [nomOption]: valeur };
    setChoix(nouveau);
    const v = produit.variantes.find((x) => Object.entries(x.options).every(([k, val]) => nouveau[k] === val));
    const i = v?.image ? produit.images.indexOf(v.image) : -1;
    if (i >= 0) setImageIdx(i);
  };

  /** Une valeur d'option est-elle disponible avec les autres choix actuels ? */
  const valeurDispo = (nomOption: string, valeur: string) =>
    produit.variantes.some(
      (v) => v.options[nomOption] === valeur && v.stock > 0 && Object.entries(choix).every(([k, val]) => k === nomOption || v.options[k] === val),
    );

  const onAjouter = () => {
    if (maxAjout <= 0) return;
    ajouter({
      produitId: produit.id,
      varianteId: variante?.id,
      quantite,
      nom: produit.nom,
      slug: produit.slug,
      variante: variante ? Object.values(variante.options).join(" · ") : undefined,
      prix: prixActuel,
      image: variante?.image ?? produit.images[0],
      stock,
    });
    setAjoute(true);
    setTimeout(() => setAjoute(false), 4000);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
      {/* Galerie */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={produit.images[imageIdx]} alt={`${produit.nom} – vue ${imageIdx + 1}`} width={800} height={800} className={`size-full ${produit.appareil ? "object-contain p-8" : "object-cover"}`} />
        </div>
        {produit.images.length > 1 && (
          <ul className="mt-3 grid grid-cols-4 gap-3" aria-label="Choisir une image">
            {produit.images.map((src, i) => (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => setImageIdx(i)}
                  aria-label={`Afficher l'image ${i + 1}`}
                  aria-current={i === imageIdx}
                  className={`block aspect-square w-full overflow-hidden rounded-2xl border-2 bg-white ${i === imageIdx ? "border-brand" : "border-transparent hover:border-line"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" width={160} height={160} loading="lazy" className="size-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Infos d'achat */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-brand">{produit.marque}</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{produit.nom}</h1>
        <p className="mt-4 flex items-baseline gap-3">
          <span className="font-display text-4xl font-bold">{prix(prixActuel)}</span>
          {produit.prixBarre && <span className="text-lg text-subtle line-through">{prix(produit.prixBarre)}</span>}
          <span className="text-sm text-muted">TTC</span>
        </p>
        <p className="mt-4 text-lg text-muted">{produit.description}</p>

        {produit.options.map((o) => (
          <fieldset key={o.nom} className="mt-7">
            <legend className="mb-3 text-sm font-semibold">
              {o.nom} : <span className="font-normal text-muted">{choix[o.nom]}</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {o.valeurs.map((val) => {
                const actif = choix[o.nom] === val;
                const dispo = valeurDispo(o.nom, val);
                return (
                  <button
                    key={val}
                    type="button"
                    aria-pressed={actif}
                    onClick={() => choisir(o.nom, val)}
                    className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${actif ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"} ${dispo ? "" : "text-subtle line-through decoration-1"}`}
                  >
                    {val}
                    {!dispo && <span className="sr-only"> (épuisé)</span>}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        {produit.appareil && (
          <dl className="mt-6 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            {[
              ["État", produit.appareil.etat],
              ["Grade", produit.appareil.grade || "–"],
              ["Capacité", produit.appareil.capacite],
              ["Couleur", produit.appareil.couleur || "–"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-white px-3 py-2.5 ring-1 ring-line">
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {produit.appareil?.infoClient && (
          <p className="mt-3 flex gap-2 rounded-2xl bg-brand-soft px-4 py-3 text-sm text-brand-strong">
            <Info className="mt-0.5 size-4 shrink-0" aria-hidden /> {produit.appareil.infoClient}.
          </p>
        )}

        {/* Stock */}
        <p className="mt-7 flex items-center gap-2 text-sm font-semibold" aria-live="polite">
          {produit.surCommande ? (
            <><span className="size-2.5 rounded-full bg-brand" aria-hidden /> <span className="text-brand-strong">Commandé sur demande · disponible sous 2 à 4 jours ouvrés</span></>
          ) : stock === 0 ? (
            <><span className="size-2.5 rounded-full bg-danger" aria-hidden /> <span className="text-danger">Rupture de stock{aVariantes ? " pour cette combinaison" : ""}</span></>
          ) : stock <= 3 ? (
            <><span className="size-2.5 rounded-full bg-accent" aria-hidden /> <span className="text-accent-strong">Plus que {stock} en stock</span></>
          ) : (
            <><span className="size-2.5 rounded-full bg-success" aria-hidden /> <span className="text-success">En stock</span></>
          )}
        </p>

        {stock > 0 ? (
          <div className="mt-4 flex gap-3">
            <div className="flex h-12 shrink-0 items-center rounded-full border border-line bg-white">
              <button type="button" onClick={() => setQuantite(Math.max(1, quantite - 1))} disabled={quantite <= 1} className="grid size-12 place-items-center rounded-full disabled:opacity-40" aria-label="Diminuer la quantité">
                <Minus className="size-4" aria-hidden />
              </button>
              <label htmlFor="quantite" className="sr-only">Quantité</label>
              <input
                id="quantite"
                type="number"
                inputMode="numeric"
                min={1}
                max={maxAjout}
                value={quantite}
                onChange={(e) => setQuantite(Math.max(1, Math.min(Number(e.target.value) || 1, maxAjout || 1)))}
                className="w-12 bg-transparent text-center font-semibold [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button type="button" onClick={() => setQuantite(Math.min(maxAjout, quantite + 1))} disabled={quantite >= maxAjout} className="grid size-12 place-items-center rounded-full disabled:opacity-40" aria-label="Augmenter la quantité">
                <Plus className="size-4" aria-hidden />
              </button>
            </div>
            <button type="button" onClick={onAjouter} disabled={maxAjout <= 0} className="btn-accent flex-1">
              <ShoppingBag className="size-5" aria-hidden /> Ajouter au panier
            </button>
          </div>
        ) : (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-line bg-white p-4 text-sm">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-accent-strong" aria-hidden />
            <p>
              Ce produit est momentanément indisponible{aVariantes ? " dans cette version" : ""}.{" "}
              <Link href="/contact" className="font-semibold text-brand underline underline-offset-2">Contactez-nous</Link> : nous pouvons le commander pour vous.
            </p>
          </div>
        )}
        {maxAjout <= 0 && stock > 0 && <p className="mt-2 text-sm text-muted">Vous avez déjà tout le stock disponible dans votre panier.</p>}

        <div role="status" aria-live="polite">
          {ajoute && (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-success/30 bg-success-soft p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 font-semibold text-ink"><Check className="size-5 text-success" aria-hidden /> Ajouté au panier !</p>
              <Link href="/panier" className="btn-dark btn-sm">Voir le panier</Link>
            </div>
          )}
        </div>

        {produit.surCommande && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <a href={`tel:${entreprise.telephoneLien}`} className="btn-ghost">
              <Phone className="size-5" aria-hidden /> Réserver par téléphone
            </a>
            <a
              href={`https://wa.me/${entreprise.telephoneLien.replace("+", "")}?text=${encodeURIComponent(`Bonjour, je souhaite réserver : ${produit.nom} (réf. ${produit.appareil?.reference ?? produit.id}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <MessageCircle className="size-5" aria-hidden /> Réserver sur WhatsApp
            </a>
          </div>
        )}

        <ul className="mt-8 space-y-3 rounded-3xl bg-white p-5 text-sm ring-1 ring-line">
          <li className="flex gap-3"><Truck className="size-5 shrink-0 text-brand" aria-hidden /> {livraisonTexte}</li>
          <li className="flex gap-3"><Store className="size-5 shrink-0 text-brand" aria-hidden /> Retrait gratuit en boutique à Montpellier sous {produit.surCommande ? "2 à 4 jours ouvrés" : "24 h ouvrées"}</li>
          {produit.appareil ? (
            <li className="flex gap-3"><ShieldCheck className="size-5 shrink-0 text-brand" aria-hidden /> Garantie 12 mois · Rétractation 14 jours pour un achat en ligne</li>
          ) : (
            <li className="flex gap-3"><Check className="size-5 shrink-0 text-brand" aria-hidden /> Garantie légale de conformité 2 ans · Rétractation 14 jours</li>
          )}
        </ul>
      </div>
    </div>
  );
}
