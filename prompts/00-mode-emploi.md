# Cap Inspecteur — mode d'emploi des prompts

Version du 21 octobre 2026. Écrits du concours : 7 et 8 décembre 2026.

## Les fichiers

| Fichier | Rôle | Quand |
|---|---|---|
| 01-prompt-maitre.md | Contexte, sources, programme, format des questions, continuité | Au début de chaque conversation |
| 02-specification.md | Ce que fait l'application | Conversations 1, 2 et 3 |
| 03-conversation-1-fondations.md | Référentiel, cœur logique, générateurs, tests | Conversation 1 |
| 04-conversation-2-interface.md | Interface, hors ligne, mise en ligne | Conversation 2 |
| 05-conversation-3-complements.md | Tableau de bord, examen blanc, entraînement libre, banque | Conversation 3 |
| 06-module-lot.md | Rédaction d'un lot de questions et relecture | Une conversation par lot |
| 07-module-actualite.md | Vérification et mise à jour de l'actualité | Vers le 20 novembre, puis vers le 1er décembre |
| 08-apres-concours.md | Tout ce qui attend après le 7 décembre | Pour mémoire |

## Avant la conversation 1 (10 minutes)

1. Crée sur GitHub un dépôt public vide nommé `cap-inspecteur`. Il ne contiendra que le code et les questions ; ta progression reste sur tes appareils.
2. Note ton identifiant GitHub : il remplace `<compte>` dans les messages ci-dessous.
3. Lance chaque conversation dans ce projet : les prompts y sont enregistrés, Claude les lit directement.

## Messages de lancement

Conversation 1 :
> Lis dans le projet prompts/01-prompt-maitre.md, prompts/02-specification.md et prompts/03-conversation-1-fondations.md, puis exécute la conversation 1. Mon identifiant GitHub : `<compte>`.

Conversations 2 et 3 : même message, avec 04-… ou 05-… à la place de 03-….

Un lot :
> Lis dans le projet prompts/01-prompt-maitre.md et prompts/06-module-lot.md, puis rédige le lot `<identifiant>`. Mon identifiant GitHub : `<compte>`.

Après le test de positionnement, ajoute au message du lot suivant : « Blocs faibles : … » (la phrase affichée par l'application).

Actualité :
> Lis dans le projet prompts/01-prompt-maitre.md, prompts/06-module-lot.md et prompts/07-module-actualite.md, puis exécute le module actualité. Mon identifiant GitHub : `<compte>`.

Erreurs signalées dans l'appli (Banque → exporter les signalements, puis joindre le fichier) :
> Lis dans le projet prompts/01-prompt-maitre.md et prompts/06-module-lot.md, puis fais un lot correctif à partir des signalements joints. Mon identifiant GitHub : `<compte>`.

Hors de ce projet, colle le contenu des fichiers dans le même ordre.

## Calendrier

| Quand | Quoi |
|---|---|
| 21 au 23 octobre | Conversation 1. Un arrêt pour valider les notions centrales. |
| Dès la fin de la conversation 1 | Lot 00-demarrage, puis lots 01 à 04, dans des conversations séparées, en parallèle de la conversation 2. |
| 23 au 25 octobre | Conversation 2. Activer GitHub Pages, installer l'appli sur le téléphone et l'ordinateur. |
| Dès que le lot 00 est livré | Test de positionnement (environ 65 minutes), puis indiquer tes blocs faibles au lot suivant. |
| Avant le 2 novembre | Conversation 3. |
| Jusqu'au 30 novembre | 2 à 3 lots par semaine, environ 15 lots au total. |
| Samedis 14, 21 et 28 novembre (et 5 décembre si tu veux) | Examens blancs. |
| Vers le 20 novembre et le 1er décembre | Module actualité. |

## Chaque jour (2 heures)

1. Séance du jour : 45 questions, environ 65 minutes. Réponds d'abord aux questions sûres, puis fais un second passage sur les doutes.
2. Correction : environ 15 minutes. Lis surtout les « À retenir » et les pièges.
3. Révisions du jour : environ 40 questions, avec correction immédiate.

## Deux appareils

Le plus simple : un seul appareil par jour. Sinon, en fin de séance : Réglages → Exporter, envoie-toi le fichier, puis sur l'autre appareil : Importer → Fusionner.

## Si la connexion à GitHub échoue

Claude relaie le message d'erreur exact et livre une archive .zip en fin de conversation. Joins cette archive au premier message de la conversation suivante.

## Ce qui a changé par rapport à ta version

- **Objectif :** environ 600 questions avant le concours (vague 1), centrales et blocs faibles d'abord. La banque de 1 500 questions passe après le concours.
- **Révisions :** la file de révisions n'a plus de plafond. Le nombre de nouvelles questions s'adapte au retard (de 1 à 4 par bloc). Une simulation sur 90 jours vérifie que la file reste sous 120.
- **Fiabilité :**
  - chaque question porte l'URL qui prouve sa réponse ;
  - les domaines réformés récemment sont vérifiés en ligne ;
  - le relecteur résout la logique à l'aveugle ;
  - les corrections sont arbitrées, pas appliquées d'office.
- **Temps :** 65 minutes pour le QCM, alerte au-delà de 2 minutes par question, plafond fixé par le guide (1 h 20 au plus).
- **Calibrage :** une « réponse pressentie » facultative après « Ann » permet de mesurer le coût réel des abstentions.
- **Continuité :** le code vit dans le dépôt GitHub. Le contrat d'interface, le plan des lots et les scripts de couverture font le lien entre les conversations.
- **Corrections diverses :**
  - contraste de `--text-3` corrigé ;
  - pastille de sélection lilas, au lieu du rose qui signifie « faux » ;
  - polices et icônes auto-hébergées ;
  - mises à jour hors ligne gérées par le service worker.
