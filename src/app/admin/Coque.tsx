import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Inbox, LogOut, ExternalLink } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { deconnexion } from "./actions";
import { stripeActif, modeTestStripe } from "@/lib/stripe";
import { smtpConfigure } from "@/lib/mail";

const LIENS = [
  { href: "/admin", nom: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/commandes", nom: "Commandes", icon: ShoppingCart },
  { href: "/admin/produits", nom: "Produits", icon: Package },
  { href: "/admin/messages", nom: "Messages", icon: Inbox },
];

/** Mise en page commune des pages admin (menu + bandeau d'état) */
export function Coque({ titre, actif, children, actions }: { titre: string; actif: string; children: React.ReactNode; actions?: React.ReactNode }) {
  const stripe = stripeActif();
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="bg-ink text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0">
        <div className="flex items-center gap-3 p-4 lg:p-6">
          <LogoMark />
          <div className="leading-tight">
            <p className="font-display font-bold">GCS Admin</p>
            <p className="text-xs text-white/60">Gestion de la boutique</p>
          </div>
        </div>
        <nav aria-label="Menu admin" className="overflow-x-auto px-2 pb-2 lg:px-3">
          <ul className="flex gap-1 lg:flex-col">
            {LIENS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={actif === l.href ? "page" : undefined} className={`flex min-h-11 items-center gap-3 whitespace-nowrap rounded-xl px-3 text-sm font-medium ${actif === l.href ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
                  <l.icon className="size-5" aria-hidden /> {l.nom}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/" target="_blank" className="flex min-h-11 items-center gap-3 whitespace-nowrap rounded-xl px-3 text-sm text-white/70 hover:bg-white/10 hover:text-white">
                <ExternalLink className="size-5" aria-hidden /> Voir le site
              </Link>
            </li>
            <li>
              <form action={deconnexion}>
                <button className="flex min-h-11 w-full items-center gap-3 whitespace-nowrap rounded-xl px-3 text-sm text-white/70 hover:bg-white/10 hover:text-white">
                  <LogOut className="size-5" aria-hidden /> Déconnexion
                </button>
              </form>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <div className="mb-6 flex flex-wrap gap-2 text-xs font-semibold">
          <span className={`rounded-full px-3 py-1 ${stripe ? (modeTestStripe() ? "bg-accent-soft text-accent-strong" : "bg-success-soft text-success") : "bg-yellow-100 text-yellow-900"}`}>
            Paiement : {stripe ? (modeTestStripe() ? "Stripe MODE TEST" : "Stripe EN PRODUCTION") : "MODE DÉMO (simulé)"}
          </span>
          <span className={`rounded-full px-3 py-1 ${smtpConfigure() ? "bg-success-soft text-success" : "bg-yellow-100 text-yellow-900"}`}>
            E-mails : {smtpConfigure() ? "SMTP actif" : "non configurés (enregistrés dans data/outbox)"}
          </span>
        </div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold sm:text-3xl">{titre}</h1>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}
