/**
 * Encadré d'information sur les garanties légales – texte imposé par le décret n° 2022-946 du 29 juin 2022
 * (annexe à l'article D. 211-2 du Code de la consommation) pour les ventes de biens.
 */
export function EncadreGarantieLegale({ occasion = false }: { occasion?: boolean }) {
  return (
    <div className="my-6 rounded-2xl border-2 border-ink p-5 text-sm leading-6">
      <p className="font-semibold">Garantie légale de conformité et garantie des vices cachés</p>
      <p className="mt-2">
        Le consommateur dispose d&apos;un délai de deux ans à compter de la délivrance du bien pour obtenir la mise en œuvre de la garantie légale de
        conformité en cas d&apos;apparition d&apos;un défaut de conformité. Durant ce délai, le consommateur n&apos;est tenu d&apos;établir que l&apos;existence du défaut
        de conformité et non la date d&apos;apparition de celui-ci.{occasion && " Pour les biens vendus d'occasion, ce délai de présomption est de douze mois."}
      </p>
      <p className="mt-2">
        Lorsque le contrat de vente du bien prévoit la fourniture d&apos;un contenu numérique ou d&apos;un service numérique de manière continue pendant une durée
        supérieure à deux ans, la garantie légale est applicable à ce contenu numérique ou ce service numérique tout au long de la période de fourniture prévue.
        Durant ce délai, le consommateur n&apos;est tenu d&apos;établir que l&apos;existence du défaut de conformité affectant le contenu numérique ou le service
        numérique et non la date d&apos;apparition de celui-ci.
      </p>
      <p className="mt-2">La garantie légale de conformité emporte obligation pour le professionnel, le cas échéant, de fournir toutes les mises à jour nécessaires au maintien de la conformité du bien.</p>
      <p className="mt-2">
        La garantie légale de conformité donne au consommateur droit à la réparation ou au remplacement du bien dans un délai de trente jours suivant sa
        demande, sans frais et sans inconvénient majeur pour lui.
      </p>
      <p className="mt-2">Si le bien est réparé dans le cadre de la garantie légale de conformité, le consommateur bénéficie d&apos;une extension de six mois de la garantie initiale.</p>
      <p className="mt-2">
        Si le consommateur demande la réparation du bien, mais que le vendeur impose le remplacement, la garantie légale de conformité est renouvelée pour une
        période de deux ans à compter de la date de remplacement du bien.
      </p>
      <p className="mt-2">
        Le consommateur peut obtenir une réduction du prix d&apos;achat en conservant le bien ou mettre fin au contrat en se faisant rembourser intégralement
        contre restitution du bien, si : 1° Le professionnel refuse de réparer ou de remplacer le bien ; 2° La réparation ou le remplacement du bien intervient
        après un délai de trente jours ; 3° La réparation ou le remplacement du bien occasionne un inconvénient majeur pour le consommateur, notamment lorsque le
        consommateur supporte définitivement les frais de reprise ou d&apos;enlèvement du bien non conforme, ou s&apos;il supporte les frais d&apos;installation du
        bien réparé ou de remplacement ; 4° La non-conformité du bien persiste en dépit de la tentative de mise en conformité du vendeur restée infructueuse.
      </p>
      <p className="mt-2">
        Le consommateur a également droit à une réduction du prix du bien ou à la résolution du contrat lorsque le défaut de conformité est si grave qu&apos;il
        justifie que la réduction du prix ou la résolution du contrat soit immédiate. Le consommateur n&apos;est alors pas tenu de demander la réparation ou le
        remplacement du bien au préalable.
      </p>
      <p className="mt-2">Le consommateur n&apos;a pas droit à la résolution de la vente si le défaut de conformité est mineur.</p>
      <p className="mt-2">Toute période d&apos;immobilisation du bien en vue de sa réparation ou de son remplacement suspend la garantie qui restait à courir jusqu&apos;à la délivrance du bien remis en état.</p>
      <p className="mt-2">Les droits mentionnés ci-dessus résultent de l&apos;application des articles L. 217-1 à L. 217-32 du code de la consommation.</p>
      <p className="mt-2">
        Le vendeur qui fait obstacle de mauvaise foi à la mise en œuvre de la garantie légale de conformité encourt une amende civile d&apos;un montant maximal
        de 300 000 euros, qui peut être porté jusqu&apos;à 10 % du chiffre d&apos;affaires moyen annuel (article L. 241-5 du code de la consommation).
      </p>
      <p className="mt-2">
        Le consommateur bénéficie également de la garantie légale des vices cachés en application des articles 1641 à 1649 du code civil, pendant une durée de
        deux ans à compter de la découverte du défaut. Cette garantie donne droit à une réduction de prix si le bien est conservé ou à un remboursement intégral
        contre restitution du bien.
      </p>
    </div>
  );
}
