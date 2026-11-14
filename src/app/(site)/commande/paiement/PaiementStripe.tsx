"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Loader2, Lock } from "lucide-react";
import { prix } from "@/lib/format";

let stripePromise: Promise<Stripe | null> | null = null;
const getStripe = (cle: string) => (stripePromise ??= loadStripe(cle, { locale: "fr" }));

type Props = { commande: string; token: string; total: number; email: string; cle: string };

export function PaiementStripe(props: Props) {
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/paiement/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commande: props.commande, t: props.token }),
      });
      const json = await res.json();
      if (json.ok) return setClientSecret(json.clientSecret);
      if (json.erreur === "rupture") {
        sessionStorage.setItem("gcs-rupture", JSON.stringify(json.problemes ?? []));
        return router.push("/commande/rupture");
      }
      if (json.erreur === "deja_payee") return router.push(`/commande/confirmation?commande=${encodeURIComponent(props.commande)}&t=${encodeURIComponent(props.token)}`);
      setErreur(json.erreur ?? "Paiement indisponible.");
    })();
  }, [props.commande, props.token, router]);

  if (erreur) return <p role="alert" className="rounded-2xl bg-danger-soft p-4 font-medium text-danger">{erreur}</p>;
  if (!clientSecret) return <div className="flex h-48 items-center justify-center gap-2 text-muted"><Loader2 className="size-5 animate-spin" aria-hidden /> Chargement du paiement sécurisé…</div>;

  return (
    <Elements
      stripe={getStripe(props.cle)}
      options={{
        clientSecret,
        locale: "fr",
        appearance: {
          theme: "stripe",
          variables: { colorPrimary: "#5b2ee6", colorText: "#160c33", borderRadius: "12px", fontFamily: "Jost, system-ui, sans-serif" },
        },
      }}
    >
      <Formulaire {...props} />
    </Elements>
  );
}

function Formulaire({ commande, token, total, email }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [envoi, setEnvoi] = useState(false);
  const [message, setMessage] = useState("");
  const retour = `/commande/confirmation?commande=${encodeURIComponent(commande)}&t=${encodeURIComponent(token)}`;

  async function payer(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setEnvoi(true);
    setMessage("");
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}${retour}`, receipt_email: email },
    });
    // On n'arrive ici qu'en cas d'erreur (sinon Stripe redirige vers la page de confirmation)
    if (error.type === "card_error" || error.type === "validation_error") {
      if (error.type === "card_error") {
        router.push(`/commande/paiement-refuse?commande=${encodeURIComponent(commande)}&t=${encodeURIComponent(token)}&raison=${encodeURIComponent(error.message ?? "")}`);
        return;
      }
      setMessage(error.message ?? "Vérifiez vos informations de paiement.");
    } else {
      setMessage("Une erreur inattendue est survenue. Réessayez.");
    }
    setEnvoi(false);
  }

  return (
    <form onSubmit={payer} className="space-y-5">
      <PaymentElement options={{ layout: "tabs" }} />
      {message && <p role="alert" className="rounded-xl bg-danger-soft p-3 text-sm font-medium text-danger">{message}</p>}
      <button type="submit" disabled={!stripe || envoi} className="btn-accent w-full text-base">
        {envoi ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Lock className="size-4" aria-hidden />}
        {envoi ? "Paiement en cours…" : `Payer ${prix(total)}`}
      </button>
    </form>
  );
}
