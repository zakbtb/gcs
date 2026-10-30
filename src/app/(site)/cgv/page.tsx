import { PageLegale } from "@/components/legal/PageLegale";
import { EncadreGarantieLegale } from "@/components/legal/GarantiesLegales";
import { BoutonImprimer } from "@/components/legal/BoutonImprimer";
import { Val } from "@/components/ui/Val";
import { boutique, entreprise } from "@/config/entreprise";
import { meta } from "@/lib/seo";
import { prix } from "@/lib/format";

export const metadata = meta({ titre: "Conditions générales de vente (boutique en ligne)", description: "CGV de la boutique en ligne GCS : prix, paiement, livraison, retrait, droit de rétractation de 14 jours, garanties légales, médiation.", chemin: "/cgv" });

const sommaire = [
  { id: "objet", titre: "1. Objet et vendeur" },
  { id: "produits", titre: "2. Produits" },
  { id: "prix", titre: "3. Prix" },
  { id: "commande", titre: "4. Commande" },
  { id: "paiement", titre: "5. Paiement" },
  { id: "livraison", titre: "6. Livraison et retrait" },
  { id: "retractation", titre: "7. Droit de rétractation" },
  { id: "garanties", titre: "8. Garanties légales" },
  { id: "sav", titre: "9. Service client" },
  { id: "donnees", titre: "10. Données personnelles" },
  { id: "mediation", titre: "11. Médiation et litiges" },
  { id: "formulaire", titre: "Annexe : formulaire de rétractation" },
];

export default function CGV() {
  const e = entreprise;
  const adresse = <><Val v={e.adresse.rue} />, {e.adresse.codePostal} {e.adresse.ville}</>;
  return (
    <PageLegale titre="Conditions générales de vente" majLe="27 octobre 2026" sommaire={sommaire} intro="Conditions applicables aux achats de produits (accessoires) effectués sur la boutique en ligne GCS par des consommateurs.">
      <h2 id="objet">1. Objet et identification du vendeur</h2>
      <p>
        Les présentes conditions générales de vente (CGV) régissent les ventes de produits conclues à distance sur le site {e.siteUrl.replace(/^https?:\/\//, "")}
        entre {e.raisonSociale}, <Val v={e.formeJuridique} /> au capital de <Val v={e.capitalSocial} />, immatriculée sous le n° <Val v={e.siret} /> (<Val v={e.rcs} />),
        TVA <Val v={e.tvaIntracom} />, dont le siège est situé {adresse}, exerçant sous le nom commercial « {e.nomCommercial} – {e.nomComplet} »
        (ci-après « le Vendeur »), joignable au <Val v={e.telephone} /> ou à <Val v={e.email} />, et toute personne physique agissant à des fins non
        professionnelles (ci-après « le Client »).
      </p>
      <p>Toute commande implique l&apos;acceptation sans réserve des présentes CGV, que le Client reconnaît avoir lues avant de passer commande (case à cocher). Les CGV applicables sont celles en vigueur à la date de la commande.</p>

      <h2 id="produits">2. Produits</h2>
      <p>
        Les caractéristiques essentielles des produits (description, compatibilité, caractéristiques techniques, photos) sont présentées sur chaque fiche produit.
        Les photographies sont aussi fidèles que possible mais n&apos;ont pas de valeur contractuelle. Les offres sont valables dans la limite des stocks disponibles,
        indiqués en temps réel. En cas d&apos;indisponibilité après commande, le Client est informé et remboursé sans délai.
      </p>

      <h2 id="prix">3. Prix</h2>
      <p>
        Les prix sont indiqués en euros toutes taxes comprises (TTC), TVA française incluse, hors frais de livraison. Les frais de livraison sont indiqués avant
        la validation de la commande :
      </p>
      <ul>
        <li>{boutique.livraison.nom} : {prix(boutique.livraison.prix)} TTC{boutique.livraison.gratuiteDes ? `, offerte à partir de ${prix(boutique.livraison.gratuiteDes)} d'achat` : ""} ({boutique.livraison.zones}) ;</li>
        <li>{boutique.retrait.nom} : gratuit.</li>
      </ul>
      <p>Le Vendeur se réserve le droit de modifier ses prix à tout moment ; les produits sont facturés au prix en vigueur lors de la validation de la commande. En cas de réduction de prix, le prix de référence barré correspond au prix le plus bas pratiqué au cours des 30 jours précédant la réduction.</p>

      <h2 id="commande">4. Commande</h2>
      <ol>
        <li>Le Client sélectionne les produits et les ajoute à son panier ;</li>
        <li>Il vérifie le contenu du panier et peut le modifier ;</li>
        <li>Il renseigne ses coordonnées, choisit la livraison à domicile ou le retrait en boutique, et accepte les CGV ;</li>
        <li>Il vérifie le récapitulatif (produits, prix, frais, total) puis procède au paiement en cliquant sur le bouton « Payer », qui vaut commande avec obligation de paiement ;</li>
        <li>Après paiement accepté, la commande est confirmée à l&apos;écran (numéro de commande) et par e-mail récapitulatif reprenant les présentes conditions.</li>
      </ol>
      <p>Le Vendeur se réserve le droit d&apos;annuler toute commande d&apos;un Client avec lequel existerait un litige relatif au paiement d&apos;une commande antérieure, ou en cas de suspicion de fraude.</p>

      <h2 id="paiement">5. Paiement</h2>
      <p>
        Le paiement s&apos;effectue en ligne, au moment de la commande, par carte bancaire (CB, Visa, Mastercard…) et éventuellement par d&apos;autres moyens proposés à
        l&apos;écran, via la solution sécurisée Stripe (certifiée PCI-DSS). Les données de carte sont chiffrées et ne sont jamais communiquées au Vendeur. Une
        authentification forte (3-D Secure) peut être demandée par votre banque. La commande n&apos;est validée qu&apos;après accord du centre de paiement ; en cas de
        refus, elle n&apos;est pas enregistrée comme payée et le Client peut réessayer.
      </p>

      <h2 id="livraison">6. Livraison et retrait en boutique</h2>
      <p><strong>Livraison à domicile</strong> : en {boutique.livraison.zones}, à l&apos;adresse indiquée par le Client. Les produits sont expédiés sous {boutique.expeditionSous} après confirmation du paiement, avec un délai d&apos;acheminement indicatif de {boutique.livraison.delai}. Sauf indication contraire, la livraison intervient au plus tard 30 jours après la commande.</p>
      <p><strong>Retrait en boutique</strong> : gratuit, à {adresse}, aux horaires d&apos;ouverture. {boutique.retrait.delai}. Le Client présente son numéro de commande et, si demandé, une pièce d&apos;identité. Les commandes non retirées dans un délai de 30 jours peuvent être annulées et remboursées après relance.</p>
      <p>En cas de retard de livraison, le Client peut, après mise en demeure restée sans effet, résoudre le contrat (art. L.216-6 du Code de la consommation). Le transfert des risques intervient lorsque le Client (ou un tiers désigné par lui) prend physiquement possession des produits. Il est recommandé de vérifier l&apos;état du colis à réception et de signaler toute anomalie au transporteur et au Vendeur.</p>

      <h2 id="retractation">7. Droit de rétractation</h2>
      <p>
        Conformément aux articles L.221-18 et suivants du Code de la consommation, le Client dispose d&apos;un délai de <strong>14 jours</strong> à compter de la
        réception du produit (ou du dernier produit en cas de livraison multiple) pour exercer son droit de rétractation, sans avoir à motiver sa décision ni
        à supporter d&apos;autres coûts que ceux prévus ci-dessous.
      </p>
      <p><strong>Comment se rétracter ?</strong> Le Client notifie sa décision avant l&apos;expiration du délai par une déclaration dénuée d&apos;ambiguïté : par e-mail à <Val v={e.email} />, par courrier à {e.raisonSociale}, {adresse}, ou en utilisant le formulaire type figurant en annexe ci-dessous (facultatif).</p>
      <p><strong>Retour des produits</strong> : le Client renvoie ou rapporte le produit en boutique, complet et dans son emballage d&apos;origine si possible, au plus tard 14 jours après avoir communiqué sa décision. Les frais de retour sont à la charge du Client. Sa responsabilité peut être engagée en cas de dépréciation du produit résultant de manipulations autres que celles nécessaires pour en établir la nature, les caractéristiques et le bon fonctionnement.</p>
      <p><strong>Remboursement</strong> : le Vendeur rembourse la totalité des sommes versées, frais de livraison initiaux inclus (dans la limite du mode de livraison standard), au plus tard 14 jours à compter de la réception de la décision de rétractation, par le même moyen de paiement. Le remboursement peut être différé jusqu&apos;à récupération des produits ou preuve de leur expédition.</p>
      <p><strong>Exceptions</strong> (art. L.221-28) : le droit de rétractation ne peut être exercé pour les biens confectionnés selon les spécifications du Client ou nettement personnalisés, notamment les <strong>films hydrogel découpés sur mesure</strong>, ni pour les produits de protection d&apos;écran une fois posés à la demande du Client, ni pour les biens descellés par le Client après la livraison et qui ne peuvent être renvoyés pour des raisons d&apos;hygiène (par exemple, écouteurs intra-auriculaires dont l&apos;emballage scellé a été ouvert).</p>

      <h2 id="garanties">8. Garanties légales</h2>
      <p>Tous les produits vendus bénéficient de plein droit de la garantie légale de conformité (articles L.217-1 et suivants du Code de la consommation) et de la garantie des vices cachés (articles 1641 et suivants du Code civil), indépendamment de toute garantie commerciale éventuelle.</p>
      <EncadreGarantieLegale />
      <p>Pour mettre en œuvre une garantie, contactez-nous (coordonnées à l&apos;article 9) en précisant votre numéro de commande et le défaut constaté.</p>

      <h2 id="sav">9. Service client</h2>
      <p>Pour toute question ou réclamation : en boutique, par téléphone au <Val v={e.telephone} /> (appel non surtaxé), par e-mail à <Val v={e.email} /> ou via le <a href="/contact">formulaire de contact</a>.</p>

      <h2 id="donnees">10. Données personnelles</h2>
      <p>Les données collectées lors de la commande sont nécessaires à son traitement. Leur utilisation et vos droits sont décrits dans notre <a href="/confidentialite">politique de confidentialité</a>.</p>

      <h2 id="mediation">11. Médiation et règlement des litiges</h2>
      <p>
        En cas de litige, le Client adresse d&apos;abord une réclamation écrite au Vendeur. À défaut de solution amiable dans un délai raisonnable, le Client peut
        recourir gratuitement au médiateur de la consommation dont relève le Vendeur : <Val v={e.mediateur.nom} />, <Val v={e.mediateur.adresse} />, <Val v={e.mediateur.site} />.
      </p>
      <p>Les présentes CGV sont soumises au droit français. À défaut d&apos;accord amiable, le litige sera porté devant les juridictions compétentes dans les conditions de droit commun ; le consommateur peut saisir la juridiction du lieu où il demeurait au moment de la conclusion du contrat ou de la survenance du fait dommageable.</p>

      <h2 id="formulaire">Annexe : formulaire type de rétractation</h2>
      <p className="no-print"><BoutonImprimer /></p>
      <div className="rounded-2xl border-2 border-dashed border-line p-6">
        <p><em>(Veuillez compléter et renvoyer le présent formulaire uniquement si vous souhaitez vous rétracter du contrat.)</em></p>
        <p>
          À l&apos;attention de {e.raisonSociale} ({e.nomCommercial}), {adresse}, e-mail : <Val v={e.email} /> :
        </p>
        <p>Je/Nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat portant sur la vente du bien (*)/pour la prestation de services (*) ci-dessous :</p>
        <p>…………………………………………………………………………………………</p>
        <p>Commandé le (*)/reçu le (*) : ……………………… N° de commande : ………………………</p>
        <p>Nom du (des) consommateur(s) : …………………………………………………………</p>
        <p>Adresse du (des) consommateur(s) : ………………………………………………………</p>
        <p>Signature du (des) consommateur(s) (uniquement en cas de notification du présent formulaire sur papier) :</p>
        <p>Date : ………………………</p>
        <p><em>(*) Rayez la mention inutile.</em></p>
      </div>
    </PageLegale>
  );
}
