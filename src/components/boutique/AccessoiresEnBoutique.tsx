import Link from "next/link";
import { BatteryCharging, Cable, Headphones, Shield, Smartphone, Store } from "lucide-react";
import { entreprise, prixVitrine } from "@/config/entreprise";
import { prixCourt } from "@/lib/format";

/** Accessoires vendus en boutique (affiché tant qu'aucun accessoire n'est en vente en ligne). */
export function AccessoiresEnBoutique() {
  const tuiles = [
    { i: Smartphone, t: "Coques", p: prixVitrine.coquesDes != null ? `dès ${prixCourt(prixVitrine.coquesDes)}` : null },
    {
      i: Shield,
      t: "Film hydrogel posé",
      p: prixVitrine.hydrogel != null ? `${prixCourt(prixVitrine.hydrogel)}${prixVitrine.hydrogelAntiEspion != null ? ` · anti-espion ${prixCourt(prixVitrine.hydrogelAntiEspion)}` : ""}` : null,
    },
    { i: BatteryCharging, t: "Batteries externes", p: prixVitrine.batteriesExternesDes != null ? `dès ${prixCourt(prixVitrine.batteriesExternesDes)}` : null },
    { i: Cable, t: "Chargeurs et câbles", p: null },
    { i: Headphones, t: "Écouteurs", p: null },
  ];
  return (
    <div className="rounded-[2rem] bg-white p-6 ring-1 ring-line sm:p-10">
      <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand">
        <Store className="size-5" aria-hidden /> En boutique à Montpellier
      </p>
      <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Nos accessoires vous attendent en boutique</h2>
      <p className="mt-3 max-w-2xl text-muted">
        Venez les voir et les essayer au {entreprise.adresse.rue}, {entreprise.adresse.codePostal} {entreprise.adresse.ville}. Le film hydrogel est découpé
        sur mesure et posé sur place. La vente en ligne des accessoires arrive bientôt.
      </p>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tuiles.map(({ i: I, t, p }) => (
          <li key={t} className="flex items-center gap-4 rounded-2xl bg-surface p-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand text-white"><I className="size-5" aria-hidden /></span>
            <span>
              <span className="block font-semibold">{t}</span>
              {p && <span className="text-sm text-muted">{p}</span>}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href={`tel:${entreprise.telephoneLien}`} className="btn-dark">Appeler la boutique</a>
        <Link href="/contact" className="btn-ghost">Itinéraire et horaires</Link>
      </div>
    </div>
  );
}
