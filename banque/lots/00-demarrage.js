/*
 * Cap Inspecteur — lot 00-demarrage
 * 35 questions de niveaux 1 et 2 (10 bloc I, 10 bloc II, 10 bloc III, 5 bloc V),
 * sur des notions centrales. Elles servent au test de positionnement et restent dans la banque.
 * Rédaction et vérification des sources : 21 octobre 2026.
 */
CI.banque.ajouter([

  /* ===================== Bloc I ===================== */

  {
    id: "Q-I.A.a.02-01", bloc: "I", notion: "I.A.a.02", difficulte: 1, angle: "hierarchie",
    enonce: "Selon la Constitution, quelle autorité ont les traités ou accords régulièrement ratifiés ou approuvés, dès leur publication ?",
    choix: [
      "Une autorité supérieure à celle des lois",
      "Une autorité supérieure à celle de la Constitution",
      "Une autorité égale à celle des lois",
      "Une autorité inférieure à celle des lois"
    ],
    bonne: 0, ordreFixe: false,
    explication: "L'article 55 de la Constitution donne aux traités ou accords régulièrement ratifiés ou approuvés, dès leur publication, une autorité supérieure à celle des lois, sous réserve de leur application par l'autre partie. Ils ne sont pas au-dessus de la Constitution : selon l'article 54, si un engagement international contient une clause contraire à la Constitution, il ne peut être ratifié qu'après révision de celle-ci. Ils ne sont donc ni au même niveau que la loi, ni en dessous.",
    aRetenir: "Constitution > traités (art. 55) > lois : un traité contraire à la Constitution impose de la réviser avant ratification (art. 54).",
    references: [{ texte: "Constitution du 4 octobre 1958", article: "art. 55" }, { texte: "Constitution du 4 octobre 1958", article: "art. 54" }],
    source: "https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/texte-integral-de-la-constitution-du-4-octobre-1958-en-vigueur",
    piege: "Croire que les traités l'emportent aussi sur la Constitution : en droit interne, la Constitution reste au sommet.",
    voirAussi: ["II.D.b"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-I.A.b.02-01", bloc: "I", notion: "I.A.b.02", difficulte: 2, angle: "procedure",
    enonce: "Lequel de ces textes doit obligatoirement être soumis au Conseil constitutionnel avant sa promulgation ?",
    choix: [
      "Une loi organique",
      "Une loi de finances",
      "Une loi autorisant la ratification d'un traité",
      "Un décret en Conseil d'État"
    ],
    bonne: 0, ordreFixe: false,
    explication: "L'article 61, alinéa 1er, de la Constitution impose de soumettre au Conseil constitutionnel les lois organiques avant leur promulgation, ainsi que les règlements des assemblées parlementaires et les propositions de loi référendaires de l'article 11. Les autres lois, y compris les lois de finances et les lois autorisant la ratification d'un traité, peuvent seulement lui être déférées (article 61, alinéa 2) par le Président de la République, le Premier ministre, le président de l'une des deux assemblées, ou soixante députés ou soixante sénateurs. Un décret n'est pas une loi : il n'entre pas dans le champ de l'article 61.",
    aRetenir: "Contrôle obligatoire : lois organiques, règlements des assemblées, propositions de loi de l'article 11 ; contrôle facultatif : les autres lois.",
    references: [{ texte: "Constitution du 4 octobre 1958", article: "art. 61" }],
    source: "https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/texte-integral-de-la-constitution-du-4-octobre-1958-en-vigueur",
    piege: "Penser que les lois de finances, très souvent soumises au Conseil, le sont obligatoirement : leur saisine reste facultative.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-I.A.c.03-01", bloc: "I", notion: "I.A.c.03", difficulte: 1, angle: "definition",
    enonce: "Selon la Constitution, le nombre de députés à l'Assemblée nationale ne peut excéder :",
    choix: ["348", "577", "600", "925"],
    bonne: 1, ordreFixe: true,
    explication: "L'article 24 de la Constitution fixe à 577 le nombre maximal de députés, élus au suffrage direct. Le nombre 348 est le plafond fixé pour les sénateurs, élus au suffrage indirect. 925 correspond à l'addition des deux plafonds (577 + 348), c'est-à-dire l'effectif maximal du Parlement. Le nombre 600 ne figure pas dans la Constitution.",
    aRetenir: "Article 24 : 577 députés au plus (suffrage direct), 348 sénateurs au plus (suffrage indirect).",
    references: [{ texte: "Constitution du 4 octobre 1958", article: "art. 24" }],
    source: "https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/texte-integral-de-la-constitution-du-4-octobre-1958-en-vigueur",
    piege: "Confondre le plafond des députés (577) avec celui des sénateurs (348).",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-I.B.1.c.01-01", bloc: "I", notion: "I.B.1.c.01", difficulte: 2, angle: "distinction",
    enonce: "Laquelle de ces situations relève de la déconcentration, et non de la décentralisation ?",
    choix: [
      "Le préfet règle sur place certaines affaires de l'État, à la place de l'administration centrale",
      "L'État transfère une compétence administrative à la région",
      "Un conseil départemental élu vote librement son budget",
      "Plusieurs communes se regroupent pour gérer ensemble un service public"
    ],
    bonne: 0, ordreFixe: false,
    explication: "La déconcentration consiste à confier à des représentants locaux de l'État, avant tout le préfet et les services déconcentrés, le règlement de certaines affaires à la place des administrations centrales : l'État reste seul décideur. La décentralisation consiste, au contraire, à confier des compétences à des collectivités distinctes de l'État : c'est le cas du transfert d'une compétence à la région. Le vote du budget par un conseil élu relève de la libre administration des collectivités. Le regroupement de communes relève de la coopération intercommunale, pas de l'organisation interne de l'État.",
    aRetenir: "Déconcentration : l'État délègue à ses propres agents locaux ; décentralisation : l'État transfère à des collectivités distinctes de lui.",
    references: [{ texte: "V. Aubelle et É. Kerrouche, « Parlons décentralisation en 30 questions », La Documentation française", article: "" }],
    source: "https://www.vie-publique.fr/files/2021-09/9782111574519_DEP_Actu_Decentralisation_Extrait.pdf",
    piege: "Croire que tout ce qui se passe « au niveau local » relève de la décentralisation : le préfet agit au nom de l'État.",
    voirAussi: ["I.B.2.a"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-I.B.1.f.04-01", bloc: "I", notion: "I.B.1.f.04", difficulte: 2, angle: "competence",
    enonce: "Hors des cas prévus par les textes, notamment l'accès aux documents administratifs, qui peut délier un agent public de son obligation de discrétion professionnelle ?",
    choix: [
      "L'autorité dont il dépend, par une décision expresse",
      "Le référent déontologue de son administration",
      "Le juge administratif, à la demande de l'agent",
      "La Commission d'accès aux documents administratifs"
    ],
    bonne: 0, ordreFixe: false,
    explication: "L'article L. 121-7 du code général de la fonction publique prévoit qu'en dehors des cas expressément prévus par les textes, l'agent public ne peut être délié de son obligation de discrétion professionnelle que par décision expresse de l'autorité dont il dépend. Le référent déontologue conseille l'agent, mais ne le délie pas de ses obligations. Le juge administratif n'a pas ce rôle. La Commission d'accès aux documents administratifs intervient sur l'accès aux documents, qui est l'un des cas prévus par les textes, sans délier l'agent de son obligation.",
    aRetenir: "Discrétion professionnelle (CGFP, L. 121-7) : seule une décision expresse de l'autorité hiérarchique en délie l'agent ; le secret professionnel relève, lui, du code pénal (L. 121-6).",
    references: [{ texte: "Code général de la fonction publique", article: "art. L. 121-7" }, { texte: "Code général de la fonction publique", article: "art. L. 121-6" }],
    source: "https://www.fonction-publique.gouv.fr/etre-agent-public/mes-droits-et-obligations",
    piege: "Confondre discrétion professionnelle et secret professionnel, et citer la loi de 1983 au lieu du code général de la fonction publique.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-I.B.2.a.01-01", bloc: "I", notion: "I.B.2.a.01", difficulte: 2, angle: "distinction",
    enonce: "Laquelle de ces affirmations est conforme à l'article 72 de la Constitution ?",
    choix: [
      "Aucune collectivité territoriale ne peut exercer une tutelle sur une autre",
      "La région peut exercer une tutelle sur les départements de son ressort",
      "Les collectivités territoriales disposent d'un pouvoir législatif pour exercer leurs compétences",
      "Les collectivités territoriales s'administrent par des conseils nommés par le préfet"
    ],
    bonne: 0, ordreFixe: false,
    explication: "L'article 72, alinéa 5, de la Constitution dispose qu'aucune collectivité territoriale ne peut exercer une tutelle sur une autre ; la région n'a donc aucune tutelle sur les départements. Selon l'alinéa 3, les collectivités s'administrent librement par des conseils élus et disposent d'un pouvoir réglementaire, et non législatif, pour l'exercice de leurs compétences. Des conseils nommés par le préfet contrediraient le principe des conseils élus.",
    aRetenir: "Article 72 : libre administration par des conseils élus, pouvoir réglementaire, interdiction de la tutelle d'une collectivité sur une autre.",
    references: [{ texte: "Constitution du 4 octobre 1958", article: "art. 72" }],
    source: "https://www.conseil-constitutionnel.fr/le-bloc-de-constitutionnalite/texte-integral-de-la-constitution-du-4-octobre-1958-en-vigueur",
    piege: "Parler de « pouvoir législatif » des collectivités : elles n'ont qu'un pouvoir réglementaire.",
    voirAussi: ["I.B.1.c"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-I.B.2.e.01-01", bloc: "I", notion: "I.B.2.e.01", difficulte: 2, angle: "procedure",
    enonce: "Lors des élections municipales de mars 2026, quel mode de scrutin s'appliquait dans les communes de moins de 1 000 habitants ?",
    choix: [
      "Un scrutin de liste paritaire, sans panachage",
      "Un scrutin plurinominal majoritaire avec panachage",
      "Un scrutin uninominal majoritaire à deux tours",
      "Un scrutin de liste sans obligation de parité"
    ],
    bonne: 0, ordreFixe: false,
    explication: "La loi du 21 mai 2025 a étendu aux communes de moins de 1 000 habitants le scrutin de liste paritaire, appliqué dès les municipales de mars 2026. Les listes doivent alterner femmes et hommes, et le panachage est supprimé : un scrutin avec panachage relève donc de l'ancien régime de ces communes. Le scrutin uninominal ne concerne pas les élections municipales. Une liste sans parité n'est plus admise.",
    aRetenir: "Depuis mars 2026, toutes les communes élisent leur conseil municipal au scrutin de liste paritaire ; les listes peuvent compter jusqu'à deux candidats de moins que l'effectif du conseil dans les communes de moins de 1 000 habitants.",
    references: [{ texte: "Loi n° 2025-444 du 21 mai 2025 visant à harmoniser le mode de scrutin aux élections municipales afin de garantir la vitalité démocratique, la cohésion municipale et la parité", article: "" }],
    source: "https://www.interieur.gouv.fr/actualites/actualites-du-ministere/municipales-2026-mode-de-scrutin-change-pour-communes-de-moins-de-1-000-habitants",
    piege: "Répondre « avec panachage » : c'était la règle de ces communes avant la loi du 21 mai 2025.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-I.C.1.a.01-01", bloc: "I", notion: "I.C.1.a.01", difficulte: 2, angle: "intrus",
    enonce: "Laquelle de ces lois N'EST PAS une loi de finances ?",
    choix: [
      "La loi de financement de la sécurité sociale",
      "La loi de finances rectificative",
      "La loi de finances de fin de gestion",
      "La loi relative aux résultats de la gestion et portant approbation des comptes de l'année"
    ],
    bonne: 0, ordreFixe: false,
    explication: "Depuis la réforme de la LOLF en 2021, on distingue quatre catégories de lois de finances : la loi de finances de l'année, les lois de finances rectificatives, la loi de finances de fin de gestion et la loi relative aux résultats de la gestion et portant approbation des comptes de l'année, qui a remplacé la loi de règlement. La loi de financement de la sécurité sociale est une catégorie distincte : la Constitution lui consacre une disposition propre à l'article 34 et une procédure propre à l'article 47-1, alors que les lois de finances relèvent de l'article 47. Elle porte sur l'équilibre financier de la sécurité sociale, et non sur les ressources et charges de l'État.",
    aRetenir: "Lois de finances = ressources et charges de l'État (art. 34 et 47) ; LFSS = équilibre de la sécurité sociale (art. 34 et 47-1).",
    references: [{ texte: "Constitution du 4 octobre 1958", article: "art. 34" }, { texte: "Constitution du 4 octobre 1958", article: "art. 47-1" }, { texte: "Assemblée nationale, fiche de synthèse n° 53 « L'examen parlementaire des lois de finances »", article: "" }],
    source: "https://www.assemblee-nationale.fr/dyn/contenu/telechargement/629134/file/Fiche%2053%20-%20Examen%20LF.pdf",
    piege: "Ranger la LFSS parmi les lois de finances parce qu'elle est votée à l'automne avec le projet de loi de finances.",
    voirAussi: ["I.C.1.b"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-I.C.2.d.01-01", bloc: "I", notion: "I.C.2.d.01", difficulte: 1, angle: "definition",
    enonce: "Dans le budget de l'État, quelle unité regroupe les crédits destinés à mettre en œuvre une action ou un ensemble cohérent d'actions relevant d'un même ministère, associés à des objectifs précis et à des résultats attendus ?",
    choix: ["Le programme", "La mission", "L'action", "Le titre"],
    bonne: 0, ordreFixe: false,
    explication: "C'est la définition du programme : il regroupe les crédits d'un même ministère destinés à une action ou à un ensemble cohérent d'actions, avec des objectifs précis et des résultats attendus faisant l'objet d'une évaluation. La mission est l'échelon supérieur : elle regroupe des programmes, ne peut être créée qu'à l'initiative du Gouvernement, et la loi de finances fixe les crédits par mission. L'action est une composante du programme. Le titre classe les crédits par nature (personnel, fonctionnement, investissement, etc.).",
    aRetenir: "Mission (vote, initiative du Gouvernement) > programme (crédits, objectifs, un ministère) > action ; le titre classe les crédits par nature.",
    references: [{ texte: "Assemblée nationale, fiche de synthèse n° 53 « L'examen parlementaire des lois de finances »", article: "" }],
    source: "https://www.assemblee-nationale.fr/dyn/contenu/telechargement/629134/file/Fiche%2053%20-%20Examen%20LF.pdf",
    piege: "Confondre la mission, cadre du vote, et le programme, auquel sont rattachés objectifs et indicateurs de performance.",
    voirAussi: ["I.C.1.b"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-I.C.3.a.03-01", bloc: "I", notion: "I.C.3.a.03", difficulte: 2, angle: "distinction",
    enonce: "Le principe d'universalité budgétaire interdit en principe d'affecter une recette à une dépense déterminée. Quelle procédure permet d'y déroger au sein du budget de l'État ?",
    choix: [
      "Le fonds de concours",
      "Le report de crédits d'une année sur l'autre",
      "Le virement de crédits entre programmes d'un même ministère",
      "La présentation des crédits par titre"
    ],
    bonne: 0, ordreFixe: false,
    explication: "Les fonds de concours font partie des procédures comptables particulières qui permettent d'affecter des recettes à certaines dépenses ; le Gouvernement les présente comme une dérogation au principe d'universalité, aux côtés des budgets annexes et des comptes spéciaux. Le report de crédits concerne le passage de crédits disponibles d'une année à l'autre : c'est un aménagement de l'annualité. Le virement modifie la répartition des crédits entre programmes, dans la limite de 2 %. La présentation par titre est un classement des crédits par nature.",
    aRetenir: "Universalité = non-contraction + non-affectation ; fonds de concours, budgets annexes et comptes spéciaux sont des procédures d'affectation dérogatoires.",
    references: [{ texte: "Réponse ministérielle à la question écrite n° 34391, JO AN du 18 mars 2014, p. 2623", article: "" }, { texte: "LOLF n° 2001-692 du 1er août 2001", article: "" }],
    source: "https://questions.assemblee-nationale.fr/dyn/14/questions/QANR5L14QE34391.pdf",
    piege: "Rattacher le report de crédits à l'universalité, alors qu'il relève de l'annualité.",
    voirAussi: ["I.C.2.c"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  /* ===================== Bloc II ===================== */

  {
    id: "Q-II.A.a.06-01", bloc: "II", notion: "II.A.a.06", difficulte: 2, angle: "chronologie",
    enonce: "Quelle innovation institutionnelle doit-on au traité de Lisbonne ?",
    choix: [
      "Un président stable du Conseil européen, élu pour deux ans et demi",
      "Le lancement de l'euro comme monnaie unique",
      "L'élection des députés européens au suffrage universel direct",
      "La création de la Cour européenne des droits de l'homme"
    ],
    bonne: 0, ordreFixe: false,
    explication: "Le traité de Lisbonne, entré en vigueur le 1er décembre 2009, fait du président du Conseil européen une fonction stable et à plein temps : il est élu à la majorité qualifiée pour deux ans et demi, renouvelable une fois. L'euro a été lancé dès le 1er janvier 1999. Les premières élections du Parlement européen au suffrage universel direct ont eu lieu en juin 1979. La Cour européenne des droits de l'homme n'est pas une institution de l'Union : elle relève du Conseil de l'Europe.",
    aRetenir: "Lisbonne : président stable du Conseil européen (2 ans et demi, renouvelable une fois).",
    references: [{ texte: "Conseil de l'UE, note sur le président du Conseil européen", article: "" }],
    source: "https://www.consilium.europa.eu/media/31098/background-president_of_the_ec_fr.pdf",
    piege: "Attribuer à Lisbonne des avancées plus anciennes (élection directe du Parlement en 1979, euro en 1999).",
    voirAussi: ["II.B.b"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-II.A.b.02-01", bloc: "II", notion: "II.A.b.02", difficulte: 1, angle: "chronologie",
    enonce: "Quel État est devenu membre de l'Union européenne le 1er juillet 2013 ?",
    choix: ["La Croatie", "La Slovénie", "La Bulgarie", "La Serbie"],
    bonne: 0, ordreFixe: false,
    explication: "La Croatie est membre de l'Union depuis le 1er juillet 2013 ; c'est le dernier élargissement en date. La Slovénie a adhéré plus tôt, le 1er mai 2004, et la Bulgarie le 1er janvier 2007. La Serbie n'est pas membre de l'Union.",
    aRetenir: "Croatie, 1er juillet 2013 : dernier élargissement en date ; Slovénie en 2004, Bulgarie en 2007.",
    references: [{ texte: "Portail de l'Union européenne, fiche pays Croatie", article: "" }],
    source: "https://european-union.europa.eu/principles-countries-history/eu-countries/croatia_fr",
    piege: "Confondre la Croatie avec la Slovénie, voisine entrée en 2004.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-II.B.a.01-01", bloc: "II", notion: "II.B.a.01", difficulte: 2, angle: "distinction",
    enonce: "Les critères de Copenhague, définis en 1993, imposent notamment à un pays candidat à l'adhésion :",
    choix: [
      "De disposer d'une économie de marché viable",
      "D'avoir adopté l'euro avant son adhésion",
      "D'être membre de l'Alliance atlantique (OTAN)",
      "D'avoir un déficit public inférieur à 3 % du PIB"
    ],
    bonne: 0, ordreFixe: false,
    explication: "Les critères de Copenhague, définis par le Conseil européen de 1993, comportent un volet politique (institutions stables garantissant la démocratie, l'État de droit, les droits de l'homme et la protection des minorités), un volet économique (une économie de marché viable, capable de faire face à la concurrence) et la capacité à assumer les obligations de l'adhésion. Le candidat doit adhérer aux objectifs de l'union économique et monétaire, mais il n'a pas à avoir adopté l'euro avant d'entrer. L'appartenance à l'OTAN n'est pas une condition. Le plafond de déficit de 3 % du PIB n'est pas un critère de Copenhague.",
    aRetenir: "Copenhague (1993) : critères politique, économique (économie de marché viable) et capacité à reprendre l'acquis.",
    references: [{ texte: "Commission européenne, conditions d'adhésion", article: "" }],
    source: "https://enlargement.ec.europa.eu/enlargement-policy/conditions-membership_fr",
    piege: "Mélanger les critères d'adhésion à l'Union et les critères chiffrés de passage à l'euro.",
    voirAussi: ["II.D.a", "II.C.e"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-II.B.b.07-01", bloc: "II", notion: "II.B.b.07", difficulte: 1, angle: "competence",
    enonce: "Quelle institution est chargée de proposer les actes législatifs de l'Union européenne (droit d'initiative) ?",
    choix: ["La Commission européenne", "Le Parlement européen", "Le Conseil de l'Union européenne", "Le Conseil européen"],
    bonne: 0, ordreFixe: false,
    explication: "La Commission européenne est chargée de planifier, de préparer et de proposer la nouvelle législation européenne : c'est son droit d'initiative. Le Parlement européen, le Conseil de l'Union européenne et le Conseil européen peuvent l'inviter à présenter une proposition, de même qu'une initiative citoyenne réussie, mais c'est la Commission qui la rédige et la présente. Le Parlement et le Conseil adoptent ensuite les actes législatifs.",
    aRetenir: "La Commission propose ; le Parlement européen et le Conseil de l'UE adoptent.",
    references: [{ texte: "Commission européenne, « Planifier et proposer la législation »", article: "" }],
    source: "https://commission.europa.eu/law/law-making-process/planning-and-proposing-law_fr",
    piege: "Attribuer l'initiative au Parlement européen, comme le Parlement français pour les propositions de loi.",
    voirAussi: ["II.B.c"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-II.B.c.01-01", bloc: "II", notion: "II.B.c.01", difficulte: 1, angle: "definition",
    enonce: "Quel acte de l'Union fixe aux États membres un objectif à atteindre, en laissant à chacun le choix des mesures pour y parvenir ?",
    choix: ["La directive", "Le règlement", "La décision", "La recommandation"],
    bonne: 0, ordreFixe: false,
    explication: "La directive fixe des objectifs aux pays de l'Union, mais chaque pays est libre d'élaborer ses propres mesures pour les atteindre, d'où sa transposition en droit national. Le règlement est contraignant et doit être mis en œuvre dans son intégralité dans toute l'Union. La décision est contraignante pour ses destinataires et directement applicable. La recommandation n'est pas contraignante.",
    aRetenir: "Directive = résultat imposé, moyens libres ; règlement = obligatoire en tous ses éléments partout dans l'Union.",
    references: [{ texte: "Traité sur le fonctionnement de l'Union européenne", article: "art. 288" }],
    source: "https://european-union.europa.eu/institutions-law-budget/law/types-legislation_fr",
    piege: "Confondre directive et règlement : seule la directive appelle une transposition nationale.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-II.B.d.02-01", bloc: "II", notion: "II.B.d.02", difficulte: 2, angle: "procedure",
    enonce: "Selon les traités, le cadre financier pluriannuel de l'Union est établi pour une durée d'au moins :",
    choix: ["3 ans", "5 ans", "7 ans", "10 ans"],
    bonne: 1, ordreFixe: true,
    explication: "L'article 312 du TFUE prévoit que le cadre financier pluriannuel est établi pour une période d'au moins cinq ans. Le cadre actuel couvre sept ans (2021-2027) : sept ans est une pratique, pas le minimum fixé par le traité. Les durées de trois ans et de dix ans ne correspondent à aucune règle des traités. Depuis le traité de Lisbonne, le règlement fixant le cadre est adopté par le Conseil à l'unanimité, après approbation du Parlement européen.",
    aRetenir: "CFP : au moins 5 ans selon le traité (art. 312 TFUE), 7 ans en pratique (2021-2027).",
    references: [{ texte: "Traité sur le fonctionnement de l'Union européenne", article: "art. 312" }, { texte: "Parlement européen, fiche thématique « Cadre financier pluriannuel »", article: "" }, { texte: "Commission européenne, budget à long terme 2021-2027 (https://commission.europa.eu/strategy-and-policy/eu-budget/long-term-eu-budget/2021-2027_fr)", article: "" }],
    source: "https://www.europarl.europa.eu/factsheets/fr/sheet/29/cadre-financier-pluriannuel",
    piege: "Répondre 7 ans, la durée habituelle des cadres financiers, et non le minimum prévu par le traité.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-II.C.a.01-01", bloc: "II", notion: "II.C.a.01", difficulte: 2, angle: "chronologie",
    enonce: "Quel texte a fixé l'objectif d'achever le marché intérieur au 31 décembre 1992 ?",
    choix: [
      "L'Acte unique européen",
      "Le traité de Maastricht",
      "Le traité de Rome instituant la CEE",
      "Le traité de Lisbonne"
    ],
    bonne: 0, ordreFixe: false,
    explication: "L'Acte unique européen, adopté en 1986 et entré en vigueur le 1er juillet 1987, a intégré dans le traité CEE l'objectif d'un marché intérieur, « espace sans frontières intérieures », à achever au 31 décembre 1992. Ce marché assure la libre circulation des marchandises, des personnes, des services et des capitaux. Le traité de Rome avait institué la CEE, et c'est ce traité que l'Acte unique a complété ; le traité de Maastricht et le traité de Lisbonne n'ont pas fixé cette échéance.",
    aRetenir: "Acte unique (1986, en vigueur en 1987) : marché intérieur à achever au 31 décembre 1992.",
    references: [{ texte: "Parlement européen, fiche thématique « Le marché intérieur : principes généraux »", article: "" }],
    source: "https://www.europarl.europa.eu/factsheets/fr/sheet/33/le-marche-interieur-principes-generaux",
    piege: "Associer 1992 au traité de Maastricht, signé la même année, au lieu de l'Acte unique qui avait fixé l'échéance.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-II.C.e.01-01", bloc: "II", notion: "II.C.e.01", difficulte: 2, angle: "chronologie",
    enonce: "En quelle année l'euro a-t-il été lancé, d'abord sous une forme « invisible » réservée à la comptabilité et aux paiements électroniques ?",
    choix: ["1992", "1999", "2002", "2009"],
    bonne: 1, ordreFixe: true,
    explication: "L'euro a été lancé le 1er janvier 1999 : pendant trois ans, il n'a existé que sous forme « invisible », pour la comptabilité et les paiements électroniques. Les pièces et billets n'ont été mis en circulation que le 1er janvier 2002. 1992 renvoie à l'échéance d'achèvement du marché intérieur fixée par l'Acte unique. 2009 est l'année d'entrée en vigueur du traité de Lisbonne.",
    aRetenir: "Euro : 1er janvier 1999 (monnaie « invisible »), 1er janvier 2002 (pièces et billets).",
    references: [{ texte: "Portail de l'Union européenne, « Histoire et finalité de l'euro »", article: "" }],
    source: "https://european-union.europa.eu/institutions-law-budget/euro/history-and-purpose_fr",
    piege: "Répondre 2002, date de l'arrivée des pièces et billets, et non du lancement de l'euro.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-II.D.a.01-01", bloc: "II", notion: "II.D.a.01", difficulte: 2, angle: "intrus",
    enonce: "Laquelle de ces notions NE FIGURE PAS parmi les valeurs sur lesquelles l'Union européenne est fondée ?",
    choix: ["La laïcité", "La dignité humaine", "L'État de droit", "L'égalité"],
    bonne: 0, ordreFixe: false,
    explication: "Les valeurs de l'Union sont la dignité humaine, la liberté, la démocratie, l'égalité, l'État de droit et les droits de l'homme. La laïcité n'en fait pas partie : c'est un principe de la République française, que les traités européens ne reprennent pas. L'Union protège en revanche la liberté de religion et interdit les discriminations fondées sur la religion.",
    aRetenir: "Valeurs de l'Union : dignité humaine, liberté, démocratie, égalité, État de droit, droits de l'homme.",
    references: [{ texte: "Traité sur l'Union européenne, tel que modifié par le traité de Lisbonne", article: "art. 2" }, { texte: "Portail de l'Union européenne, « Buts et valeurs »", article: "" }],
    source: "https://european-union.europa.eu/principles-countries-history/principles-and-values/aims-and-values_fr",
    piege: "Projeter sur l'Union un principe propre à la Constitution française.",
    voirAussi: ["I.A.a"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-II.D.c.01-01", bloc: "II", notion: "II.D.c.01", difficulte: 2, angle: "distinction",
    enonce: "Qu'est-ce que le Conseil de l'Europe ?",
    choix: [
      "Une organisation internationale distincte de l'Union européenne, qui siège à Strasbourg et dont relève la Cour européenne des droits de l'homme",
      "L'institution de l'Union européenne qui réunit les chefs d'État ou de gouvernement des États membres",
      "L'institution de l'Union européenne qui réunit les ministres des États membres",
      "L'assemblée de l'Union européenne composée de députés élus au suffrage universel direct"
    ],
    bonne: 0, ordreFixe: false,
    explication: "Le Conseil de l'Europe est une organisation internationale qui siège à Strasbourg et réunit 46 États européens ; la Cour européenne des droits de l'homme en est l'organe judiciaire permanent. L'institution de l'Union qui réunit les chefs d'État ou de gouvernement est le Conseil européen. Celle qui réunit les ministres des États membres est le Conseil de l'Union européenne. L'assemblée élue au suffrage universel direct est le Parlement européen.",
    aRetenir: "Conseil de l'Europe (46 États, CEDH) ≠ Conseil européen (chefs d'État ou de gouvernement) ≠ Conseil de l'UE (ministres).",
    references: [{ texte: "Conseil de l'Europe, « Ne pas confondre »", article: "" }],
    source: "https://www.coe.int/fr/web/about-us/do-not-get-confused",
    piege: "Confondre les trois « Conseils », dont un seul est extérieur à l'Union.",
    voirAussi: ["II.B.b", "II.D.b"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  /* ===================== Bloc III ===================== */

  {
    id: "Q-III.A.1.a.04-01", bloc: "III", notion: "III.A.1.a.04", difficulte: 1, angle: "cas",
    enonce: "Pour évaluer la fiabilité d'une information trouvée en ligne, quelle démarche est la plus pertinente ?",
    choix: [
      "Identifier la source et l'auteur, regarder la date, puis vérifier si d'autres médias la confirment",
      "La retenir si elle est très partagée sur les réseaux sociaux",
      "Considérer qu'une information ancienne reste toujours valable",
      "S'y fier dès lors qu'une photo ou une vidéo l'accompagne"
    ],
    bonne: 0, ordreFixe: false,
    explication: "Pour vérifier une information, il faut chercher d'où elle vient et qui la publie, regarder sa date, puis vérifier si d'autres médias la confirment à partir d'autres sources. Un contenu très partagé sur les réseaux sociaux n'est pas vrai pour autant. Une information ancienne n'est peut-être plus exacte. Les photos et les vidéos peuvent être truquées ou sorties de leur contexte.",
    aRetenir: "Source, auteur, date, recoupement : quatre réflexes avant de croire une information.",
    references: [{ texte: "CLEMI, « Comment savoir si une information est vraie ou fausse ? »", article: "" }],
    source: "https://www.clemi.fr/sites/default/files/clemi/RepereEMI/fausses_infos_poster.pdf",
    piege: "Prendre la popularité d'un contenu pour une preuve de sa fiabilité.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-III.A.1.c.05-01", bloc: "III", notion: "III.A.1.c.05", difficulte: 2, angle: "cas",
    enonce: "À la DGFiP, à quoi sert principalement l'exploration de données (data mining) ?",
    choix: [
      "Mieux cibler les contrôles fiscaux, chaque dossier repéré étant ensuite examiné par un agent",
      "Déclencher automatiquement des redressements, sans intervention humaine",
      "Publier en données ouvertes les déclarations fiscales individuelles",
      "Calculer le taux du prélèvement à la source de chaque foyer"
    ],
    bonne: 0, ordreFixe: false,
    explication: "La DGFiP utilise l'exploration de données, fouille approfondie de données par des algorithmes, pour mieux cibler ses contrôles fiscaux : c'est la méthode d'intelligence artificielle la plus répandue dans ce domaine. Les outils produisent des listes de dossiers, qui sont toujours affectés à un agent et examinés par lui : il n'y a jamais de redressement automatique. Publier des déclarations individuelles ou calculer le prélèvement à la source ne sont pas des usages du data mining décrits par l'Assemblée nationale.",
    aRetenir: "Data mining fiscal : il cible les dossiers à contrôler, l'agent décide.",
    references: [{ texte: "Assemblée nationale, rapport d'information n° 2742 sur l'usage des nouvelles technologies dans le contrôle fiscal (6 juin 2024)", article: "" }],
    source: "https://www.assemblee-nationale.fr/dyn/16/rapports/cion_fin/l16b2742_rapport-information.pdf",
    piege: "Croire que l'algorithme décide seul du contrôle ou du redressement.",
    voirAussi: ["III.B.a"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-III.A.2.d.02-01", bloc: "III", notion: "III.A.2.d.02", difficulte: 1, angle: "cas",
    enonce: "D'après l'Insee, quelle tranche d'âge est la plus touchée par l'illectronisme en France ?",
    choix: ["Les 75 ans ou plus", "Les 15-29 ans", "Les 40-59 ans", "Les 60-74 ans"],
    bonne: 0, ordreFixe: false,
    explication: "Selon l'Insee, 15,7 % des personnes de 15 ans ou plus étaient en situation d'illectronisme en 2023. Ce taux atteint 62,2 % chez les 75 ans ou plus, de loin la tranche la plus touchée. Les 60-74 ans viennent ensuite, avec 23,4 %, puis les 40-59 ans (6,7 %) et les 15-29 ans (2,7 %).",
    aRetenir: "Illectronisme : 15,7 % des 15 ans ou plus en 2023, mais 62,2 % des 75 ans ou plus.",
    references: [{ texte: "Insee, « Compétences numériques de la population », octobre 2025 (données 2023)", article: "" }],
    source: "https://www.insee.fr/fr/statistiques/8616801",
    piege: "Répondre « 60-74 ans » : ils suivent, mais loin derrière les 75 ans ou plus.",
    voirAussi: ["III.B.b"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-III.A.4.a.03-01", bloc: "III", notion: "III.A.4.a.03", difficulte: 1, angle: "definition",
    enonce: "Pourquoi faut-il installer les mises à jour de ses appareils et logiciels dès qu'elles sont disponibles ?",
    choix: [
      "Elles corrigent des failles de sécurité que des cybercriminels pourraient exploiter",
      "Elles rendent l'antivirus inutile",
      "Elles n'apportent que de nouvelles fonctionnalités, sans effet sur la sécurité",
      "Elles ne servent que sur les ordinateurs, pas sur les téléphones"
    ],
    bonne: 0, ordreFixe: false,
    explication: "Les failles de sécurité peuvent permettre à des cybercriminels de prendre le contrôle d'un équipement ou de voler des données ; les éditeurs et fabricants publient des mises à jour pour les corriger, d'où l'importance de les installer dès qu'elles sont disponibles. Elles ne remplacent pas les autres protections comme l'antivirus. Elles ne se limitent pas aux nouvelles fonctionnalités. Elles concernent tous les équipements, téléphones compris.",
    aRetenir: "Une mise à jour de sécurité ferme une faille : l'installer vite, depuis le site officiel de l'éditeur.",
    references: [{ texte: "Cybermalveillance.gouv.fr, fiche « Les mises à jour »", article: "" }],
    source: "https://www.cybermalveillance.gouv.fr/medias/2020/04/fiche_mises_a_jour.pdf",
    piege: "Repousser les mises à jour en les croyant purement fonctionnelles.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-III.A.4.b.01-01", bloc: "III", notion: "III.A.4.b.01", difficulte: 2, angle: "distinction",
    enonce: "Sur un site marchand, lequel de ces traceurs (cookies) peut être déposé sans le consentement de l'internaute ?",
    choix: [
      "Un traceur qui conserve le contenu du panier d'achat",
      "Un traceur qui affiche de la publicité personnalisée",
      "Un traceur lié au bouton de partage d'un réseau social",
      "Un traceur qui affiche de la publicité non personnalisée"
    ],
    bonne: 0, ordreFixe: false,
    explication: "La CNIL dispense de consentement les traceurs strictement nécessaires au service demandé, comme ceux qui conservent un panier d'achat ou permettent l'authentification. Les traceurs liés à l'affichage de publicité, qu'elle soit personnalisée ou non, exigent un consentement préalable. Il en va de même des traceurs liés aux fonctionnalités de partage sur les réseaux sociaux.",
    aRetenir: "Sans consentement : seulement les traceurs strictement nécessaires (panier, authentification, choix de langue) et certaines mesures d'audience encadrées.",
    references: [{ texte: "CNIL, « Cookies et traceurs : comment mettre mon site web en conformité ? »", article: "" }],
    source: "https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite",
    piege: "Croire que la publicité non personnalisée échappe au consentement.",
    voirAussi: ["III.C.a"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-III.A.4.c.01-01", bloc: "III", notion: "III.A.4.c.01", difficulte: 2, angle: "cas",
    enonce: "Selon l'évaluation de l'ADEME et de l'Arcep publiée en janvier 2025, quelle part de l'empreinte carbone de la France le numérique représentait-il en 2022 ?",
    choix: ["0,4 %", "4,4 %", "14 %", "44 %"],
    bonne: 1, ordreFixe: true,
    explication: "L'étude ADEME-Arcep mise à jour en janvier 2025 évalue l'empreinte carbone du numérique à 29,5 millions de tonnes équivalent CO2 en 2022, soit 4,4 % de l'empreinte carbone de la France. Par équipement, les terminaux en représentent environ 50 %, les centres de données environ 46 % et les réseaux environ 4 %. Par étape, environ 60 % provient de la fabrication, de la distribution et de la fin de vie des équipements, et environ 40 % de leur utilisation. Les valeurs de 0,4 %, 14 % et 44 % ne correspondent pas à cette évaluation.",
    aRetenir: "Numérique : 4,4 % de l'empreinte carbone française (2022) ; environ 60 % vient de la fabrication des équipements.",
    references: [{ texte: "ADEME-Arcep, « Évaluation de l'impact environnemental du numérique en France », janvier 2025", article: "" }],
    source: "https://ecoresponsable.numerique.gouv.fr/docs/2024/etude-ademe-impacts-environnementaux-numerique.pdf",
    piege: "Croire que l'essentiel de l'empreinte vient de la phase d'utilisation (environ 40 %), alors qu'environ 60 % provient de la fabrication, de la distribution et de la fin de vie des équipements.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-III.B.a.02-01", bloc: "III", notion: "III.B.a.02", difficulte: 2, angle: "chronologie",
    enonce: "Quel texte a posé en 2016 le principe d'ouverture par défaut des données publiques (« open data par défaut ») ?",
    choix: [
      "La loi pour une République numérique",
      "La loi Informatique et libertés",
      "Le règlement général sur la protection des données",
      "Le règlement européen sur l'intelligence artificielle"
    ],
    bonne: 0, ordreFixe: false,
    explication: "La loi pour une République numérique du 7 octobre 2016 a posé le principe d'open data par défaut ; le Gouvernement y voit un renversement juridique, car la mise en ligne devient la règle et non plus l'exception. La loi Informatique et libertés date du 6 janvier 1978 et a créé la CNIL. Le RGPD protège les données personnelles. Le règlement européen sur l'intelligence artificielle encadre les systèmes d'IA. Aucun de ces trois textes n'a posé l'ouverture par défaut des données publiques.",
    aRetenir: "Open data par défaut : loi pour une République numérique (loi Lemaire) du 7 octobre 2016.",
    references: [{ texte: "Loi du 7 octobre 2016 pour une République numérique", article: "" }, { texte: "Réponse ministérielle à la question écrite n° 5506, JO AN du 5 juin 2018, p. 4822", article: "" }],
    source: "https://questions.assemblee-nationale.fr/dyn/15/questions/QANR5L15QE5506.pdf",
    piege: "Confondre l'ouverture des données publiques avec la protection des données personnelles.",
    voirAussi: ["III.B.b"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-III.B.b.01-01", bloc: "III", notion: "III.B.b.01", difficulte: 1, angle: "competence",
    enonce: "Quel service du Premier ministre, rattaché au SGDSN, est l'autorité nationale chargée d'accompagner et de sécuriser le développement du numérique, et de réagir aux attaques informatiques ?",
    choix: [
      "L'Agence nationale de la sécurité des systèmes d'information (ANSSI)",
      "La Commission nationale de l'informatique et des libertés (CNIL)",
      "L'Autorité de régulation de la communication audiovisuelle et numérique (Arcom)",
      "La Direction interministérielle du numérique (DINUM)"
    ],
    bonne: 0, ordreFixe: false,
    explication: "L'ANSSI est un service du Premier ministre rattaché au Secrétariat général de la défense et de la sécurité nationale (SGDSN). Elle est l'autorité nationale chargée d'accompagner et de sécuriser le développement du numérique ; elle assure la veille, la détection, l'alerte et la réaction face aux attaques informatiques. La CNIL veille à la protection des données personnelles. L'Arcom régule la communication audiovisuelle et numérique. La DINUM conduit la transformation numérique de l'État.",
    aRetenir: "Cybersécurité de l'État : ANSSI (SGDSN) ; données personnelles : CNIL.",
    references: [{ texte: "Fiche de l'ANSSI sur data.gouv.fr", article: "" }],
    source: "https://www.data.gouv.fr/organizations/5aaa439dc751df5dd457fc62/",
    piege: "Attribuer la cybersécurité à la CNIL, compétente pour les données personnelles.",
    voirAussi: ["III.A.4.a"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-III.C.a.02-01", bloc: "III", notion: "III.C.a.02", difficulte: 1, angle: "definition",
    enonce: "Quel principe du RGPD impose que les données personnelles soient adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités du traitement ?",
    choix: [
      "La minimisation des données",
      "La limitation de la conservation",
      "L'exactitude des données",
      "La portabilité des données"
    ],
    bonne: 0, ordreFixe: false,
    explication: "L'article 5, paragraphe 1, point c), du RGPD exige que les données soient adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités : c'est le principe de minimisation. La limitation de la conservation porte sur la durée pendant laquelle les données sont gardées. L'exactitude impose des données exactes et tenues à jour. La portabilité est un droit de la personne concernée, et non un principe de l'article 5.",
    aRetenir: "Minimisation : ne collecter que les données nécessaires à la finalité.",
    references: [{ texte: "Règlement (UE) 2016/679 (RGPD)", article: "art. 5, § 1, c)" }],
    source: "https://edps.europa.eu/data-protection/data-protection/glossary/m_fr",
    piege: "Ranger la portabilité parmi les principes de l'article 5 : c'est un droit des personnes.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-III.C.b.01-01", bloc: "III", notion: "III.C.b.01", difficulte: 1, angle: "chronologie",
    enonce: "En quelle année a été adoptée la loi Informatique et libertés, qui a créé la CNIL ?",
    choix: ["1958", "1978", "2001", "2016"],
    bonne: 1, ordreFixe: true,
    explication: "La CNIL a été créée par la loi Informatique et libertés du 6 janvier 1978. 1958 est l'année de la Constitution de la Ve République. 2001 est celle de la LOLF, du 1er août 2001. 2016 est l'année de la loi pour une République numérique.",
    aRetenir: "Loi Informatique et libertés : 6 janvier 1978, création de la CNIL.",
    references: [{ texte: "Loi du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés", article: "" }],
    source: "https://www.info.gouv.fr/organisation/commission-nationale-de-l-informatique-et-des-libertes-cnil",
    piege: "Dater la loi de l'arrivée du RGPD, alors qu'elle est bien plus ancienne.",
    voirAussi: ["III.C.a"],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  /* ===================== Bloc V ===================== */

  {
    id: "Q-V.1-01", bloc: "V", notion: "V.1", difficulte: 1, angle: "definition",
    enonce: "Choisissez la traduction correcte : « Le gouvernement a annoncé de nouvelles mesures. »",
    choix: [
      "The government has announced new measures.",
      "The governement has announced new measures.",
      "The government has anounced new measures.",
      "The government has announced news measures."
    ],
    bonne: 0, ordreFixe: false,
    explication: "« Government » s'écrit sans « e » après « govern » (ce n'est pas le français « gouvernement »). « Announce » prend deux « n ». « New » est l'adjectif « nouveau » ; « news » est le nom « les nouvelles, les informations », qui ne peut pas qualifier « measures ». « Measures » désigne ici des mesures officielles prises pour atteindre un objectif.",
    aRetenir: "government (sans e), announce (deux n), new (adjectif) ≠ news (nom).",
    references: [{ texte: "Oxford Learner's Dictionaries, entrées « government », « announce », « measure »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/government",
    piege: "Calquer l'orthographe française « gouvernement » et confondre « new » avec « news ».",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.2-01", bloc: "V", notion: "V.2", difficulte: 1, angle: "definition",
    enonce: "Complétez : « The final price depends ___ the quantity ordered. »",
    choix: ["on", "of", "from", "at"],
    bonne: 0, ordreFixe: false,
    explication: "On dit « depend on something », au sens de « être influencé ou déterminé par quelque chose ». « Depend of » est un calque fautif du français « dépendre de ». « Depend from » et « depend at » ne s'emploient pas dans ce sens.",
    aRetenir: "depend on (ou upon), jamais « depend of ».",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « depend on »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/us/definition/english/depend-on",
    piege: "Traduire mot à mot « dépendre de » par « depend of ».",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.3-01", bloc: "V", notion: "V.3", difficulte: 2, angle: "distinction",
    enonce: "Dans la phrase « The meeting has been postponed until next Monday », quel verbe a le sens le plus proche de « postponed » ?",
    choix: ["put off", "called off", "brought forward", "set up"],
    bonne: 0, ordreFixe: false,
    explication: "« To postpone » signifie reporter à plus tard ; « to put something off » a le même sens : changer quelque chose pour une date ou une heure plus tardive. « To call something off » signifie annuler. « To bring something forward » signifie avancer à une date plus proche, soit le sens inverse. « To set something up » signifie organiser ou créer.",
    aRetenir: "put off = postpone (reporter) ; call off = cancel (annuler) ; bring forward = avancer.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrées « put off », « call off », « bring forward », « set up »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/put-off",
    piege: "Confondre « put off » (reporter) et « call off » (annuler).",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.4-01", bloc: "V", notion: "V.4", difficulte: 2, angle: "distinction",
    enonce: "Quelle phrase est correcte ?",
    choix: [
      "I saw that film last week.",
      "I have seen that film last week.",
      "I have saw that film last week.",
      "I seen that film last week."
    ],
    bonne: 0, ordreFixe: false,
    explication: "Quand on dit à quel moment passé l'action a eu lieu, par exemple avec « last week », on emploie le prétérit (past simple) : « I saw ». Le present perfect « I have seen » ne se combine pas avec une indication de temps passé et terminé. « Have saw » est faux, car le present perfect se construit avec le participe passé « seen ». « I seen » est faux, car le participe passé ne s'emploie pas seul, sans auxiliaire.",
    aRetenir: "Moment passé précisé (yesterday, last week, in 2020) → past simple, jamais present perfect.",
    references: [{ texte: "British Council, LearnEnglish, « Present perfect »", article: "" }],
    source: "https://learnenglish.britishcouncil.org/grammar/b1-b2-grammar/present-perfect?page=21",
    piege: "Calquer le passé composé français (« j'ai vu ») sur le present perfect anglais.",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  },

  {
    id: "Q-V.5-01", bloc: "V", notion: "V.5", difficulte: 1, angle: "definition",
    enonce: "Dans la phrase « The negotiations eventually succeeded », que signifie « eventually » ?",
    choix: ["Finalement", "Éventuellement", "Actuellement", "Probablement"],
    bonne: 0, ordreFixe: false,
    explication: "« Eventually » signifie « au bout d'un certain temps, après une série d'événements », c'est-à-dire « finalement ». C'est un faux ami : « éventuellement » se traduit par « possibly » ou « perhaps ». « Actuellement » se traduit par « currently », et « probablement » par « probably ».",
    aRetenir: "eventually = finalement ; éventuellement = possibly.",
    references: [{ texte: "Oxford Learner's Dictionaries, entrée « eventually »", article: "" }],
    source: "https://www.oxfordlearnersdictionaries.com/definition/english/eventually",
    piege: "Se laisser tromper par la ressemblance avec « éventuellement ».",
    voirAussi: [],
    nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
  }

], { lot: "00-demarrage" });
