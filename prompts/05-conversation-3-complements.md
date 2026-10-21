# Conversation 3 — Compléments (avant le 2 novembre si possible)

À lire après 01-prompt-maitre.md et 02-specification.md.

<objectif>
Ajouter ce qui aide à piloter les révisions d'ici le concours :
- le tableau de bord ;
- l'entraînement libre ;
- l'examen blanc ;
- l'écran Banque ;
- le générateur de figures IV.G8 ;
- la note estimée.

Puis régler l'algorithme d'après l'usage réel.
</objectif>

<etapes>
1. Dépôt et tests au vert.

2. Écrans
   - Tableau de bord, Entraînement libre, Examen blanc et Banque, conformes à <ecrans> et <seances>.
   - Boutons « S'entraîner » sur les notions à retravailler et sur les notions fragiles.

3. Note estimée et calibrage par bloc dans le tableau de bord, conformes à <bareme_et_correction>.

4. Générateur IV.G8 : suites de figures en SVG
   - Grilles simples : formes, rotations, remplissages.
   - Une seule règle par niveau, et une seule figure compatible parmi les 4 choix.
   - Texte alternatif décrivant chaque figure.
   - Tests sur 1 000 graines et sur chaque niveau.
   - Couleurs issues des jetons uniquement.

5. Réglage d'après l'usage, si l'utilisatrice joint un export de sauvegarde
   - Analyse :
     - la file restante jour par jour ;
     - les nouvelles questions vues par bloc ;
     - le temps moyen par question ;
     - le calibrage.
   - Propose, sans l'appliquer d'office, un ajustement des paliers du plancher ou de l'objectif de révisions du jour.
   - N'enregistre aucun contenu de l'export dans le dépôt.

6. Tests au vert, commit, push, bandeau de nouvelle version vérifié.
</etapes>

<rapport_final>
- Ce qui a été ajouté et testé.
- Ce qui n'a pas pu être testé automatiquement.
- Ajustements proposés.
- Rappel des dates d'examen blanc : samedis 14, 21 et 28 novembre, et 5 décembre si souhaité.
</rapport_final>
