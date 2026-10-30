"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { Cookie, X } from "lucide-react";
import { mesureAudience } from "@/config/entreprise";

/**
 * Gestion du consentement cookies conforme aux recommandations de la CNIL :
 * - aucun cookie/traceur non essentiel avant le consentement ;
 * - « Tout refuser » aussi visible que « Tout accepter » ;
 * - choix par catégorie ;
 * - choix modifiable à tout moment (lien « Gérer les cookies » dans le pied de page) ;
 * - choix conservé 6 mois, puis redemandé.
 */

export type Choix = { audience: boolean; tiers: boolean };
type Etat = { choix: Choix | null; ouvrir: () => void; enregistrer: (c: Choix) => void };

const CLE = "gcs_consentement";
const VERSION = 1;
const DUREE_JOURS = 182;

const ConsentementContext = createContext<Etat>({ choix: null, ouvrir: () => {}, enregistrer: () => {} });

export const useConsentement = () => useContext(ConsentementContext);

/** Permet d'ouvrir le panneau depuis n'importe quel bouton (ex. pied de page) */
export const ouvrirPanneauCookies = () => window.dispatchEvent(new Event("gcs:cookies"));

function lireCookie(): Choix | null {
  const brut = document.cookie.split("; ").find((c) => c.startsWith(`${CLE}=`));
  if (!brut) return null;
  try {
    const v = JSON.parse(decodeURIComponent(brut.slice(CLE.length + 1)));
    if (v.v !== VERSION) return null;
    return { audience: Boolean(v.audience), tiers: Boolean(v.tiers) };
  } catch {
    return null;
  }
}

function ecrireCookie(c: Choix) {
  const valeur = encodeURIComponent(JSON.stringify({ v: VERSION, ...c, date: new Date().toISOString() }));
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CLE}=${valeur}; Max-Age=${DUREE_JOURS * 86400}; Path=/; SameSite=Lax${secure}`;
}

export function ConsentementProvider({ children }: { children: React.ReactNode }) {
  const [choix, setChoix] = useState<Choix | null>(null);
  const [visible, setVisible] = useState(false);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    const c = lireCookie();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- le cookie n'est lisible que dans le navigateur
    setChoix(c);
    if (!c) setVisible(true);
    const ouvrir = () => {
      setDetails(true);
      setVisible(true);
    };
    window.addEventListener("gcs:cookies", ouvrir);
    return () => window.removeEventListener("gcs:cookies", ouvrir);
  }, []);

  const enregistrer = useCallback((c: Choix) => {
    ecrireCookie(c);
    setChoix(c);
    setVisible(false);
    setDetails(false);
  }, []);

  const ouvrir = useCallback(() => {
    setDetails(true);
    setVisible(true);
  }, []);

  return (
    <ConsentementContext.Provider value={{ choix, ouvrir, enregistrer }}>
      {children}
      {visible && (
        <Bandeau
          choixActuel={choix}
          details={details}
          setDetails={setDetails}
          enregistrer={enregistrer}
          fermer={choix ? () => setVisible(false) : undefined}
        />
      )}
    </ConsentementContext.Provider>
  );
}

function Bandeau({
  choixActuel,
  details,
  setDetails,
  enregistrer,
  fermer,
}: {
  choixActuel: Choix | null;
  details: boolean;
  setDetails: (v: boolean) => void;
  enregistrer: (c: Choix) => void;
  fermer?: () => void;
}) {
  const titreId = useId();
  const [audience, setAudience] = useState(choixActuel?.audience ?? false);
  const [tiers, setTiers] = useState(choixActuel?.tiers ?? false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (details) ref.current?.querySelector<HTMLElement>("input, button")?.focus();
  }, [details]);

  const toutAccepter = () => enregistrer({ audience: mesureAudience.active, tiers: true });
  const toutRefuser = () => enregistrer({ audience: false, tiers: false });

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titreId}
      className="no-print fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-5 text-ink shadow-pop sm:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 hidden size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand sm:grid">
            <Cookie className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h2 id={titreId} className="text-lg font-semibold">
                Vos choix en matière de cookies
              </h2>
              {fermer && (
                <button onClick={fermer} className="-m-2 grid size-10 place-items-center rounded-full hover:bg-surface" aria-label="Fermer sans modifier">
                  <X className="size-5" aria-hidden />
                </button>
              )}
            </div>
            <p className="mt-1 text-[0.85rem] leading-relaxed text-muted sm:text-sm">
              Nous utilisons uniquement les cookies nécessaires au fonctionnement du site (panier, paiement sécurisé,
              mémorisation de vos choix). Avec votre accord, nous pouvons aussi afficher des contenus tiers comme la
              carte Google Maps{mesureAudience.active ? " et mesurer l'audience du site" : ""}. Vous pouvez changer
              d&apos;avis à tout moment via le lien « Gérer les cookies » en bas de chaque page.{" "}
              <Link href="/cookies" className="font-medium text-brand underline underline-offset-2">
                En savoir plus
              </Link>
            </p>

            {details && (
              <fieldset className="mt-4 space-y-3">
                <legend className="sr-only">Choix par catégorie</legend>
                <Categorie
                  titre="Cookies nécessaires"
                  texte="Panier, sécurité du paiement (Stripe), session admin, mémorisation de vos choix. Toujours actifs : le site ne peut pas fonctionner sans."
                  coche
                  desactive
                />
                <Categorie
                  titre="Contenus tiers"
                  texte="Carte Google Maps sur la page contact. Google peut déposer des cookies et collecter votre adresse IP."
                  coche={tiers}
                  onChange={setTiers}
                />
                {mesureAudience.active && (
                  <Categorie
                    titre="Mesure d'audience"
                    texte={`Statistiques de fréquentation (${mesureAudience.nomOutil}) pour améliorer le site.`}
                    coche={audience}
                    onChange={setAudience}
                  />
                )}
              </fieldset>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <button onClick={toutRefuser} className="btn btn-sm border border-ink bg-white text-ink hover:bg-surface">
                Tout refuser
              </button>
              {details ? (
                <button onClick={() => enregistrer({ audience: mesureAudience.active && audience, tiers })} className="btn btn-sm order-last col-span-2 border border-ink bg-white text-ink hover:bg-surface sm:order-none sm:col-span-1">
                  Enregistrer mes choix
                </button>
              ) : (
                <button onClick={() => setDetails(true)} className="btn btn-sm order-last col-span-2 border border-ink bg-white text-ink hover:bg-surface sm:order-none sm:col-span-1">
                  Personnaliser
                </button>
              )}
              <button onClick={toutAccepter} className="btn btn-sm border border-ink bg-white text-ink hover:bg-surface">
                Tout accepter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Categorie({
  titre,
  texte,
  coche,
  desactive,
  onChange,
}: {
  titre: string;
  texte: string;
  coche: boolean;
  desactive?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-line p-3">
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="block text-sm font-semibold">{titre}</span>
        <span className="block text-sm text-muted">{texte}</span>
      </label>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={coche}
        disabled={desactive}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 size-5 shrink-0 accent-brand disabled:opacity-60"
        aria-describedby={undefined}
      />
    </div>
  );
}
