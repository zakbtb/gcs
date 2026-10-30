import Link from "next/link";
import type { Produit } from "@/lib/types";
import { prix } from "@/lib/format";

function stockTotal(p: Produit) {
  return p.variantes.length > 0 ? p.variantes.reduce((s, v) => s + v.stock, 0) : p.stock ?? 0;
}

export function CarteProduit({ produit, nomCategorie }: { produit: Produit; nomCategorie?: string }) {
  const stock = stockTotal(produit);
  const nbCouleurs = produit.options.find((o) => o.nom === "Couleur")?.valeurs.length ?? 0;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-card">
      <div className="relative aspect-square overflow-hidden bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={produit.images[0]}
          alt=""
          width={800}
          height={800}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {produit.prixBarre && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-ink">
              -{Math.round((1 - produit.prix / produit.prixBarre) * 100)} %
            </span>
          )}
          {stock === 0 && <span className="rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-white">Rupture</span>}
          {stock > 0 && stock <= 3 && <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-accent-strong">Plus que {stock}</span>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        {nomCategorie && <p className="text-xs font-semibold uppercase tracking-wider text-subtle">{nomCategorie}</p>}
        <h3 className="mt-1 font-sans text-[0.98rem] font-semibold leading-snug">
          <Link href={`/boutique/${produit.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {produit.nom}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{produit.description}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <p>
            <span className="font-display text-lg font-bold">{prix(produit.prix)}</span>
            {produit.prixBarre && <span className="ml-2 text-sm text-subtle line-through">{prix(produit.prixBarre)}</span>}
          </p>
          {nbCouleurs > 1 && <p className="text-xs text-muted">{nbCouleurs} coloris</p>}
        </div>
      </div>
    </article>
  );
}
