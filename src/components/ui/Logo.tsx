import Link from "next/link";

/** Symbole GCS (les deux maillons). `dark` : version pour fond foncé. */
export function LogoMark({ className = "h-9 w-auto", dark = false }: { className?: string; dark?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={dark ? "/marque/gcs-symbole-couleur-fond-fonce.svg" : "/marque/gcs-symbole-couleur.svg"}
      alt=""
      width={1304}
      height={878}
      className={className}
    />
  );
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center rounded-lg" aria-label="GCS – Global Connect Services, retour à l'accueil">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dark ? "/marque/gcs-horizontal-couleur-fond-fonce.svg" : "/marque/gcs-horizontal-couleur.svg"}
        alt="GCS – Global Connect Services"
        width={4287}
        height={1197}
        className="h-10 w-auto"
      />
    </Link>
  );
}
