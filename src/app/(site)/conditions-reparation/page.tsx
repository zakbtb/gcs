import { PageLegale } from "@/components/legal/PageLegale";
import { Val } from "@/components/ui/Val";
import { boutique, entreprise } from "@/config/entreprise";
import { meta } from "@/lib/seo";

export const metadata = meta({ titre: "Conditions générales de prestation – Réparation", description: "Conditions des réparations de smartphones chez GCS Montpellier : devis, pièces, garantie, données, récupération des appareils.", chemin: "/conditions-reparation" });

const sommaire = [
  { id: "champ", titre: "1. Champ d'application" },
  { id: "diagnostic", titre: "2. Diagnostic et devis" },
  { id: "prix", titre: "3. Prix et paiement" },
  { id: "pieces", titre: "4. Pièces détachées" },
  { id: "donnees", titre: "5. Données du client" },
  { id: "execution", titre: "6. Exécution" },
  { id: "garantie", titre: "7. Garantie" },
  { id: "recuperation", titre: "8. Récupération des appareils" },
  { id: "domicile", titre: "9. Réparation à domicile" },
  { id: "responsabilite", titre: "10. Responsabilité" },
  { id: "litiges", titre: "11. Réclamations et médiation" },
];

export default function ConditionsReparation() {
  const e = entreprise;
  const g = boutique.garantieReparationMois;
  return (
    <PageLegale titre="Conditions de réparation" majLe="27 octobre 2026" sommaire={sommaire} intro="Conditions générales applicables aux prestations de diagnostic, de réparation, de désoxydation, de micro-soudure, de déblocage et de transfert ou récupération de données réalisées par GCS.">
      <h2 id="champ">1. Champ d&apos;application</h2>
      <p>
        Les présentes conditions s&apos;appliquent à toute prestation réalisée par {e.raisonSociale} (« {e.nomCommercial} »), {<Val v={e.adresse.rue} />}, {e.adresse.codePostal} {e.adresse.ville},
        SIRET <Val v={e.siret} />, sur un appareil confié par un client (« le Client »), en boutique ou à domicile. Elles sont affichées en boutique et
        acceptées lors du dépôt de l&apos;appareil (bon de dépôt / fiche d&apos;intervention).
      </p>

      <h2 id="diagnostic">2. Diagnostic et devis</h2>
      <ul>
        <li>Le diagnostic est <strong>gratuit et sans engagement</strong>.</li>
        <li>Les prix affichés sur le site (simulateur) et en boutique sont des prix TTC, pièce et main-d&apos;œuvre incluses, pour la panne décrite.</li>
        <li>Avant toute intervention, un devis (ou une fiche d&apos;intervention mentionnant le prix) est remis au Client, qui l&apos;accepte expressément (signature ou accord écrit, y compris par SMS ou e-mail). Aucune réparation n&apos;est effectuée sans cet accord.</li>
        <li>Si le diagnostic ou l&apos;ouverture de l&apos;appareil révèle une panne différente ou supplémentaire, un devis complémentaire est soumis au Client avant de poursuivre. En cas de refus, l&apos;appareil est restitué dans l&apos;état, sans frais (hors pièces spécialement commandées à la demande expresse du Client, si cela a été convenu par écrit).</li>
        <li>Les devis sont valables 15 jours, sous réserve de la disponibilité des pièces.</li>
      </ul>

      <h2 id="prix">3. Prix et paiement</h2>
      <p>Le prix est celui figurant sur le devis accepté. Il est payable à la restitution de l&apos;appareil, en espèces (dans les limites légales), par carte bancaire ou par tout autre moyen accepté en boutique. Une facture est remise au Client ; elle mentionne la nature des pièces utilisées. Un acompte peut être demandé pour les pièces commandées spécialement.</p>

      <h2 id="pieces">4. Information sur les pièces détachées</h2>
      <p>Conformément au Code de la consommation, le Client est informé de la nature des pièces proposées, qui figure sur le devis et la facture :</p>
      <ul>
        <li><strong>Pièce d&apos;origine</strong> : pièce fabriquée par ou pour le constructeur de l&apos;appareil, ou de qualité équivalente garantie par son fournisseur ;</li>
        <li><strong>Pièce compatible neuve</strong> : pièce neuve de fabricant tiers, non d&apos;origine, testée avant pose ; des différences de rendu (luminosité, couleurs, consommation) peuvent exister ;</li>
        <li><strong>Pièce issue de l&apos;économie circulaire</strong> (réemploi ou reconditionnée) : pièce d&apos;occasion récupérée sur un autre appareil et contrôlée. Lorsqu&apos;elle est disponible, cette option est proposée au Client, conformément au Code de la consommation.</li>
      </ul>
      <p>
        Le Client est informé que, sur certains iPhone, le remplacement d&apos;une pièce (écran, batterie, caméra) par une pièce non d&apos;origine ou non appairée
        peut entraîner l&apos;affichage d&apos;un message « pièce inconnue » dans les réglages, la perte de certaines fonctions (True Tone, indicateur de santé de la batterie)
        sans incidence sur le fonctionnement général. Les pièces remplacées sont restituées au Client sur simple demande au moment de la restitution.
      </p>

      <h2 id="donnees">5. Données du Client</h2>
      <ul>
        <li>Le Client reste seul responsable de ses données. Il lui appartient d&apos;effectuer une <strong>sauvegarde complète</strong> avant de confier son appareil (GCS peut la réaliser sur demande, comme prestation distincte).</li>
        <li>Certaines interventions (micro-soudure, désoxydation, carte mère, remise à zéro nécessaire) peuvent entraîner une perte de données. GCS ne saurait être tenu responsable de cette perte, sauf faute prouvée de sa part.</li>
        <li>Le code de déverrouillage n&apos;est demandé que lorsqu&apos;il est indispensable au test de l&apos;appareil. GCS s&apos;engage à ne consulter, copier ni conserver aucune donnée personnelle du Client au-delà de ce qui est strictement nécessaire à la prestation (voir <a href="/confidentialite">politique de confidentialité</a>).</li>
        <li>Pour les prestations de transfert ou de récupération de données, GCS est tenu à une obligation de moyens ; la récupération dépend de l&apos;état du support.</li>
      </ul>

      <h2 id="execution">6. Exécution de la prestation</h2>
      <p>Les délais annoncés (ex. « 30 minutes ») sont indicatifs et s&apos;entendent pièce disponible en stock. Les interventions de désoxydation, de micro-soudure et de récupération de données relèvent d&apos;une <strong>obligation de moyens</strong> : leur résultat ne peut être garanti compte tenu de l&apos;état de l&apos;appareil. Après ouverture, l&apos;étanchéité d&apos;origine (normes IP67/IP68) ne peut plus être garantie, même si un joint neuf est posé.</p>
      <p>Le déblocage opérateur est réalisé dans le respect des conditions de l&apos;opérateur d&apos;origine et sous réserve que l&apos;appareil ne soit pas déclaré perdu ou volé.</p>

      <h2 id="garantie">7. Garantie des réparations</h2>
      <p>
        Les réparations sont garanties <strong>{g} mois</strong> à compter de la restitution, pièce et main-d&apos;œuvre, pour la seule pièce remplacée et le défaut
        réparé. Cette garantie ne couvre pas : la casse, les chocs, l&apos;oxydation ou l&apos;exposition à un liquide survenus après la réparation, l&apos;usure normale,
        l&apos;intervention d&apos;un tiers, les dommages logiciels. La garantie est exclue pour les appareils ayant déjà été oxydés avant la réparation. Les pièces
        vendues dans le cadre de la réparation bénéficient en outre des garanties légales applicables.
      </p>

      <h2 id="recuperation">8. Conditions de récupération des appareils</h2>
      <ul>
        <li>Le Client est prévenu par téléphone, SMS ou e-mail lorsque son appareil est prêt.</li>
        <li>L&apos;appareil est remis au Client sur présentation du bon de dépôt et/ou d&apos;une pièce d&apos;identité, contre paiement du prix.</li>
        <li>Le Client s&apos;engage à récupérer son appareil dans un délai de 30 jours suivant l&apos;avis de mise à disposition. Au-delà de 90 jours, une relance écrite lui est adressée.</li>
        <li>Conformément à la loi du 31 décembre 1903 relative à la vente de certains objets abandonnés, les appareils non réclamés dans un délai d&apos;un an à compter de la date de dépôt pourront, après autorisation judiciaire, être vendus aux enchères publiques, le produit de la vente servant à couvrir les sommes dues.</li>
      </ul>

      <h2 id="domicile">9. Réparation à domicile</h2>
      <p>
        La réparation à domicile est proposée dans la zone suivante : {e.zoneDomicile}. Un éventuel forfait de déplacement est indiqué avant le rendez-vous. Lorsque le
        contrat est conclu hors établissement, le Client consommateur dispose d&apos;un droit de rétractation de 14 jours. S&apos;il demande expressément que la
        prestation soit exécutée immédiatement, il reconnaît qu&apos;il perdra son droit de rétractation une fois la prestation pleinement exécutée (art. L.221-25
        et L.221-28 du Code de la consommation) et reste redevable des pièces fournies et du travail réalisé jusqu&apos;à sa rétractation.
      </p>

      <h2 id="responsabilite">10. Responsabilité</h2>
      <p>GCS est responsable des dommages directs causés à l&apos;appareil par sa faute. Il ne saurait être tenu responsable des pannes préexistantes non signalées, de dysfonctionnements révélés par l&apos;intervention mais sans lien avec celle-ci, ni des appareils déjà ouverts ou réparés par un tiers. Le Client déclare être propriétaire de l&apos;appareil confié ou dûment autorisé par son propriétaire.</p>

      <h2 id="litiges">11. Réclamations et médiation</h2>
      <p>Toute réclamation est à adresser en boutique, au <Val v={e.telephone} /> ou à <Val v={e.email} />. À défaut d&apos;accord amiable, le Client consommateur peut recourir gratuitement au médiateur de la consommation : <Val v={e.mediateur.nom} />, <Val v={e.mediateur.site} />. Droit applicable : droit français.</p>
    </PageLegale>
  );
}
