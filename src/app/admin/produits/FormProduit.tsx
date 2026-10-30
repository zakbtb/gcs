"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { sauverProduit } from "../actions";
import type { Categorie, Produit } from "@/lib/types";

export function FormProduit({ produit, categories }: { produit?: Produit; categories: Categorie[] }) {
  const [etat, action, enCours] = useActionState(sauverProduit, {});
  const couleurs = produit?.options.find((o) => o.nom === "Couleur")?.valeurs.join(", ") ?? "";
  const modeles = produit?.options.find((o) => o.nom === "Modèle")?.valeurs.join(", ") ?? "";
  const champ = "space-y-1.5";
  return (
    <form action={action} className="space-y-6">
      {produit && <input type="hidden" name="ancienId" value={produit.id} />}
      {etat.erreur && <p role="alert" className="rounded-2xl bg-danger-soft p-4 font-medium text-danger">{etat.erreur}</p>}

      <section className="grid gap-5 rounded-2xl bg-white p-5 ring-1 ring-line sm:grid-cols-2">
        <h2 className="text-lg font-semibold sm:col-span-2">Informations</h2>
        <div className={`${champ} sm:col-span-2`}>
          <label htmlFor="nom" className="field-label">Nom du produit *</label>
          <input id="nom" name="nom" required defaultValue={produit?.nom} className="field" />
        </div>
        <div className={champ}>
          <label htmlFor="categorie" className="field-label">Catégorie *</label>
          <select id="categorie" name="categorie" defaultValue={produit?.categorie} className="field">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>
        <div className={champ}>
          <label htmlFor="marque" className="field-label">Marque</label>
          <input id="marque" name="marque" defaultValue={produit?.marque ?? "GCS Essentials"} className="field" />
        </div>
        <div className={champ}>
          <label htmlFor="prix" className="field-label">Prix TTC (€) *</label>
          <input id="prix" name="prix" inputMode="decimal" required defaultValue={produit?.prix} placeholder="19.90" className="field" />
        </div>
        <div className={champ}>
          <label htmlFor="prixBarre" className="field-label">Ancien prix barré (€)</label>
          <input id="prixBarre" name="prixBarre" inputMode="decimal" defaultValue={produit?.prixBarre} placeholder="Facultatif" className="field" />
          <p className="field-hint">Uniquement s&apos;il s&apos;agit du prix le plus bas pratiqué dans les 30 jours précédant la promotion (obligation légale).</p>
        </div>
        <div className={`${champ} sm:col-span-2`}>
          <label htmlFor="description" className="field-label">Description courte</label>
          <input id="description" name="description" defaultValue={produit?.description} className="field" />
        </div>
        <div className={`${champ} sm:col-span-2`}>
          <label htmlFor="descriptionLongue" className="field-label">Description détaillée</label>
          <textarea id="descriptionLongue" name="descriptionLongue" rows={5} defaultValue={produit?.descriptionLongue} className="field" />
        </div>
        <div className={`${champ} sm:col-span-2`}>
          <label htmlFor="caracteristiques" className="field-label">Caractéristiques (une par ligne : « Clé : valeur »)</label>
          <textarea id="caracteristiques" name="caracteristiques" rows={4} defaultValue={Object.entries(produit?.caracteristiques ?? {}).map(([k, v]) => `${k} : ${v}`).join("\n")} className="field font-mono text-sm" />
        </div>
        <div className={`${champ} sm:col-span-2`}>
          <label htmlFor="compatibilite" className="field-label">Compatibilité (séparée par des virgules)</label>
          <input id="compatibilite" name="compatibilite" defaultValue={produit?.compatibilite.join(", ")} placeholder="iPhone 15, iPhone 16, Universel USB-C" className="field" />
        </div>
        <div className={`${champ} sm:col-span-2`}>
          <label htmlFor="images" className="field-label">Images (une adresse par ligne)</label>
          <textarea id="images" name="images" rows={3} defaultValue={produit?.images.join("\n")} placeholder="/images/produits/mon-produit-1.jpg" className="field font-mono text-sm" />
          <p className="field-hint">Déposez vos photos dans le dossier <code>public/images/produits/</code> puis indiquez « /images/produits/nom-du-fichier.jpg ». Si le produit a plusieurs couleurs, mettez les images dans le même ordre que les couleurs.</p>
        </div>
      </section>

      <section className="grid gap-5 rounded-2xl bg-white p-5 ring-1 ring-line sm:grid-cols-2">
        <h2 className="text-lg font-semibold sm:col-span-2">Variantes & stock</h2>
        <div className={champ}>
          <label htmlFor="couleurs" className="field-label">Couleurs (virgules)</label>
          <input id="couleurs" name="couleurs" defaultValue={couleurs} placeholder="Noir, Blanc, Bleu" className="field" />
        </div>
        <div className={champ}>
          <label htmlFor="modeles" className="field-label">Modèles compatibles proposés (virgules)</label>
          <input id="modeles" name="modeles" defaultValue={modeles} placeholder="iPhone 15, iPhone 16" className="field" />
        </div>
        <div className={champ}>
          <label htmlFor="stock" className="field-label">{produit?.variantes.length ? "Stock par défaut des nouvelles variantes" : "Stock"}</label>
          <input id="stock" name="stock" type="number" min={0} defaultValue={produit?.stock ?? 10} className="field" />
          <p className="field-hint">Sans couleur ni modèle : c&apos;est le stock du produit. Avec : chaque combinaison a son propre stock (ci-dessous).</p>
        </div>
        {produit && produit.variantes.length > 0 && (
          <div className="sm:col-span-2">
            <p className="field-label">Stock par variante</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {produit.variantes.map((v) => (
                <label key={v.id} className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2 text-sm">
                  <span>{Object.values(v.options).join(" · ")}</span>
                  <input type="number" min={0} name={`stock_${v.id}`} defaultValue={v.stock} className="w-20 rounded-lg border border-line px-2 py-1.5 text-right" aria-label={`Stock ${Object.values(v.options).join(" ")}`} />
                </label>
              ))}
            </div>
            <p className="field-hint">Si vous ajoutez une couleur ou un modèle, enregistrez : les nouvelles combinaisons apparaîtront ici.</p>
          </div>
        )}
      </section>

      <section className="flex flex-wrap gap-6 rounded-2xl bg-white p-5 ring-1 ring-line">
        <label className="flex items-center gap-3"><input type="checkbox" name="actif" defaultChecked={produit?.actif ?? true} className="size-5 accent-brand" /> En ligne (visible dans la boutique)</label>
        <label className="flex items-center gap-3"><input type="checkbox" name="misEnAvant" defaultChecked={produit?.misEnAvant ?? false} className="size-5 accent-brand" /> Mis en avant sur l&apos;accueil</label>
      </section>

      <button className="btn-accent" disabled={enCours}>{enCours && <Loader2 className="size-5 animate-spin" aria-hidden />} Enregistrer le produit</button>
    </form>
  );
}
