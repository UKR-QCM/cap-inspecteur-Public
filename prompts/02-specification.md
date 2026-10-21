# Cap Inspecteur — spécification de l'application

À lire dans les conversations 1, 2 et 3, après le prompt maître. Tout ce qui n'apparaît pas ici est reporté après le concours (08-apres-concours.md).

<architecture>
```
cap-inspecteur/
├── index.html
├── tests.html                 (exécute dans le navigateur les mêmes suites que outils/tests.js)
├── manifest.webmanifest
├── sw.js                      (service worker)
├── assets/css/app.css
├── assets/fonts/              (woff2 auto-hébergés)
├── assets/icons/              (logo, icônes de l'app, PNG 180/192/512 générés depuis le SVG)
├── assets/js/
│   ├── utils.js               (dates calendaires locales, horloge injectable, générateur pseudo-aléatoire initialisable)
│   ├── stockage.js            (localStorage, migrate, export, import, fusion)
│   ├── banque.js              (chargement, index, contrôle d'intégrité)
│   ├── srs.js                 (répétition espacée)
│   ├── seance.js              (séance du jour, positionnement, révisions du jour, examen blanc, entraînement libre)
│   ├── bareme.js              (notation, calibrage, note estimée)
│   ├── stats.js               (calculs du tableau de bord)
│   ├── generateurs/           (un fichier par famille IV.G1 à IV.G8)
│   ├── ui-*.js                (un fichier par écran)
│   └── app.js                 (routeur par hash, initialisation)
├── banque/referentiel.js
├── banque/manifest.js         (généré par outils/preparer.js)
├── banque/lots/*.js           (chaque lot appelle CI.banque.ajouter([...]))
├── outils/                    (preparer.js, tests.js, couverture.js, existant.js, contraste.js, simulation.js)
├── prompts/                   (copie des prompts du projet)
├── CONTRAT.md
├── PLAN-DES-LOTS.md
└── README.md
```

Contraintes :
- Scripts classiques, pas de `type="module"`, espace de noms global `window.CI`, aucun `fetch` de fichier local. L'application fonctionne en double-clic (file://) comme sur GitHub Pages.
- Les modules de logique (utils, banque, srs, seance, bareme, stats, generateurs, et stockage hormis ses lectures et écritures dans localStorage) n'accèdent jamais au DOM. Ils reçoivent l'état, la date du jour et l'horloge en paramètres. `outils/tests.js` les charge tels quels dans Node (module vm, faux `window`) ; `tests.html` les charge dans le navigateur.
- Les lots sont chargés par injection de balises `<script>` d'après `banque/manifest.js`.
- Aucune dépendance pendant l'exécution :
  - polices Quicksand et Nunito auto-hébergées en woff2 (licence SIL OFL 1.1, fichiers copiés depuis les paquets npm @fontsource), polices système en repli ;
  - icônes copiées depuis le paquet npm lucide-static (licence ISC), en SVG inline ;
  - licences mentionnées dans « À propos ».
- Service worker (actif en HTTPS uniquement) :
  - précache de tous les fichiers listés par `preparer.js`, dans un cache nommé d'après la version ;
  - `banque/manifest.js` servi réseau d'abord ;
  - quand une nouvelle version est disponible, bandeau « Nouvelle version : recharger », jamais affiché pendant une séance en cours ni à sa place.
- Performance : 2 000 questions indexées au chargement ; interface interactive en moins d'une seconde.
</architecture>

<memoire_srs>
État par question, et par famille générée pour le bloc IV :
`{ b, due, vues, justes, fausses, abstentions, sansReponse, hesitations, serie, err, hes, retoursErreur, derniere, derniereErreur, tempsMoyen }`
- `b` : boîte de 0 à 5 ;
- `due` : date « AAAA-MM-JJ » ;
- `retoursErreur` : nombre de présentations de la question alors que `err` vaut true.

Intervalles par boîte : b1 = 1 jour, b2 = 3 jours, b3 = 7 jours, b4 = 16 jours, b5 = 35 jours. Toutes les dates se calculent en jours calendaires locaux, jamais en millisecondes.

Règles appliquées à chaque réponse :
- Juste sans doute :
  - b = 2 si la question était nouvelle (b = 0), sinon b = min(b + 1, 5) ;
  - serie + 1 ; due = aujourd'hui + intervalle(b) ; hes = false ;
  - si err et serie ≥ 3, alors err = false (erreur résorbée).
- Juste avec doute :
  - b inchangé, avec un minimum de 1 ;
  - serie = 0 ; hes = true ; due = aujourd'hui + 2 jours.
- Faux, Ann ou sans réponse :
  - b = 1 ; serie = 0 ; err = true ; due = aujourd'hui + 1 jour ;
  - le compteur correspondant (fausses, abstentions ou sansReponse) augmente.

Statut d'une question, dans cet ordre de priorité : en erreur (err) > en hésitation (hes) > maîtrisée (b ≥ 4) > en cours (déjà vue) > nouvelle.

Statut d'une notion, dans cet ordre :
1. fragile : au moins une question en erreur ;
2. maîtrisée : toutes ses questions existantes vues, au moins 70 % maîtrisées, aucune en erreur ;
3. non vue : aucune question vue ;
4. en cours : tous les autres cas.

Moment de la mise à jour de la mémoire :
- séance du jour, positionnement, examen blanc : à la validation ;
- révisions du jour et entraînement libre en correction immédiate : à chaque réponse.

L'entraînement libre propose l'option « ne pas modifier la mémoire ». Une séance abandonnée ne modifie rien.

L'algorithme est documenté en clair dans le code et dans « À propos ».
</memoire_srs>

<seances>
1. Séance du jour

- Création et stockage :
  - générée à la première ouverture de la journée locale, puis stockée en entier : identifiants, ou famille + graine + `genVersion` pour les questions générées, ordre affiché des propositions, réponses, temps ;
  - un rechargement affiche exactement la séance stockée ; elle n'est jamais recalculée.
- Composition et ordre :
  - 45 questions = I 10, II 10, III 10, IV 10, V 5 ;
  - présentées bloc par bloc de I à V, mélangées à l'intérieur de chaque bloc (générateur initialisé par la date et l'identifiant du profil).
- Plancher de nouvelles par bloc, fixé d'après la file restante de la veille (révisions dues non faites à la fin de la journée) :

| File restante de la veille | Blocs I à IV | Bloc V |
|---|---|---|
| 0 | 4 | 2 |
| 1 à 40 | 3 | 1 |
| 41 à 80 | 2 | 1 |
| plus de 80 | 1 | 0 |

  Premier jour sans historique : 3 et 1.
- Remplissage de chaque bloc :
  - les places de révision (places du bloc − plancher) reçoivent les révisions dues, classées par score de priorité ;
  - les places restantes reçoivent des nouvelles questions ;
  - s'il n'y a pas assez de révisions dues, on prend plus de nouvelles ;
  - s'il n'y a plus de nouvelles, on prend des révisions non dues : les moins maîtrisées (plus petit b), puis les plus anciennement vues.
- Score de priorité = type du dernier résultat + jours de retard + min(fausses, 3).
  - Types : erreur, abstention ou sans réponse = 3 ; doute = 2 ; rappel = 1.
  - Égalité : la plus ancienne échéance, puis l'identifiant.
- Choix des nouvelles questions :
  - les notions jamais vues d'abord, puis les notions centrales ;
  - niveaux 1 et 2 seulement pendant les 7 jours qui suivent le test de positionnement ;
  - ensuite, viser 40 % de niveau 1, 45 % de niveau 2 et 15 % de niveau 3 selon la disponibilité.
- Bloc IV :
  - questions générées et questions rédigées partagent les places du bloc ;
  - au plus 2 nouvelles questions rédigées par séance, le reste généré ;
  - famille générée choisie : d'abord une famille due, sinon la moins récemment vue ;
  - niveau du générateur d'après la boîte de la famille : b0 et b1 → 1, b2 et b3 → 2, b4 et b5 → 3.
- Question sœur :
  - quand une révision choisie a err = true et retoursErreur ≥ 2 (troisième retour en erreur ou plus), et que retoursErreur est pair, elle est remplacée par une question sœur de la même notion, non maîtrisée ou nouvelle, si elle existe ;
  - la question remplacée garde son échéance.
- Anti-répétition :
  - jamais deux fois la même question dans une séance ;
  - aucune question vue dans les 3 derniers jours, sauf si elle est due ;
  - au plus 2 questions de la même notion par séance, hors erreurs dues ;
  - aucune question déjà présente dans une séance de rattrapage en attente.
- Exclusions :
  - questions dont `perimeLe` est dépassée ; elles apparaissent dans la liste « Actualité à mettre à jour » ;
  - questions dont `perimeLe` tombe avant la date du concours : elles restent dans les séances, mais sont signalées « à renouveler avant le concours » dans la même liste ;
  - questions « a_verifier », sauf si le réglage les inclut ;
  - questions signalées avec l'option « retirer des séances ».
- Rattrapage :
  - une séance non validée reste disponible en « rattrapage » jusqu'à sa validation ou son abandon ;
  - un seul rattrapage à la fois : quand une séance plus récente devient rattrapage, la plus ancienne est abandonnée automatiquement ;
  - la séance du jour est générée quand même.

2. Révisions du jour
- File : révisions dues qui n'ont pas trouvé place dans la séance du jour, classées par score de priorité.
- Accessibles à tout moment, et proposées après la validation de la séance.
- Correction immédiate après chaque réponse (bonne réponse, explication, « À retenir », lien vers la source) ; la mémoire est mise à jour à chaque réponse.
- Objectif réglable (40 par défaut), compteur de questions restantes, arrêt possible à tout moment.
- La file restante en fin de journée alimente le plancher du lendemain.

3. Test de positionnement (premier lancement)
- 45 questions aux proportions de l'épreuve : lot de démarrage `banque/lots/00-demarrage.js` (35 questions de niveaux 1 et 2 pour I, II, III et V) et générateurs de niveaux 1 et 2 pour le bloc IV.
- Mode examen, allure indicative sur 65 minutes.
- Il remplace la séance du premier jour et initialise la mémoire selon les règles.
- Résultat : taux de réussite par bloc. Les « blocs faibles » (sous le taux global) s'affichent avec une phrase prête à copier pour la prochaine conversation de lot, par exemple « Blocs faibles : II, V ».

4. Examen blanc (conversation 3)
- Proposé chaque samedi à partir du 14 novembre 2026, et disponible à la demande.
- 45 questions aux proportions de l'épreuve : nouvelles en priorité, puis les moins récemment vues.
- Durée = temps cible (65 minutes par défaut) :
  - compte à rebours, remise automatique à zéro ;
  - le temps continue de courir onglet masqué et après un rechargement.
- Pas de calculatrice intégrée : rappel d'utiliser sa calculatrice non programmable.
- Rappel : le seuil de 5/20 porte sur l'épreuve entière (QCM et QRC).
- Met à jour la mémoire à la validation.

5. Entraînement libre (conversation 3)
- Filtres : bloc, ligne du programme, notion ou famille, difficulté, statut (nouvelles, en erreur, en hésitation, abstentions, maîtrisées).
- Nombre de questions au choix ; mode correction immédiate ou mode examen ; option « ne pas modifier la mémoire ».
</seances>

<affichage_question>
- Propositions :
  - numérotées de 1 à 4 ;
  - ordre mélangé une seule fois, à la création de la séance, puis stocké ; jamais remélangé à l'affichage ni au rechargement ;
  - questions `ordreFixe` : ordre d'origine ;
  - réponses stockées par index d'origine.
- Boutons de réponse :
  - « Ann » (abstention volontaire), distinct de « sans réponse » (oubli). Après « Ann », un choix facultatif « Réponse pressentie », non noté, sert au calibrage ;
  - « Je doute », combinable avec une réponse et désactivé quand « Ann » est choisi.
- Barrer une proposition (bouton dédié ou appui long) : effet visuel seulement, mémorisé, pour pratiquer l'élimination recommandée par le guide.
- Calculatrice simple intégrée, disponible pour le bloc IV, sauf en examen blanc.
- Figures SVG : texte alternatif qui décrit la figure.
</affichage_question>

<mode_examen>
- Commandes :
  - clavier : 1 à 4 pour répondre, 0 pour Ann, H pour Je doute, flèches pour naviguer ;
  - réponse modifiable jusqu'à la validation.
- Aucune indication juste ou faux avant la validation.
- Chronomètre MM:SS avec indicateur d'allure :
  - le temps cible (réglage, 65 minutes par défaut pour 45 questions) donne l'allure : « en avance » ou « en retard » ;
  - alerte si la moyenne dépasse 2 minutes par question, plafond du guide ;
  - le chronomètre persiste au rechargement grâce à des horodatages ;
  - en pause quand l'onglet est masqué, sauf en examen blanc.
- Temps passé enregistré pour chaque question.
- Navigation :
  - grille des numéros, états distingués par la forme et la couleur ;
  - raccourcis « aller aux sans-réponse » et « aller aux doutes » ;
  - « second passage » : n'affiche que les doutes.
- Sauvegarde à chaque action.
- Validation : récapitulatif (sans réponse, doutes, abstentions, temps), confirmation explicite, puis validation irréversible.
</mode_examen>

<bareme_et_correction>
- Barème réglable : bonne réponse +1 ; Ann ou sans réponse 0 ; réponse fausse −0,5 par défaut, ou −0,25, ou −1.
- Note QCM indicative sur 20 = max(0, points) ÷ nombre de questions × 20.
  - Les points bruts sont affichés, ainsi que la note sous les trois hypothèses de barème.
  - Mention permanente : le barème et le poids du QCM dans la note de l'épreuve ne sont pas publiés.
  - L'application n'affiche jamais « éliminatoire » : le seuil de 5/20 porte sur l'épreuve entière.
- Écran de correction :
  - en tête : note, pourcentage, points bruts, temps total, comparaison avec la moyenne des 7 dernières séances ;
  - répartition : juste et sûr, juste avec doute, faux, Ann, sans réponse ;
  - liste filtrable ; pour chaque question : énoncé, ta réponse, bonne réponse, explication, « À retenir », références, lien vers la source, piège, notion et ligne du programme, temps passé ;
  - bouton « Signaler une erreur » par question : motif, commentaire, option « retirer des séances » ;
  - synthèse : notions à retravailler, erreurs récurrentes (questions ratées au moins 2 fois).
- Calibrage, sur les 30 derniers jours, global et par bloc :
  - taux de réussite des réponses données avec doute ;
  - seuils de rentabilité, p > pénalité ÷ (1 + pénalité) : 20 % pour −0,25, 33,3 % pour −0,5, 50 % pour −1 ;
  - conseil par bloc : « réponds quand tu doutes », « abstiens-toi » ou « à la limite », avec le calcul expliqué ;
  - taux de réussite des réponses pressenties après « Ann » ;
  - coût des abstentions : points qu'auraient rapportés les réponses pressenties sous le barème choisi (un nombre positif signale une prudence excessive) ;
  - en dessous de 10 réponses : « pas encore assez de données ».
- Note estimée (conversation 3) :
  - calculée uniquement sur les premières rencontres (questions jamais vues) des 14 derniers jours et sur les examens blancs ;
  - par bloc : taux de bonnes réponses, de fausses et d'abstentions, convertis en points attendus pour 45 questions selon le barème ;
  - fourchette à 95 % par approximation normale de la binomiale ;
  - affichée seulement à partir de 20 premières rencontres par bloc.
</bareme_et_correction>

<sauvegarde>
- Stockage local :
  - localStorage, clé `capinspecteur:v1`, JSON compact, champ `schemaVersion` et fonction `migrate()` ;
  - contenu : profil (pseudo, date du concours 2026-12-07 par défaut, barème, temps cible), réglages, états des questions et des familles, séances (complètes tant qu'elles ne sont pas validées ; ensuite résumé, réponses compactes et temps), file du jour, journal d'XP, signalements.
- Écriture :
  - `navigator.storage.persist()` au premier lancement ;
  - écriture regroupée environ 300 ms après chaque action, dans un try/catch, avec un indicateur discret « Sauvegardé » ;
  - mode dégradé clairement signalé si le stockage est indisponible ;
  - espace utilisé affiché.
- Export : fichier `cap-inspecteur-sauvegarde-AAAA-MM-JJ.json`.
- Import :
  - validation, puis aperçu (période couverte, nombre de séances, de questions vues) ;
  - choix entre Fusionner et Remplacer ;
  - fusion : pour chaque question ou famille, l'état dont `derniere` est la plus récente l'emporte ; séances réunies par identifiant ; XP et série recalculées depuis l'historique ;
  - une séance en cours n'est jamais écrasée sans confirmation.
- Bandeau de rappel d'export tous les 7 jours.
- Installation :
  - au premier lancement, et tant que l'application n'est pas installée, explication de l'ajout à l'écran d'accueil sur Android, iPhone et ordinateur ;
  - sur iPhone et iPad : Safari peut effacer les données d'un site non installé après 7 jours sans visite ;
  - la version ouverte en double-clic a son propre stockage, distinct de la version en ligne.
- Versions des questions :
  - état indexé par identifiant ;
  - une version supérieure du même identifiant (lot correctif) remplace l'ancienne et garde ses statistiques ;
  - une question retirée garde son historique et sort des séances.
  - Un lot correctif peut contenir des versions supérieures (`CI.banque.ajouter`) et des retraits (`CI.banque.retirer([{ id, raison }])`).
</sauvegarde>

<ecrans>
Conversation 2 (noyau) :
- Accueil au premier lancement : pseudo, date du concours, barème, temps cible, explication de l'installation, puis test de positionnement.
- Aujourd'hui : séance du jour ou rattrapage, nombre de révisions du jour, J-xx, série, XP, rappel d'export, alertes (actualité à mettre à jour, questions à vérifier).
- Séance (mode examen), Correction, Révisions du jour.
- Réglages et sauvegarde : barème, temps cible, objectif de révisions du jour, inclure ou non les questions « a_verifier », animations réduites, export, import, espace utilisé.
- À propos et mentions légales :
  - outil indépendant, non affilié à la DGFiP ni à l'ENFiP ;
  - aucun logo ni élément de charte officielle ;
  - le barème appliqué est une hypothèse ;
  - les contenus sont à vérifier sur les sources citées ;
  - les données restent uniquement sur l'appareil ;
  - algorithme expliqué ;
  - licences.

Conversation 3 :
- Tableau de bord :
  - J-xx, séances validées, série, XP ;
  - courbe des notes séance par séance ;
  - taux de réussite par bloc (barres) ;
  - note estimée avec sa fourchette ;
  - calibrage par bloc comparé aux seuils ;
  - couverture : arborescence officielle avec le pourcentage de notions vues et maîtrisées par ligne ;
  - les 5 notions les plus fragiles, avec bouton « S'entraîner » ;
  - les 10 questions les plus ratées ;
  - projection : « à ce rythme, x % des notions disponibles vues le 7 décembre ».
- Entraînement libre, Examen blanc.
- Banque :
  - rapport d'intégrité ;
  - questions « a_verifier », avec bascule vers « valide » ;
  - signalements exportables en JSON ;
  - liste « Actualité à mettre à jour ».
</ecrans>

<gamification_minimale>
- XP :
  - séance du jour, positionnement ou examen blanc : 10 × max(0, points bruts) + 30 à la validation ;
  - révisions du jour : +2 par bonne réponse sûre ;
  - +20 par erreur résorbée ;
  - XP totale affichée, sans niveaux.
- Série : jours locaux consécutifs (jusqu'à aujourd'hui ou hier) avec au moins une séance validée ce jour-là. Affichée avec une icône de flamme et un nombre, sans animation.
- Rien d'autre avant le concours.
</gamification_minimale>

<direction_artistique>
« Pastel nocturne » : thème sombre, doux et reposant pour de longues séances.

Jetons de couleur (variables CSS sur `:root`, aucune couleur codée en dur ailleurs) :

| Rôle | Jeton | Valeur |
|---|---|---|
| Fond de page | --bg | #1B1926 |
| Cartes | --surface | #25223A |
| Propositions, champs | --surface-2 | #2C2843 |
| Survol, sélection | --surface-3 | #3A3260 |
| Bordures | --border | #3A3558 |
| Texte principal | --text | #F3EEFF |
| Texte secondaire | --text-2 | #B5ADCF |
| Légendes (interdit sur --surface-3) | --text-3 | #9D95BA |
| Accent | --lilas | #C8B6FF |
| Texte sur lilas | --on-lilas | #231B45 |

Couleurs de sens, toujours accompagnées d'une icône ou d'un libellé :

| Sens | Fond | Texte posé dessus |
|---|---|---|
| juste | #B7E8A6 | #1E3A14 |
| faux | #FFB5C9 | #4A1D2C |
| doute | #FFE08A | #4A3A00 |
| abstention | #CFC8E3 | #2E2A40 |

« Nouvelle question » se signale par une icône et un contour lilas, jamais par une couleur de sens.

Couleurs des blocs :

| Bloc | Fond | Texte posé dessus |
|---|---|---|
| I | #C8B6FF | #231B45 |
| II | #A9D4FF | #12304D |
| III | #FFCFA8 | #4A2A10 |
| IV | #E3B5F0 | #3F1A4A |
| V | #A8E6EF | #0E3A40 |

Sur un fond pastel, le texte est toujours la teinte foncée de la même famille.

Ombres : aucune ombre dure ; ombre `0 8px 24px rgba(10,8,20,.35)` réservée aux fenêtres et aux notifications. Aucun dégradé.

Typographie :
- titres en Quicksand (600-700) ; texte en Nunito (400-600) ;
- échelle 12 / 14 / 16 / 20 / 24 / 32 px ; interligne 1,5 pour le texte, 1,2 pour les titres ;
- chiffres tabulaires pour le chronomètre, les scores et les statistiques.

Formes et espacements :
- rayons : cartes 22 px, propositions 14 px, boutons 16 px, puces 999 px ;
- grille de 4 px ; gouttière mobile de 16 px ; marge intérieure des cartes de 16 à 20 px ;
- icônes Lucide de 20 px, trait de 2 px, extrémités arrondies.

Composants :
- Puces (bloc, notion, difficulté, statut) : pastel plein, texte foncé de la même famille.
- Boutons : primaire lilas plein, un seul par écran ; secondaire en contour lilas ; destructif rose.
- Propositions :
  - au repos : fond --surface-2, pastille ronde numérotée ;
  - sélectionnée : fond --surface-3, contour lilas de 2 px, pastille lilas pleine avec texte --on-lilas ;
  - barrée : texte barré en --text-2 (lisible aussi au survol, sur --surface-3).
- Correction : bonne réponse en vert avec une icône de coche ; mauvaise réponse en rose avec une icône de croix.
- « Ann » et « Je doute » : boutons discrets en contour, sous les propositions.
- Grille de navigation : sans réponse = contour ; répondue = lilas plein ; doute = jaune avec un point ; Ann = gris avec un trait.
- Graphiques SVG : traits arrondis, couleurs des blocs, grille en --border, infobulles sur --surface-3.
- États vides : une phrase d'invitation et une forme pastel discrète, jamais « Rien ici ».
- Logo : petite boussole lilas suivie de « Cap Inspecteur » en Quicksand 700, en SVG ; aucune ressemblance avec une identité visuelle officielle.

Mouvement :
- durées 150 ou 250 ms ; courbe cubic-bezier(.2,.8,.2,1) ; on n'anime que transform et opacity ;
- changement d'écran : fondu avec un glissement de 8 px ;
- tout est désactivé par `prefers-reduced-motion` ou par le réglage « animations réduites ».

Ton : tutoiement, chaleureux, phrases courtes, jamais infantilisant. Retours sur les erreurs pédagogiques, jamais culpabilisants.
</direction_artistique>

<accessibilite>
- Mobile d'abord :
  - barre de navigation en bas sur mobile, latérale à partir de 900 px ;
  - cibles tactiles d'au moins 44 px ;
  - aucun défilement horizontal à 320 px de large.
- Clavier :
  - tout est utilisable au clavier ;
  - anneau de focus lilas de 2 px.
- Contraste AA :
  - au moins 4,5:1 pour le texte normal ;
  - vérifié par `outils/contraste.js` pour chaque couple texte/fond utilisé dans la CSS.
- Couleur : l'information n'est jamais portée par la couleur seule.
- Lecteurs d'écran :
  - retours annoncés via aria-live ; alertes du chronomètre aussi, mais pas chaque seconde ;
  - libellé sur chaque bouton-icône ;
  - texte alternatif sur chaque figure.
</accessibilite>

<tests>
`node outils/tests.js` et `tests.html` exécutent les mêmes suites.

1. Répétition espacée :
   - toutes les transitions ;
   - nouvelle question juste et sûre → b2 ;
   - sortie d'erreur après 3 réussites ;
   - ordre de priorité des statuts.
2. Séance du jour :
   - 10/10/10/10/5 ;
   - plancher adaptatif (les 4 paliers) ;
   - classement par score ;
   - toutes les règles de complément ;
   - question sœur ;
   - anti-répétition, y compris l'exclusion du rattrapage en attente ;
   - séance identique après sérialisation puis relecture.
3. Mélange des propositions : index d'origine retrouvé après sérialisation ; `ordreFixe` respecté.
4. Barème :
   - les trois barèmes, la note sur 20 ;
   - les seuils de calibrage ;
   - le coût des abstentions avec réponses pressenties ;
   - la note estimée et sa fourchette.
5. Générateurs, pour chaque famille, chaque niveau et 1 000 graines :
   - bonne réponse recalculée indépendamment ;
   - 4 choix distincts ;
   - déterminisme (même graine et même `genVersion` → même question).

   Pour IV.G1 et IV.G2 : au moins 5 termes affichés, et aucun distracteur n'est produit par une autre règle simple compatible avec les termes affichés (arithmétique, géométrique, alternée, différences d'ordre 2, type Fibonacci, lettres à pas constant).
6. Actualité : exclusion des questions périmées ; signalement de celles qui périment avant le concours.
7. Dates :
   - arithmétique calendaire locale ;
   - passage de minuit ;
   - changements d'heure du 25 octobre 2026 et du 28 mars 2027 ;
   - série de jours.
8. Sauvegarde :
   - aller-retour export puis import ;
   - fusion selon la règle ;
   - `migrate()` d'un schéma antérieur.
9. Banque :
   - identifiants uniques ;
   - 4 choix distincts ; `bonne` entre 0 et 3 ;
   - notion ou famille existante ;
   - champs obligatoires présents, `source` et `verifieLe` exigés pour le statut « valide », `perimeLe` exigé pour l'actualité ;
   - aucune question rattachée à une compétence exclue du CRCN.
10. Simulation `outils/simulation.js` :
    - conditions : 90 jours, banque fictive de 420/330/270/250/230 questions, 40 révisions du jour faites chaque jour ;
    - profil de réussite simulé :
      - première rencontre : 50 % juste et sûr, 15 % juste avec doute, 35 % faux ou Ann ;
      - b1 : 60 % et 12 % ; b2 : 70 % et 10 % ; b3 : 80 % et 8 % ; b4 : 85 % et 5 % ; b5 : 90 % et 4 % ;
    - attendus :
      - la file restante en fin de journée ne dépasse jamais 120 ;
      - chaque séance compte 45 questions réparties 10/10/10/10/5 ;
      - chaque bloc reçoit son plancher de nouvelles tant qu'il en reste.
11. Interface (conversation 2) :
    - contraste AA de chaque couple utilisé ;
    - aucune couleur hors des jetons ;
    - recherche automatique de « TODO », « lorem » et des fonctions vides.

Critères d'acceptation :
- Aucune erreur dans la console, en double-clic comme sur GitHub Pages.
- Recharger la page conserve tout, y compris une séance en cours, l'ordre de ses propositions et son chronomètre.
- La séance du jour est identique après rechargement.
- Aucune correction n'est visible avant la validation.
- Tous les tests sont au vert.
</tests>
