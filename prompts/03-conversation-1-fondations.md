# Conversation 1 — Fondations

À lire après 01-prompt-maitre.md et 02-specification.md.

<objectif>
À la fin de cette conversation, le dépôt contient :
- le référentiel validé par l'utilisatrice ;
- le plan des lots ;
- le contrat d'interface ;
- tout le cœur logique, testé dans Node ;
- les générateurs IV.G1 à IV.G7 ;
- les outils.

Aucune interface : elle relève de la conversation 2. Le générateur de figures (IV.G8) relève de la conversation 3.
</objectif>

<etapes>
1. Dépôt
   - Attache et clone le dépôt.
   - S'il est vide, crée l'arborescence de 02-specification.md.
   - Copie les fichiers de prompts du projet dans `prompts/`.

2. Contrôle de la transcription
   - Lis le PDF `Programme_concours_QCM.pdf` du projet.
   - Compare-le ligne à ligne avec <programme_officiel>.
   - Signale tout écart.

3. Référentiel : `banque/referentiel.js`
   - Structure :
     - lignes : identifiant, libellé exact du PDF, bloc, thème, sous-thème ;
     - notions de chaque ligne : identifiant, libellé, une phrase qui dit ce que la notion couvre, `centrale` (booléen), justification si centrale, `voirAussi` éventuel ; pour III.A, la compétence du CRCN qui sert de source ;
     - familles des blocs IV et V : identifiant, libellé, `generee` (booléen).
   - Découpage :
     - une notion = un point de cours qui se prête à 3 à 5 questions sous des angles différents (définition, compétence, procédure, chronologie, distinction, mini-cas) ;
     - jamais un fait isolé ;
     - chaque ligne a au moins une notion ; aucune notion ne sort de sa ligne.
   - Notions centrales :
     - environ 25 % des notions ;
     - chacune justifiée par au moins un critère : thème interrogé dans le sujet 2026 (le thème, pas la formulation) ; notion pivot dont dépendent d'autres notions ; notion indispensable pour comprendre la ligne.
   - Cibles :
     - vague 1 (avant le concours) : 1 question par notion, 3 par notion centrale, dans la limite d'environ 170 par bloc pour I à III. Si une limite est dépassée, propose de retirer des notions centrales, sans les retirer toi-même ;
     - bloc IV : 8 questions rédigées par famille rédigée (48) ;
     - bloc V : environ 12 questions par famille (environ 70) ;
     - vague 2 (après le concours) : bloc I, 3 par notion et 5 si centrale ; bloc II, 4 par notion ; bloc III, 3 par notion ; bloc IV, 250 questions rédigées ; bloc V, 230 questions.
   - Termine par un tableau : ligne → nombre de notions → dont centrales → cible vague 1 → cible vague 2, avec les totaux par bloc et le total général.

   **ARRÊT 1 :** présente le tableau, la liste des notions centrales par ligne avec leur justification, et tes doutes de découpage. Attends la validation ou les corrections avant de continuer.

4. Plan des lots : `PLAN-DES-LOTS.md`
   - En tête, la ligne : `Blocs faibles : non renseignés (à compléter après le test de positionnement)`.
   - Lot 00-demarrage :
     - 35 questions de niveaux 1 et 2 : 10 pour le bloc I, 10 pour le II, 10 pour le III, 5 pour le V ;
     - portant sur des notions centrales, réparties sur le plus grand nombre de lignes possible ;
     - elles servent au test de positionnement et restent dans la banque.
   - Lots suivants de la vague 1 :
     - chaque lot = un sous-thème ou un groupe de lignes, de 30 à 50 questions ;
     - centrales d'abord dans chaque bloc ;
     - ordre alterné I, II, III, V, puis IV rédigé, pour que chaque bloc reçoive régulièrement des nouvelles questions ;
     - les lots 01 à 04 couvrent un bloc chacun (I, II, III, V), sur les lignes les plus centrales.
   - Colonnes : identifiant du lot, lignes ou familles couvertes, nombre de questions visé, statut (à faire, en cours, livré), date de livraison, nombre de questions « a_verifier ».

5. Contrat d'interface : `CONTRAT.md`
   - Il décrit :
     - le format des données (question, état, séance stockée, historique, profil, réglages, sauvegarde exportée) ;
     - la liste des fonctions publiques de chaque module de `window.CI`, avec leurs paramètres et leurs retours ;
     - la clé et le schéma de stockage ;
     - les conventions de fichiers et de lots.
   - Écris-le avant le code, puis tiens-le à jour.

6. Cœur logique
   - Modules : `utils.js`, `stockage.js` (sérialisation, migration, export, import, fusion), `banque.js`, `srs.js`, `seance.js` (génération de tous les types de séances, file des révisions du jour, rattrapage), `bareme.js`, `stats.js`.
   - Exigences :
     - conforme à 02-specification.md ;
     - aucun accès au DOM ;
     - horloge et date du jour injectées.

7. Générateurs IV.G1 à IV.G7 : `assets/js/generateurs/`
   - Signature : `(graine, niveau) → { enonce, choix, bonne, explication, aRetenir, svg?, alt? }`, avec une constante `genVersion` par fichier.
   - Déterminisme complet à partir de la graine et de la version.
   - La bonne réponse est calculée.
   - Les distracteurs viennent d'erreurs typiques (décalage d'un rang, mauvaise opération, oubli d'une contrainte), jamais du hasard pur, et sont tous distincts.
   - L'explication détaille le raisonnement étape par étape.
   - Chaque générateur couvre 3 niveaux de difficulté.
   - Suites (IV.G1, IV.G2) :
     - au moins 5 termes affichés ;
     - si une autre règle simple prolonge les termes affichés autrement, l'instance est rejetée et retirée de façon déterministe.
   - Calendrier : arithmétique calendaire, sans millisecondes.
   - Familles calibrées sur le sujet 2026, sans en reprendre aucun énoncé : prix calculé à partir des lettres d'un nom, tableau à deux lignes liées par une règle, nombre manquant dans une figure, série lettres-nombres, tirage de boules, jour de la semaine dans N jours.

8. Outils : `outils/`
   - `preparer.js` : régénère `banque/manifest.js` d'après le contenu de `banque/lots/`, la liste de préchargement du service worker et le numéro de version du cache.
   - `tests.js` : charge les modules dans Node et exécute toutes les suites de la spécification (sauf celles de l'interface) ; sortie lisible ; code de retour non nul en cas d'échec.
   - `couverture.js` : par ligne, notion et famille, questions existantes face aux cibles des vagues 1 et 2, questions « a_verifier », questions d'actualité qui périment avant le 2026-12-07, répartition des difficultés ; totaux par bloc et global.
   - `existant.js <préfixe>` : liste les questions déjà écrites pour un préfixe de notion ou de famille (identifiant, énoncé, bonne réponse, angle), pour éviter les doublons.
   - `simulation.js` : la simulation de 90 jours décrite dans la spécification.

9. README.md (première version)
   - Structure du projet ; lancement des tests ; ajout d'un lot ; lots correctifs.
   - La conversation 2 complète le déploiement et l'installation.

10. Vérification et livraison
    - `node outils/tests.js`, puis `node outils/simulation.js` : tout est au vert.
    - Exécute `preparer.js`, puis fais le commit et le push.
</etapes>

<rapport_final>
- Tableau du référentiel validé (totaux).
- Résultat des tests et de la simulation (file restante maximale, nouvelles par bloc).
- Les décisions prises seule, sur des détails réversibles.
- Les messages exacts pour lancer :
  - le lot 00-demarrage et les lots 01 à 04 (module 06), qui peuvent tourner en parallèle de la conversation 2 ;
  - la conversation 2.
</rapport_final>
