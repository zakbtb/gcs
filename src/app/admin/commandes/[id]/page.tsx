import Link from "next/link";
import { notFound } from "next/navigation";
import { exigerAdmin } from "@/lib/admin-auth";
import { getCommande, LIBELLES_STATUT } from "@/lib/commandes";
import { dateFr, prix } from "@/lib/format";
import { Coque } from "../../Coque";
import { BadgeStatut } from "../../BadgeStatut";
import { majStatutCommande } from "../../actions";

export const dynamic = "force-dynamic";

export default async function DetailCommande({ params }: { params: Promise<{ id: string }> }) {
  await exigerAdmin();
  const { id } = await params;
  const c = await getCommande(decodeURIComponent(id));
  if (!c) notFound();
  return (
    <Coque titre={`Commande ${c.id}`} actif="/admin/commandes" actions={<Link href="/admin/commandes" className="btn-ghost btn-sm">← Toutes les commandes</Link>}>
      {c.paiement.fournisseur === "demo" && (
        <p className="mb-4 rounded-2xl bg-yellow-100 p-4 text-sm font-medium text-yellow-900">Commande passée en MODE DÉMO : aucun paiement réel n&apos;a été encaissé.</p>
      )}
      {c.historique.some((h) => h.note?.includes("Stock insuffisant")) && (
        <p className="mb-4 rounded-2xl bg-danger-soft p-4 text-sm font-medium text-danger">⚠️ Stock insuffisant au moment du paiement : vérifiez la disponibilité ou remboursez le client depuis Stripe.</p>
      )}
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-5 ring-1 ring-line">
            <div className="flex flex-wrap items-center gap-3"><BadgeStatut statut={c.statut} /><span className="text-sm text-muted">Créée le {dateFr(c.creeLe, true)}</span></div>
            <table className="mt-4 w-full text-sm">
              <tbody className="divide-y divide-line">
                {c.lignes.map((l) => (
                  <tr key={`${l.produitId}-${l.varianteId ?? ""}`}>
                    <td className="py-3">{l.nom}{l.variante && <span className="block text-muted">{l.variante}</span>}</td>
                    <td className="py-3 text-center">× {l.quantite}</td>
                    <td className="py-3 text-right">{prix(l.total)}</td>
                  </tr>
                ))}
                <tr><td colSpan={2} className="py-2 text-muted">Sous-total</td><td className="py-2 text-right">{prix(c.sousTotal)}</td></tr>
                <tr><td colSpan={2} className="py-2 text-muted">{c.livraison.mode === "retrait" ? "Retrait" : "Livraison"}</td><td className="py-2 text-right">{prix(c.fraisLivraison)}</td></tr>
                <tr><td colSpan={2} className="py-2 font-semibold">Total TTC</td><td className="py-2 text-right text-lg font-bold">{prix(c.total)}</td></tr>
              </tbody>
            </table>
          </section>
          <section className="rounded-2xl bg-white p-5 ring-1 ring-line">
            <h2 className="font-semibold">Historique</h2>
            <ol className="mt-3 space-y-2 text-sm">
              {c.historique.map((h, i) => (
                <li key={i} className="flex flex-wrap gap-2"><span className="text-muted">{dateFr(h.date, true)}</span> <strong>{LIBELLES_STATUT[h.statut]}</strong> {h.note && <span>– {h.note}</span>}</li>
              ))}
            </ol>
          </section>
        </div>
        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-5 ring-1 ring-line">
            <h2 className="font-semibold">Changer le statut</h2>
            <form action={majStatutCommande} className="mt-3 space-y-3">
              <input type="hidden" name="id" value={c.id} />
              <label htmlFor="statut" className="sr-only">Statut</label>
              <select id="statut" name="statut" defaultValue={c.statut} className="field">
                {Object.entries(LIBELLES_STATUT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <label htmlFor="note" className="sr-only">Note interne</label>
              <input id="note" name="note" placeholder="Note (ex. n° de suivi Colis Privé)" className="field" />
              <button className="btn-dark w-full">Enregistrer</button>
            </form>
            <p className="mt-3 text-xs text-muted">Pensez à prévenir le client (e-mail/SMS) quand la commande est expédiée ou prête à retirer.</p>
          </section>
          <section className="rounded-2xl bg-white p-5 text-sm ring-1 ring-line">
            <h2 className="font-semibold">Client</h2>
            <p className="mt-2">{c.client.prenom} {c.client.nom}<br /><a className="text-brand" href={`mailto:${c.client.email}`}>{c.client.email}</a><br /><a className="text-brand" href={`tel:${c.client.telephone}`}>{c.client.telephone}</a></p>
            <h2 className="mt-4 font-semibold">{c.livraison.mode === "retrait" ? "Retrait en boutique" : "Adresse de livraison"}</h2>
            {c.livraison.mode === "livraison" && <p className="mt-2">{c.livraison.adresse}{c.livraison.complement && <><br />{c.livraison.complement}</>}<br />{c.livraison.codePostal} {c.livraison.ville}</p>}
            {c.note && <><h2 className="mt-4 font-semibold">Remarque du client</h2><p className="mt-2 whitespace-pre-wrap">{c.note}</p></>}
            <h2 className="mt-4 font-semibold">Paiement</h2>
            <p className="mt-2">{c.paiement.fournisseur === "stripe" ? "Stripe" : "Démo"}{c.paiement.reference && <><br /><code className="text-xs">{c.paiement.reference}</code></>}{c.paiement.payeLe && <><br />Payé le {dateFr(c.paiement.payeLe, true)}</>}</p>
            <p className="mt-1 text-xs text-muted">E-mail de confirmation : {c.emailEnvoye ? "envoyé" : "non envoyé"}</p>
          </section>
        </div>
      </div>
    </Coque>
  );
}
