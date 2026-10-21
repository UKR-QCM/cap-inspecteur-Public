/*
 * IV.G4 — Probabilités simples. Réponses en fractions irréductibles, rangées par valeur croissante.
 * Niveau 1 : un tirage dans une urne, ou un lancer de dé.
 * Niveau 2 : deux tirages, avec ou sans remise, de deux boules de la même couleur.
 * Niveau 3 : deux tirages sans remise de couleurs différentes, « au moins une » avec remise, ou somme de deux dés.
 */
(function (racine) {
  "use strict";
  var CI = racine.CI;
  var U = CI.utils, O = CI.generateurs.outils;
  var FAMILLE = "IV.G4";
  var GEN_VERSION = 1;

  function F(n, d) { return U.fraction(n, d); }
  function tx(f) { return U.fractionTexte(f.n, f.d); }

  function choixFractions(correct, cands) {
    var liste = [correct];
    for (var i = 0; i < cands.length && liste.length < 4; i++) {
      var c = cands[i];
      if (!c || c.d <= 0 || c.n <= 0 || c.n > c.d) continue;
      if (liste.some(function (x) { return x.n * c.d === c.n * x.d; })) continue;
      liste.push(c);
    }
    if (liste.length < 4) return null;
    var idx = [0, 1, 2, 3].sort(function (a, b) { return liste[a].n / liste[a].d - liste[b].n / liste[b].d; });
    return { choix: idx.map(function (k) { return tx(liste[k]); }), bonne: idx.indexOf(0) };
  }

  function urne(rng) {
    var r = rng.entier(2, 7), b = rng.entier(2, 7), v = rng.suivant() < 0.5 ? rng.entier(1, 5) : 0;
    return { rouges: r, bleues: b, vertes: v };
  }

  function decrireUrne(u) {
    var p = [u.rouges + " boules rouges", u.bleues + " boules bleues"];
    if (u.vertes) p.push(u.vertes === 1 ? "1 boule verte" : u.vertes + " boules vertes");
    return "Une urne contient " + (p.length === 3 ? p[0] + ", " + p[1] + " et " + p[2] : p[0] + " et " + p[1]) +
      ", indiscernables au toucher.";
  }

  function construire(rng, niveau) {
    var u, n, correct, cands, enonce, explication, aRetenir, donnees;
    var v = rng.entier(0, niveau === 3 ? 2 : 1);

    if (niveau === 1 && v === 0) {
      u = urne(rng); n = u.rouges + u.bleues + u.vertes;
      correct = F(u.rouges, n);
      enonce = decrireUrne(u) + " On tire une boule au hasard. Quelle est la probabilité qu'elle soit rouge ?";
      explication = "Il y a " + n + " boules en tout, dont " + u.rouges + " rouges. Chaque boule a la même chance d'être tirée : p = " +
        u.rouges + "/" + n + (tx(correct) !== u.rouges + "/" + n ? " = " + tx(correct) : "") + ".";
      aRetenir = "Probabilité = nombre de cas favorables ÷ nombre de cas possibles.";
      cands = [F(u.rouges, u.bleues + u.vertes), F(1, n), F(u.bleues, n), F(u.rouges, n + 1), F(u.rouges + 1, n)];
      donnees = { type: "urne", urne: u, evenement: "une_rouge" };
    } else if (niveau === 1) {
      var seuil = rng.entier(2, 5);
      correct = F(6 - seuil, 6);
      enonce = "On lance un dé équilibré à 6 faces numérotées de 1 à 6. Quelle est la probabilité d'obtenir un nombre strictement supérieur à " + seuil + " ?";
      explication = "Les résultats favorables sont " + [1, 2, 3, 4, 5, 6].filter(function (x) { return x > seuil; }).join(", ") +
        ", soit " + (6 - seuil) + " cas sur 6 : p = " + (6 - seuil) + "/6" + (tx(correct) !== (6 - seuil) + "/6" ? " = " + tx(correct) : "") + ".";
      aRetenir = "« Strictement supérieur » exclut la valeur elle-même.";
      cands = [F(7 - seuil, 6), F(5 - seuil, 6), F(1, 6), F(seuil, 6), F(6 - seuil, 5)];
      donnees = { type: "de", seuil: seuil };
    } else if (niveau === 2) {
      u = urne(rng); n = u.rouges + u.bleues + u.vertes;
      var avec = v === 0;
      correct = avec ? F(u.rouges * u.rouges, n * n) : F(u.rouges * (u.rouges - 1), n * (n - 1));
      enonce = decrireUrne(u) + " On tire successivement deux boules " + (avec ? "avec remise" : "sans remise") +
        ". Quelle est la probabilité de tirer deux boules rouges ?";
      explication = avec
        ? "Avec remise, les deux tirages sont identiques et indépendants : p = (" + u.rouges + "/" + n + ") × (" + u.rouges + "/" + n + ") = " + tx(correct) + "."
        : "Sans remise : " + u.rouges + "/" + n + " pour la première boule, puis " + (u.rouges - 1) + "/" + (n - 1) +
          " pour la seconde (une rouge et une boule en moins). p = " + u.rouges + "/" + n + " × " + (u.rouges - 1) + "/" + (n - 1) + " = " + tx(correct) + ".";
      aRetenir = "Sans remise, le numérateur et le dénominateur diminuent de 1 au second tirage.";
      cands = avec
        ? [F(u.rouges * (u.rouges - 1), n * (n - 1)), F(u.rouges, n), F(2 * u.rouges, n * n), F(u.rouges * u.rouges, n * (n - 1))]
        : [F(u.rouges * u.rouges, n * n), F(u.rouges, n), F(u.rouges * (u.rouges - 1), n * n), F(u.rouges - 1, n - 1)];
      donnees = { type: "urne", urne: u, evenement: avec ? "deux_rouges_avec" : "deux_rouges_sans" };
    } else if (v === 0) {
      u = urne(rng); u.vertes = 0; n = u.rouges + u.bleues;
      correct = F(2 * u.rouges * u.bleues, n * (n - 1));
      enonce = decrireUrne(u) + " On tire successivement deux boules sans remise. Quelle est la probabilité d'obtenir une boule de chaque couleur ?";
      explication = "Deux ordres sont possibles. Rouge puis bleue : " + u.rouges + "/" + n + " × " + u.bleues + "/" + (n - 1) +
        ". Bleue puis rouge : " + u.bleues + "/" + n + " × " + u.rouges + "/" + (n - 1) + ". Total : 2 × " + u.rouges + " × " + u.bleues +
        " / (" + n + " × " + (n - 1) + ") = " + tx(correct) + ".";
      aRetenir = "« Une de chaque » : n'oublie pas les deux ordres possibles.";
      cands = [F(u.rouges * u.bleues, n * (n - 1)), F(2 * u.rouges * u.bleues, n * n), F(u.rouges * u.bleues, n * n), F(1, 2)];
      donnees = { type: "urne", urne: u, evenement: "une_de_chaque_sans" };
    } else if (v === 1) {
      u = urne(rng); n = u.rouges + u.bleues + u.vertes;
      var non = n - u.rouges;
      correct = F(n * n - non * non, n * n);
      enonce = decrireUrne(u) + " On tire successivement deux boules avec remise. Quelle est la probabilité d'obtenir au moins une boule rouge ?";
      explication = "On passe par l'événement contraire « aucune rouge » : (" + non + "/" + n + ")² = " + tx(F(non * non, n * n)) +
        ". Donc p = 1 − " + tx(F(non * non, n * n)) + " = " + tx(correct) + ".";
      aRetenir = "« Au moins un » : calcule la probabilité du contraire (« aucun ») et soustrais-la de 1.";
      cands = [F(2 * u.rouges, n), F(u.rouges * u.rouges, n * n), F(2 * u.rouges * non, n * n), F(non * non, n * n), F(u.rouges, n)];
      donnees = { type: "urne", urne: u, evenement: "au_moins_une_rouge_avec" };
    } else {
      var s = rng.entier(4, 10);
      var fav = 0;
      for (var a = 1; a <= 6; a++) for (var b = 1; b <= 6; b++) if (a + b === s) fav += 1;
      correct = F(fav, 36);
      enonce = "On lance deux dés équilibrés à 6 faces. Quelle est la probabilité que la somme des deux faces soit égale à " + s + " ?";
      var couples = [];
      for (a = 1; a <= 6; a++) for (b = 1; b <= 6; b++) if (a + b === s) couples.push("(" + a + ", " + b + ")");
      explication = "Il y a 36 couples équiprobables. Les couples de somme " + s + " sont " + couples.join(", ") + ", soit " + fav +
        " cas : p = " + fav + "/36" + (tx(correct) !== fav + "/36" ? " = " + tx(correct) : "") + ".";
      aRetenir = "Avec deux dés, compte les couples ordonnés : (1, 2) et (2, 1) sont deux cas différents.";
      var nonOrd = 0;
      for (a = 1; a <= 6; a++) for (b = a; b <= 6; b++) if (a + b === s) nonOrd += 1;
      cands = [F(nonOrd, 36), F(fav, 11), F(1, 11), F(fav + 1, 36), F(fav - 1, 36), F(1, 6)];
      donnees = { type: "deux_des", somme: s };
    }
    var c = choixFractions(correct, cands.concat([F(1, 3), F(1, 4), F(2, 5), F(1, 5)]));
    if (!c) return null;
    return {
      enonce: enonce, choix: c.choix, bonne: c.bonne, ordreFixe: true,
      explication: explication, aRetenir: aRetenir,
      piege: "Confondre tirage avec remise et sans remise.",
      donnees: donnees
    };
  }

  CI.generateurs.enregistrer({
    famille: FAMILLE,
    genVersion: GEN_VERSION,
    generer: function (graine, niveau) {
      return O.tenter(graine, FAMILLE + "|n" + niveau, function (rng) { return construire(rng, niveau); });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
