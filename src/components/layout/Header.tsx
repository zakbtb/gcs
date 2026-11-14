"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { StatutOuverture } from "@/components/ui/StatutOuverture";
import { usePanier } from "@/components/panier/PanierProvider";
import { entreprise } from "@/config/entreprise";

export const NAVIGATION = [
  { href: "/reparation-telephone-montpellier", nom: "Réparation", vedette: true },
  { href: "/boutique", nom: "Boutique" },
  { href: "/services", nom: "Téléphones & services" },
  { href: "/creation-site-web-montpellier", nom: "Sites web" },
  { href: "/a-propos", nom: "À propos" },
  { href: "/contact", nom: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  // Le menu est « ouvert sur » une page : il se referme tout seul quand on change de page
  const [ouvertSur, setOuvertSur] = useState<string | null>(null);
  const ouvert = ouvertSur === pathname;
  const setOuvert = (v: boolean) => setOuvertSur(v ? pathname : null);
  const { nombre, pret } = usePanier();

  useEffect(() => {
    document.body.style.overflow = ouvert ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOuvertSur(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [ouvert]);

  const actif = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <div className="no-print hidden bg-ink text-[0.8rem] text-white/80 md:block">
        <div className="container-x flex h-9 items-center justify-between">
          <StatutOuverture />
          <p className="flex items-center gap-5">
            <span>Diagnostic gratuit · Réparation iPhone dès 30 min</span>
            <a href={`https://www.snapchat.com/add/${entreprise.snapchat}`} className="hover:text-white" target="_blank" rel="noopener noreferrer">
              Snapchat : <strong className="text-white">{entreprise.snapchat}</strong>
            </a>
          </p>
        </div>
      </div>
      <header className="no-print sticky top-0 z-50 border-b border-line/80 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/75">
        <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          Aller au contenu
        </a>
        <div className="container-x flex h-[4.25rem] items-center justify-between gap-4">
          <Logo />
          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAVIGATION.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={actif(l.href) ? "page" : undefined}
                    className={
                      l.vedette
                        ? `ml-1 mr-2 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${actif(l.href) ? "bg-brand text-white" : "bg-brand-soft text-brand-strong hover:bg-brand hover:text-white"}`
                        : `rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-surface ${actif(l.href) ? "text-brand-strong" : "text-ink/80 hover:text-ink"}`
                    }
                  >
                    {l.vedette && <Sparkles className="size-4" aria-hidden />}
                    {l.nom}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-1.5">
            <Link
              href="/panier"
              className="relative grid size-11 place-items-center rounded-full transition-colors hover:bg-surface"
              aria-label={`Panier${pret && nombre > 0 ? ` : ${nombre} article${nombre > 1 ? "s" : ""}` : " vide"}`}
            >
              <ShoppingBag className="size-[1.35rem]" aria-hidden />
              {pret && nombre > 0 && (
                <span className="absolute right-0.5 top-0.5 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.7rem] font-bold leading-5 text-ink">
                  {nombre}
                </span>
              )}
            </Link>
            <Link href="/reparation-telephone-montpellier#simulateur" className="btn-accent btn-sm hidden sm:inline-flex">
              Estimer ma réparation
            </Link>
            <button
              className="grid size-11 place-items-center rounded-full hover:bg-surface lg:hidden"
              onClick={() => setOuvert(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={ouvert}
              aria-controls="menu-mobile"
            >
              <Menu className="size-6" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile */}
      <div
        id="menu-mobile"
        className={`fixed inset-0 z-[70] lg:hidden ${ouvert ? "visible" : "invisible"}`}
        aria-hidden={!ouvert}
        inert={!ouvert}
      >
        <div
          className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${ouvert ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOuvert(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-white shadow-pop transition-transform duration-300 ease-out ${ouvert ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex h-[4.25rem] items-center justify-between border-b border-line px-4">
            <Logo />
            <button onClick={() => setOuvert(false)} className="grid size-11 place-items-center rounded-full hover:bg-surface" aria-label="Fermer le menu">
              <X className="size-6" aria-hidden />
            </button>
          </div>
          <nav aria-label="Navigation mobile" className="flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-1">
              <li>
                <Link href="/" className="block rounded-xl px-4 py-3.5 text-lg font-medium hover:bg-surface" aria-current={pathname === "/" ? "page" : undefined}>
                  Accueil
                </Link>
              </li>
              {NAVIGATION.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={actif(l.href) ? "page" : undefined}
                    className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-lg font-medium ${l.vedette ? "bg-brand-soft text-brand-strong" : "hover:bg-surface"} ${actif(l.href) ? "text-brand-strong" : ""}`}
                  >
                    {l.nom}
                    {l.vedette && <Sparkles className="size-5" aria-hidden />}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-3 border-t border-line p-4">
            <StatutOuverture className="text-sm text-muted" />
            <Link href="/reparation-telephone-montpellier#simulateur" className="btn-accent w-full">Estimer ma réparation</Link>
            <Link href="/boutique" className="btn-ghost w-full">Voir la boutique</Link>
          </div>
        </div>
      </div>
    </>
  );
}
