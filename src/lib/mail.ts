import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import nodemailer from "nodemailer";
import { cheminData } from "./store";

export type Mail = { to: string; subject: string; html: string; text: string; replyTo?: string };

export function smtpConfigure() {
  return Boolean(process.env.SMTP_HOST);
}

/**
 * Envoie un e-mail via SMTP si configuré.
 * Sinon (développement), l'e-mail est enregistré dans data/outbox/ pour pouvoir le relire.
 */
export async function envoyerMail(mail: Mail) {
  if (!smtpConfigure()) {
    const dossier = cheminData("outbox");
    await fs.mkdir(dossier, { recursive: true });
    const nom = `${new Date().toISOString().replace(/[:.]/g, "-")}-${mail.to.replace(/[^a-z0-9@.]/gi, "_")}.html`;
    const entete = `<!-- À : ${mail.to}\n     Objet : ${mail.subject} -->\n`;
    await fs.writeFile(path.join(dossier, nom), entete + mail.html, "utf8");
    console.info(`[mail] SMTP non configuré : e-mail « ${mail.subject} » enregistré dans data/outbox/${nom}`);
    return;
  }
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
  await transport.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: mail.to,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    replyTo: mail.replyTo,
  });
}

export function adresseAdmin(): string | undefined {
  return process.env.MAIL_ADMIN || undefined;
}
