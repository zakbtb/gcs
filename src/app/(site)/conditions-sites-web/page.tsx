import { PageLegale } from "@/components/legal/PageLegale";
import { Val } from "@/components/ui/Val";
import { entreprise } from "@/config/entreprise";
import { meta } from "@/lib/seo";

export const metadata = meta({ titre: "Conditions générales de prestation – Création de sites web", description: "Conditions des prestations de création de sites internet, refonte, hébergement, maintenance et référencement de GCS Montpellier.", chemin: "/conditions-sites-web" });

const sommaire = [
  { id: "objet", titre: "1. Objet" },
  { id: "devis", titre: "2. Devis et commande" },
  { id: "prix", titre: "3. Prix et paiement" },
  { id: "obligations", titre: "4. Obligations du client" },
  { id: "realisation", titre: "5. Réalisation et recette" },
  { id: "propriete", titre: "6. Propriété intellectuelle" },
  { id: "hebergement", titre: "7. Hébergement et maintenance" },
  { id: "seo", titre: "8. Référencement" },
  { id: "rgpd", titre: "9. Données personnelles" },
  { id: "responsabilite", titre: "10. Responsabilité" },
  { id: "retractation", titre: "11. Rétractation (consommateurs)" },
  { id: "resiliation", titre: "12. Résiliation" },
  { id: "litiges", titre: "13. Litiges" },
];

export default function ConditionsSitesWeb() {
  const e = entreprise;
  return (
    <PageLegale titre="Conditions de prestation – Sites web" majLe="27 octobre 2026" sommaire={sommaire} intro="Conditions générales applicables aux prestations de création de sites internet, de refonte, d'hébergement, de maintenance et de référencement proposées par GCS.">
      <h2 id="objet">1. Objet</h2>
      <p>
        Les présentes conditions régissent les prestations web réalisées par {e.raisonSociale} (« le Prestataire »), SIRET <Val v={e.siret} />, pour le compte de
        ses clients professionnels ou particuliers (« le Client »). Le devis signé et ses éventuelles annexes (cahier des charges) prévalent sur les présentes en
        cas de contradiction.
      </p>

      <h2 id="devis">2. Devis et commande</h2>
      <p>Chaque prestation fait l&apos;objet d&apos;un devis gratuit, détaillé et valable 30 jours, précisant le périmètre (nombre de pages, fonctionnalités), le prix, le calendrier prévisionnel et les livrables. La commande est ferme à réception du devis signé (« bon pour accord », signature électronique acceptée) et de l&apos;acompte. Toute demande hors périmètre fait l&apos;objet d&apos;un devis complémentaire.</p>

      <h2 id="prix">3. Prix et modalités de paiement</h2>
      <ul>
        <li>Les prix « à partir de » affichés sur le site sont indicatifs ; seul le devis fait foi. Les prix sont exprimés en euros TTC pour les particuliers et HT pour les professionnels.</li>
        <li>Sauf mention contraire : acompte de 40 % à la signature, 30 % à la validation de la maquette, solde de 30 % à la mise en ligne.</li>
        <li>Les abonnements (hébergement, maintenance) sont facturés mensuellement ou annuellement, d&apos;avance.</li>
        <li>Clients professionnels : paiement à 30 jours maximum date de facture. Tout retard entraîne de plein droit des pénalités au taux de trois fois le taux d&apos;intérêt légal et une indemnité forfaitaire pour frais de recouvrement de 40 € (art. L.441-10 et D.441-5 du Code de commerce). Aucun escompte pour paiement anticipé.</li>
        <li>En cas de non-paiement, le Prestataire peut suspendre ses prestations, y compris la mise en ligne ou l&apos;hébergement, après mise en demeure restée sans effet pendant 15 jours.</li>
      </ul>

      <h2 id="obligations">4. Obligations du Client</h2>
      <p>Le Client fournit dans les délais convenus les contenus nécessaires (textes, photos, logo, informations légales) et garantit qu&apos;il dispose de tous les droits sur ceux-ci (droits d&apos;auteur, droit à l&apos;image, marques). Il est responsable de l&apos;exactitude et de la licéité des contenus publiés, ainsi que des obligations légales propres à son activité (mentions légales, CGV, conformité RGPD de ses traitements). Un retard dans la fourniture des éléments décale d&apos;autant le calendrier.</p>

      <h2 id="realisation">5. Réalisation, recette et mise en ligne</h2>
      <p>Le Prestataire est tenu à une obligation de moyens et réalise le site selon les règles de l&apos;art. Le projet comprend jusqu&apos;à deux séries de corrections sur la maquette, sauf mention contraire au devis. À la livraison, le Client dispose de 10 jours ouvrés pour signaler par écrit toute non-conformité au devis (recette). À défaut de réserve dans ce délai, ou en cas de mise en ligne à la demande du Client, la prestation est réputée acceptée. Les anomalies signalées sont corrigées sans frais si elles relèvent du périmètre initial.</p>

      <h2 id="propriete">6. Propriété intellectuelle</h2>
      <p>
        Après paiement intégral du prix, le Prestataire cède au Client, pour la durée légale des droits et pour le monde entier, les droits patrimoniaux
        (reproduction, représentation, adaptation) sur les créations spécifiques réalisées pour lui (design, textes rédigés, code spécifique), pour
        l&apos;exploitation de son site. Les composants préexistants, logiciels libres et bibliothèques tierces restent soumis à leurs licences respectives. Le nom de
        domaine est réservé au nom du Client, qui en reste titulaire. Sauf refus écrit du Client, le Prestataire peut mentionner la réalisation dans ses références
        et insérer un lien discret « Site réalisé par GCS ».
      </p>
      <p>En cas de changement de prestataire, le Prestataire remet au Client, à sa demande et après paiement des sommes dues, les accès et fichiers nécessaires à la reprise du site.</p>

      <h2 id="hebergement">7. Hébergement et maintenance</h2>
      <p>L&apos;hébergement est assuré par un prestataire technique tiers choisi pour sa fiabilité ; le Prestataire ne peut garantir une disponibilité ininterrompue. Le forfait de maintenance comprend les éléments décrits au devis (mises à jour de sécurité, sauvegardes, petites modifications dans la limite du temps inclus). Les abonnements sont conclus pour 12 mois, renouvelables tacitement, et résiliables à chaque échéance avec un préavis d&apos;un mois. Pour les consommateurs, le Prestataire informe le Client de la possibilité de ne pas reconduire le contrat, conformément à l&apos;article L.215-1 du Code de la consommation.</p>

      <h2 id="seo">8. Référencement</h2>
      <p>Les prestations de référencement naturel (SEO) et d&apos;optimisation de la fiche Google Business Profile relèvent d&apos;une obligation de moyens. Le positionnement dans les moteurs de recherche dépend d&apos;algorithmes indépendants du Prestataire, qui ne peut garantir un classement déterminé.</p>

      <h2 id="rgpd">9. Données personnelles</h2>
      <p>Lorsque le Prestataire héberge ou maintient un site collectant des données personnelles, il agit en qualité de sous-traitant du Client au sens de l&apos;article 28 du RGPD et ne traite ces données que sur instruction du Client, pour les besoins de la prestation. Les engagements correspondants (sécurité, confidentialité, sort des données en fin de contrat) peuvent être formalisés dans un accord de sous-traitance annexé au devis.</p>

      <h2 id="responsabilite">10. Responsabilité</h2>
      <p>La responsabilité du Prestataire envers un Client professionnel est limitée aux dommages directs et prouvés, et plafonnée au montant payé au titre de la prestation concernée. Le Prestataire n&apos;est pas responsable des contenus fournis par le Client, des interruptions imputables à l&apos;hébergeur ou aux réseaux, ni des modifications réalisées par le Client ou un tiers.{e.assuranceRcPro ? <> Assurance : {e.assuranceRcPro}.</> : null}</p>

      <h2 id="retractation">11. Droit de rétractation (clients consommateurs)</h2>
      <p>
        Lorsque le contrat est conclu à distance ou hors établissement avec un consommateur, celui-ci dispose d&apos;un délai de 14 jours à compter de la conclusion
        du contrat pour se rétracter, au moyen du <a href="/cgv#formulaire">formulaire type</a> ou de toute déclaration dénuée d&apos;ambiguïté. Si le Client demande
        expressément que la prestation commence avant la fin de ce délai, il reste redevable d&apos;un montant proportionnel au travail effectué jusqu&apos;à la
        communication de sa rétractation (art. L.221-25 du Code de la consommation). Les professionnels ne bénéficient pas de ce droit, sauf cas prévus à l&apos;article L.221-3.
      </p>

      <h2 id="resiliation">12. Résiliation</h2>
      <p>En cas de manquement grave de l&apos;une des parties non réparé dans les 30 jours suivant une mise en demeure, l&apos;autre partie peut résilier le contrat de plein droit. Les sommes correspondant aux travaux réalisés restent dues.</p>

      <h2 id="litiges">13. Litiges</h2>
      <p>Les présentes conditions sont soumises au droit français. Les parties recherchent une solution amiable. Le Client consommateur peut recourir gratuitement au médiateur de la consommation : <Val v={e.mediateur.nom} />, <Val v={e.mediateur.site} />. Entre professionnels, à défaut d&apos;accord amiable, compétence est attribuée aux tribunaux du ressort de Montpellier.</p>
    </PageLegale>
  );
}
