import "server-only";
import { idAleatoire, lireJson, modifierJson } from "./store";
import type { Message } from "./types";

const FICHIER = "messages.json";

export async function enregistrerMessage(m: Omit<Message, "id" | "creeLe" | "lu">): Promise<Message> {
  const message: Message = { ...m, id: `MSG-${idAleatoire(6)}`, creeLe: new Date().toISOString(), lu: false };
  await modifierJson<Message[]>(FICHIER, [], (liste) => {
    liste.push(message);
  });
  return message;
}

export async function getMessages(): Promise<Message[]> {
  const liste = await lireJson<Message[]>(FICHIER, []);
  return liste.sort((a, b) => b.creeLe.localeCompare(a.creeLe));
}

export async function marquerLu(id: string, lu = true) {
  await modifierJson<Message[]>(FICHIER, [], (liste) => {
    const m = liste.find((x) => x.id === id);
    if (m) m.lu = lu;
  });
}

export async function supprimerMessage(id: string) {
  await modifierJson<Message[]>(FICHIER, [], (liste) => {
    const i = liste.findIndex((x) => x.id === id);
    if (i >= 0) liste.splice(i, 1);
  });
}
