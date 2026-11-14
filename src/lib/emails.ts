import "server-only";
import { boutique, entreprise } from "@/config/entreprise";
import { prix } from "./format";
import { adresseAdmin, envoyerMail } from "./mail";
import type { Commande, Message } from "./types";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function gabarit(titre: string, contenu: string) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(titre)}</title></head>
<body style="margin:0;background:#f7f5ff;font-family:Arial,Helvetica,sans-serif;color:#160c33">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5ff;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#160c33;padding:24px 28px;color:#ffffff;font-size:20px;font-weight:bold">GCS <span style="color:#d8ff3e;font-weight:normal;font-size:14px">Global Connect Services · Montpellier</span></td></tr>
<tr><td style="padding:28px">${contenu}</td></tr>
<tr><td style="padding:20px 28px;background:#f7f5ff;font-size:12px;color:#4b5568;line-height:1.6">
${esc(entreprise.raisonSociale)} (${esc(entreprise.nomCommercial)} – ${esc(entreprise.nomComplet)})<br>
${esc(entreprise.adresse.rue)}, ${esc(entreprise.adresse.codePostal)} ${esc(entreprise.adresse.ville)}<br>
${esc(entreprise.telephone)} · ${esc(entreprise.email)} · Snapchat : ${esc(entreprise.snapchat)}<br>
<a href="${entreprise.siteUrl}/cgv" style="color:#5b2ee6">Conditions générales de vente</a> · <a href="${entreprise.siteUrl}/confidentialite" style="color:#5b2ee6">Confidentialité</a>
</td></tr></table></td></tr></table></body></html>`;
}

function tableauLignes(c: Commande) {
  const lignes = c.lignes
    .map(
      (l) => `<tr>
<td style="padding:10px 0;border-bottom:1px solid #e6e1f5">${esc(l.nom)}${l.variante ? `<br><span style="color:#4b5568;font-size:13px">${esc(l.variante)}</span>` : ""}</td>
<td style="padding:10px 0;border-bottom:1px solid #e6e1f5;text-align:center">×${l.quantite}</td>
<td style="padding:10px 0;border-bottom:1px solid #e6e1f5;text-align:right">${prix(l.total)}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin:16px 0">${lignes}
<tr><td colspan="2" style="padding:8px 0;color:#4b5568">Sous-total</td><td style="text-align:right">${prix(c.sousTotal)}</td></tr>
<tr><td colspan="2" style="padding:8px 0;color:#4b5568">${c.livraison.mode === "retrait" ? "Retrait en boutique" : "Livraison"}</td><td style="text-align:right">${c.fraisLivraison === 0 ? "Offerte" : prix(c.fraisLivraison)}</td></tr>
<tr><td colspan="2" style="padding:8px 0;font-weight:bold;font-size:16px">Total TTC</td><td style="text-align:right;font-weight:bold;font-size:16px">${prix(c.total)}</td></tr></table>`;
}

export async function envoyerConfirmationCommande(c: Commande) {
  const lien = `${entreprise.siteUrl}/commande/confirmation?commande=${encodeURIComponent(c.id)}&t=${encodeURIComponent(c.token)}`;
  const livraison =
    c.livraison.mode === "retrait"
      ? `<p><strong>Retrait en boutique</strong> : ${esc(boutique.retrait.delai)}. Adresse : ${esc(entreprise.adresse.rue)}, ${esc(entreprise.adresse.codePostal)} ${esc(entreprise.adresse.ville)}. Munissez-vous de votre numéro de commande.</p>`
      : `<p><strong>Livraison</strong> à : ${esc(c.client.prenom)} ${esc(c.client.nom)}, ${esc(c.livraison.adresse ?? "")} ${esc(c.livraison.complement ?? "")}, ${esc(c.livraison.codePostal ?? "")} ${esc(c.livraison.ville ?? "")}.<br>Expédition sous ${esc(boutique.expeditionSous)}, ${esc(boutique.livraison.delai)}.</p>`;

  const html = gabarit(
    `Commande ${c.id} confirmée`,
    `<h1 style="font-size:22px;margin:0 0 8px">Merci ${esc(c.client.prenom)}, votre commande est confirmée !</h1>
<p style="color:#4b5568;margin:0 0 16px">Numéro de commande : <strong style="color:#160c33">${esc(c.id)}</strong></p>
${tableauLignes(c)}
${livraison}
<p><a href="${lien}" style="display:inline-block;background:#d8ff3e;color:#160c33;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold">Voir ma commande</a></p>
<p style="font-size:13px;color:#4b5568;line-height:1.6"><strong>Droit de rétractation :</strong> vous disposez de 14 jours à compter de la réception pour vous rétracter, sans avoir à vous justifier. Le formulaire type est disponible dans nos <a href="${entreprise.siteUrl}/cgv#retractation" style="color:#5b2ee6">CGV</a>. Vos produits bénéficient de la garantie légale de conformité (2 ans) et de la garantie des vices cachés.</p>`,
  );
  const text = `Merci ${c.client.prenom}, votre commande ${c.id} est confirmée.
${c.lignes.map((l) => `- ${l.nom}${l.variante ? ` (${l.variante})` : ""} x${l.quantite} : ${prix(l.total)}`).join("\n")}
Livraison : ${c.fraisLivraison === 0 ? "offerte" : prix(c.fraisLivraison)}
Total TTC : ${prix(c.total)}
Suivi : ${lien}`;

  await envoyerMail({ to: c.client.email, subject: `Confirmation de votre commande ${c.id} – GCS Montpellier`, html, text });

  const admin = adresseAdmin();
  if (admin) {
    await envoyerMail({
      to: admin,
      subject: `🛒 Nouvelle commande ${c.id} – ${prix(c.total)} (${c.livraison.mode === "retrait" ? "retrait" : "livraison"})`,
      html: gabarit(
        "Nouvelle commande",
        `<h1 style="font-size:20px">Nouvelle commande ${esc(c.id)}</h1><p>${esc(c.client.prenom)} ${esc(c.client.nom)} · ${esc(c.client.email)} · ${esc(c.client.telephone)}</p>${tableauLignes(c)}${livraison}<p><a href="${entreprise.siteUrl}/admin/commandes/${encodeURIComponent(c.id)}">Ouvrir dans l'admin</a></p>`,
      ),
      text: `Nouvelle commande ${c.id} - ${prix(c.total)}`,
      replyTo: c.client.email,
    });
  }
}

const TITRES: Record<Message["type"], string> = {
  contact: "Message de contact",
  "devis-web": "Demande de devis site web",
  "rendez-vous": "Demande de rendez-vous réparation",
  rachat: "Demande d'estimation rachat",
};

export async function envoyerNotificationMessage(m: Message) {
  const details = Object.entries(m.details ?? {})
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#4b5568">${esc(k)}</td><td>${esc(v)}</td></tr>`)
    .join("");
  const corps = `<h1 style="font-size:20px">${TITRES[m.type]}</h1>
<p><strong>${esc(m.nom)}</strong><br>${esc(m.email)}${m.telephone ? ` · ${esc(m.telephone)}` : ""}</p>
${details ? `<table style="font-size:14px;margin:12px 0">${details}</table>` : ""}
<p style="white-space:pre-wrap;background:#f7f5ff;padding:16px;border-radius:12px">${esc(m.contenu)}</p>`;

  const admin = adresseAdmin();
  if (admin) {
    await envoyerMail({
      to: admin,
      subject: `${TITRES[m.type]} – ${m.nom}`,
      html: gabarit(TITRES[m.type], corps),
      text: `${TITRES[m.type]}\n${m.nom} <${m.email}> ${m.telephone ?? ""}\n\n${m.contenu}`,
      replyTo: m.email,
    });
  }
  // Accusé de réception au client
  await envoyerMail({
    to: m.email,
    subject: `Nous avons bien reçu votre demande – GCS Montpellier`,
    html: gabarit(
      "Demande reçue",
      `<h1 style="font-size:20px">Merci ${esc(m.nom)} !</h1><p>Nous avons bien reçu votre ${TITRES[m.type].toLowerCase()} et nous vous répondons au plus vite (généralement sous 24 h ouvrées).</p><p>Besoin d'une réponse immédiate ? Appelez-nous au ${esc(entreprise.telephone)} ou écrivez-nous sur Snapchat : <strong>${esc(entreprise.snapchat)}</strong>.</p>`,
    ),
    text: `Merci ${m.nom}, nous avons bien reçu votre demande et vous répondons au plus vite.`,
  });
}
