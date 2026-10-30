"use client";

import Link from "next/link";

export default function Erreur({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="container-x py-20 text-center">
      <h1 className="text-3xl font-semibold">Une erreur est survenue</h1>
      <p className="mt-3 text-muted">Nous sommes désolés. Réessayez dans un instant ou contactez-nous si le problème persiste.</p>
      <div className="mt-8 flex justify-center gap-3">
        <button onClick={reset} className="btn-dark">Réessayer</button>
        <Link href="/" className="btn-ghost">Accueil</Link>
      </div>
    </section>
  );
}
