# Module — Actualité (vers le 20 novembre, puis vers le 1er décembre 2026)

À lire après 01-prompt-maitre.md et 06-module-lot.md : les règles de rédaction et de relecture du module lot s'appliquent.

<objectif>
Que chaque question d'actualité soit juste le 7 décembre 2026, et ajouter au plus 20 questions sur les faits d'actualité du programme les plus susceptibles d'être interrogés.
</objectif>

<etapes>
1. Préparation
   - Attache et clone le dépôt ; lance les tests.
   - Indique ta date de fin de connaissances.

2. Inventaire
   - Toutes les questions `nature: "actualite"`.
   - Toutes celles dont `perimeLe` tombe avant le 2026-12-08.
   - Les questions « stables » des domaines réformés récemment (prompt maître, partie C) dont `verifieLe` remonte à plus de 30 jours.

3. Vérification
   - Revérifie chaque question sur le web à la date du jour.
   - Selon le résultat :
     - question toujours juste : mets à jour `verifieLe` et `perimeLe` ;
     - question devenue fausse ou sur le point de l'être : crée une version corrigée dans `banque/lots/correctif-AAAA-MM-JJ.js`, avec le même identifiant et `version` + 1 ;
     - fait trop instable : retire la question des séances, dans le même lot correctif, avec `CI.banque.retirer([{ id, raison }])`.

4. Ajouts, rattachés explicitement à une ligne du programme, chacun avec sa source et `perimeLe` :
   - présidence du Conseil de l'UE et trio en cours ;
   - présidences du Parlement européen, de la Commission, du Conseil européen et de la BCE ;
   - état de l'élargissement ;
   - procédure budgétaire en cours : loi de finances pour 2027 en discussion (n'interroge que la procédure et le calendrier, jamais un contenu non adopté) ;
   - dette et déficit publics (dernière publication de l'INSEE ou d'Eurostat, avec sa date) ;
   - réformes récentes entrant dans les lignes du programme.

   Écarte tout fait qui peut changer entre aujourd'hui et le 7 décembre, sauf si la question reste juste dans tous les cas.

5. Relecture et livraison
   - Relecture par un sous-agent, avec le prompt de relecture du module lot, puis arbitrage.
   - Tests au vert, `preparer.js`, commit, push.
</etapes>

<rapport_final>
- Questions confirmées, corrigées, retirées et ajoutées, avec leurs sources.
- Faits à surveiller d'ici le 7 décembre.
</rapport_final>
