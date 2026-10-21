Blocs faibles : non renseignés (à compléter après le test de positionnement)

# Plan des lots — vague 1 (avant le concours)

Cibles de vague 1 tirées de `banque/referentiel.js` : 1 question par notion, 3 par notion centrale ; 8 questions par famille rédigée du bloc IV ; 12 par famille du bloc V.

| Bloc | Cible vague 1 |
|---|---|
| I | 172 |
| II | 130 |
| III | 128 |
| IV rédigé | 48 |
| V | 72 |
| **Total** | **550** |

Le lot 00 compte dans les cibles : chacune de ses questions est l'une des 3 questions de la notion centrale concernée (ou l'une des 12 de la famille, pour le bloc V).

## Tableau de suivi

| Lot | Lignes ou familles couvertes | Questions visées | Statut | Livré le | « a_verifier » |
|---|---|---|---|---|---|
| 00-demarrage | 10 notions centrales du bloc I, 10 du II, 10 du III (détail ci-dessous) ; V.1 à V.5 | 35 | livré | 2026-10-21 | 0 |
| 01-budget-centrales | Bloc I, notions centrales de I.C (lois de finances, ressources et dépenses, principes et gestion) | 36 | en cours | | |
| 02-ue-institutions-centrales | Bloc II, notions centrales de II.A et II.B | 33 | en cours | | |
| 03-numerique-socle-centrales | Bloc III, notions centrales de III.A | 39 | en cours | | |
| 04-anglais-1 | V.1, V.2, V.3 | 33 | en cours | | |
| 05-logique-redigee | IV.R1 à IV.R6 | 48 | à faire | | |
| 06-institutions-centrales | Bloc I, notions centrales de I.A et I.B | 41 | à faire | | |
| 07-ue-politiques-droits | Bloc II, notions centrales de II.C et II.D, et notions non centrales de II.D | 32 | à faire | | |
| 08-numerique-administration | Bloc III, toutes les notions de III.B et III.C | 40 | à faire | | |
| 09-anglais-2 | V.4, V.5, V.6 | 34 | à faire | | |
| 10-institutions-complements | Bloc I, notions non centrales de I.A et I.B | 47 | à faire | | |
| 11-ue-institutions-complements | Bloc II, notions non centrales de II.A et II.B | 28 | à faire | | |
| 12-numerique-socle-complements | Bloc III, notions non centrales de III.A | 39 | à faire | | |
| 13-budget-complements | Bloc I, notions non centrales de I.C | 38 | à faire | | |
| 14-ue-politiques-complements | Bloc II, notions non centrales de II.C | 27 | à faire | | |

Total : 35 + 515 = 550 questions.

Ordre : les lots 01 à 04 couvrent un bloc chacun (I, II, III, V), puis vient la logique rédigée (05) ; les lots suivants reprennent l'alternance I, II, III, V. Les lots 11 et 14 restent un peu sous 30 questions pour ne pas mélanger des sous-thèmes éloignés.

Après le test de positionnement, la conversation de lot qui reçoit « Blocs faibles : … » réordonne les lots « à faire » : lots centraux des blocs faibles d'abord, avec au moins un lot de chaque bloc parmi les 4 prochains.

## Détail du lot 00-demarrage

Niveaux 1 et 2 uniquement. Une question par notion centrale ci-dessous, chaque notion sur une ligne différente.

- Bloc I (10) : I.A.a.02 hiérarchie des normes ; I.A.b.02 contrôle de constitutionnalité ; I.A.c.03 Parlement ; I.B.1.c.01 déconcentration et décentralisation ; I.B.1.f.04 secret et discrétion professionnels ; I.B.2.a.01 libre administration ; I.B.2.e.01 élections municipales ; I.C.1.a.01 catégories de lois de finances ; I.C.2.d.01 missions, programmes, actions ; I.C.3.a.03 universalité.
- Bloc II (10) : II.A.a.06 traité de Lisbonne ; II.A.b.02 élargissements ; II.B.a.01 conditions d'adhésion ; II.B.b.07 attributions de la Commission ; II.B.c.01 actes juridiques ; II.B.d.02 cadre financier pluriannuel ; II.C.a.01 quatre libertés ; II.C.e.01 union économique et monétaire ; II.D.a.01 valeurs de l'Union ; II.D.c.01 Conseil de l'Europe.
- Bloc III (10) : III.A.1.a.04 fiabilité de l'information ; III.A.1.c.05 fouille de données ; III.A.2.d.02 illectronisme ; III.A.4.a.03 pare-feu ; III.A.4.b.01 traces numériques ; III.A.4.c.01 impact environnemental ; III.B.a.02 open data ; III.B.b.01 acteurs publics du numérique ; III.C.a.02 principes du RGPD ; III.C.b.01 loi Informatique et libertés.
- Bloc V (5) : une question pour chacune des familles V.1, V.2, V.3, V.4, V.5.

Le fichier appelle `CI.banque.ajouter([...], { lot: "00-demarrage" })` : le test de positionnement reconnaît ses questions grâce à ce nom de lot.
