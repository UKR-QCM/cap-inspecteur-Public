/*
 * Cap Inspecteur — référentiel du programme
 *
 * Source : programme officiel du QCM de l'épreuve écrite n° 2 d'admissibilité
 * (PDF « Programme_concours_QCM.pdf »). Les libellés des lignes reprennent le PDF
 * mot pour mot, y compris ses coquilles (voir `noteTranscription`).
 *
 * Blocs IV et V : le PDF ne donne qu'une description générale ; le découpage en
 * familles est un référentiel personnel, révisable.
 *
 * Identifiants stables, jamais réutilisés :
 *   ligne   I.C.1.a
 *   notion  I.C.1.a.03
 *   famille IV.G1, IV.R3, V.2
 *
 * Script classique : aucune dépendance, aucun accès au DOM.
 */
(function (racine) {
  "use strict";
  var CI = racine.CI = racine.CI || {};

  /* Notion centrale : critères S = thème interrogé dans le sujet 2026,
     P = notion pivot dont dépendent d'autres notions,
     I = notion indispensable pour comprendre la ligne. */
  function C(criteres, texte) {
    return { criteres: criteres.split(""), texte: texte };
  }

  var BLOCS = [
    { id: "I", libelle: "Environnement administratif, économique et financier", questionsEpreuve: 10 },
    { id: "II", libelle: "L’Union européenne", questionsEpreuve: 10 },
    { id: "III", libelle: "Culture numérique", questionsEpreuve: 10 },
    { id: "IV", libelle: "Raisonnement et logique", questionsEpreuve: 10,
      descriptionOfficielle: "Ensemble de questions destinées à évaluer les capacités du candidat à analyser des données et à conduire un raisonnement déductif" },
    { id: "V", libelle: "Anglais", questionsEpreuve: 5,
      descriptionOfficielle: "Anglais du niveau B1 du cadre européen de référence pour les langues (CECRL) : orthographe, grammaire, conjugaison, vocabulaire" }
  ];

  /* Compétences du CRCN (décret n° 2019-919 du 30 août 2019) exclues du programme. */
  var CRCN_EXCLUES = [
    { id: "3.3", libelle: "Adapter les documents à leur finalité" },
    { id: "3.4", libelle: "Programmer" },
    { id: "5.1", libelle: "Résoudre des problèmes techniques" },
    { id: "5.2", libelle: "Construire un environnement numérique (intitulé du BO n° 37 du 10 octobre 2019 : « Évoluer dans un environnement numérique »)" }
  ];

  /* [id, libellé exact du PDF, thème, sous-thème, compétence CRCN] */
  var LIGNES = [
    ["I.A.a", "La Constitution, la hiérarchie des normes", "A. Les institutions françaises", ""],
    ["I.A.b", "Le Conseil constitutionnel", "A. Les institutions françaises", ""],
    ["I.A.c", "Le pouvoir exécutif, législatif et judiciaire", "A. Les institutions françaises", ""],
    ["I.B.1.a", "L’administration centrale", "B. Les institutions administratives", "1° L’organisation administrative de la France"],
    ["I.B.1.b", "Les autorités indépendantes et organes centraux de conseil et de contrôle", "B. Les institutions administratives", "1° L’organisation administrative de la France"],
    ["I.B.1.c", "L’administration territoriale de l’État et déconcentration", "B. Les institutions administratives", "1° L’organisation administrative de la France"],
    ["I.B.1.d", "Les juridictions administratives", "B. Les institutions administratives", "1° L’organisation administrative de la France"],
    ["I.B.1.e", "La réforme de l’État depuis 20 ans", "B. Les institutions administratives", "1° L’organisation administrative de la France"],
    ["I.B.1.f", "Les droits et obligations des fonctionnaires", "B. Les institutions administratives", "1° L’organisation administrative de la France"],
    ["I.B.2.a", "La libre administration des collectivités territoriales et la décentralisation", "B. Les institutions administratives", "2° Les collectivités territoriales"],
    ["I.B.2.b", "Les formes de collectivités territoriales et de coopération intercommunale et leurs attributions", "B. Les institutions administratives", "2° Les collectivités territoriales"],
    ["I.B.2.c", "Les contrôles sur les collectivités territoriales", "B. Les institutions administratives", "2° Les collectivités territoriales"],
    ["I.B.2.d", "La réforme des collectivités territoriales depuis 2014", "B. Les institutions administratives", "2° Les collectivités territoriales"],
    ["I.B.2.e", "Les élus locaux et les élections locales", "B. Les institutions administratives", "2° Les collectivités territoriales"],
    ["I.C.1.a", "Les différentes catégories de loi de finances", "C. Le budget de l’État", "1° Les lois de finances"],
    ["I.C.1.b", "La loi organique relative aux lois de finances du 1er août 2001", "C. Le budget de l’État", "1° Les lois de finances"],
    ["I.C.1.c", "La loi de finances et la loi de programmation des finances publiques", "C. Le budget de l’État", "1° Les lois de finances"],
    ["I.C.1.d", "Contenu et structure des lois de finances", "C. Le budget de l’État", "1° Les lois de finances"],
    ["I.C.1.e", "Exécution et contrôle des lois de finances", "C. Le budget de l’État", "1° Les lois de finances"],
    ["I.C.2.a", "Les différentes ressources fiscales de l’État", "C. Le budget de l’État", "2° Les ressources et dépenses de l’État"],
    ["I.C.2.b", "Les ressources d’emprunt", "C. Le budget de l’État", "2° Les ressources et dépenses de l’État"],
    ["I.C.2.c", "Les autres ressources", "C. Le budget de l’État", "2° Les ressources et dépenses de l’État"],
    ["I.C.2.d", "La nouvelle architecture budgétaire par missions et par programmes", "C. Le budget de l’État", "2° Les ressources et dépenses de l’État"],
    ["I.C.3.a", "Les principes budgétaires", "C. Le budget de l’État", "3° Principes et gestion budgétaire"],
    ["I.C.3.b", "Le déficit", "C. Le budget de l’État", "3° Principes et gestion budgétaire"],
    ["I.C.3.c", "L’emprunt", "C. Le budget de l’État", "3° Principes et gestion budgétaire"],
    ["I.C.3.d", "La dette", "C. Le budget de l’État", "3° Principes et gestion budgétaire"],

    ["II.A.a", "Les traités", "A. Les grandes étapes de la construction européenne et les différents élargissements", ""],
    ["II.A.b", "Les Etats membres", "A. Les grandes étapes de la construction européenne et les différents élargissements", ""],
    ["II.B.a", "Adhésion et retrait de l’Union européenne", "B. Les aspects institutionnels et financiers de l’Union européenne", ""],
    ["II.B.b", "Composition et attributions des institutions l’Union européenne", "B. Les aspects institutionnels et financiers de l’Union européenne", ""],
    ["II.B.c", "Processus décisionnels au sein des institutions de l’Union européenne et rôle des parlements nationaux", "B. Les aspects institutionnels et financiers de l’Union européenne", ""],
    ["II.B.d", "Principes généraux du budget de l’Union européenne et de la contribution financière des Etats membres", "B. Les aspects institutionnels et financiers de l’Union européenne", ""],
    ["II.C.a", "Les libertés de circulation", "C. Les principales politiques", ""],
    ["II.C.b", "La politique agricole commune", "C. Les principales politiques", ""],
    ["II.C.c", "La politique régionale", "C. Les principales politiques", ""],
    ["II.C.d", "La politique commerciale commune", "C. Les principales politiques", ""],
    ["II.C.e", "La politique économique et monétaire", "C. Les principales politiques", ""],
    ["II.C.f", "La politique étrangère et de sécurité commune", "C. Les principales politiques", ""],
    ["II.C.g", "La politique sociale", "C. Les principales politiques", ""],
    ["II.D.a", "Les valeurs de l’Union européenne et leur protection", "D. La protection des droits fondamentaux", ""],
    ["II.D.b", "La Charte des droits fondamentaux de l’Union européenne et la Cour de justice de l’Union européenne", "D. La protection des droits fondamentaux", ""],
    ["II.D.c", "La Convention européenne de sauvegarde des droits de l’homme et des libertés fondamentales et la Cour européenne des droits de l’homme", "D. La protection des droits fondamentaux", ""],

    ["III.A.1.a", "Mener une recherche et une veille d’information", "A. Le socle de compétence numérique", "1° Information et données", "1.1"],
    ["III.A.1.b", "Gérer des données", "A. Le socle de compétence numérique", "1° Information et données", "1.2"],
    ["III.A.1.c", "Traiter des données", "A. Le socle de compétence numérique", "1° Information et données", "1.3"],
    ["III.A.2.a", "Interagir", "A. Le socle de compétence numérique", "2° Communication et collaboration", "2.1"],
    ["III.A.2.b", "Partager et publier", "A. Le socle de compétence numérique", "2° Communication et collaboration", "2.2"],
    ["III.A.2.c", "Collaborer", "A. Le socle de compétence numérique", "2° Communication et collaboration", "2.3"],
    ["III.A.2.d", "S’insérer dans le monde numérique", "A. Le socle de compétence numérique", "2° Communication et collaboration", "2.4"],
    ["III.A.3.a", "Développer des documents textuels", "A. Le socle de compétence numérique", "3° Créations de contenus", "3.1"],
    ["III.A.3.b", "Développer des documents multimédias", "A. Le socle de compétence numérique", "3° Créations de contenus", "3.2"],
    ["III.A.4.a", "Sécuriser l’environnement numérique", "A. Le socle de compétence numérique", "4° Protection et sécurité", "4.1"],
    ["III.A.4.b", "Protéger les données personnelles et la vie privée", "A. Le socle de compétence numérique", "4° Protection et sécurité", "4.2"],
    ["III.A.4.c", "Protéger la santé, le bien-être et l’environnement", "A. Le socle de compétence numérique", "4° Protection et sécurité", "4.3"],
    ["III.B.a", "Les notions de services en ligne, d’ouverture des données (« open data »), de mégadonnées (« big data »), de nuage (« cloud ») et d’intelligence artificielle", "B. Les enjeux et les politiques de l’administration numérique", ""],
    ["III.B.b", "Les politiques publiques du numérique", "B. Les enjeux et les politiques de l’administration numérique", ""],
    ["III.B.c", "La dématérialisation des rapports entre le public et l’administration", "B. Les enjeux et les politiques de l’administration numérique", ""],
    ["III.C.a", "Le règlement général sur la protection des données", "C. La réglementation de l’administration numérique", ""],
    ["III.C.b", "La loi informatique et libertés", "C. La réglementation de l’administration numérique", ""]
  ];

  var NOTES_TRANSCRIPTION = {
    "II.A.b": "Libellé du PDF sans accent : « Etats ».",
    "II.B.b": "Coquille du PDF : « des institutions l’Union européenne » (il manque « de »).",
    "II.B.d": "Libellé du PDF sans accent : « Etats ».",
    "I.B.1.e": "Fenêtre retenue pour « depuis 20 ans » : de 2006 au jour de rédaction (choix du référentiel, absent du PDF)."
  };

  /* Notions : [numéro, libellé, ce que la notion couvre, centrale (C(...) ou null), voirAussi] */
  var NOTIONS = {
    /* ---------- I.A Les institutions françaises ---------- */
    "I.A.a": [
      ["01", "La Constitution de 1958 et le bloc de constitutionnalité", "Élaboration et adoption de la Constitution de 1958, sa structure en titres, son préambule et les textes auxquels il renvoie (Déclaration de 1789, Préambule de 1946, Charte de l’environnement).", null],
      ["02", "La hiérarchie des normes", "Le rang respectif de la Constitution, des traités et du droit de l’Union, des lois organiques et ordinaires, des ordonnances, des règlements et des actes administratifs, et les contrôles qui la garantissent.",
        C("P", "Pivot : la hiérarchie des normes conditionne le contrôle de constitutionnalité, la place du droit de l’Union et le domaine de la loi."), ["II.D.b"]],
      ["03", "Le domaine de la loi et le domaine du règlement", "La répartition des articles 34 et 37, le pouvoir réglementaire autonome et d’application, les ordonnances de l’article 38 et leur ratification.", null],
      ["04", "La révision de la Constitution et le référendum", "La procédure de révision de l’article 89 (Congrès ou référendum), ses limites, le référendum législatif de l’article 11 et le référendum d’initiative partagée.", null],
      ["05", "Les principes fondamentaux de la République et ses symboles", "Les caractères de la République énoncés à l’article 1er (indivisible, laïque, démocratique, sociale), la souveraineté nationale, la langue, l’emblème, l’hymne, la devise et le principe de la République (article 2).",
        C("S", "Sujet 2026 (Q6) : principes fondamentaux de la République."), ["II.D.a"]]
    ],
    "I.A.b": [
      ["01", "Composition et organisation du Conseil constitutionnel", "Les membres nommés et les membres de droit, les autorités de nomination, la durée et le renouvellement des mandats, la présidence et les incompatibilités.", null],
      ["02", "Le contrôle de constitutionnalité des lois", "Le contrôle a priori de l’article 61 (lois organiques, règlements des assemblées, lois ordinaires, traités) et les autorités qui peuvent saisir le Conseil, distingué du contrôle a posteriori.",
        C("P", "Pivot : fonde la QPC, la hiérarchie des normes et la portée des décisions du Conseil.")],
      ["03", "La question prioritaire de constitutionnalité", "La procédure de l’article 61-1 : droits et libertés invocables, double filtre du Conseil d’État et de la Cour de cassation, délais, effets de l’abrogation.", null],
      ["04", "Les autres attributions et la portée des décisions", "Le juge électoral et du référendum, l’avis sur l’article 16, la constatation de l’empêchement, l’autorité des décisions (article 62) et les réserves d’interprétation.", null]
    ],
    "I.A.c": [
      ["01", "Le Président de la République", "Mode d’élection, durée et nombre des mandats, pouvoirs propres dispensés de contreseing (nomination du Premier ministre, dissolution, article 16, référendum, saisine du Conseil constitutionnel) et responsabilité.",
        C("I", "Indispensable : la répartition des pouvoirs exécutifs de la Ve République s’articule autour de la fonction présidentielle.")],
      ["02", "Le Gouvernement et le Premier ministre", "Composition et formation du Gouvernement, rôle du Premier ministre (direction de l’action du Gouvernement, pouvoir réglementaire), contreseing, incompatibilités.", null],
      ["03", "Le Parlement : Assemblée nationale et Sénat", "Le bicamérisme, la composition et le mode d’élection de chaque assemblée, la durée des mandats, la représentation des collectivités par le Sénat et les missions du Parlement (article 24).",
        C("S", "Sujet 2026 (Q2) : rôle du Sénat au titre de l’article 24 de la Constitution.")],
      ["04", "La procédure législative", "Initiative (projets et propositions), examen en commission, navette, commission mixte paritaire, dernier mot de l’Assemblée nationale, promulgation.", null],
      ["05", "Le contrôle du Gouvernement par le Parlement", "Responsabilité gouvernementale : question de confiance, motion de censure, article 49 alinéa 3, questions au Gouvernement, commissions d’enquête, évaluation des politiques publiques.", null],
      ["06", "L’autorité judiciaire et l’organisation des juridictions judiciaires", "Le titre VIII de la Constitution (indépendance, Conseil supérieur de la magistrature, garde des libertés individuelles), les juridictions judiciaires de première instance, d’appel et la Cour de cassation.", null, ["I.B.1.d"]]
    ],

    /* ---------- I.B.1 L'organisation administrative de la France ---------- */
    "I.B.1.a": [
      ["01", "L’organisation d’un ministère", "Le ministre et son cabinet, le secrétariat général, les directions générales et directions d’administration centrale, la distinction entre administration centrale et services déconcentrés.", null],
      ["02", "Les services du Premier ministre", "Les services rattachés au Premier ministre pour la coordination interministérielle : Secrétariat général du Gouvernement, Secrétariat général de la défense et de la sécurité nationale, autres services interministériels.", null],
      ["03", "Les ministères économiques et financiers et la DGFiP", "L’organisation des ministères économiques et financiers, la création de la DGFiP par fusion de la DGI et de la DGCP, ses missions, les services à compétence nationale et les opérateurs.", null, ["I.B.1.e"]]
    ],
    "I.B.1.b": [
      ["01", "Les autorités administratives et publiques indépendantes", "Définition et raison d’être des AAI et API, différence entre les deux (personnalité morale), statut général fixé par la loi, garanties d’indépendance et exemples.",
        C("I", "Indispensable : catégorie juridique qui structure toute la ligne.")],
      ["02", "Le Défenseur des droits", "Autorité constitutionnelle indépendante (article 71-1) : domaines de compétence, modes de saisine, pouvoirs, nomination.", null],
      ["03", "Les organes centraux de conseil", "Le Conseil d’État dans sa fonction consultative (avis sur les projets de loi et de décret) et le Conseil économique, social et environnemental (composition, saisine, rôle).", null, ["I.B.1.d"]],
      ["04", "La Cour des comptes", "Statut et missions de la Cour : contrôle des comptes et de la gestion, certification des comptes de l’État, assistance au Parlement et au Gouvernement, évaluation des politiques publiques.", null, ["I.C.1.e"]],
      ["05", "Les corps d’inspection et de contrôle", "Les inspections générales interministérielles et ministérielles (dont l’Inspection générale des finances), leurs missions d’audit, de contrôle et d’évaluation.", null]
    ],
    "I.B.1.c": [
      ["01", "Déconcentration et décentralisation", "Distinction entre la déconcentration (répartition des pouvoirs au sein de l’État) et la décentralisation (transfert à des collectivités dotées de la personnalité morale), pouvoir hiérarchique et contrôle de légalité.",
        C("P", "Pivot : distinction préalable à toute la partie collectivités territoriales et administration territoriale."), ["I.B.2.a"]],
      ["02", "Le préfet", "Le représentant de l’État dans le département et la région (article 72) : nomination, attributions, autorité sur les services déconcentrés, ordre public, contrôle administratif.", null],
      ["03", "Les services déconcentrés de l’État", "Directions régionales et départementales (dont les directions départementales interministérielles et les directions des finances publiques), sous-préfectures et répartition des rôles entre niveau régional et départemental.", null],
      ["04", "Les réformes de l’organisation territoriale de l’État", "La réforme de l’administration territoriale de l’État (RéATE), la charte de la déconcentration, la primauté du niveau régional et les réorganisations récentes.", null, ["I.B.1.e"]]
    ],
    "I.B.1.d": [
      ["01", "L’organisation de la juridiction administrative", "Les trois degrés : tribunaux administratifs, cours administratives d’appel et Conseil d’État, leurs compétences respectives et le juge de droit commun en premier ressort.",
        C("I", "Indispensable : socle de la ligne, dont dépendent les recours et le rôle du Conseil d’État.")],
      ["02", "Le Conseil d’État juge", "Compétences en premier et dernier ressort, en appel et en cassation ; distinction avec sa fonction consultative.", null, ["I.B.1.b"]],
      ["03", "Les recours et les procédures d’urgence", "Recours pour excès de pouvoir et recours de plein contentieux, délais de recours, référé-suspension et référé-liberté.", null],
      ["04", "Le dualisme juridictionnel et le Tribunal des conflits", "Séparation des ordres administratif et judiciaire, critères de compétence, rôle du Tribunal des conflits.", null],
      ["05", "Les juridictions administratives spécialisées", "Juridictions financières (Cour des comptes, chambres régionales et territoriales des comptes), Cour nationale du droit d’asile et autres juridictions spécialisées soumises au contrôle de cassation du Conseil d’État.", null, ["I.B.2.c"]]
    ],
    "I.B.1.e": [
      ["01", "De la RGPP à la transformation de l’action publique", "Chronologie des démarches de réforme : révision générale des politiques publiques, modernisation de l’action publique, programme Action publique 2022 et politique de transformation publique.", null],
      ["02", "La réforme de la haute fonction publique", "La réforme de 2021 : création de l’Institut national du service public, corps des administrateurs de l’État, délégation interministérielle à l’encadrement supérieur.", null, ["I.B.1.f"]],
      ["03", "La relation de confiance avec l’usager", "La loi pour un État au service d’une société de confiance (2018) : droit à l’erreur, droit au contrôle, rescrit, et mesures de simplification administrative.", null, ["III.B.c"]],
      ["04", "La proximité des services publics", "Le réseau France services, la relocalisation de services et la réorganisation du réseau territorial des administrations, dont celui de la DGFiP.", null, ["III.B.b"]]
    ],
    "I.B.1.f": [
      ["01", "Le Code général de la fonction publique", "Le code en vigueur depuis 2022 (qui remplace notamment la loi de 1983 portant droits et obligations), les trois versants de la fonction publique, les catégories A, B et C, fonctionnaires et contractuels.",
        C("PI", "Pivot et domaine réformé : base légale de tous les droits et obligations des agents.")],
      ["02", "Les droits des fonctionnaires", "Liberté d’opinion et non-discrimination, droit syndical, droit de grève, droit à la formation, droit à rémunération, protection fonctionnelle.", null],
      ["03", "Les obligations de neutralité, de probité et d’obéissance", "Neutralité et laïcité, dignité, impartialité, intégrité, probité, obéissance hiérarchique et ses limites, obligation de servir.", null],
      ["04", "Le secret et la discrétion professionnels", "Distinction entre secret professionnel et discrétion professionnelle, obligation d’information du public, exceptions et sanctions.",
        C("S", "Sujet 2026 (Q3) : obligation de confidentialité des informations sur les usagers.")],
      ["05", "La déontologie et la prévention des conflits d’intérêts", "Conflits d’intérêts, cumul d’activités, référent déontologue, déclarations, contrôle des départs vers le secteur privé.", null],
      ["06", "Le régime disciplinaire", "La faute disciplinaire, l’échelle des sanctions par groupes, le conseil de discipline et les garanties de procédure.", null]
    ],

    /* ---------- I.B.2 Les collectivités territoriales ---------- */
    "I.B.2.a": [
      ["01", "Le principe de libre administration", "Sa consécration constitutionnelle (article 72), ses conditions (conseils élus, attributions effectives, pouvoir réglementaire) et ses limites.",
        C("S", "Sujet 2026 (Q9) : statut juridique de la libre administration des collectivités.")],
      ["02", "Les étapes de la décentralisation", "Les lois de 1982-1983, la révision constitutionnelle de 2003 et l’organisation décentralisée de la République, les réformes ultérieures jusqu’à la loi 3DS.", null, ["I.B.2.d"]],
      ["03", "L’autonomie financière des collectivités", "Les garanties de l’article 72-2 : libre emploi des ressources, part déterminante des ressources propres, compensation des transferts de compétences, péréquation.", null, ["I.C.2.c"]],
      ["04", "Subsidiarité, expérimentation et démocratie locale", "Le principe de subsidiarité, l’interdiction de la tutelle d’une collectivité sur une autre, le chef de filat, l’expérimentation, le droit de pétition et le référendum local.", null]
    ],
    "I.B.2.b": [
      ["01", "Les catégories de collectivités territoriales", "Les catégories prévues par l’article 72 : communes, départements, régions, collectivités à statut particulier et collectivités d’outre-mer, création par la loi.",
        C("P", "Pivot : préalable à l’étude des compétences et de l’intercommunalité.")],
      ["02", "La commune et le maire", "Compétences de la commune, double qualité du maire (exécutif local et agent de l’État : état civil, police administrative), organes communaux.", null],
      ["03", "Le département", "Compétences du département (action sociale, collèges, routes départementales, solidarité territoriale) et la fin de la clause générale de compétence.", null],
      ["04", "La région", "Compétences de la région (développement économique, lycées, transports, formation professionnelle, aménagement et schémas régionaux).", null],
      ["05", "L’intercommunalité", "Les EPCI à fiscalité propre (communautés de communes, d’agglomération, urbaines, métropoles) et sans fiscalité propre (syndicats), principes de spécialité et d’exclusivité, compétences obligatoires.",
        C("I", "Indispensable : l’intercommunalité est devenue un échelon central de l’action locale.")],
      ["06", "Les collectivités à statut particulier et l’outre-mer", "Paris, la métropole de Lyon, la Corse, les collectivités uniques de Guyane et de Martinique, les départements et régions d’outre-mer, les collectivités d’outre-mer et la Nouvelle-Calédonie.", null]
    ],
    "I.B.2.c": [
      ["01", "Le contrôle de légalité", "Transmission des actes au préfet, actes soumis à transmission, déféré préfectoral, recours et lettre d’observations.",
        C("I", "Indispensable : forme principale du contrôle de l’État depuis la suppression de la tutelle.")],
      ["02", "Le contrôle budgétaire et les chambres régionales des comptes", "Les cas de saisine de la chambre régionale des comptes (budget non adopté dans les délais, en déséquilibre, compte administratif en déficit, dépense obligatoire non inscrite) et le contrôle de la gestion.", null, ["I.B.1.d"]],
      ["03", "Le comptable public et le contrôle de la dépense locale", "La séparation entre l’ordonnateur local et le comptable public de la DGFiP, les contrôles du comptable sur les dépenses.", null, ["I.C.1.e"]]
    ],
    "I.B.2.d": [
      ["01", "La loi MAPTAM et les métropoles", "La loi de modernisation de l’action publique territoriale et d’affirmation des métropoles (2014), les métropoles de droit commun et à statut particulier.", null],
      ["02", "La nouvelle carte régionale et la loi NOTRe", "La réduction du nombre de régions métropolitaines (2015), la nouvelle organisation territoriale de la République : suppression de la clause générale de compétence des départements et régions, renforcement de l’intercommunalité.",
        C("P", "Pivot : ces lois fixent la répartition actuelle des compétences.")],
      ["03", "La loi Engagement et proximité", "La loi de 2019 relative à l’engagement dans la vie locale et à la proximité de l’action publique : place du maire, assouplissements de l’intercommunalité, statut de l’élu.", null, ["I.B.2.e"]],
      ["04", "La loi 3DS et les évolutions statutaires récentes", "Différenciation, décentralisation, déconcentration et simplification (2022), Collectivité européenne d’Alsace et autres créations récentes.", null]
    ],
    "I.B.2.e": [
      ["01", "Les élections municipales et communautaires", "Mode de scrutin selon la taille de la commune tel qu’appliqué en 2026, durée du mandat, parité, désignation des conseillers communautaires.",
        C("S", "Sujet 2026 (Q8) : durée du mandat municipal ; domaine réformé avant les municipales de 2026.")],
      ["02", "Le conseil municipal, le maire et les adjoints", "Élection du maire et des adjoints par le conseil, fonctionnement du conseil municipal, délégations.", null],
      ["03", "Les élections départementales et régionales", "Scrutin binominal paritaire pour les départements, scrutin de liste avec prime majoritaire pour les régions, durée des mandats.", null],
      ["04", "Le statut de l’élu local", "Limitation du cumul des mandats, indemnités, droit à la formation, garanties professionnelles, obligations déontologiques.", null]
    ],

    /* ---------- I.C.1 Les lois de finances ---------- */
    "I.C.1.a": [
      ["01", "Les catégories de lois de finances", "Loi de finances de l’année, loi de finances rectificative, loi relative aux résultats de la gestion et portant approbation des comptes de l’année, et leur objet respectif.",
        C("P", "Pivot : préalable à toute la partie lois de finances.")],
      ["02", "La loi spéciale et les procédures de secours", "Les solutions prévues quand la loi de finances n’est pas votée à temps : ordonnance budgétaire (article 47), loi spéciale, décrets de services votés.", null],
      ["03", "Lois de finances et lois de financement de la sécurité sociale", "Distinction entre lois de finances, lois de financement de la sécurité sociale et loi de programmation des finances publiques : objet, champ, cadre organique.", null]
    ],
    "I.C.1.b": [
      ["01", "Genèse et objectifs de la LOLF", "Le remplacement de l’ordonnance de 1959, l’adoption consensuelle de 2001, la logique de résultats et le renforcement du Parlement.",
        C("P", "Pivot : la LOLF structure toute la partie budget de l’État.")],
      ["02", "La démarche de performance", "Objectifs et indicateurs, projets annuels de performances, rapports annuels de performances, responsabilisation des gestionnaires.", null],
      ["03", "La réforme de la LOLF de 2021", "Les apports de la loi organique du 28 décembre 2021 : nouvelle dénomination de la loi de règlement, article liminaire enrichi, information du Parlement, calendrier.",
        C("I", "Domaine réformé : les anciennes dénominations restent des pièges fréquents.")],
      ["04", "Les pouvoirs du Parlement en matière budgétaire", "Droit d’amendement et article 40, information et contrôle des commissions des finances, mission d’évaluation et de contrôle.", null, ["I.C.1.e"]]
    ],
    "I.C.1.c": [
      ["01", "La loi de programmation des finances publiques", "Fondement constitutionnel (article 34), contenu (trajectoire pluriannuelle des soldes, de la dépense et de la dette), portée juridique, loi en vigueur.",
        C("I", "Indispensable : articule la loi de finances annuelle avec la trajectoire pluriannuelle et les règles européennes."), ["I.C.3.b"]],
      ["02", "Le Haut Conseil des finances publiques", "Rattachement à la Cour des comptes, composition, avis sur les prévisions macroéconomiques et la cohérence avec la trajectoire.", null],
      ["03", "L’articulation avec les engagements européens", "Le traité sur la stabilité, la coordination et la gouvernance, l’objectif à moyen terme, la règle d’équilibre et leur traduction dans le droit national.", null, ["II.C.e"]]
    ],
    "I.C.1.d": [
      ["01", "La structure de la loi de finances de l’année", "Les deux parties de la loi de finances (conditions générales de l’équilibre ; moyens des politiques publiques), l’article liminaire et l’article d’équilibre.",
        C("P", "Pivot : la structure en deux parties commande la procédure de vote.")],
      ["02", "Le calendrier et la procédure d’adoption", "Date de dépôt du projet, délais d’examen (article 47), ordre de vote des deux parties, rôle de chaque assemblée.", null],
      ["03", "Le contenu obligatoire et les cavaliers budgétaires", "Domaine exclusif et domaine partagé des lois de finances, dispositions interdites, cavaliers censurés par le Conseil constitutionnel.", null],
      ["04", "Les annexes et documents d’information", "Annexes explicatives (« bleus »), annexes générales (« jaunes »), rapport sur la situation et les perspectives économiques, documents de performance.", null]
    ],
    "I.C.1.e": [
      ["01", "Ordonnateurs et comptables publics", "Le principe de séparation des ordonnateurs et des comptables, leurs rôles respectifs, les contrôles exercés par le comptable.",
        C("P", "Pivot : fondement de toute la procédure d’exécution."), ["I.B.2.c"]],
      ["02", "Les phases d’exécution de la dépense et de la recette", "Engagement, liquidation, ordonnancement (ou mandatement) et paiement ; liquidation et recouvrement des recettes.", null],
      ["03", "Les modifications de crédits en cours d’année", "Virements, transferts, décrets d’avance, annulations, reports, mise en réserve et surgel.", null],
      ["04", "Les contrôles de l’exécution", "Contrôle budgétaire et contrôle interne, contrôle de la Cour des comptes (certification, rapport sur le budget de l’État), contrôle parlementaire et loi relative aux résultats de la gestion.", null, ["I.B.1.b"]],
      ["05", "La responsabilité des gestionnaires publics", "Le régime de responsabilité financière des gestionnaires publics entré en vigueur en 2023 et la juridiction qui le met en œuvre.", null]
    ],

    /* ---------- I.C.2 Les ressources et dépenses de l'État ---------- */
    "I.C.2.a": [
      ["01", "Panorama des recettes fiscales de l’État", "Les principaux impôts de l’État et leur poids respectif, impôts directs et indirects, recettes brutes et nettes, partage avec les collectivités et la sécurité sociale.",
        C("P", "Pivot : vue d’ensemble nécessaire aux autres notions de la ligne.")],
      ["02", "La taxe sur la valeur ajoutée", "Mécanisme (collectée et déductible), redevables, taux, poids dans les recettes.", null],
      ["03", "L’impôt sur le revenu", "Caractéristiques : foyer fiscal, quotient familial, barème progressif, prélèvement à la source.", null],
      ["04", "L’impôt sur les sociétés", "Champ, taux, poids dans les recettes et effet de l’imposition minimale des grands groupes.", null, ["II.C.e"]],
      ["05", "Les accises et autres impôts indirects", "L’accise sur les énergies (ancienne TICPE) et les autres accises, droits d’enregistrement, et leurs dénominations actuelles.", null]
    ],
    "I.C.2.b": [
      ["01", "L’emprunt dans l’équilibre budgétaire", "L’emprunt comme opération de trésorerie et non comme recette budgétaire, le tableau de financement (besoin et ressources de financement).", null, ["I.C.3.c"]],
      ["02", "L’autorisation d’emprunter votée par le Parlement", "L’autorisation donnée par la loi de finances et le plafond de variation de la dette négociable de l’État.", null]
    ],
    "I.C.2.c": [
      ["01", "Les recettes non fiscales", "Produits du domaine, dividendes et participations, amendes, produits divers.", null],
      ["02", "Fonds de concours et attributions de produits", "Définition, procédure d’affectation, exception au principe de non-affectation.", null, ["I.C.3.a"]],
      ["03", "Les prélèvements sur recettes", "Prélèvements au profit des collectivités territoriales et de l’Union européenne, nature et vote.", null, ["II.B.d"]]
    ],
    "I.C.2.d": [
      ["01", "Missions, programmes et actions", "Définitions, mission ministérielle ou interministérielle, création des missions, unité de vote, rôle du programme comme unité de spécialité.",
        C("S", "Sujet 2026 (Q7) : les missions dans la structure du budget de l’État.")],
      ["02", "Les titres de dépenses", "Classement des crédits par nature (titres), caractère indicatif sauf pour les dépenses de personnel.", null],
      ["03", "La fongibilité asymétrique", "Possibilité de redéployer les crédits au sein d’un programme, sauf vers les dépenses de personnel ; plafonds d’autorisation d’emplois.",
        C("S", "Sujet 2026 (Q5) : fongibilité asymétrique."), ["I.C.1.b"]],
      ["04", "La chaîne de responsabilité", "Responsable de programme, budget opérationnel de programme, unité opérationnelle, dialogue de gestion.", null],
      ["05", "Autorisations d’engagement et crédits de paiement", "Distinction, usage pour les opérations pluriannuelles, lien avec la règle d’annualité.", null, ["I.C.3.a"]]
    ],

    /* ---------- I.C.3 Principes et gestion budgétaire ---------- */
    "I.C.3.a": [
      ["01", "Le principe d’annualité", "Autorisation annuelle des recettes et des dépenses, exercice budgétaire, aménagements (reports, autorisations d’engagement).", null],
      ["02", "Le principe d’unité", "Présentation de toutes les recettes et dépenses dans un document unique, exceptions et débudgétisations.", null],
      ["03", "Le principe d’universalité", "Règle de non-compensation et règle de non-affectation, et leurs exceptions.",
        C("S", "Sujet 2026 (Q1) : principe d’universalité budgétaire.")],
      ["04", "Le principe de spécialité", "Affectation des crédits à un objet déterminé : programmes, titres, fongibilité.", null],
      ["05", "Le principe de sincérité", "Sincérité budgétaire et comptable, contrôle du Conseil constitutionnel, appréciation au regard des informations disponibles.", null],
      ["06", "Budgets annexes et comptes spéciaux", "Les budgets annexes et les quatre catégories de comptes spéciaux comme dérogations aux principes d’unité et d’universalité.", null]
    ],
    "I.C.3.b": [
      ["01", "Déficit budgétaire de l’État et déficit public", "Distinction entre le solde budgétaire de l’État et le déficit des administrations publiques au sens européen, sous-secteurs concernés.",
        C("P", "Pivot : distinction nécessaire pour toutes les questions sur le déficit et la dette.")],
      ["02", "Les règles européennes de déficit appliquées à la France", "Le seuil de 3 % du PIB, le pacte de stabilité et de croissance, la procédure pour déficit excessif et la situation de la France.",
        C("S", "Sujet 2026 (Q4) : plafond du déficit public fixé par le pacte de stabilité et de croissance."), ["II.C.e"]],
      ["03", "Solde structurel, solde conjoncturel et solde primaire", "Définitions et usage de ces soldes dans le pilotage des finances publiques.", null],
      ["04", "Le niveau du déficit public", "Dernier chiffre publié par l’INSEE, son évolution et le calendrier de publication.", null]
    ],
    "I.C.3.c": [
      ["01", "L’Agence France Trésor", "Statut, rattachement et missions dans la gestion de la dette et de la trésorerie de l’État.", null],
      ["02", "Les titres de la dette de l’État", "Obligations assimilables du Trésor, bons du Trésor à taux fixe, titres indexés sur l’inflation, obligations vertes.", null],
      ["03", "Les modalités d’émission et le coût de l’emprunt", "Adjudications, syndications, spécialistes en valeurs du Trésor, taux d’intérêt et notation de l’État.", null]
    ],
    "I.C.3.d": [
      ["01", "La dette publique au sens de Maastricht", "Définition, périmètre des administrations publiques et répartition de la dette entre État, administrations de sécurité sociale, administrations publiques locales et organismes divers.",
        C("S", "Sujet 2026 (Q10) : composition de la dette publique.")],
      ["02", "La charge de la dette", "Charge d’intérêts, sensibilité aux taux et à l’inflation, place dans le budget de l’État.", null],
      ["03", "Le niveau de la dette publique", "Dernier chiffre publié par l’INSEE, ratio au PIB, évolution récente.", null],
      ["04", "La soutenabilité de la dette et les critères européens", "Le critère de 60 % du PIB, la trajectoire de réduction, les enjeux de soutenabilité.", null, ["II.C.e"]]
    ],

    /* ---------- II.A Grandes étapes et élargissements ---------- */
    "II.A.a": [
      ["01", "Les traités fondateurs", "La déclaration Schuman, le traité CECA, les traités de Rome instituant la CEE et l’Euratom, et leurs objectifs.", null],
      ["02", "L’Acte unique européen", "Achèvement du marché intérieur, extension du vote à la majorité qualifiée, coopération politique.", null],
      ["03", "Le traité de Maastricht", "Création de l’Union européenne, citoyenneté européenne, union économique et monétaire, structure en piliers.",
        C("P", "Pivot : fonde l’UEM, la citoyenneté et la structure dont hérite le traité de Lisbonne.")],
      ["04", "Les traités d’Amsterdam et de Nice", "Ajustements institutionnels préparant l’élargissement, intégration de Schengen, proclamation de la Charte.", null],
      ["05", "Le traité constitutionnel de 2004", "Contenu, rejets par référendum en France et aux Pays-Bas, et reprise de sa substance par la suite.", null],
      ["06", "Le traité de Lisbonne", "Signature et entrée en vigueur, TUE et TFUE, personnalité juridique de l’Union, président du Conseil européen, haut représentant, valeur de la Charte.",
        C("S", "Sujet 2026 (Q15) : date de signature du traité de Lisbonne.")],
      ["07", "Les traités intergouvernementaux de la crise de la zone euro", "Le traité instituant le mécanisme européen de stabilité et le traité sur la stabilité, la coordination et la gouvernance.", null, ["II.C.e", "I.C.1.c"]]
    ],
    "II.A.b": [
      ["01", "Les vingt-sept États membres", "Liste des États membres et date d’entrée de chacun.", null],
      ["02", "Les élargissements successifs", "Les vagues d’adhésion depuis les six fondateurs jusqu’au dernier élargissement, et leur contexte.",
        C("P", "Pivot : chronologie qui structure les questions sur les États membres et l’adhésion.")],
      ["03", "Les cercles de l’intégration", "Zone euro, espace Schengen, coopérations renforcées : États participants et non participants, dérogations.", null, ["II.C.e", "II.C.a"]],
      ["04", "Les pays candidats et l’élargissement en cours", "Liste des pays candidats et candidats potentiels, état des négociations.", null, ["II.B.a"]],
      ["05", "Les territoires à statut particulier", "Régions ultrapériphériques et pays et territoires d’outre-mer : différence de statut au regard du droit de l’Union.", null, ["II.C.c"]]
    ],

    /* ---------- II.B Aspects institutionnels et financiers ---------- */
    "II.B.a": [
      ["01", "Les conditions d’adhésion", "L’article 49 du TUE, le respect des valeurs de l’article 2 et les critères de Copenhague.",
        C("S", "Sujet 2026 (Q14) : conditions d’adhésion.")],
      ["02", "La procédure d’adhésion", "Demande, avis de la Commission, statut de candidat, négociations par chapitres, unanimité du Conseil, approbation du Parlement européen, ratification.", null],
      ["03", "Le retrait de l’Union", "L’article 50 du TUE : notification, délai de négociation, accord de retrait.", null],
      ["04", "Le Brexit", "Chronologie du retrait du Royaume-Uni, accord de retrait, accord de commerce et de coopération.", null]
    ],
    "II.B.b": [
      ["01", "Le cadre institutionnel de l’Union", "Les sept institutions de l’article 13 du TUE, distinction avec les organes et avec le Conseil de l’Europe, sièges.", null, ["II.D.c"]],
      ["02", "Le Parlement européen : composition et élection", "Nombre de députés, répartition par État, mode de scrutin, durée du mandat, groupes politiques, sièges.", null],
      ["03", "Le Parlement européen : attributions", "Pouvoir législatif partagé, pouvoir budgétaire (budget annuel, cadre financier pluriannuel), contrôle de la Commission, investiture et motion de censure.",
        C("S", "Sujet 2026 (Q12) : rôle du Parlement européen dans le cadre financier pluriannuel.")],
      ["04", "Le Conseil européen", "Composition, président stable, rôle d’impulsion, mode de décision ; distinction avec le Conseil de l’Union.", null],
      ["05", "Le Conseil de l’Union européenne", "Formations, présidence tournante semestrielle et trio, rôle législatif et budgétaire, Coreper.",
        C("S", "Sujet 2026 (Q18) : présidence du Conseil de l’Union européenne.")],
      ["06", "La Commission européenne : composition et nomination", "Un commissaire par État, procédure de désignation du président et du collège, responsabilité devant le Parlement.", null],
      ["07", "La Commission européenne : attributions", "Monopole de l’initiative législative, exécution du budget, gardienne des traités (recours en manquement), représentation extérieure.",
        C("S", "Sujet 2026 (Q19) : institution qui veille à l’application du droit de l’Union.")],
      ["08", "La Cour de justice de l’Union européenne : organisation", "Cour de justice et Tribunal, composition, avocats généraux, siège.", null, ["II.D.b"]],
      ["09", "La Banque centrale européenne : statut institutionnel", "Organes de décision, indépendance, siège.", null, ["II.C.e"]],
      ["10", "La Cour des comptes européenne et les organes de l’Union", "Cour des comptes européenne, Comité économique et social européen, Comité européen des régions, Banque européenne d’investissement, Médiateur européen, Parquet européen.", null],
      ["11", "Les titulaires des présidences des institutions", "Présidents actuels du Parlement européen, du Conseil européen, de la Commission, de la BCE ; présidence en cours du Conseil de l’Union et trio.",
        C("S", "Sujet 2026 (Q18, Q20) : présidences du Conseil de l’Union et du Parlement européen.")]
    ],
    "II.B.c": [
      ["01", "Les actes juridiques de l’Union", "Règlement, directive, décision, recommandation et avis : portée et effets (article 288 du TFUE), transposition des directives.",
        C("S", "Sujet 2026 (Q16) : portée juridique des règlements.")],
      ["02", "La procédure législative ordinaire", "Proposition de la Commission, lectures au Parlement et au Conseil, comité de conciliation, trilogues.",
        C("P", "Pivot : procédure de droit commun de l’adoption des actes législatifs.")],
      ["03", "Les procédures législatives spéciales", "Consultation et approbation du Parlement, domaines concernés, actes non législatifs et délégués.", null],
      ["04", "Les modes de vote au Conseil", "Majorité qualifiée (double majorité), unanimité, majorité simple, domaines respectifs.", null],
      ["05", "Le rôle des parlements nationaux", "Contrôle de la subsidiarité (avis motivés, cartons jaune et orange), information, articles 88-4 et 88-6 de la Constitution.",
        C("I", "Indispensable : seconde moitié du libellé de la ligne.")],
      ["06", "Compétences de l’Union et principes de leur exercice", "Principe d’attribution, compétences exclusives, partagées et d’appui, subsidiarité et proportionnalité.", null],
      ["07", "L’initiative citoyenne européenne", "Conditions (nombre de signataires, États), effets sur la Commission.", null]
    ],
    "II.B.d": [
      ["01", "Les principes budgétaires de l’Union", "Unité, universalité, annualité, équilibre, spécialité, unité de compte, bonne gestion financière ; interdiction du déficit.", null],
      ["02", "Le cadre financier pluriannuel", "Durée, plafonds par rubrique, adoption à l’unanimité du Conseil après approbation du Parlement, cadre en cours et négociation du suivant.",
        C("S", "Sujet 2026 (Q12) : cadre financier pluriannuel."), ["II.B.b"]],
      ["03", "La procédure budgétaire annuelle", "Projet de la Commission, positions du Conseil et du Parlement, comité de conciliation, adoption (article 314 du TFUE).", null],
      ["04", "Les ressources propres", "Ressources propres traditionnelles, ressource TVA, ressource RNB, ressource sur les déchets d’emballages en plastique, décision relative aux ressources propres et son adoption.", null],
      ["05", "Les contributions des États membres", "Contributeurs et bénéficiaires nets, rang de la France, corrections forfaitaires.",
        C("S", "Sujet 2026 (Q13) : principal contributeur au budget de l’Union."), ["I.C.2.c"]],
      ["06", "Les dépenses de l’Union et le plan de relance", "Grandes rubriques de dépenses (cohésion, PAC…), NextGenerationEU et l’emprunt commun.", null],
      ["07", "Le contrôle du budget de l’Union", "Décharge par le Parlement, Cour des comptes européenne, OLAF, Parquet européen.", null]
    ],

    /* ---------- II.C Les principales politiques ---------- */
    "II.C.a": [
      ["01", "Les quatre libertés du marché intérieur", "Libre circulation des marchandises, des personnes, des services et des capitaux : fondements et objectifs du marché intérieur.",
        C("S", "Sujet 2026 (Q11) : libertés qui fondent le marché unique.")],
      ["02", "La libre circulation des marchandises", "Union douanière, interdiction des droits de douane et des mesures d’effet équivalent, reconnaissance mutuelle.", null],
      ["03", "La libre circulation des personnes", "Travailleurs, citoyens et membres de leur famille, droit de séjour, limites tenant à l’ordre public.", null],
      ["04", "La liberté d’établissement et la libre prestation de services", "Distinction entre établissement et prestation de services, travailleurs détachés, reconnaissance des qualifications.", null, ["II.C.g"]],
      ["05", "La libre circulation des capitaux", "Interdiction des restrictions aux mouvements de capitaux et aux paiements, y compris avec les pays tiers, et exceptions.", null],
      ["06", "L’espace Schengen", "Suppression des contrôles aux frontières intérieures, rétablissement temporaire, frontières extérieures, coopération policière.", null, ["II.A.b"]]
    ],
    "II.C.b": [
      ["01", "Objectifs et principes de la PAC", "Objectifs de l’article 39 du TFUE, principes d’unité du marché, de préférence communautaire et de solidarité financière.",
        C("P", "Pivot : les réformes et les instruments se comprennent au regard de ces objectifs.")],
      ["02", "Les deux piliers de la PAC", "Premier pilier (FEAGA : aides directes, marchés) et second pilier (FEADER : développement rural).", null],
      ["03", "Les grandes réformes de la PAC", "Des prix garantis au découplage des aides, verdissement, PAC actuelle et plans stratégiques nationaux.", null],
      ["04", "Le poids budgétaire de la PAC", "Part dans le budget de l’Union, principaux bénéficiaires dont la France.", null, ["II.B.d"]]
    ],
    "II.C.c": [
      ["01", "Objectifs de la politique de cohésion", "Cohésion économique, sociale et territoriale (article 174 du TFUE), réduction des écarts de développement.", null],
      ["02", "Les fonds de la politique de cohésion", "FEDER, FSE+, Fonds de cohésion, Fonds pour une transition juste : objet de chacun.", null],
      ["03", "Catégories de régions et régions ultrapériphériques", "Régions moins développées, en transition, plus développées ; traitement spécifique des régions ultrapériphériques.", null, ["II.A.b"]],
      ["04", "La gestion des fonds en France", "Autorités de gestion (régions et État), programmation, accord de partenariat.", null]
    ],
    "II.C.d": [
      ["01", "Une compétence exclusive de l’Union", "Politique commerciale commune (article 207 du TFUE), union douanière et tarif extérieur commun.",
        C("P", "Pivot : la compétence exclusive explique la procédure et les accords.")],
      ["02", "La négociation des accords commerciaux", "Mandat du Conseil, négociation par la Commission, approbation du Parlement européen, accords mixtes et ratifications nationales.", null, ["II.B.c"]],
      ["03", "Les accords commerciaux de l’Union", "Principaux accords conclus ou en cours (Canada, Mercosur et autres) et état de leur ratification.", null],
      ["04", "Les instruments de défense commerciale et l’OMC", "Mesures antidumping et antisubventions, instrument anticoercition, place de l’Union à l’OMC.", null]
    ],
    "II.C.e": [
      ["01", "L’union économique et monétaire", "Étapes de l’UEM, critères de convergence, passage à l’euro.",
        C("P", "Pivot : cadre de la politique monétaire et de la coordination budgétaire.")],
      ["02", "La Banque centrale européenne et la politique monétaire", "Mandat de stabilité des prix, indépendance, Eurosystème et SEBC, instruments (taux directeurs).",
        C("I", "Indispensable : seule politique monétaire unique de l’Union."), ["II.B.b"]],
      ["03", "La zone euro et l’Eurogroupe", "États membres de la zone euro, dernières adhésions, Eurogroupe et sommet de la zone euro.", null, ["II.A.b"]],
      ["04", "Le semestre européen", "Calendrier de coordination des politiques économiques et budgétaires, recommandations par pays.", null],
      ["05", "La gouvernance économique réformée en 2024", "Le nouveau cadre de surveillance budgétaire : plans budgétaires et structurels à moyen terme, trajectoire de dépenses nettes, volet correctif.", null, ["I.C.3.b"]],
      ["06", "Le mécanisme européen de stabilité et l’union bancaire", "Assistance financière aux États de la zone euro, supervision et résolution bancaires uniques.", null],
      ["07", "L’imposition minimale des grands groupes", "Accord international sur l’impôt minimum mondial (pilier 2) et sa transposition par une directive de l’Union.",
        C("S", "Sujet 2026 (Q17) : mesure fiscale de l’OCDE contre l’évasion fiscale."), ["I.C.2.a"]]
    ],
    "II.C.f": [
      ["01", "Nature et principes de la PESC", "Caractère intergouvernemental, règle de l’unanimité, rôle du Conseil européen et du Conseil, contrôle juridictionnel limité.", null],
      ["02", "Le haut représentant et le service européen pour l’action extérieure", "Double casquette du haut représentant (Conseil et Commission), service diplomatique de l’Union.", null, ["II.B.b"]],
      ["03", "La politique de sécurité et de défense commune", "Clause d’assistance mutuelle, missions et opérations, coopération structurée permanente, Facilité européenne pour la paix.", null],
      ["04", "Les mesures restrictives de l’Union", "Sanctions adoptées au titre de la PESC, procédure et exemples récents.", null]
    ],
    "II.C.g": [
      ["01", "Les compétences sociales de l’Union", "Objectifs sociaux des traités, compétence partagée et d’appui, domaines exclus.", null],
      ["02", "Le socle européen des droits sociaux", "Proclamation, principes, plan d’action et objectifs chiffrés.", null],
      ["03", "Les grandes directives sociales", "Temps de travail, détachement des travailleurs, salaires minimaux adéquats, égalité de rémunération.", null, ["II.C.a"]],
      ["04", "La coordination des systèmes de sécurité sociale et le dialogue social européen", "Coordination (et non harmonisation) des régimes, carte européenne d’assurance maladie, partenaires sociaux européens.", null]
    ],

    /* ---------- II.D La protection des droits fondamentaux ---------- */
    "II.D.a": [
      ["01", "Les valeurs de l’Union", "Les valeurs de l’article 2 du TUE et leur rôle dans l’adhésion et l’appartenance à l’Union.",
        C("P", "Pivot : fondent la procédure de l’article 7 et la conditionnalité."), ["II.B.a"]],
      ["02", "La procédure de l’article 7 du TUE", "Volet préventif et volet de sanction, majorités requises, États visés.", null],
      ["03", "La conditionnalité liée à l’État de droit", "Règlement de 2020 sur la protection du budget de l’Union, rapport annuel sur l’État de droit.", null, ["II.B.d"]],
      ["04", "La citoyenneté européenne et ses droits", "Droit de vote et d’éligibilité aux élections municipales et européennes, protection consulaire, droit de pétition, Médiateur.", null, ["II.C.a"]]
    ],
    "II.D.b": [
      ["01", "La Charte des droits fondamentaux de l’Union", "Proclamation, valeur juridique contraignante depuis le traité de Lisbonne, structure en titres, champ d’application (article 51).", null],
      ["02", "Les recours devant la Cour de justice", "Recours en manquement, en annulation, en carence, renvoi préjudiciel : auteurs et objets.",
        C("P", "Pivot : explique le rôle de la Cour dans l’application du droit de l’Union."), ["II.B.b"]],
      ["03", "Primauté et effet direct du droit de l’Union", "Principes dégagés par la jurisprudence de la Cour et leur réception en droit français.", null, ["I.A.a"]],
      ["04", "L’Union et la Convention européenne des droits de l’homme", "Obligation d’adhésion prévue par le traité, état de la procédure, articulation entre les deux Cours.", null, ["II.D.c"]]
    ],
    "II.D.c": [
      ["01", "Le Conseil de l’Europe", "Organisation distincte de l’Union : création, membres, siège, organes.",
        C("P", "Pivot : la confusion Conseil de l’Europe / Union est un piège majeur du concours."), ["II.B.b"]],
      ["02", "La Convention et ses protocoles", "Droits garantis, protocoles additionnels (dont l’abolition de la peine de mort), ratification par la France et recours individuel.", null],
      ["03", "La Cour européenne des droits de l’homme", "Composition, siège, saisine (requête individuelle, épuisement des voies de recours internes, délai), formations de jugement.", null],
      ["04", "L’exécution des arrêts", "Force obligatoire, surveillance par le Comité des ministres, satisfaction équitable, condamnations de la France.", null]
    ],

    /* ---------- III.A Le socle de compétence numérique ---------- */
    "III.A.1.a": [
      ["01", "Navigation sur le web", "Navigateur, adresse URL, nom de domaine, liens hypertextes, historique et cache.", null],
      ["02", "Fonctionnement des moteurs de recherche", "Indexation, classement des résultats, référencement payant, personnalisation et bulles de filtre.", null],
      ["03", "Formuler une requête efficace", "Choix des mots-clés, opérateurs, guillemets, filtres et recherche avancée.", null],
      ["04", "Évaluer la fiabilité de l’information", "Identification de la source et de l’auteur, date, recoupement, désinformation, contenus générés ou truqués.",
        C("I", "Indispensable : au cœur de la compétence « mener une recherche ».")],
      ["05", "Organiser une veille d’information", "Flux RSS, alertes, agrégateurs, abonnements, curation.",
        C("S", "Sujet 2026 (Q27) : définition d’un flux RSS.")],
      ["06", "Citer ses sources", "Référencer une source, droit de courte citation, respect de l’auteur dans un travail de recherche.", null]
    ],
    "III.A.1.b": [
      ["01", "Fichiers et formats", "Notion de fichier, extensions, formats ouverts et propriétaires, compression et archives.",
        C("P", "Pivot : base de la gestion, du partage et du traitement des données.")],
      ["02", "Organiser ses fichiers", "Arborescence, dossiers, chemins d’accès, règles de nommage et de version.", null],
      ["03", "Les supports et unités de stockage", "Stockage local, amovible, en réseau et en ligne ; unités de mesure de la capacité.", null],
      ["04", "Sauvegarder et synchroniser", "Sauvegarde, synchronisation, redondance des copies, restauration.", null, ["III.A.4.a"]],
      ["05", "Les bases de données", "Table, enregistrement, champ, clé, requête : notions de base.", null]
    ],
    "III.A.1.c": [
      ["01", "Le tableur : formules et fonctions", "Cellules, références relatives et absolues, formules et fonctions usuelles.", null],
      ["02", "Trier, filtrer et synthétiser des données", "Tris, filtres, tableaux croisés dynamiques, mise en forme conditionnelle.", null],
      ["03", "Représenter des données", "Choix du type de graphique selon les données, lecture et pièges d’interprétation.", null],
      ["04", "Données structurées et formats d’échange", "Formats CSV, JSON, XML, tableaux de données, qualité et nettoyage des données.", null],
      ["05", "Exploration et fouille de données", "Exploration de données (data mining), algorithmes de traitement, corrélation et causalité.",
        C("S", "Sujet 2026 (Q30) : définition de l’exploration de données."), ["III.B.a"]]
    ],
    "III.A.2.a": [
      ["01", "Le courrier électronique", "Adresse électronique, destinataires principaux, en copie et en copie cachée, pièces jointes, règles d’usage.",
        C("I", "Indispensable : principal outil d’interaction professionnelle.")],
      ["02", "Les outils de communication synchrones et asynchrones", "Messagerie instantanée, visioconférence, forums, choix de l’outil selon la situation.", null],
      ["03", "Les règles de la communication en ligne", "Nétiquette, ton, droit de réponse, respect d’autrui.", null],
      ["04", "Les protocoles de messagerie", "Rôle des protocoles d’envoi et de réception des courriels, webmail et client de messagerie.", null]
    ],
    "III.A.2.b": [
      ["01", "Les modalités de partage", "Partage par lien, droits d’accès (lecture, modification), espaces partagés, plateformes d’échange.",
        C("P", "Pivot : notion préalable à la publication et à la collaboration.")],
      ["02", "Publier en ligne", "Réseaux sociaux, blogs, paramètres de visibilité, audience et permanence des publications.", null],
      ["03", "Droit d’auteur et droit à l’image lors d’une publication", "Respect des droits d’autrui avant de publier ou de relayer un contenu.", null, ["III.A.3.b"]],
      ["04", "La liberté d’expression en ligne et ses limites", "Diffamation, injure, haine en ligne, signalement des contenus illicites.", null, ["III.B.b"]]
    ],
    "III.A.2.c": [
      ["01", "Les outils collaboratifs", "Édition simultanée de documents, suites bureautiques en ligne, wikis.",
        C("I", "Indispensable : cœur de la compétence « collaborer ».")],
      ["02", "Suivi des modifications et versions", "Historique des versions, commentaires, suivi des modifications.", null],
      ["03", "Organiser le travail en équipe", "Agendas partagés, outils de gestion de tâches, espaces de travail partagés.", null],
      ["04", "Les outils collaboratifs de l’administration", "Outils mis à disposition des agents publics et enjeux de souveraineté.", null, ["III.B.b"]]
    ],
    "III.A.2.d": [
      ["01", "Identité numérique et e-réputation", "Identité numérique, traces publiques, gestion de sa réputation en ligne.", null, ["III.A.4.b"]],
      ["02", "Fracture numérique et illectronisme", "Définitions, publics concernés, mesures d’inclusion numérique.",
        C("S", "Sujet 2026 (Q23) : définition de l’illectronisme."), ["III.B.b"]],
      ["03", "Les modèles économiques du numérique", "Gratuité, publicité ciblée, valorisation des données, économie des plateformes.", null],
      ["04", "La citoyenneté numérique", "Droits et devoirs du citoyen en ligne, participation et démarches en ligne.", null]
    ],
    "III.A.3.a": [
      ["01", "Mettre en forme un document textuel", "Mise en forme des caractères et des paragraphes, styles, titres et table des matières.",
        C("I", "Indispensable : cœur de la compétence « développer des documents textuels ».")],
      ["02", "Mettre en page un document", "En-têtes et pieds de page, sections, sauts, numérotation.", null],
      ["03", "Modèles et publipostage", "Utilisation de modèles, fusion d’un document avec une source de données.", null],
      ["04", "Les présentations", "Diaporamas : diapositives, masque, organisation du contenu.", null]
    ],
    "III.A.3.b": [
      ["01", "L’image numérique", "Images matricielles et vectorielles, pixel, définition et résolution.",
        C("P", "Pivot : notions nécessaires pour les formats et le traitement des médias.")],
      ["02", "Formats audio, image et vidéo", "Principaux formats, compression avec ou sans perte, poids des fichiers.", null],
      ["03", "Créer et modifier des contenus multimédias", "Capture, retouche d’image, montage audio et vidéo.", null],
      ["04", "Droits liés aux contenus multimédias", "Droit à l’image, droit d’auteur des œuvres multimédias, réutilisation.", null, ["III.A.2.b"]]
    ],
    "III.A.4.a": [
      ["01", "Les cybermenaces", "Logiciels malveillants (virus, rançongiciel, cheval de Troie), hameçonnage, ingénierie sociale, attaques par déni de service.", null],
      ["02", "Mots de passe et authentification", "Robustesse des mots de passe, gestionnaire de mots de passe, authentification à plusieurs facteurs.", null],
      ["03", "Pare-feu, antivirus et mises à jour", "Rôle du pare-feu, de l’antivirus et des mises à jour de sécurité.",
        C("S", "Sujet 2026 (Q21) : rôle d’un pare-feu.")],
      ["04", "Chiffrement et sécurité des échanges", "Chiffrement, protocole HTTPS, certificats, réseaux Wi-Fi publics et VPN.",
        C("S", "Sujet 2026 (Q26) : différence entre HTTP et HTTPS.")],
      ["05", "Réagir à un incident de sécurité", "Conduite à tenir, dispositif d’assistance aux victimes, signalement, rôle de l’ANSSI.", null, ["III.B.b"]]
    ],
    "III.A.4.b": [
      ["01", "Les traces numériques", "Cookies, historique, métadonnées, géolocalisation, traces volontaires et involontaires.",
        C("P", "Pivot : comprendre les traces conditionne la protection de la vie privée.")],
      ["02", "Maîtriser ses paramètres de confidentialité", "Réglages des comptes et des appareils, gestion des consentements, navigation privée et ses limites.", null],
      ["03", "Usurpation d’identité et atteintes à la vie privée", "Risques, prévention et recours.", null],
      ["04", "Profilage et publicité ciblée", "Collecte et croisement des données, profilage, données sensibles.", null, ["III.C.a"]]
    ],
    "III.A.4.c": [
      ["01", "L’impact environnemental du numérique", "Empreinte carbone et matérielle du numérique, part de la fabrication des équipements et des usages.",
        C("S", "Sujet 2026 (Q24) : origine de l’empreinte carbone du numérique.")],
      ["02", "La sobriété numérique", "Allongement de la durée de vie des équipements, réparabilité, réemploi, cadre législatif récent.", null],
      ["03", "Numérique et santé", "Ergonomie du poste de travail, exposition aux écrans, usages excessifs.", null],
      ["04", "Le droit à la déconnexion", "Fondement, mise en œuvre dans les entreprises et dans la fonction publique.",
        C("S", "Sujet 2026 (Q28) : droit à la déconnexion."), ["III.A.2.d"]],
      ["05", "Le cyberharcèlement", "Définition, sanctions, signalement et accompagnement des victimes.", null]
    ],

    /* ---------- III.B Enjeux et politiques de l'administration numérique ---------- */
    "III.B.a": [
      ["01", "Les services en ligne", "Services numériques accessibles par internet, logiciel en tant que service, applications publiques.", null],
      ["02", "L’ouverture des données publiques", "Principes de l’open data, ouverture par défaut, licences de réutilisation, portail national.",
        C("S", "Sujet 2026 (Q22) : affirmations sur l’open data.")],
      ["03", "Les mégadonnées", "Caractéristiques du big data (volume, vitesse, variété…), usages publics et limites.", null, ["III.A.1.c"]],
      ["04", "L’informatique en nuage", "Modèles de service (IaaS, PaaS, SaaS), nuage public, privé, hybride, qualification de confiance.", null],
      ["05", "L’intelligence artificielle", "Définitions, apprentissage automatique, IA générative, usages dans l’administration et limites.",
        C("I", "Indispensable : notion la plus évolutive de la ligne, support du règlement européen sur l’IA.")],
      ["06", "Le règlement européen sur l’intelligence artificielle", "Approche par les risques, pratiques interdites, systèmes à haut risque, calendrier d’application.", null, ["III.B.b"]],
      ["07", "La chaîne de blocs", "Principe de la blockchain, registre distribué, usages.", null]
    ],
    "III.B.b": [
      ["01", "Les acteurs publics du numérique", "Direction interministérielle du numérique, ANSSI, CNIL, Arcom et autres acteurs, et leurs missions respectives.",
        C("P", "Pivot : la répartition des rôles revient dans la plupart des questions de politique numérique.")],
      ["02", "La stratégie numérique de l’État", "Feuilles de route de transformation numérique, qualité des services publics en ligne, souveraineté et logiciels libres.", null],
      ["03", "La régulation européenne du numérique", "Règlement sur les services numériques (DSA), règlement sur les marchés numériques (DMA), règlement sur les données.", null, ["III.C.a"]],
      ["04", "La loi visant à sécuriser et réguler l’espace numérique", "Principales mesures de la loi SREN (2024).", null],
      ["05", "La politique de cybersécurité", "Directive NIS 2 et sa transposition, stratégie nationale de cybersécurité.", null, ["III.A.4.a"]],
      ["06", "L’inclusion numérique", "Dispositifs d’accompagnement : France services, conseillers numériques, aidants.", null, ["III.A.2.d"]]
    ],
    "III.B.c": [
      ["01", "Le droit de saisir l’administration par voie électronique", "Saisine par voie électronique, accusé de réception, démarches en ligne prévues par le code des relations entre le public et l’administration.",
        C("P", "Pivot : fondement juridique de la dématérialisation des relations avec l’usager.")],
      ["02", "L’identité numérique et FranceConnect", "Fédération d’identité, identité numérique régalienne, niveaux de garantie.", null],
      ["03", "« Dites-le-nous une fois » et l’échange de données entre administrations", "Principe de non-redemande des pièces, échanges de données, API publiques.", null],
      ["04", "La dématérialisation fiscale et la facturation électronique", "Déclaration et paiement en ligne, espace particulier et professionnel, calendrier de la facturation électronique entre entreprises.", null, ["I.C.2.a"]],
      ["05", "Accessibilité et maintien des alternatives", "Accessibilité des services en ligne (RGAA), maintien d’un accueil et d’une voie non dématérialisée.", null, ["III.A.2.d"]]
    ],

    /* ---------- III.C Réglementation de l'administration numérique ---------- */
    "III.C.a": [
      ["01", "Champ d’application et définitions du RGPD", "Donnée personnelle, traitement, responsable de traitement, sous-traitant, champ territorial, date d’application.", null],
      ["02", "Les principes du traitement", "Licéité, loyauté, transparence, limitation des finalités, minimisation, exactitude, limitation de la conservation, sécurité, responsabilité.",
        C("P", "Pivot : tous les droits et obligations en découlent.")],
      ["03", "Les bases légales et le consentement", "Les six bases légales, conditions du consentement, données sensibles.", null],
      ["04", "Les droits des personnes", "Information, accès, rectification, effacement, limitation, portabilité, opposition, décision automatisée.",
        C("I", "Indispensable : partie la plus interrogée du règlement.")],
      ["05", "Les obligations du responsable de traitement", "Registre des traitements, analyse d’impact, délégué à la protection des données, notification des violations.", null],
      ["06", "Contrôle et sanctions", "Autorités de contrôle, coopération européenne, montant maximal des amendes.", null, ["III.C.b"]]
    ],
    "III.C.b": [
      ["01", "Origine et objectifs de la loi Informatique et libertés", "Contexte de son adoption en 1978, objectifs, principe selon lequel l’informatique doit être au service de chaque citoyen.",
        C("S", "Sujet 2026 (Q25) : objectif de la loi Informatique et libertés.")],
      ["02", "La CNIL", "Statut d’autorité administrative indépendante, composition, missions, pouvoirs de contrôle et de sanction.",
        C("I", "Indispensable : autorité chargée d’appliquer la loi et le RGPD en France.")],
      ["03", "La loi depuis le RGPD", "Refonte de la loi, marges de manœuvre nationales (âge du consentement des mineurs…), traitements en matière pénale.", null, ["III.C.a"]],
      ["04", "Les traitements de données par l’administration", "Encadrement des fichiers publics, algorithmes publics et obligation de transparence.", null, ["III.B.b"]]
    ]
  };

  /* Familles des blocs IV et V : [id, libellé, générée, correspondance officielle] */
  var FAMILLES = [
    ["IV.G1", "Suites numériques", true],
    ["IV.G2", "Séries alphanumériques", true],
    ["IV.G3", "Nombres manquants dans un tableau ou une figure", true],
    ["IV.G4", "Probabilités simples", true],
    ["IV.G5", "Calendrier et calculs de jours", true],
    ["IV.G6", "Problèmes arithmétiques (prix, pourcentages, proportions, vitesses)", true],
    ["IV.G7", "Codage lettres-valeurs", true],
    ["IV.G8", "Suites de figures simples", true],
    ["IV.R1", "Analogies de mots", false],
    ["IV.R2", "Séquences de mots à règle cachée", false],
    ["IV.R3", "Liens de parenté", false],
    ["IV.R4", "Syllogismes et déductions", false],
    ["IV.R5", "Grilles logiques", false],
    ["IV.R6", "Intrus", false],
    ["V.1", "Choix de la bonne traduction", false, "Orthographe, vocabulaire"],
    ["V.2", "Prépositions", false, "Grammaire"],
    ["V.3", "Synonymes et antonymes", false, "Vocabulaire"],
    ["V.4", "Temps et aspects", false, "Conjugaison"],
    ["V.5", "Faux amis et vocabulaire courant, administratif et économique", false, "Vocabulaire"],
    ["V.6", "Compréhension d’une phrase ou d’un texte très court", false, "Vocabulaire, grammaire"]
  ];

  /* Cibles de rédaction.
     Vague 1 = avant le concours ; vague 2 = après le concours (08-apres-concours.md). */
  var CIBLES = {
    vague1: {
      parNotion: { standard: 1, centrale: 3 },
      limiteParBloc: 170,
      parFamilleRedigee: { IV: 8, V: 12 }
    },
    vague2: {
      parNotion: { I: { standard: 3, centrale: 5 }, II: { standard: 4, centrale: 4 }, III: { standard: 3, centrale: 3 } },
      totalBloc: { IV: 250, V: 230 }
    }
  };

  /* ---------- Construction ---------- */
  var lignes = [], notions = [], familles = [];
  var parLigne = {}, parNotion = {}, parFamille = {};

  LIGNES.forEach(function (l) {
    var o = {
      id: l[0], libelle: l[1], bloc: l[0].split(".")[0], theme: l[2], sousTheme: l[3] || "",
      crcn: l[4] || null, noteTranscription: NOTES_TRANSCRIPTION[l[0]] || ""
    };
    lignes.push(o);
    parLigne[o.id] = o;
  });

  lignes.forEach(function (l) {
    (NOTIONS[l.id] || []).forEach(function (n) {
      var centrale = !!n[3];
      var o = {
        id: l.id + "." + n[0], ligne: l.id, bloc: l.bloc, libelle: n[1], couvre: n[2],
        centrale: centrale,
        criteres: centrale ? n[3].criteres : [],
        justification: centrale ? n[3].texte : "",
        voirAussi: n[4] || [],
        crcn: l.crcn
      };
      notions.push(o);
      parNotion[o.id] = o;
    });
  });

  /* Répartition de la cible de vague 2 des blocs IV (rédigées) et V entre familles. */
  function repartir(total, ids) {
    var base = Math.floor(total / ids.length), reste = total - base * ids.length, r = {};
    ids.forEach(function (id, i) { r[id] = base + (i < reste ? 1 : 0); });
    return r;
  }
  var redigeesIV = FAMILLES.filter(function (f) { return f[0].indexOf("IV.R") === 0; }).map(function (f) { return f[0]; });
  var famillesV = FAMILLES.filter(function (f) { return f[0].indexOf("V.") === 0; }).map(function (f) { return f[0]; });
  var v2IV = repartir(CIBLES.vague2.totalBloc.IV, redigeesIV);
  var v2V = repartir(CIBLES.vague2.totalBloc.V, famillesV);

  FAMILLES.forEach(function (f) {
    var bloc = f[0].split(".")[0];
    var o = {
      id: f[0], bloc: bloc, libelle: f[1], generee: f[2], correspondanceOfficielle: f[3] || "",
      cibleVague1: f[2] ? 0 : CIBLES.vague1.parFamilleRedigee[bloc],
      cibleVague2: f[2] ? 0 : (bloc === "IV" ? v2IV[f[0]] : v2V[f[0]])
    };
    familles.push(o);
    parFamille[o.id] = o;
  });

  notions.forEach(function (n) {
    n.cibleVague1 = n.centrale ? CIBLES.vague1.parNotion.centrale : CIBLES.vague1.parNotion.standard;
    var r = CIBLES.vague2.parNotion[n.bloc];
    n.cibleVague2 = n.centrale ? r.centrale : r.standard;
  });

  CI.referentiel = {
    version: 1,
    dateConcours: "2026-12-07",
    blocs: BLOCS,
    lignes: lignes,
    notions: notions,
    familles: familles,
    crcnExclues: CRCN_EXCLUES,
    cibles: CIBLES,
    ligne: function (id) { return parLigne[id] || null; },
    notion: function (id) { return parNotion[id] || null; },
    famille: function (id) { return parFamille[id] || null; },
    /* Rattachement d'une question : identifiant de notion (blocs I à III) ou de famille (IV, V). */
    rattachement: function (id) { return parNotion[id] || parFamille[id] || null; },
    notionsDeLigne: function (idLigne) { return notions.filter(function (n) { return n.ligne === idLigne; }); }
  };
})(typeof window !== "undefined" ? window : globalThis);
