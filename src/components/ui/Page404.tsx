import Link from "next/link";

export function Page404() {
  return (
    <section className="container-x py-20 sm:py-28">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-display text-8xl font-bold text-brand/20 sm:text-9xl">404</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Cette page est introuvable</h1>
        <p className="mt-4 text-lg text-muted">Le lien est peut-être erroné, ou la page a été déplacée. Pas de panique, voici quelques pistes :</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link href="/" className="btn-dark">Accueil</Link>
          <Link href="/boutique" className="btn-ghost">Boutique</Link>
          <Link href="/reparation-telephone-montpellier" className="btn-ghost">Prix des réparations</Link>
          <Link href="/creation-site-web-montpellier" className="btn-ghost">Création de sites web</Link>
        </div>
      </div>
    </section>
  );
}
