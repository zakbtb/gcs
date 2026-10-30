import Link from "next/link";
import { exigerAdmin } from "@/lib/admin-auth";
import { getCommandes, LIBELLES_STATUT } from "@/lib/commandes";
import { getCatalogue, stockTotal } from "@/lib/produits";
import { getMessages } from "@/lib/messages";
import { dateFr, prix } from "@/lib/format";
import { Coque } from "./Coque";
import { BadgeStatut } from "./BadgeStatut";

export const dynamic = "force-dynamic";

export default async function Tableau() {
  await exigerAdmin();
  const [commandes, { produits }, messages] = await Promise.all([getCommandes(), getCatalogue(), getMessages()]);
  const payees = commandes.filter((c) => !["en_attente_paiement", "annulee", "paiement_refuse"].includes(c.statut));
  const aTraiter = commandes.filter((c) => ["payee", "en_preparation"].includes(c.statut));
  const ca = payees.reduce((s, c) => s + c.total, 0);
  const ruptures = produits.filter((p) => p.actif && stockTotal(p) === 0);
  const faibles = produits.filter((p) => p.actif && stockTotal(p) > 0 && stockTotal(p) <= 3);
  const nonLus = messages.filter((m) => !m.lu);

  const stats = [
    { t: "Commandes à traiter", v: aTraiter.length, href: "/admin/commandes" },
    { t: "Chiffre d'affaires (commandes payées)", v: prix(ca), href: "/admin/commandes" },
    { t: "Messages non lus", v: nonLus.length, href: "/admin/messages" },
    { t: "Produits en rupture", v: ruptures.length, href: "/admin/produits" },
  ];

  return (
    <Coque titre="Tableau de bord" actif="/admin">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.t} href={s.href} className="rounded-2xl bg-white p-5 ring-1 ring-line hover:ring-ink">
            <p className="text-sm text-muted">{s.t}</p>
            <p className="mt-2 font-display text-3xl font-bold">{s.v}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl bg-white p-5 ring-1 ring-line">
          <h2 className="text-lg font-semibold">Dernières commandes</h2>
          {commandes.length === 0 ? (
            <p className="mt-3 text-muted">Aucune commande pour le moment.</p>
          ) : (
            <ul className="mt-3 divide-y divide-line">
              {commandes.slice(0, 8).map((c) => (
                <li key={c.id}>
                  <Link href={`/admin/commandes/${c.id}`} className="flex flex-wrap items-center justify-between gap-2 py-3 hover:text-brand">
                    <span>
                      <span className="font-semibold">{c.id}</span> · {c.client.prenom} {c.client.nom}
                      <span className="block text-xs text-muted">{dateFr(c.creeLe, true)} · {c.livraison.mode === "retrait" ? "Retrait" : "Livraison"}{c.paiement.fournisseur === "demo" ? " · DÉMO" : ""}</span>
                    </span>
                    <span className="flex items-center gap-3"><BadgeStatut statut={c.statut} /> <strong>{prix(c.total)}</strong></span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-2xl bg-white p-5 ring-1 ring-line">
          <h2 className="text-lg font-semibold">Alertes stock</h2>
          {ruptures.length + faibles.length === 0 ? (
            <p className="mt-3 text-muted">Tout est en stock.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {[...ruptures, ...faibles].map((p) => (
                <li key={p.id} className="flex justify-between gap-2">
                  <Link href={`/admin/produits/${p.id}`} className="hover:text-brand">{p.nom}</Link>
                  <span className={stockTotal(p) === 0 ? "font-semibold text-danger" : "font-semibold text-accent-strong"}>{stockTotal(p) === 0 ? "Rupture" : `${stockTotal(p)} restant(s)`}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-6 text-xs text-muted">Statuts disponibles : {Object.values(LIBELLES_STATUT).join(", ")}.</p>
        </section>
      </div>
    </Coque>
  );
}
