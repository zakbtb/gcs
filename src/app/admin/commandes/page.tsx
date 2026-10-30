import Link from "next/link";
import { exigerAdmin } from "@/lib/admin-auth";
import { getCommandes } from "@/lib/commandes";
import { dateFr, prix } from "@/lib/format";
import { Coque } from "../Coque";
import { BadgeStatut } from "../BadgeStatut";

export const dynamic = "force-dynamic";

export default async function Commandes({ searchParams }: { searchParams: Promise<{ filtre?: string }> }) {
  await exigerAdmin();
  const { filtre } = await searchParams;
  const toutes = await getCommandes();
  const commandes = filtre === "attente" ? toutes.filter((c) => c.statut === "en_attente_paiement") : filtre === "payees" ? toutes.filter((c) => c.statut !== "en_attente_paiement") : toutes;
  return (
    <Coque titre="Commandes" actif="/admin/commandes">
      <nav className="mb-4 flex gap-2 text-sm" aria-label="Filtrer">
        {[["", "Toutes"], ["payees", "Payées et suivantes"], ["attente", "Paiement non finalisé"]].map(([k, n]) => (
          <Link key={k} href={k ? `?filtre=${k}` : "?"} className={`rounded-full px-3 py-1.5 font-medium ${(filtre ?? "") === k ? "bg-ink text-white" : "bg-white ring-1 ring-line"}`}>{n}</Link>
        ))}
      </nav>
      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-line">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted">
            <tr><th className="p-3">N°</th><th className="p-3">Date</th><th className="p-3">Client</th><th className="p-3">Mode</th><th className="p-3">Statut</th><th className="p-3 text-right">Total</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {commandes.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-muted">Aucune commande.</td></tr>}
            {commandes.map((c) => (
              <tr key={c.id} className="hover:bg-surface">
                <td className="p-3 font-semibold"><Link href={`/admin/commandes/${c.id}`} className="text-brand hover:underline">{c.id}</Link>{c.paiement.fournisseur === "demo" && <span className="ml-2 rounded bg-yellow-100 px-1.5 text-[0.65rem] text-yellow-900">DÉMO</span>}</td>
                <td className="p-3">{dateFr(c.creeLe, true)}</td>
                <td className="p-3">{c.client.prenom} {c.client.nom}<span className="block text-xs text-muted">{c.client.email}</span></td>
                <td className="p-3">{c.livraison.mode === "retrait" ? "Retrait" : "Livraison"}</td>
                <td className="p-3"><BadgeStatut statut={c.statut} /></td>
                <td className="p-3 text-right font-semibold">{prix(c.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Coque>
  );
}
