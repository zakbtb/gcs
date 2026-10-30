import { PageLegale } from "@/components/legal/PageLegale";
import { Val } from "@/components/ui/Val";
import { entreprise } from "@/config/entreprise";
import { meta } from "@/lib/seo";

export const metadata = meta({ titre: "Politique de confidentialité (RGPD)", description: "Comment GCS (Pronet Services Plus) collecte, utilise et protège vos données personnelles, et comment exercer vos droits.", chemin: "/confidentialite" });

const sommaire = [
  { id: "responsable", titre: "Responsable du traitement" },
  { id: "traitements", titre: "Données, finalités et bases légales" },
  { id: "destinataires", titre: "Destinataires" },
  { id: "transferts", titre: "Transferts hors UE" },
  { id: "securite", titre: "Sécurité" },
  { id: "droits", titre: "Vos droits" },
  { id: "cnil", titre: "Réclamation CNIL" },
  { id: "appareils", titre: "Données des appareils réparés" },
];

export default function Confidentialite() {
  const e = entreprise;
  return (
    <PageLegale
      titre="Politique de confidentialité"
      majLe="27 octobre 2026"
      sommaire={sommaire}
      intro="Nous attachons une grande importance à la protection de vos données personnelles. Cette politique explique quelles données nous collectons, pourquoi, combien de temps nous les gardons et quels sont vos droits, conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés."
    >
      <h2 id="responsable">1. Responsable du traitement</h2>
      <p>
        Le responsable du traitement est {e.raisonSociale} ({e.nomCommercial} – {e.nomComplet}), <Val v={e.formeJuridique} />, dont le siège est situé <Val v={e.adresse.rue} />, {e.adresse.codePostal} {e.adresse.ville}.
        Contact pour toute question relative à vos données : <Val v={e.emailDonneesPersonnelles} />.
      </p>

      <h2 id="traitements">2. Données collectées, finalités, bases légales et durées de conservation</h2>
      <p>Nous ne collectons que les données strictement nécessaires. Les champs obligatoires sont signalés par un astérisque dans chaque formulaire.</p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr><th>Traitement</th><th>Données</th><th>Finalité</th><th>Base légale</th><th>Durée de conservation</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Formulaire de contact</td>
              <td>Nom, e-mail, téléphone (facultatif), sujet, message</td>
              <td>Répondre à votre demande</td>
              <td>Mesures précontractuelles prises à votre demande (art. 6.1.b RGPD) / intérêt légitime à répondre (art. 6.1.f)</td>
              <td>3 ans à compter du dernier contact</td>
            </tr>
            <tr>
              <td>Demande de devis site web</td>
              <td>Nom, e-mail, téléphone, entreprise, site actuel, type de projet, budget, description</td>
              <td>Établir un devis, vous recontacter</td>
              <td>Mesures précontractuelles (art. 6.1.b)</td>
              <td>3 ans à compter du dernier contact ; si un contrat est conclu, durée du contrat + 5 ans</td>
            </tr>
            <tr>
              <td>Réservation de réparation</td>
              <td>Nom, e-mail, téléphone, modèle, réparation, date et créneau souhaités, description de la panne</td>
              <td>Organiser le rendez-vous, commander la pièce</td>
              <td>Mesures précontractuelles (art. 6.1.b)</td>
              <td>3 ans à compter du dernier contact</td>
            </tr>
            <tr>
              <td>Estimation de rachat</td>
              <td>Nom, e-mail, téléphone, modèle et état de l&apos;appareil</td>
              <td>Vous proposer un prix de rachat</td>
              <td>Mesures précontractuelles (art. 6.1.b)</td>
              <td>3 ans ; en cas de rachat, le registre de police des objets mobiliers est conservé selon la durée légale</td>
            </tr>
            <tr>
              <td>Commandes en ligne</td>
              <td>Prénom, nom, e-mail, téléphone, adresse de livraison, contenu de la commande, historique, référence de paiement (nous ne recevons jamais vos numéros de carte)</td>
              <td>Gérer la commande, le paiement, la livraison, le service après-vente, les garanties et la comptabilité</td>
              <td>Exécution du contrat (art. 6.1.b) et obligations légales (art. 6.1.c)</td>
              <td>Durée de la relation commerciale + 5 ans (prescription) ; pièces comptables : 10 ans (art. L.123-22 Code de commerce)</td>
            </tr>
            <tr>
              <td>Paiement</td>
              <td>Données de carte bancaire, saisies directement chez Stripe</td>
              <td>Encaisser le paiement, prévenir la fraude</td>
              <td>Exécution du contrat (art. 6.1.b), intérêt légitime pour la lutte contre la fraude</td>
              <td>Conservées par Stripe selon sa propre politique ; aucune donnée de carte n&apos;est stockée par GCS</td>
            </tr>
            <tr>
              <td>Panier</td>
              <td>Produits ajoutés, quantités (stockés dans votre navigateur uniquement)</td>
              <td>Conserver votre panier entre deux visites</td>
              <td>Intérêt légitime / exemption de consentement (traceur strictement nécessaire)</td>
              <td>Jusqu&apos;à la validation de la commande ou la suppression par vos soins</td>
            </tr>
            <tr>
              <td>Cookies et traceurs</td>
              <td>Voir la <a href="/cookies">politique cookies</a></td>
              <td>Fonctionnement du site, contenus tiers</td>
              <td>Consentement (art. 82 loi Informatique et Libertés) sauf traceurs strictement nécessaires</td>
              <td>Choix mémorisé 6 mois</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>Nous ne vendons ni ne louons jamais vos données. Nous ne vous envoyons pas de prospection commerciale sans votre accord préalable.</p>

      <h2 id="destinataires">3. Destinataires</h2>
      <p>Vos données sont destinées exclusivement au personnel habilité de {e.raisonSociale}. Elles peuvent être transmises, dans la stricte limite nécessaire, à nos sous-traitants :</p>
      <ul>
        <li>Hébergeur du site : <Val v={e.hebergeur.nom} /> ;</li>
        <li>Prestataire de paiement : Stripe Payments Europe Ltd. (Irlande) ;</li>
        <li>Prestataire d&apos;envoi d&apos;e-mails (si utilisé) ;</li>
        <li>Transporteur (pour les commandes livrées) : nom, adresse, téléphone ;</li>
        <li>Les autorités administratives ou judiciaires, uniquement sur réquisition légale.</li>
      </ul>

      <h2 id="transferts">4. Transferts hors de l&apos;Union européenne</h2>
      <p>
        Certains sous-traitants (par exemple Stripe ou l&apos;hébergeur, selon celui retenu) peuvent traiter des données hors de l&apos;Union européenne,
        notamment aux États-Unis. Ces transferts sont encadrés par des garanties appropriées : décision d&apos;adéquation (EU-US Data Privacy Framework)
        et/ou clauses contractuelles types de la Commission européenne.
      </p>

      <h2 id="securite">5. Sécurité</h2>
      <p>
        Le site est servi exclusivement en HTTPS (connexion chiffrée). L&apos;accès à l&apos;espace d&apos;administration est protégé par mot de passe et
        limité aux personnes habilitées. Les paiements sont traités par Stripe, certifié PCI-DSS niveau 1.
      </p>

      <h2 id="droits">6. Vos droits</h2>
      <p>Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants :</p>
      <ul>
        <li><strong>Droit d&apos;accès</strong> : obtenir une copie des données vous concernant ;</li>
        <li><strong>Droit de rectification</strong> : corriger des données inexactes ou incomplètes ;</li>
        <li><strong>Droit à l&apos;effacement</strong> : demander la suppression de vos données, sauf obligation légale de conservation ;</li>
        <li><strong>Droit d&apos;opposition</strong> : vous opposer à un traitement fondé sur notre intérêt légitime ;</li>
        <li><strong>Droit à la limitation</strong> : demander le gel temporaire d&apos;un traitement ;</li>
        <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré et lisible par machine ;</li>
        <li><strong>Retrait du consentement</strong> à tout moment, pour les traitements fondés sur celui-ci (ex. cookies) ;</li>
        <li><strong>Directives post-mortem</strong> : définir le sort de vos données après votre décès.</li>
      </ul>
      <p>
        <strong>Comment les exercer ?</strong> Par e-mail à <Val v={e.emailDonneesPersonnelles} /> ou par courrier à {e.raisonSociale}, <Val v={e.adresse.rue} />,
        {" "}{e.adresse.codePostal} {e.adresse.ville}. Nous pouvons vous demander un justificatif d&apos;identité en cas de doute raisonnable. Nous répondons dans
        un délai d&apos;un mois, prolongeable de deux mois en cas de demande complexe.
      </p>

      <h2 id="cnil">7. Réclamation auprès de la CNIL</h2>
      <p>
        Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la Commission
        nationale de l&apos;informatique et des libertés (CNIL), 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 –{" "}
        <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">www.cnil.fr/fr/plaintes</a>.
      </p>

      <h2 id="appareils">8. Données présentes sur les appareils confiés en réparation</h2>
      <p>
        Lors d&apos;une réparation, nous n&apos;accédons pas au contenu de votre appareil, sauf si c&apos;est indispensable au diagnostic ou à une prestation
        demandée (transfert ou récupération de données), et uniquement avec votre accord. Nous ne copions ni ne conservons aucune donnée au-delà de
        la prestation. Les appareils rachetés font l&apos;objet d&apos;un effacement sécurisé avant revente. Voir aussi nos{" "}
        <a href="/conditions-reparation">conditions de réparation</a>.
      </p>
    </PageLegale>
  );
}
