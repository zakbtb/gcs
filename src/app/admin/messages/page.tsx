import { exigerAdmin } from "@/lib/admin-auth";
import { getMessages } from "@/lib/messages";
import { dateFr } from "@/lib/format";
import { Coque } from "../Coque";
import { basculerLu, effacerMessage } from "../actions";

export const dynamic = "force-dynamic";

const TYPES = { contact: "Contact", "devis-web": "Devis site web", "rendez-vous": "Rendez-vous réparation", rachat: "Estimation rachat" } as const;

export default async function Messages() {
  await exigerAdmin();
  const messages = await getMessages();
  return (
    <Coque titre="Messages & demandes" actif="/admin/messages">
      {messages.length === 0 && <p className="text-muted">Aucun message pour le moment.</p>}
      <ul className="space-y-4">
        {messages.map((m) => (
          <li key={m.id} className={`rounded-2xl bg-white p-5 ring-1 ${m.lu ? "ring-line" : "ring-2 ring-brand"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${m.type === "devis-web" ? "bg-accent-soft text-accent-strong" : "bg-brand-soft text-brand-strong"}`}>{TYPES[m.type]}</span>
                {!m.lu && <span className="ml-2 text-xs font-bold text-brand">NOUVEAU</span>}
                <p className="mt-2 font-semibold">{m.nom}</p>
                <p className="text-sm"><a href={`mailto:${m.email}`} className="text-brand">{m.email}</a>{m.telephone && <> · <a href={`tel:${m.telephone}`} className="text-brand">{m.telephone}</a></>}</p>
              </div>
              <p className="text-xs text-muted">{dateFr(m.creeLe, true)}</p>
            </div>
            {m.details && Object.keys(m.details).length > 0 && (
              <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                {Object.entries(m.details).map(([k, v]) => <div key={k}><dt className="inline text-muted">{k} : </dt><dd className="inline font-medium">{v}</dd></div>)}
              </dl>
            )}
            <p className="mt-3 whitespace-pre-wrap rounded-xl bg-surface p-3 text-sm">{m.contenu}</p>
            <div className="mt-3 flex gap-2">
              <form action={basculerLu}><input type="hidden" name="id" value={m.id} /><input type="hidden" name="lu" value={m.lu ? "0" : "1"} /><button className="btn-ghost btn-sm">{m.lu ? "Marquer non lu" : "Marquer comme lu"}</button></form>
              <form action={effacerMessage}><input type="hidden" name="id" value={m.id} /><button className="btn btn-sm text-danger hover:bg-danger-soft">Supprimer</button></form>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs text-muted">RGPD : supprimez les demandes sans suite au-delà de 3 ans.</p>
    </Coque>
  );
}
