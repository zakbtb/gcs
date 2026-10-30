import Link from "next/link";
import { notFound } from "next/navigation";
import { exigerAdmin } from "@/lib/admin-auth";
import { getCatalogue } from "@/lib/produits";
import { Coque } from "../../Coque";
import { FormProduit } from "../FormProduit";
import { effacerProduit } from "../../actions";

export const dynamic = "force-dynamic";

export default async function Modifier({ params }: { params: Promise<{ id: string }> }) {
  await exigerAdmin();
  const { id } = await params;
  const { produits, categories } = await getCatalogue();
  const produit = produits.find((p) => p.id === id);
  if (!produit) notFound();
  return (
    <Coque
      titre={produit.nom}
      actif="/admin/produits"
      actions={
        <div className="flex gap-2">
          <Link href={`/boutique/${produit.slug}`} target="_blank" className="btn-ghost btn-sm">Voir la fiche</Link>
          <Link href="/admin/produits" className="btn-ghost btn-sm">← Retour</Link>
        </div>
      }
    >
      <FormProduit produit={produit} categories={categories} />
      <form action={effacerProduit} className="mt-10 rounded-2xl border border-danger/30 bg-white p-5">
        <input type="hidden" name="id" value={produit.id} />
        <p className="font-semibold text-danger">Zone de danger</p>
        <p className="mt-1 text-sm text-muted">Supprime définitivement le produit. Pour le cacher temporairement, décochez plutôt « En ligne ».</p>
        <button className="btn btn-sm mt-3 border border-danger text-danger hover:bg-danger hover:text-white">Supprimer ce produit</button>
      </form>
    </Coque>
  );
}
