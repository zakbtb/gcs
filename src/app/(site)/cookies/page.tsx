import { PageLegale } from "@/components/legal/PageLegale";
import { BoutonCookies } from "@/components/layout/BoutonCookies";
import { mesureAudience } from "@/config/entreprise";
import { meta } from "@/lib/seo";

export const metadata = meta({ titre: "Politique cookies", description: "Liste des cookies et traceurs utilisés sur le site GCS et gestion de votre consentement.", chemin: "/cookies" });

export default function Cookies() {
  return (
    <PageLegale
      titre="Politique cookies"
      majLe="27 octobre 2026"
      intro="Cette page explique quels cookies et autres traceurs sont utilisés sur notre site, à quoi ils servent et comment gérer vos choix, conformément à l'article 82 de la loi Informatique et Libertés et aux recommandations de la CNIL."
    >
      <h2 id="principe">1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
      <p>
        Un cookie est un petit fichier déposé sur votre appareil lors de la visite d&apos;un site. Par extension, nous désignons aussi par « cookies »
        les autres traceurs (stockage local du navigateur, etc.).
      </p>

      <h2 id="choix">2. Vos choix</h2>
      <p>
        Lors de votre première visite, un bandeau vous permet d&apos;<strong>accepter</strong>, de <strong>refuser</strong> ou de <strong>personnaliser</strong>{" "}
        votre choix par catégorie. Refuser est aussi simple qu&apos;accepter. Aucun cookie non essentiel n&apos;est déposé avant votre accord. Votre choix
        est conservé 6 mois, puis vous est redemandé. Vous pouvez le modifier à tout moment via le lien « Gérer les cookies » présent en bas de chaque page,
        ou ici :
      </p>
      <p><BoutonCookies className="btn-dark btn-sm" /></p>

      <h2 id="liste">3. Liste des cookies et traceurs</h2>
      <h3>Cookies strictement nécessaires (exemptés de consentement)</h3>
      <div className="overflow-x-auto">
        <table>
          <thead><tr><th>Nom</th><th>Émetteur</th><th>Finalité</th><th>Durée</th></tr></thead>
          <tbody>
            <tr><td><code>gcs_consentement</code></td><td>GCS</td><td>Mémoriser vos choix en matière de cookies</td><td>6 mois</td></tr>
            <tr><td><code>gcs-panier-v1</code> (stockage local)</td><td>GCS</td><td>Conserver le contenu de votre panier</td><td>Jusqu&apos;à commande ou suppression</td></tr>
            <tr><td><code>gcs-rupture</code> (stockage de session)</td><td>GCS</td><td>Afficher les produits devenus indisponibles pendant la commande</td><td>Fin de la session</td></tr>
            <tr><td><code>gcs_admin</code></td><td>GCS</td><td>Session sécurisée de l&apos;espace administration (personnel uniquement)</td><td>8 heures</td></tr>
            <tr><td><code>__stripe_mid</code>, <code>__stripe_sid</code></td><td>Stripe</td><td>Sécurité du paiement et prévention de la fraude (page de paiement uniquement)</td><td>1 an / 30 minutes</td></tr>
          </tbody>
        </table>
      </div>

      <h3>Contenus tiers (soumis à votre consentement)</h3>
      <div className="overflow-x-auto">
        <table>
          <thead><tr><th>Service</th><th>Émetteur</th><th>Finalité</th><th>Plus d&apos;informations</th></tr></thead>
          <tbody>
            <tr>
              <td>Carte Google Maps (page Contact)</td>
              <td>Google Ireland Ltd.</td>
              <td>Afficher le plan d&apos;accès à la boutique. Google peut déposer des cookies et collecter votre adresse IP.</td>
              <td><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Politique de Google</a></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Tant que vous n&apos;avez pas accepté cette catégorie, la carte est remplacée par un lien vers Google Maps.</p>

      {mesureAudience.active ? (
        <>
          <h3>Mesure d&apos;audience (soumise à votre consentement)</h3>
          <p>Nous utilisons {mesureAudience.nomOutil} pour mesurer la fréquentation du site et l&apos;améliorer. Ces cookies ne sont déposés qu&apos;après votre accord.</p>
        </>
      ) : (
        <>
          <h3>Mesure d&apos;audience et publicité</h3>
          <p>Nous n&apos;utilisons actuellement <strong>aucun</strong> cookie de mesure d&apos;audience, de publicité ou de réseaux sociaux.</p>
        </>
      )}

      <h2 id="navigateur">4. Paramétrer votre navigateur</h2>
      <p>
        Vous pouvez aussi bloquer ou supprimer les cookies depuis les réglages de votre navigateur (Chrome, Safari, Firefox, Edge…). Le blocage des cookies
        nécessaires peut empêcher le fonctionnement du panier ou du paiement.
      </p>

      <h2 id="contact">5. Contact</h2>
      <p>Pour toute question, consultez notre <a href="/confidentialite">politique de confidentialité</a> ou contactez-nous via la <a href="/contact">page contact</a>.</p>
    </PageLegale>
  );
}
