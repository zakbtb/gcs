import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AchatProduit } from "@/components/boutique/AchatProduit";
import { CarteProduit } from "@/components/boutique/CarteProduit";
import { FilAriane } from "@/components/ui/Section";
import { JsonLd } from "@/components/ui/JsonLd";
import { boutique, entreprise } from "@/config/entreprise";
import { getCatalogue, getProduit, stockTotal } from "@/lib/produits";
import { arianeJsonLd, meta } from "@/lib/seo";
import { prix, prixCourt } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduit(slug);
  if (!p || !p.actif) return { title: "Produit introuvable" };
  return meta({
    titre: `${p.nom} – ${prix(p.prix)}`,
    description: `${p.description} Livraison ou retrait gratuit à Montpellier.`.slice(0, 160),
    chemin: `/boutique/${p.slug}`,
    image: p.images[0],
  });
}

export default async function PageProduit({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [produit, catalogue] = await Promise.all([getProduit(slug), getCatalogue()]);
  if (!produit || !produit.actif) notFound();

  const categorie = catalogue.categories.find((c) => c.id === produit.categorie);
  const similaires = catalogue.produits
    .filter((p) => p.actif && p.id !== produit.id && p.categorie === produit.categorie)
    .concat(catalogue.produits.filter((p) => p.actif && p.id !== produit.id && p.categorie !== produit.categorie && p.misEnAvant))
    .slice(0, 4);
  const livraisonTexte = boutique.livraison.gratuiteDes
    ? `Livraison ${prix(boutique.livraison.prix)}, offerte dès ${prixCourt(boutique.livraison.gratuiteDes)} d'achat · expédition sous ${boutique.expeditionSous}`
    : `Livraison ${prix(boutique.livraison.prix)} · expédition sous ${boutique.expeditionSous}`;

  const ariane = [
    { nom: "Accueil", href: "/" },
    { nom: "Boutique", href: "/boutique" },
    ...(categorie ? [{ nom: categorie.nom, href: `/boutique?categorie=${categorie.id}` }] : []),
    { nom: produit.nom, href: `/boutique/${produit.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: produit.nom,
          description: produit.descriptionLongue,
          image: produit.images.map((i) => `${entreprise.siteUrl}${i}`),
          brand: { "@type": "Brand", name: produit.marque },
          sku: produit.id,
          offers: {
            "@type": "Offer",
            url: `${entreprise.siteUrl}/boutique/${produit.slug}`,
            priceCurrency: "EUR",
            price: produit.prix,
            availability: stockTotal(produit) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@id": `${entreprise.siteUrl}/#entreprise` },
          },
        }}
      />
      <JsonLd data={arianeJsonLd(ariane)} />

      <div className="container-x py-6 text-muted">
        <FilAriane items={ariane.map((a, i) => (i === ariane.length - 1 ? { nom: a.nom } : a))} />
      </div>

      <section className="container-x pb-16">
        <AchatProduit produit={produit} livraisonTexte={livraisonTexte} />
      </section>

      <section className="bg-white py-16" aria-labelledby="t-details">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <h2 id="t-details" className="text-2xl font-semibold">Description</h2>
            <p className="mt-4 leading-relaxed text-ink/85">{produit.descriptionLongue}</p>
            <h3 className="mt-8 text-lg font-semibold">Compatibilité</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {produit.compatibilite.map((c) => <li key={c} className="rounded-full bg-surface px-3 py-1.5 text-sm">{c}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Caractéristiques</h2>
            <dl className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line">
              {Object.entries(produit.caracteristiques).map(([k, v]) => (
                <div key={k} className="grid grid-cols-2 gap-4 px-4 py-3 text-sm">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {similaires.length > 0 && (
        <section className="py-16" aria-labelledby="t-similaires">
          <div className="container-x">
            <h2 id="t-similaires" className="text-2xl font-semibold sm:text-3xl">Vous aimerez aussi</h2>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {similaires.map((p) => (
                <CarteProduit key={p.id} produit={p} nomCategorie={catalogue.categories.find((c) => c.id === p.categorie)?.nom} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
