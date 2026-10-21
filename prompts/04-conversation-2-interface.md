# Conversation 2 — Interface et mise en ligne

À lire après 01-prompt-maitre.md et 02-specification.md.

<objectif>
À la fin de cette conversation, l'application est en ligne sur GitHub Pages, installable sur téléphone et sur ordinateur, et utilisable chaque jour :
- premier lancement et test de positionnement ;
- séance du jour en mode examen ;
- correction ;
- révisions du jour ;
- réglages et sauvegarde ;
- « À propos ».
</objectif>

<etapes>
1. Dépôt
   - Attache, clone, lis `CONTRAT.md` et `PLAN-DES-LOTS.md`.
   - Lance `node outils/tests.js` : tout doit être au vert avant de commencer.

2. Ressources
   - Installe les paquets npm @fontsource/quicksand, @fontsource/nunito et lucide-static.
   - Copie uniquement les fichiers woff2 nécessaires (latin, graisses utilisées) et les icônes utilisées.
   - Génère les icônes PNG 180, 192 et 512 à partir du logo SVG, avec un outil installé localement.
   - N'ajoute au dépôt aucun dossier node_modules.

3. Interface
   - Fichiers : `index.html`, `assets/css/app.css` (jetons de 02-specification.md), `app.js` (routeur par hash), un fichier `ui-*.js` par écran.
   - Écrans de la conversation 2 listés dans <ecrans>.
   - Fonctions à inclure :
     - calculatrice du bloc IV ;
     - barrer une proposition ;
     - réponse pressentie après « Ann » ;
     - signalement d'erreur ;
     - bandeau de rappel d'export ;
     - bandeau de nouvelle version ;
     - aide à l'installation, avec l'avertissement sur Safari.
   - Si le lot 00-demarrage n'est pas encore dans le dépôt :
     - le test de positionnement affiche ce qui manque et propose d'attendre ;
     - les données de test restent cantonnées à `tests.html` et à `outils/`, jamais dans `banque/`.

4. Hors ligne
   - `sw.js` et `manifest.webmanifest` conformes à <architecture>.
   - Teste la mise à jour du cache : une nouvelle version du manifeste des lots est bien prise en compte.

5. Tests
   - `tests.html` exécute les mêmes suites que `outils/tests.js`.
   - `outils/contraste.js` vérifie chaque couple texte/fond utilisé dans la CSS, et l'absence de toute couleur hors des jetons.
   - Ajoute la recherche automatique de « TODO », de « lorem » et des fonctions vides.
   - Si Chromium sans interface s'installe dans l'environnement (par exemple avec Playwright), vérifie automatiquement :
     - `index.html` en file:// et via un serveur local : aucune erreur dans la console ;
     - `tests.html` : tout au vert ;
     - le parcours complet : premier lancement, positionnement partiel, rechargement en pleine séance (réponses, ordre des propositions et chronomètre conservés), validation, correction, export puis import.

     Sinon, dis-le clairement et ajoute ce parcours à la liste de contrôle manuel du rapport.

6. Mise en ligne
   - Commit et push.
   - Indique à l'utilisatrice comment activer GitHub Pages : dans les réglages du dépôt, rubrique Pages, déploiement depuis la branche main, dossier racine.
   - Une fois Pages actif, vérifie que l'URL publique répond.

7. README.md, à compléter
   - Mise en ligne sur GitHub Pages.
   - Installation sur Android, iPhone et ordinateur.
   - Sauvegarde, restauration et usage sur deux appareils : un seul appareil par jour, ou export en fin de séance puis import avec « Fusionner ».
   - Ajout d'un lot ; lots correctifs.
   - Les prompts du dossier `prompts/` et leur ordre d'utilisation.
</etapes>

<rapport_final>
- URL de l'application.
- Résultat des tests automatiques, et ce qui n'a pas pu être testé automatiquement.
- Liste de contrôle manuel de 5 points pour l'utilisatrice :
  1. installer l'application sur le téléphone et sur l'ordinateur ;
  2. lancer le test de positionnement ;
  3. recharger la page en pleine séance ;
  4. valider la séance et lire la correction ;
  5. exporter puis importer la sauvegarde.
- Message exact pour lancer la conversation 3.
</rapport_final>
