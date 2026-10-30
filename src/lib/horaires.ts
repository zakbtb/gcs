import { entreprise } from "@/config/entreprise";

const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const formatHeure = (hhmm: string) => hhmm.replace(":00", "h").replace(":", "h");

export function plagesTexte(plages: [string, string][]): string {
  if (plages.length === 0) return "Fermé";
  return plages.map(([a, b]) => `${formatHeure(a)} – ${formatHeure(b)}`).join(" / ");
}

/** Heure actuelle à Montpellier (indépendamment du fuseau du serveur ou du visiteur). */
function maintenantParis(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const jours = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return { jour: jours.indexOf(get("weekday")), min: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type EtatOuverture = { ouvert: boolean; texte: string };

export function etatOuverture(date = new Date()): EtatOuverture {
  const { jour, min } = maintenantParis(date);
  const aujourdhui = entreprise.horaires.find((h) => h.jour === jour);
  for (const [a, b] of aujourdhui?.plages ?? []) {
    if (min >= minutes(a) && min < minutes(b)) {
      return { ouvert: true, texte: `Ouvert · ferme à ${formatHeure(b)}` };
    }
  }
  // Prochaine ouverture (aujourd'hui plus tard ou jours suivants)
  for (const [a] of aujourdhui?.plages ?? []) {
    if (minutes(a) > min) return { ouvert: false, texte: `Fermé · ouvre à ${formatHeure(a)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const j = (jour + i) % 7;
    const h = entreprise.horaires.find((x) => x.jour === j);
    if (h && h.plages.length > 0) {
      const quand = i === 1 ? "demain" : h.nom.toLowerCase();
      return { ouvert: false, texte: `Fermé · ouvre ${quand} à ${formatHeure(h.plages[0][0])}` };
    }
  }
  return { ouvert: false, texte: "Fermé" };
}

/** Horaires triés du lundi au dimanche */
export function horairesSemaine() {
  return [...entreprise.horaires].sort((a, b) => ((a.jour + 6) % 7) - ((b.jour + 6) % 7));
}
