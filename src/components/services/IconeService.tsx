import { Car, Plane, BedDouble, Bus, Banknote, Package, CreditCard, FileText, Smartphone, Send, FileBadge, CardSim } from "lucide-react";
import type { ServiceProximite } from "@/config/entreprise";

const ICONES = {
  "carte-grise": FileBadge,
  recharge: Smartphone,
  credit: Send,
  sim: CardSim,
  avion: Plane,
  hotel: BedDouble,
  voiture: Car,
  bus: Bus,
  argent: Banknote,
  colis: Package,
  pcs: CreditCard,
  admin: FileText,
} satisfies Record<ServiceProximite["icone"], unknown>;

export function IconeService({ icone, className }: { icone: ServiceProximite["icone"]; className?: string }) {
  const I = ICONES[icone];
  return <I className={className} aria-hidden />;
}
