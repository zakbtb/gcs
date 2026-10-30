import type { Commande } from "@/lib/types";
import { prix } from "@/lib/format";

export function RecapCommande({ commande: c }: { commande: Commande }) {
  return (
    <aside className="rounded-3xl bg-white p-6 ring-1 ring-line" aria-label="Récapitulatif">
      <h2 className="text-xl font-semibold">Récapitulatif</h2>
      <ul className="mt-5 space-y-3">
        {c.lignes.map((l) => (
          <li key={`${l.produitId}-${l.varianteId ?? ""}`} className="flex gap-3 text-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.image} alt="" width={56} height={56} className="size-14 rounded-xl bg-surface object-cover" />
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{l.nom}</span>
              {l.variante && <span className="block text-muted">{l.variante}</span>}
              <span className="text-muted">Qté : {l.quantite} × {prix(l.prixUnitaire)}</span>
            </span>
            <span className="font-semibold">{prix(l.total)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[0.95rem]">
        <div className="flex justify-between"><dt className="text-muted">Sous-total</dt><dd>{prix(c.sousTotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">{c.livraison.mode === "retrait" ? "Retrait en boutique" : "Livraison"}</dt><dd>{c.fraisLivraison === 0 ? "Gratuit" : prix(c.fraisLivraison)}</dd></div>
        <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold"><dt>Total TTC</dt><dd className="font-display text-2xl font-bold">{prix(c.total)}</dd></div>
      </dl>
      <div className="mt-5 rounded-2xl bg-surface p-4 text-sm">
        <p className="font-semibold">{c.livraison.mode === "retrait" ? "Retrait en boutique" : "Livraison à"}</p>
        <p className="text-muted">
          {c.client.prenom} {c.client.nom}
          {c.livraison.mode === "livraison" && <><br />{c.livraison.adresse}{c.livraison.complement ? `, ${c.livraison.complement}` : ""}<br />{c.livraison.codePostal} {c.livraison.ville}</>}
        </p>
      </div>
    </aside>
  );
}
