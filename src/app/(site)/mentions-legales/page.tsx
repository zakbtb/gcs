import { PageLegale } from "@/components/legal/PageLegale";
import { Val } from "@/components/ui/Val";
import { entreprise } from "@/config/entreprise";
import { meta } from "@/lib/seo";

export const metadata = meta({ titre: "Mentions légales", description: "Mentions légales du site GCS – Global Connect Services (Pronet Services Plus), Montpellier.", chemin: "/mentions-legales" });

export default function MentionsLegales() {
  const e = entreprise;
  return (
    <PageLegale titre="Mentions légales" majLe="27 octobre 2026" intro="Informations légales relatives à l'éditeur et à l'hébergeur du site, conformément à la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN).">
      <h2 id="editeur">1. Éditeur du site</h2>
      <table>
        <tbody>
          <tr><th scope="row">Raison sociale</th><td>{e.raisonSociale}</td></tr>
          <tr><th scope="row">Nom commercial</th><td>{e.nomCommercial} – {e.nomComplet}</td></tr>
          <tr><th scope="row">Forme juridique</th><td><Val v={e.formeJuridique} /></td></tr>
          <tr><th scope="row">Capital social</th><td><Val v={e.capitalSocial} /></td></tr>
          <tr><th scope="row">Siège social</th><td><Val v={e.adresse.rue} />, {e.adresse.codePostal} {e.adresse.ville}, {e.adresse.pays}</td></tr>
          <tr><th scope="row">SIRET</th><td><Val v={e.siret} /></td></tr>
          <tr><th scope="row">RCS</th><td><Val v={e.rcs} /></td></tr>
          <tr><th scope="row">N° TVA intracommunautaire</th><td><Val v={e.tvaIntracom} /></td></tr>
          <tr><th scope="row">Code APE</th><td><Val v={e.codeApe} /></td></tr>
          <tr><th scope="row">Téléphone</th><td><Val v={e.telephone} /></td></tr>
          <tr><th scope="row">E-mail</th><td><Val v={e.email} /></td></tr>
          <tr><th scope="row">Directeur de la publication</th><td><Val v={e.directeurPublication} /></td></tr>
        </tbody>
      </table>

      <h2 id="hebergeur">2. Hébergeur</h2>
      <table>
        <tbody>
          <tr><th scope="row">Nom</th><td><Val v={e.hebergeur.nom} /></td></tr>
          <tr><th scope="row">Adresse</th><td><Val v={e.hebergeur.adresse} /></td></tr>
          <tr><th scope="row">Téléphone</th><td><Val v={e.hebergeur.telephone} /></td></tr>
          <tr><th scope="row">Site web</th><td><Val v={e.hebergeur.site} /></td></tr>
        </tbody>
      </table>

      <h2 id="propriete">3. Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus de ce site (textes, graphismes, logo, illustrations, mise en page, code) est la propriété de {e.raisonSociale}
        ou fait l&apos;objet d&apos;une autorisation d&apos;utilisation. Toute reproduction, représentation, modification ou exploitation, totale ou partielle,
        sans autorisation écrite préalable est interdite et constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la
        propriété intellectuelle. Les marques citées (Apple, iPhone, Samsung, etc.) appartiennent à leurs propriétaires respectifs ; {e.nomCommercial} est un
        réparateur indépendant, non affilié à ces marques.
      </p>

      <h2 id="responsabilite">4. Responsabilité</h2>
      <p>
        L&apos;éditeur s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffusées sur le site, mais ne peut garantir qu&apos;elles soient exemptes
        d&apos;erreurs. Les prix indiqués dans le simulateur de réparation sont donnés à titre informatif et peuvent être ajustés après diagnostic, avec
        votre accord préalable. L&apos;éditeur ne saurait être tenu responsable des contenus des sites tiers vers lesquels des liens renvoient.
      </p>

      <h2 id="donnees">5. Données personnelles et cookies</h2>
      <p>
        Le traitement de vos données personnelles est décrit dans notre <a href="/confidentialite">politique de confidentialité</a>. L&apos;utilisation des
        cookies est détaillée dans notre <a href="/cookies">politique cookies</a>.
      </p>

      <h2 id="mediation">6. Médiation de la consommation</h2>
      <p>
        Conformément aux articles L.612-1 et suivants du Code de la consommation, en cas de litige non résolu avec notre service client, vous pouvez
        recourir gratuitement au médiateur de la consommation : <Val v={e.mediateur.nom} />, <Val v={e.mediateur.adresse} />, <Val v={e.mediateur.site} />.
      </p>

      <h2 id="droit">7. Droit applicable</h2>
      <p>Les présentes mentions légales sont régies par le droit français.</p>
    </PageLegale>
  );
}
