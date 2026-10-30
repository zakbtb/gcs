import { PageLegale } from "@/components/legal/PageLegale";
import { EncadreGarantieLegale } from "@/components/legal/GarantiesLegales";
import { Val } from "@/components/ui/Val";
import { boutique, entreprise } from "@/config/entreprise";
import { meta } from "@/lib/seo";

export const metadata = meta({ titre: "Conditions de vente et de rachat de téléphones reconditionnés", description: "Conditions de vente des smartphones reconditionnés et de rachat d'appareils d'occasion chez GCS Montpellier.", chemin: "/conditions-reconditionnes" });

export default function ConditionsReconditionnes() {
  const e = entreprise;
  return (
    <PageLegale
      titre="Conditions reconditionnés & rachat"
      majLe="27 octobre 2026"
      sommaire={[
        { id: "vente", titre: "A. Vente de reconditionnés" },
        { id: "definition", titre: "1. Définition" },
        { id: "etat", titre: "2. Grades et batterie" },
        { id: "garanties", titre: "3. Garanties" },
        { id: "retractation", titre: "4. Rétractation" },
        { id: "rachat", titre: "B. Rachat d'appareils" },
        { id: "conditions-rachat", titre: "5. Conditions" },
        { id: "prix-rachat", titre: "6. Prix et paiement" },
        { id: "donnees", titre: "7. Données" },
      ]}
      intro={`Conditions applicables à la vente de smartphones reconditionnés et au rachat d'appareils d'occasion par ${e.raisonSociale} (${e.nomCommercial}).`}
    >
      <h2 id="vente">A. Vente de téléphones reconditionnés</h2>
      <h3 id="definition">1. Définition</h3>
      <p>
        Conformément à l&apos;article L.122-21-1 et au décret n° 2022-190 du 17 février 2022, un appareil vendu comme « reconditionné » par GCS a fait
        l&apos;objet de tests portant sur l&apos;ensemble de ses fonctionnalités afin d&apos;établir qu&apos;il répond aux obligations légales de sécurité et à l&apos;usage
        auquel le consommateur peut légitimement s&apos;attendre, ainsi que, le cas échéant, d&apos;une ou plusieurs interventions afin de lui restituer ses
        fonctionnalités. Les données de l&apos;ancien propriétaire ont été effacées de manière sécurisée et l&apos;appareil n&apos;est rattaché à aucun compte (iCloud, Google).
      </p>
      <h3 id="etat">2. Grades esthétiques et état de la batterie</h3>
      <p>Chaque appareil est présenté avec son grade esthétique, sa capacité de stockage, sa couleur et, pour les iPhone, l&apos;état de santé de la batterie :</p>
      <ul>
        <li><strong>Comme neuf</strong> : aucune trace d&apos;usure visible ;</li>
        <li><strong>Très bon état</strong> : micro-rayures invisibles à 20 cm ;</li>
        <li><strong>Bon état</strong> : rayures légères visibles, sans impact sur l&apos;utilisation.</li>
      </ul>
      <p>Les pièces éventuellement remplacées (écran, batterie…) et leur nature (origine, compatible) sont indiquées au Client avant l&apos;achat.</p>
      <h3 id="garanties">3. Garanties</h3>
      <p>
        Les appareils reconditionnés bénéficient de la garantie légale de conformité de deux ans et de la garantie des vices cachés. En complément, GCS accorde
        une garantie commerciale de <strong>{boutique.garantieReconditionneMois} mois</strong> à compter de l&apos;achat couvrant les pannes de fonctionnement, hors casse,
        oxydation, usure normale de la batterie au-delà de 6 mois et intervention d&apos;un tiers. Cette garantie commerciale ne se substitue pas aux garanties légales.
      </p>
      <EncadreGarantieLegale occasion />
      <h3 id="retractation">4. Droit de rétractation</h3>
      <p>
        Pour les ventes en boutique, il n&apos;existe pas de droit de rétractation légal ; GCS peut accorder un délai d&apos;échange à titre commercial, précisé sur le
        ticket. Pour les ventes à distance, les conditions de rétractation de 14 jours des <a href="/cgv#retractation">CGV</a> s&apos;appliquent.
      </p>

      <h2 id="rachat">B. Rachat d&apos;appareils d&apos;occasion</h2>
      <h3 id="conditions-rachat">5. Conditions du rachat</h3>
      <ul>
        <li>Le vendeur doit être majeur, présenter une pièce d&apos;identité en cours de validité et être le propriétaire légitime de l&apos;appareil (facture conseillée).</li>
        <li>Conformément à l&apos;article 321-7 du Code pénal, chaque rachat est inscrit sur le registre des objets mobiliers (« livre de police ») avec l&apos;identité du vendeur.</li>
        <li>L&apos;appareil doit être déconnecté de tout compte (iCloud / « Localiser », compte Google) et ne pas être déclaré perdu, volé ou bloqué (IMEI vérifié). GCS refuse tout appareil suspect et coopère avec les autorités.</li>
      </ul>
      <h3 id="prix-rachat">6. Prix et paiement</h3>
      <p>L&apos;estimation en ligne est indicative. Le prix définitif est fixé après contrôle de l&apos;appareil en boutique et accepté par le vendeur. Le paiement est effectué immédiatement par virement ou en espèces, dans la limite des plafonds légaux.</p>
      <h3 id="donnees">7. Données</h3>
      <p>Il est recommandé au vendeur de sauvegarder puis d&apos;effacer ses données avant la cession. GCS procède dans tous les cas à un effacement sécurisé avant toute remise en vente. Les données d&apos;identité du vendeur sont conservées conformément aux obligations légales relatives au registre de police (voir <a href="/confidentialite">politique de confidentialité</a>).</p>
      <p>Contact : <Val v={e.telephone} /> · <Val v={e.email} /> · Médiateur : <Val v={e.mediateur.nom} />.</p>
    </PageLegale>
  );
}
