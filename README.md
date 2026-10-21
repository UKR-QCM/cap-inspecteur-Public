# Cap Inspecteur

Application web personnelle de préparation au QCM de l'épreuve écrite n° 2 du concours externe d'inspecteur des Finances publiques (écrits des 7 et 8 décembre 2026).

Outil indépendant, non affilié à la DGFiP ni à l'ENFiP. Gratuite, hors ligne une fois installée, sans IA au quotidien ; la progression reste sur l'appareil.

> Première version (conversation 1) : cœur logique, générateurs et outils. L'interface, la mise en ligne sur GitHub Pages et l'installation sur téléphone et ordinateur arrivent avec la conversation 2.

## Structure

```
index.html, manifest.webmanifest, sw.js   interface et hors ligne (conversation 2)
tests.html                                mêmes tests que Node, dans le navigateur
sw-liste.js                               généré : fichiers préchargés et version du cache
assets/js/
  utils.js      dates calendaires locales, générateur pseudo-aléatoire initialisable
  banque.js     chargement des lots, versions, retraits, contrôle d'intégrité
  srs.js        répétition espacée (boîtes 0 à 5)
  seance.js     séance du jour, rattrapage, positionnement, révisions du jour, examen blanc, entraînement libre
  bareme.js     notation, calibrage, note estimée
  stats.js      XP, série, tableau de bord
  stockage.js   localStorage, migration, export, import, fusion
  generateurs/  registre.js + un fichier par famille IV.G1 à IV.G7
banque/
  referentiel.js   programme officiel découpé en notions (lignes, notions, familles, cibles)
  manifest.js      généré : liste des lots
  lots/*.js        questions, un fichier par lot
outils/
  charger.js       charge les modules dans Node (module vm)
  tests.js         lance toutes les suites (outils/suites.js)
  simulation.js    simulation de 90 jours d'utilisation
  couverture.js    questions existantes face aux cibles
  existant.js      questions déjà écrites pour un préfixe
  preparer.js      régénère banque/manifest.js et sw-liste.js
prompts/           prompts du projet et PDF du programme
CONTRAT.md         contrat d'interface entre les conversations
PLAN-DES-LOTS.md   plan et suivi des lots de questions
```

Aucune dépendance : il suffit de Node 18 ou plus récent pour les outils.

## Lancer les tests

```sh
node outils/tests.js          # toutes les suites (environ 6 s)
node outils/tests.js "5."     # une seule suite, par exemple les générateurs
node outils/simulation.js     # simulation de 90 jours seule
```

Le code de retour est non nul en cas d'échec. Dans le navigateur, ouvre `tests.html`.

## Ajouter un lot de questions

1. Lancer la conversation du lot (prompts `01-prompt-maitre.md` et `06-module-lot.md`). Elle commence par :
   ```sh
   node outils/existant.js I.C.1      # questions déjà écrites, prochain identifiant libre
   ```
2. Le lot est un fichier `banque/lots/<identifiant>.js` :
   ```js
   CI.banque.ajouter([
     { id: "Q-I.C.1.a.01-01", bloc: "I", notion: "I.C.1.a.01", /* … format de CONTRAT.md § 2.1 */ }
   ], { lot: "01-budget-centrales" });
   ```
3. Contrôler, puis publier :
   ```sh
   node outils/tests.js                 # intégrité de la banque comprise
   node outils/couverture.js --prefixe I.C
   node outils/preparer.js              # manifeste des lots et version du cache
   ```
4. Mettre à jour `PLAN-DES-LOTS.md`, commit, `git pull --rebase`, push.

## Lots correctifs

Un lot correctif `banque/lots/correctif-AAAA-MM-JJ.js` est chargé après les lots numérotés. Il peut :

- remplacer une question : même identifiant, `version` + 1. La nouvelle version garde les statistiques de l'ancienne ;
- retirer une question des séances : `CI.banque.retirer([{ id: "Q-…", raison: "…" }])`. Son historique est conservé.

## Répétition espacée, en bref

- Boîtes 0 (jamais vue) à 5. Intervalles : 1, 3, 7, 16 et 35 jours.
- Juste et sûr : la question monte d'une boîte ; une nouvelle question passe directement en boîte 2.
- Juste avec doute : même boîte, retour dans 2 jours.
- Faux, Ann ou sans réponse : boîte 1, « en erreur », retour le lendemain. L'erreur est résorbée après 3 réussites sûres de suite.
- La séance du jour compte toujours 45 questions (10/10/10/10/5). Le nombre minimum de nouvelles questions par bloc dépend des révisions restées en retard la veille : de 4 à 1 par bloc, et de 2 à 0 en anglais.

Le détail des règles et des décisions figure dans `CONTRAT.md` (§ 6).
