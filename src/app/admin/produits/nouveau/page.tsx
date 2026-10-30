import Link from "next/link";
import { exigerAdmin } from "@/lib/admin-auth";
import { getCatalogue } from "@/lib/produits";
import { Coque } from "../../Coque";
import { FormProduit } from "../FormProduit";

export const dynamic = "force-dynamic";

export default async function Nouveau() {
  await exigerAdmin();
  const { categories } = await getCatalogue();
  return (
    <Coque titre="Nouveau produit" actif="/admin/produits" actions={<Link href="/admin/produits" className="btn-ghost btn-sm">← Retour</Link>}>
      <FormProduit categories={categories} />
    </Coque>
  );
}
