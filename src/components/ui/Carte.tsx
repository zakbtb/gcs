"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { useConsentement } from "@/components/cookies/Consentement";

/** Carte Google Maps chargée uniquement après consentement « contenus tiers ». */
export function Carte({ adresse }: { adresse: string }) {
  const { choix, enregistrer } = useConsentement();
  const q = encodeURIComponent(adresse);
  const lien = `https://www.google.com/maps/search/?api=1&query=${q}`;

  if (choix?.tiers) {
    return (
      <div className="overflow-hidden rounded-3xl border border-line bg-surface">
        <iframe
          title="Carte : accès à la boutique GCS à Montpellier"
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          className="h-80 w-full sm:h-96"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }
  return (
    <div className="grid h-80 place-items-center rounded-3xl border border-dashed border-line bg-[radial-gradient(circle_at_30%_30%,#e3dbff,transparent_60%),radial-gradient(circle_at_80%_70%,#fff1e6,transparent_55%)] p-6 text-center sm:h-96">
      <div className="max-w-sm">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white shadow-card"><MapPin className="size-6 text-brand" aria-hidden /></span>
        <p className="mt-4 font-semibold">La carte Google Maps est désactivée</p>
        <p className="mt-1 text-sm text-muted">Elle n&apos;est chargée qu&apos;avec votre accord, car Google peut déposer des cookies.</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button type="button" className="btn-dark btn-sm" onClick={() => enregistrer({ audience: choix?.audience ?? false, tiers: true })}>
            Afficher la carte
          </button>
          <a href={lien} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm">
            Ouvrir dans Maps <ExternalLink className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
}
