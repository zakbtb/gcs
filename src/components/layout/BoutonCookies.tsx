"use client";

import { ouvrirPanneauCookies } from "@/components/cookies/Consentement";

export function BoutonCookies({ className = "inline-block py-1.5 text-sm hover:text-white hover:underline hover:underline-offset-4" }: { className?: string }) {
  return (
    <button type="button" onClick={ouvrirPanneauCookies} className={className}>
      Gérer les cookies
    </button>
  );
}
