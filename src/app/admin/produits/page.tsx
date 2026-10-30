import Link from "next/link";
import { Plus } from "lucide-react";
import { exigerAdmin } from "@/lib/admin-auth";
import { getCatalogue, stockTotal } from "@/lib/produits";
import { prix } from "@/lib/format";
import { Coque } from "../Coque";

export const dynamic = "force-dynamic";

export default async function Produits({ searchParams }: { searchParams: Promise<{ ok?: string }> }) {
  await exigerAdmin();
  const { ok } = await searchParams;
  const { produits, categories } = await getCatalogue();
  const nomCat = Object.fromEntries(categories.map((c) => [c.id, c.nom]));
  return (
    <Coque titre="Produits" actif="/admin/produits" actions={<Link href="/admin/produits/nouveau" className="btn-accent btn-sm"><Plus className="size-4" aria-hidden /> Nouveau produit</Link>}>
      {ok && <p role="status" className="mb-4 rounded-2xl bg-success-soft p-4 text-sm font-medium text-success">« {ok} » a bien été enregistré.</p>}
      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-line">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted">
            <tr><th className="p-3">Produit</th><th className="p-3">Catégorie</th><th className="p-3 text-right">Prix TTC</th><th className="p-3 text-right">Stock</th><th className="p-3">État</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {produits.map((p) => {
              const s = stockTotal(p);
              return (
                <tr key={p.id} className="hover:bg-surface">
                  <td className="p-3">
                    <Link href={`/admin/produits/${p.id}`} className="flex items-center gap-3 font-semibold hover:text-brand">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.images[0]} alt="" width={40} height={40} className="size-10 rounded-lg bg-surface object-cover" />
                      {p.nom}
                    </Link>
                  </td>
                  <td className="p-3">{nomCat[p.categorie] ?? p.categorie}</td>
                  <td className="p-3 text-right">{prix(p.prix)}</td>
                  <td className={`p-3 text-right font-semibold ${s === 0 ? "text-danger" : s <= 3 ? "text-accent-strong" : ""}`}>{s}{p.variantes.length > 0 && <span className="block text-xs font-normal text-muted">{p.variantes.length} variantes</span>}</td>
                  <td className="p-3">{p.actif ? <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">En ligne</span> : <span className="rounded-full bg-line px-2.5 py-1 text-xs font-semibold text-muted">Masqué</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-muted">Astuce : vous pouvez aussi modifier directement le fichier <code>data/produits.json</code>.</p>
    </Coque>
  );
}
