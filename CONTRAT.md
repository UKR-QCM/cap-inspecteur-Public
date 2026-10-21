# Contrat d'interface — Cap Inspecteur

Ce document fait le lien entre les conversations. Toute modification d'interface (format, fonction publique, stockage) le met à jour dans le même commit.

Version du contrat : 1 (conversation 1, 21 octobre 2026).

## 1. Conventions générales

- Scripts classiques (aucun `type="module"`), tous rattachés à l'espace de noms global `window.CI`. Aucun `fetch` de fichier local : l'application fonctionne en `file://` et sur GitHub Pages.
- Les modules de logique (`utils`, `banque`, `srs`, `bareme`, `seance`, `stats`, `generateurs`, et `stockage` hormis `charger`/`sauvegarder`) n'accèdent jamais au DOM, ni à `Date.now()`, ni à `Math.random()`. La date du jour (`jour`, chaîne `AAAA-MM-JJ`) et l'instant (`maintenant`, millisecondes) sont passés en paramètre.
- Toutes les dates métier sont des jours calendaires locaux `AAAA-MM-JJ`. L'arithmétique des jours est purement calendaire (`CI.utils.ajouterJours`, `CI.utils.ecartJours`), jamais en millisecondes.
- Ordre de chargement : `utils.js`, `banque.js`, `banque/referentiel.js`, `srs.js`, `bareme.js`, `seance.js`, `stats.js`, `stockage.js`, `generateurs/registre.js`, `generateurs/g1-…` à `g7-…`, `banque/manifest.js`, puis les lots (injectés par balises `<script>` d'après le manifeste).
- `outils/charger.js` charge les mêmes fichiers dans Node (module `vm`, faux `window`).

## 2. Formats de données

### 2.1 Question (banque)

```js
{
  id: "Q-I.C.1.a.01-01",          // Q-<notion ou famille>-<nn>, jamais réutilisé
  bloc: "I",                      // "I" | "II" | "III" | "IV" | "V"
  notion: "I.C.1.a.01",           // notion (blocs I à III) ou famille (IV.R*, V.*)
  difficulte: 2,                  // 1 | 2 | 3
  enonce: "...",
  choix: ["...", "...", "...", "..."],
  bonne: 0,                       // index dans choix, avant tout mélange
  ordreFixe: false,               // true : nombres ou dates rangés par ordre croissant, jamais mélangés
  explication: "...",
  aRetenir: "...",
  references: [{ texte: "...", article: "..." }],
  source: "https://...",
  piege: "...",
  voirAussi: [],                  // facultatif
  angle: "definition",            // facultatif : definition | competence | chronologie | procedure | hierarchie | distinction | cas | intrus
  nature: "stable",               // "stable" | "actualite"
  verifieLe: "AAAA-MM-JJ",
  perimeLe: "AAAA-MM-JJ",         // obligatoire si actualite
  statut: "valide",               // "valide" | "a_verifier"
  raisonAVerifier: "",            // obligatoire si a_verifier
  version: 1
}
```

Règles contrôlées par `CI.banque.controler` : identifiant unique et bien formé (préfixe = notion) ; 4 choix non vides et distincts ; `bonne` entier de 0 à 3 ; notion ou famille existante dans le référentiel, famille non générée ; `bloc` cohérent avec la notion ; champs obligatoires présents ; « valide » exige `source` (URL http/https) et `verifieLe` ; « a_verifier » exige `raisonAVerifier` ; « actualite » exige `perimeLe` ; `ordreFixe` exige des choix numériques strictement croissants ou des dates croissantes ; aucune question rattachée à une compétence CRCN exclue.

### 2.2 Question générée (bloc IV, familles IV.G*)

Un générateur renvoie :

```js
{
  enonce, choix: [4 chaînes], bonne, explication, aRetenir,
  ordreFixe: true|false,          // le générateur fixe lui-même l'ordre d'affichage
  tableau: [["2", "5", "?"], ...],// facultatif : grille à afficher (IV.G3)
  svg: "<svg…>", alt: "...",      // facultatif (IV.G8, conversation 3)
  donnees: { ... }                // données brutes du problème, sans la réponse, pour la vérification indépendante des tests
}
```

`CI.generateurs.generer(famille, graine, niveau)` complète avec `id: "G-<famille>-v<genVersion>-n<niveau>-<graine>"`, `bloc: "IV"`, `notion: <famille>`, `difficulte: niveau`, `genVersion`, `generee: true`, `statut: "valide"`, `nature: "stable"`.

### 2.3 État de mémoire (par question, et par famille générée)

```js
{
  b: 0,                 // boîte 0 à 5
  due: null,            // "AAAA-MM-JJ" ou null si jamais vue
  vues: 0, justes: 0, fausses: 0, abstentions: 0, sansReponse: 0, hesitations: 0,
  serie: 0,             // réussites sûres consécutives
  err: false, hes: false,
  retoursErreur: 0,     // présentations (ou remplacements par une sœur) alors que err vaut true
  derniere: null,       // jour de la dernière réponse
  derniereErreur: null,
  tempsMoyen: 0,        // secondes
  dernier: null         // extension : dernier résultat "juste" | "doute" | "faux" | "ann" | "sans" (sert au score de priorité)
}
```

Codes de résultat (`CI.srs.CODES`) : `juste` (juste et sûr), `doute` (juste avec doute), `faux`, `ann`, `sans` (sans réponse).

### 2.4 Séance stockée

```js
{
  id: "J-2026-10-21",             // J- séance du jour, P- positionnement, E-<jour>-<n> examen blanc, L-<jour>-<n> entraînement libre
  type: "jour" | "positionnement" | "examen" | "libre",
  jour: "2026-10-21",             // jour de création
  statut: "en_cours" | "validee" | "abandonnee",
  creeLe: 1761040000000,
  options: {
    mode: "examen" | "immediat",  // immediat : correction après chaque réponse (entraînement libre)
    memoire: true,                // false : « ne pas modifier la mémoire »
    dureeCible: 3900,             // secondes
    compteARebours: false,        // true pour l'examen blanc
    pauseSiMasque: true           // false pour l'examen blanc
  },
  plancher: { I: 3, II: 3, III: 3, IV: 3, V: 1 }, // informatif (séance du jour)
  items: [Item, ...],
  courant: 0,                     // index affiché
  chrono: { cumule: 0, depuis: null }, // ms ; en marche si depuis != null
  validee: null | { le: ms, jour: "AAAA-MM-JJ", resume: Resume, xp: 0 },
  abandonneeLe: null | ms
}
```

Item :

```js
{
  q: "Q-…",                       // question rédigée
  // ou, pour une question générée :
  f: "IV.G1", graine: 123456, genVersion: 1, niveau: 2,
  bloc: "IV", notion: "IV.G1",
  ordre: [2, 0, 3, 1] | null,     // indices d'origine dans l'ordre affiché ; null = ordre d'origine (ordreFixe ou question générée)
  nouvelle: true,                 // première rencontre au moment de la création
  reponse: null | 0..3,           // index d'origine
  ann: false,
  pressentie: null | 0..3,        // index d'origine, seulement après Ann
  doute: false,
  barres: [],                     // indices d'origine barrés (effet visuel)
  temps: 0,                       // secondes passées sur la question
  remplace: "Q-…",                // facultatif : question sœur qui remplace une révision en erreur
  corrige: true                   // facultatif : déjà corrigée (entraînement libre en correction immédiate)
}
```

Après validation, `barres` est supprimé et `ordre` conservé.

### 2.5 Résumé de séance (`Resume`)

```js
{
  n: 45, justes: 30, doutesJustes: 4, fausses: 8, abstentions: 2, sansReponse: 1,
  points: 26.0,                   // sous le barème du profil
  note: 11.56,                    // sur 20
  notes: { "0.25": .., "0.5": .., "1": .. },
  parBloc: { I: { n, justes, doutesJustes, fausses, abstentions, sansReponse, points } , ... },
  temps: 3600,                    // secondes
  resorbees: 1                    // erreurs résorbées pendant la validation
}
```

### 2.6 Entrée d'historique (une par réponse enregistrée)

```js
{
  k: "J-2026-10-21#3",            // clé unique : <séance>#<index>, ou R-<jour>-<n> pour les révisions du jour
  j: "2026-10-21",
  s: "jour" | "positionnement" | "examen" | "libre" | "rev",
  q: "Q-…" | null, f: "IV.G1" | null,
  b: "I", n: "I.C.1.a.01",
  r: "juste" | "doute" | "faux" | "ann" | "sans",
  d: 0 | 1,                       // « Je doute » déclaré
  pr: null | 0 | 1,               // réponse pressentie après Ann : juste (1) ou fausse (0)
  t: 42,                          // secondes
  pre: 0 | 1,                     // première rencontre
  res: 0 | 1,                     // erreur résorbée par cette réponse
  m: 0 | 1                        // mémoire modifiée
}
```

### 2.7 État complet stocké

```js
{
  schemaVersion: 1,
  profil: {
    id: "p-…", pseudo: "", dateConcours: "2026-12-07",
    penalite: 0.5,                // 0.25 | 0.5 | 1
    tempsCible: 3900,             // secondes pour 45 questions
    creeLe: "AAAA-MM-JJ",
    positionnementLe: null        // jour de validation du test de positionnement
  },
  reglages: { objectifRevisions: 40, inclureAVerifier: false, animationsReduites: false },
  questions: { "Q-…": EtatMemoire },
  familles: { "IV.G1": EtatMemoire },
  seances: { "J-2026-10-21": Seance },
  historique: [EntreeHistorique],
  revisions: { jour: "AAAA-MM-JJ", faites: 0, compteur: 0, courant: null | Item }, // file du jour
  signalements: [{ id: "S-…", q: "Q-…", version: 1, jour, motif, commentaire, retirer: false, exporte: false }],
  dernierExport: null | "AAAA-MM-JJ",
  installationVue: false
}
```

L'XP n'est pas stockée : elle est recalculée (`CI.stats.journalXp`) à partir des séances validées et de l'historique, ce qui rend la fusion d'imports exacte.

### 2.8 Sauvegarde exportée

Fichier `cap-inspecteur-sauvegarde-AAAA-MM-JJ.json` :

```js
{ application: "cap-inspecteur", exporteLe: "AAAA-MM-JJ", etat: EtatComplet }
```

## 3. Stockage

- Clé localStorage : `capinspecteur:v1`. Valeur : JSON compact de l'état complet.
- `schemaVersion` courant : 1. `CI.stockage.migrate(obj)` accepte un état sans `schemaVersion` (schéma 0 : `etatsQuestions` au lieu de `questions`, pas d'`historique`) et le porte au schéma 1.

## 4. Fonctions publiques

Notation : `ctx` est le contexte de séance (§ 4.5).

### 4.1 `CI.utils`

| Fonction | Rôle |
|---|---|
| `jourDe(ms)` | jour local `AAAA-MM-JJ` d'un instant |
| `ajouterJours(jour, n)` | jour + n jours calendaires |
| `ecartJours(a, b)` | nombre de jours de a à b (b − a), entier |
| `numeroJour(jour)` / `jourDeNumero(n)` | conversion jour ↔ numéro de jour (calendrier grégorien proleptique) |
| `jourSemaine(jour)` | 0 = lundi … 6 = dimanche |
| `nomJour(i)`, `nomMois(m)` | noms français |
| `formaterDate(jour)` | « 21 octobre 2026 » |
| `estJour(chaine)` | validation `AAAA-MM-JJ` |
| `hacher(chaine)` | entier 32 bits non signé (FNV-1a) |
| `alea(graine)` | générateur pseudo-aléatoire initialisable : `{ suivant(), entier(min, max), choisir(tab), melanger(tab) }` (mulberry32) |
| `cloner(objet)` | copie profonde JSON |
| `nombreFr(x, decimales?)` | « 12,5 » |
| `fraction(n, d)` | `{ n, d }` irréductible ; `fractionTexte(n, d)` → « 3/10 » |

### 4.2 `CI.banque`

| Fonction | Rôle |
|---|---|
| `ajouter(questions, meta?)` | enregistre des questions ; `meta.lot` mémorise le lot d'origine. Une version supérieure du même identifiant remplace l'ancienne. |
| `retirer([{ id, raison }])` | retire des questions des séances (historique conservé) |
| `toutes()` | questions actives, dernière version |
| `question(id)` | dernière version, même retirée (ou null) |
| `estRetiree(id)`, `retraits()` | retraits enregistrés |
| `lot(id)` | lot d'origine d'une question |
| `parNotion(id)` | questions actives d'une notion ou famille |
| `controler(referentiel)` | `{ erreurs: [{ id, message }], avertissements: [...] }` |
| `etatActualite(question, jour, dateConcours)` | `"perimee"` \| `"a_renouveler"` \| `"ok"` |
| `actualiteAMettreAJour(jour, dateConcours)` | `{ perimees: [q], aRenouveler: [q] }` |
| `reinitialiser()` | vide la banque (tests) |

### 4.3 `CI.srs`

| Fonction | Rôle |
|---|---|
| `INTERVALLES` | `{ 1: 1, 2: 3, 3: 7, 4: 16, 5: 35 }` |
| `etatInitial()` | état de mémoire vierge |
| `appliquer(etat, code, jour, options?)` | nouvel état (pur). `options` : `{ doute, temps }`. Renvoie l'état avec `_resorbee: true` si l'erreur est résorbée (champ retiré avant stockage par `seance`). |
| `compterRemplacement(etat)` | +1 à `retoursErreur` (question remplacée par une sœur) |
| `statutQuestion(etat)` | `"erreur"` \| `"hesitation"` \| `"maitrisee"` \| `"en_cours"` \| `"nouvelle"` |
| `statutNotion(etats)` | `"fragile"` \| `"maitrisee"` \| `"non_vue"` \| `"en_cours"` (liste des états des questions existantes de la notion) |
| `estDue(etat, jour)` | vue et `due ≤ jour` |
| `score(etat, jour)` | type du dernier résultat + jours de retard + min(fausses, 3) |
| `comparerPriorite(a, b)` | tri : score décroissant, échéance la plus ancienne, identifiant (`a`, `b` : `{ id, etat, score }`) |
| `niveauFamille(etat)` | niveau du générateur : b0-b1 → 1, b2-b3 → 2, b4-b5 → 3 |

### 4.4 `CI.bareme`

| Fonction | Rôle |
|---|---|
| `PENALITES` | `[0.25, 0.5, 1]` |
| `points(compte, penalite)` | `compte` : `{ justes, doutesJustes, fausses }` |
| `note20(points, n)` | max(0, points) ÷ n × 20 |
| `seuil(penalite)` | p ÷ (1 + p) |
| `resumer(issues, penalite)` | `Resume` à partir de `[{ code, bloc, temps }]` |
| `calibrage(historique, jour, penalite)` | `{ global, parBloc }` : `{ doutes: { n, justes, taux }, seuil, conseil, calcul, pressenties: { n, justes, taux, cout }, assez }` |
| `noteEstimee(historique, jour, penalite)` | `{ disponible, manque, parBloc, points, note, basse, haute }` |

### 4.5 `CI.seance`

Contexte (`CI.seance.contexte(etat, jour, maintenant)` le construit à partir de `CI.banque`, `CI.referentiel` et `CI.generateurs`) :

```js
{
  etat,                       // état complet (modifié en place par les fonctions qui le disent)
  jour, maintenant,
  questions: [Question],      // questions actives
  referentiel,                // CI.referentiel
  familles: { "IV.G1": 1 },   // familles générées disponibles → genVersion
  resoudre(item) → Question   // question complète d'un item (rédigée ou générée)
}
```

| Fonction | Rôle |
|---|---|
| `contexte(etat, jour, maintenant)` | contexte par défaut |
| `plancher(fileVeille, premierJour)` | `{ I, II, III, IV, V }` |
| `fileRestante(ctx, jour)` | révisions dues au plus tard ce jour-là (questions et familles éligibles) |
| `eligible(question, ctx)` | hors questions retirées, périmées, « a_verifier » (sauf réglage), signalées « retirer » |
| `creerSeanceDuJour(ctx)` | séance du jour (pure, non stockée) |
| `preparerJournee(ctx)` | **modifie `ctx.etat`** : abandonne le rattrapage le plus ancien, crée et stocke la séance du jour si besoin. Renvoie `{ seance, rattrapage, positionnementRequis }`. |
| `creerPositionnement(ctx)` | `{ seance, manque }` (`manque` par bloc si le lot 00 est incomplet) |
| `creerExamenBlanc(ctx)` | 45 questions, compte à rebours |
| `creerEntrainement(ctx, filtres)` | `filtres` : `{ bloc, ligne, notion, difficulte, statut, nombre, mode, memoire }` |
| `stocker(etat, seance)` | ajoute la séance à l'état |
| `repondre(seance, index, { choix?, ann?, doute?, pressentie? })` | règles : choisir annule Ann ; Ann efface choix et doute ; doute impossible avec Ann ; pressentie seulement après Ann |
| `barrer(seance, index, choixOrigine)` | bascule l'état barré |
| `ordreAffiche(item, question)` | indices d'origine dans l'ordre d'affichage |
| `demarrerChrono(seance, maintenant)`, `suspendreChrono(seance, maintenant)`, `tempsEcoule(seance, maintenant)` | chronomètre persistant (ms) |
| `ajouterTemps(seance, index, secondes)` | temps passé par question |
| `recapitulatif(seance, maintenant)` | `{ sansReponse, doutes, abstentions, repondues, temps }` |
| `codeReponse(item, bonne)` | code de résultat d'un item |
| `valider(ctx, seanceId)` | **modifie `ctx.etat`** : corrige, met à jour la mémoire (si `options.memoire`), journalise, calcule le résumé et l'XP. Renvoie `{ seance, resume }`. Irréversible. |
| `abandonner(etat, seanceId, maintenant)` | statut « abandonnee », aucune modification de mémoire |
| `fileRevisions(ctx)` | révisions dues hors séance du jour et rattrapage, triées par priorité : `[Item]` |
| `prochaineRevision(ctx)` | **modifie `ctx.etat.revisions`** : item courant des révisions du jour (stable au rechargement) ou null |
| `repondreImmediat(ctx, seanceId, index, reponse)` | **modifie `ctx.etat`** : correction immédiate d'une question d'entraînement libre (mémoire mise à jour si `options.memoire`). Renvoie `{ code, bonne, question }`. |
| `repondreRevision(ctx, reponse)` | **modifie `ctx.etat`** : répond à l'item courant des révisions du jour, met à jour la mémoire et l'historique. Renvoie `{ code, bonne, question, resorbee }`. |
| `seancesEnCours(etat)` | séances non validées et non abandonnées |
| `PARAMETRES` | `{ soeurs: true, soeursDejaVues: true }` (voir § 6) |

### 4.6 `CI.stats`

| Fonction | Rôle |
|---|---|
| `journalXp(etat)` | `[{ jour, xp, motif }]` |
| `xpTotal(etat)` | somme |
| `serie(etat, jour)` | jours consécutifs (jusqu'à aujourd'hui ou hier) avec au moins une séance validée |
| `joursRestants(jour, dateConcours)` | J-xx |
| `courbeNotes(etat)` | `[{ jour, id, note }]` des séances validées |
| `moyenneRecente(etat, n)` | moyenne des notes des n dernières séances validées |
| `tauxParBloc(etat, jour, jours)` | taux de réussite par bloc sur la période |
| `couverture(referentiel, questions, etat)` | par ligne : notions disponibles, vues, maîtrisées (%) |
| `notionsFragiles(referentiel, questions, etat, n)` | notions fragiles les plus touchées |
| `plusRatees(etat, n)` | questions les plus ratées |
| `projection(referentiel, questions, etat, jour, dateConcours)` | % des notions disponibles vues au concours au rythme des 14 derniers jours |

### 4.7 `CI.stockage`

| Fonction | Rôle |
|---|---|
| `CLE`, `SCHEMA` | `"capinspecteur:v1"`, `1` |
| `etatVide(jour, idProfil)` | état neuf |
| `migrate(obj)` | porte un état au schéma courant |
| `serialiser(etat)` / `deserialiser(texte)` | JSON compact ↔ état (migré) |
| `charger(stockage)` | lit l'état depuis un objet de type localStorage ; `{ etat, erreur }` |
| `sauvegarder(stockage, etat)` | écrit ; `{ ok, erreur, octets }` |
| `planificateur(stockage, { delai, minuterie, surSauvegarde })` | écriture regroupée : `{ programmer(etat), forcer() }` |
| `exporter(etat, jour)` | `{ nomFichier, contenu }` |
| `analyserImport(texte)` | `{ ok, erreurs, etat, apercu: { debut, fin, seances, questionsVues } }` |
| `fusionner(local, importe, options?)` | `{ etat, conflits }` ; une séance en cours locale n'est remplacée que si `options.ecraserEnCours` |
| `remplacer(local, importe, options?)` | `{ etat, conflits }` |
| `taille(etat)` | octets de la sérialisation |

### 4.8 `CI.generateurs`

| Fonction | Rôle |
|---|---|
| `enregistrer({ famille, genVersion, generer(graine, niveau) })` | appelé par chaque fichier de générateur |
| `familles()` | `{ "IV.G1": genVersion, ... }` |
| `generer(famille, graine, niveau)` | question générée complète (§ 2.2) |
| `outils` | fonctions partagées : règles de suites (`reglesCompatibles`), formatage |

### 4.9 `CI.referentiel`

Voir `banque/referentiel.js` : `blocs`, `lignes`, `notions`, `familles`, `crcnExclues`, `cibles`, `ligne(id)`, `notion(id)`, `famille(id)`, `rattachement(id)`, `notionsDeLigne(id)`.

### 4.10 `CI.manifeste` (généré)

`banque/manifest.js` : `CI.manifeste = { version: "…", lots: ["banque/lots/00-demarrage.js", …] }`. `sw-liste.js` : `self.CI_PRECACHE = [...]`, `self.CI_VERSION = "…"` (lu par `sw.js`, conversation 2).

## 5. Lots

- Un fichier par lot : `banque/lots/<identifiant>.js`, qui appelle `CI.banque.ajouter([...], { lot: "<identifiant>" })`.
- Lot correctif : `banque/lots/correctif-AAAA-MM-JJ.js`, avec des versions supérieures (`ajouter`) et des retraits (`CI.banque.retirer([{ id, raison }])`). Il est chargé après les lots qu'il corrige (ordre alphabétique : `correctif-…` après les lots numérotés).
- Après tout ajout de lot : `node outils/preparer.js` (manifeste, liste de préchargement, version du cache).

## 6. Règles de séance précisées par le code (décisions de la conversation 1)

- « Vue dans les 3 derniers jours » : dernière réponse il y a 0, 1 ou 2 jours.
- Complément d'un bloc : places de révision → révisions dues par priorité ; puis nouvelles ; s'il manque des nouvelles, d'abord les autres révisions dues, puis les révisions non dues (b le plus petit, puis la plus anciennement vue).
- Question sœur : la question remplacée garde son échéance, et son compteur `retoursErreur` augmente de 1 à la validation, pour qu'elle revienne elle-même la fois suivante (sinon elle serait remplacée indéfiniment).
- Question sœur : seulement une question **déjà vue** et non maîtrisée (la spécification autorisait aussi une question nouvelle). Avec des sœurs nouvelles, la simulation sur 90 jours dépasse la limite de 120 (jusqu'à 226 selon le tirage) ; avec des sœurs déjà vues, elle reste sous 100. Réglage : `CI.seance.PARAMETRES.soeursDejaVues`.
- Dernier recours d'un bloc (banque trop petite) : toute question non choisie, hors vues récentes et hors niveau 3 nouveau pendant les 7 jours qui suivent le positionnement ; si rien ne convient, le bloc compte moins de questions.
- Fenêtre « 7 jours qui suivent le positionnement » : jusqu'à 7 jours après le jour du test inclus.
- Bloc IV : les places de révision vont aux questions rédigées dues ; les autres places reçoivent au plus 2 nouvelles rédigées, puis des questions générées (familles dues d'abord, puis la moins récemment vue ; au plus 2 par famille). Une question générée compte comme nouvelle.
- File restante de la veille : révisions (questions et familles éligibles) dues au plus tard la veille et toujours dues à la première ouverture du jour. Aucun état de mémoire → premier jour (3 et 1).
- Calibrage « à la limite » : taux de réussite à moins de 5 points du seuil.
- Note estimée : premières rencontres des 14 derniers jours et réponses d'examen blanc des 30 derniers jours. Fourchette : intervalle de prédiction normal, variance Σ nᵦ·σ²ᵦ·(1 + nᵦ/Nᵦ) (nᵦ questions du bloc à l'épreuve, Nᵦ réponses observées).
