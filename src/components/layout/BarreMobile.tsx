"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, ShoppingBag, Phone } from "lucide-react";
import { entreprise } from "@/config/entreprise";

/** Barre d'actions rapides en bas de l'écran sur mobile (pouce-friendly). */
export function BarreMobile() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/commande") || pathname.startsWith("/panier")) return null;
  return (
    <nav aria-label="Actions rapides" className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="grid grid-cols-3">
        <li>
          <Link href="/boutique" className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold text-ink">
            <ShoppingBag className="size-5 text-brand" aria-hidden /> Boutique
          </Link>
        </li>
        <li>
          <Link href="/reparation-telephone-montpellier#simulateur" className="flex min-h-16 flex-col items-center justify-center gap-1 bg-accent text-xs font-bold text-ink">
            <Wrench className="size-5" aria-hidden /> Prix réparation
          </Link>
        </li>
        <li>
          <a href={`tel:${entreprise.telephoneLien}`} className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold text-ink">
            <Phone className="size-5 text-brand" aria-hidden /> Appeler
          </a>
        </li>
      </ul>
    </nav>
  );
}
