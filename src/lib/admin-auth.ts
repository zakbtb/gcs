import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "gcs_admin";
const DUREE_MS = 8 * 60 * 60 * 1000; // 8 h

function secret(): string {
  const s = process.env.ADMIN_SECRET;
  if (!s || s.length < 16) throw new Error("ADMIN_SECRET manquant ou trop court (16 caractères minimum)");
  return s;
}

function signer(valeur: string) {
  return crypto.createHmac("sha256", secret()).update(valeur).digest("base64url");
}

function egal(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

export function adminConfigure(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SECRET && process.env.ADMIN_SECRET.length >= 16);
}

/* Limitation simple des tentatives de connexion (en mémoire) */
const tentatives = new Map<string, { n: number; jusqua: number }>();

export function tropDeTentatives(ip: string): boolean {
  const t = tentatives.get(ip);
  return Boolean(t && t.n >= 5 && t.jusqua > Date.now());
}

export function verifierMotDePasse(motDePasse: string, ip: string): boolean {
  const attendu = process.env.ADMIN_PASSWORD ?? "";
  const ok =
    attendu.length > 0 &&
    egal(crypto.createHash("sha256").update(motDePasse).digest("hex"), crypto.createHash("sha256").update(attendu).digest("hex"));
  if (ok) tentatives.delete(ip);
  else {
    const t = tentatives.get(ip);
    const n = t && t.jusqua > Date.now() ? t.n + 1 : 1;
    tentatives.set(ip, { n, jusqua: Date.now() + 15 * 60 * 1000 });
  }
  return ok;
}

export async function ouvrirSession() {
  const expire = Date.now() + DUREE_MS;
  const valeur = `${expire}`;
  (await cookies()).set(COOKIE, `${valeur}.${signer(valeur)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DUREE_MS / 1000,
  });
}

export async function fermerSession() {
  (await cookies()).delete(COOKIE);
}

export async function estAdmin(): Promise<boolean> {
  if (!adminConfigure()) return false;
  const brut = (await cookies()).get(COOKIE)?.value;
  if (!brut) return false;
  const [valeur, sig] = brut.split(".");
  if (!valeur || !sig || !egal(sig, signer(valeur))) return false;
  return Number(valeur) > Date.now();
}

/** À appeler en tête de chaque page / action admin. */
export async function exigerAdmin() {
  if (!(await estAdmin())) redirect("/admin/connexion");
}
