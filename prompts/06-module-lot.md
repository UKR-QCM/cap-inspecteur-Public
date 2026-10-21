# Module — Rédaction d'un lot de questions

À lire après 01-prompt-maitre.md. Une conversation = un lot. Les lots peuvent tourner en parallèle d'autres conversations.

<entree>
- Identifiant du lot donné dans le message de lancement ; à défaut, le premier lot « à faire » de `PLAN-DES-LOTS.md`.
- Facultatif : « Blocs faibles : … ».
  - Reporte cette mention en tête de `PLAN-DES-LOTS.md`.
  - Réordonne les lots « à faire » : lots centraux des blocs faibles d'abord, avec au moins un lot de chaque bloc parmi les 4 prochains.
</entree>

<lot_correctif>
Si le message de lancement joint l'export des signalements de l'application (JSON), le lot est un lot correctif `banque/lots/correctif-AAAA-MM-JJ.js`.
- Pour chaque question signalée :
  - vérifie le signalement sur une source de rang 1 ou 2 ;
  - si le signalement est fondé : corrige avec le même identifiant et `version` + 1, ou retire avec `CI.banque.retirer([{ id, raison }])` ;
  - sinon : explique dans le rapport pourquoi la question reste en l'état.
- Les étapes 1, 5, 6, 7 et 8 ci-dessous s'appliquent.
</lot_correctif>

<etapes>
1. Préparation
   - Attache et clone le dépôt ; lance les tests.
   - Passe le lot en « en cours » dans `PLAN-DES-LOTS.md`, puis commit et push. Cela évite qu'une autre conversation le prenne.
   - Indique ta date de fin de connaissances.

2. Contexte du lot
   - Lis dans `banque/referentiel.js` les lignes et notions du lot, avec leur statut central et leurs cibles de vague 1.
   - Lance `node outils/existant.js <préfixe>` pour chaque ligne ou famille : tu ne réécris aucune question existante et tu continues leur numérotation.

3. Volume
   - Les cibles de vague 1 du référentiel, en 30 à 50 questions.
   - Si le lot dépasse 50 questions, découpe-le et mets le plan à jour.

4. Rédaction : `banque/lots/<identifiant>.js`, dans l'ordre du référentiel, avec le format de <conventions>.
   - Fond :
     - Une seule bonne réponse, indiscutable au 7 décembre 2026.
     - Aucun contenu hors périmètre ; en culture numérique, uniquement les 12 compétences du programme.
     - Ne reprends aucune question ni formulation du sujet 2026 ou d'une autre source.
   - Forme des propositions :
     - 4 propositions de longueur et de forme comparables.
     - Distracteurs tirés de confusions réelles : notions voisines, dates proches, autorités confondues, anciennes dénominations.
     - Interdits : « toutes les réponses », « aucune des réponses », doubles négations. Une négation s'écrit en capitales (NE… PAS).
     - Pas de contrainte sur la position de la bonne réponse : les propositions sont mélangées à l'affichage.
     - Valeurs numériques ou dates : `ordreFixe: true` et ordre croissant.
   - Variété :
     - Pour une même notion, les questions sœurs prennent des angles différents : définition, compétence (qui fait quoi), chronologie, procédure, hiérarchie, distinction entre notions voisines, mini-cas pratique, intrus.
     - Difficulté du lot : environ 40 % de niveau 1, 45 % de niveau 2, 15 % de niveau 3. Le lot 00-demarrage ne contient que des niveaux 1 et 2.
   - Vérification et sources :
     - Avant de marquer une question « valide », vérifie-la sur une source de rang 1 ou 2.
     - `source` = URL consultée qui prouve la bonne réponse ; `verifieLe` = date du jour.
     - Un numéro d'article n'est cité que s'il figure sur la page consultée.
     - Une décision de justice n'est citée que si elle est très connue, datée et vérifiée.
     - Sans preuve trouvée : statut « a_verifier » avec `raisonAVerifier` (quoi vérifier, et où).
   - Actualité :
     - `nature: "actualite"` ;
     - `perimeLe` = fin de validité connue (fin d'une présidence semestrielle, prochaine publication d'un chiffre, fin d'un mandat) ;
     - si `perimeLe` tombe avant le 2026-12-07, signale-le dans le rapport.
   - Anglais : phrases et textes originaux, niveau B1, pièges de traduction réalistes.
   - Logique rédigée :
     - énoncé autosuffisant, sans culture générale nécessaire ;
     - une seule réponse défendable.

5. Contrôle mécanique
   - `node outils/tests.js` : intégrité de la banque.
   - `node outils/couverture.js` : cibles et répartition des difficultés.
   - Corrige jusqu'à obtenir tout au vert.

6. Relecture indépendante
   - Je te demande explicitement de lancer un sous-agent qui n'a pas vu la rédaction, avec le prompt de <prompt_relecture>.
   - Ce que tu lui transmets :
     - blocs I, II, III et V : les questions complètes ;
     - bloc IV : d'abord les questions sans `bonne`, `explication` ni `aRetenir`, pour une résolution à l'aveugle ; ensuite seulement les réponses, pour comparaison.
   - Sans outil de sous-agent : livre le prompt de relecture et le fichier du lot, puis attends que je colle le JSON de retour.

7. Arbitrage
   - Pour chaque correction proposée : accepte et applique, ou rejette avec ta source.
   - Une question du bloc IV pour laquelle le relecteur trouve une autre réponse défendable est réécrite ou supprimée.
   - Une question non prouvée passe en « a_verifier ».

8. Livraison
   - Tests au vert, puis `preparer.js` et `couverture.js`.
   - Mets à jour `PLAN-DES-LOTS.md` : statut « livré », date, nombre de questions, nombre de questions « a_verifier ».
   - Commit, `git pull --rebase`, push.
</etapes>

<rapport_final>
a. Couverture du lot, d'après `couverture.js` : notion ou famille → questions → cible de vague 1 atteinte (oui/non).
b. Cumul global, d'après `couverture.js` : notions couvertes sur le total, questions sur la cible de vague 1, par bloc.
c. Questions « a_verifier », avec leur raison.
d. Corrections du relecteur rejetées, avec ta source.
e. Questions d'actualité qui périment avant le 7 décembre.
f. Prochain lot, et message exact pour le lancer.
</rapport_final>

<prompt_relecture>
Tu es relecteur expert des concours administratifs de catégorie A (QCM de l'épreuve n° 2 du concours externe d'inspecteur des Finances publiques, écrits le 7 décembre 2026). Tu n'as pas écrit ces questions.

Ne cherche que les problèmes suivants :
- erreurs factuelles ;
- éléments faux ou obsolètes au 7 décembre 2026 (ancienne dénomination présentée comme actuelle, texte abrogé, chiffre dépassé) ;
- ambiguïtés : plusieurs réponses défendables, ou aucune ;
- distracteurs défendables ;
- références douteuses : article ou décision introuvable sur la source citée, URL qui ne prouve pas la réponse ;
- hors programme : compétences du CRCN exclues (adapter les documents à leur finalité, programmer, résoudre des problèmes techniques, construire un environnement numérique), bloc I hors France, macroéconomie générale ;
- reprise d'une question ou d'une formulation du sujet officiel 2026.

Méthode :
- Vérifie chaque fait contesté sur Légifrance, EUR-Lex ou un site institutionnel, et donne l'URL consultée.
- Questions de raisonnement logique transmises sans réponse : résous-les d'abord, sans aide ; donne ta réponse et ton raisonnement ; signale toute autre réponse défendable.
- N'invente rien. Si tu ne peux pas trancher, dis-le, avec « gravite » à « majeure » et « correction » à « à vérifier ».

Rends uniquement un tableau JSON, vide s'il n'y a rien à signaler :

[{ "id": "...", "champ": "enonce|choix|bonne|explication|aRetenir|references|source|piege|perimeLe|autre", "probleme": "...", "correction": "...", "preuve": "URL", "gravite": "bloquante|majeure|mineure" }]

Pour les questions résolues à l'aveugle, ajoute : { "id": "...", "reponseRelecteur": 0, "raisonnement": "...", "autreReponseDefendable": null }
</prompt_relecture>
