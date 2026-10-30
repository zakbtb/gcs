"use client";

import { Printer } from "lucide-react";

export function BoutonImprimer() {
  return (
    <button type="button" onClick={() => window.print()} className="btn-ghost btn-sm">
      <Printer className="size-4" aria-hidden /> Imprimer le formulaire
    </button>
  );
}
