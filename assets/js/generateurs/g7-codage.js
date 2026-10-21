/*
 * IV.G7 — Codage lettres-valeurs.
 * Niveau 1 : code explicite (rang alphabétique, ou tarif voyelle / consonne donné).
 * Niveau 2 : tarif à découvrir, fonction affine du nombre de lettres (deux exemples).
 * Niveau 3 : tarif à découvrir selon les voyelles et les consonnes (trois exemples).
 * Voyelles : A, E, I, O, U (aucun mot ne contient de Y).
 */
(function (racine) {
  "use strict";
  var CI = racine.CI;
  var U = CI.utils, O = CI.generateurs.outils;
  var FAMILLE = "IV.G7";
  var GEN_VERSION = 1;

  var MOTS = ["CHAT", "LOUP", "ROSE", "TABLE", "IMPOT", "BUDGET", "TRESOR", "FISCAL", "LIVRE", "ARBRE", "PORTE", "MAISON",
    "JARDIN", "ECOLE", "AVION", "BATEAU", "CRAYON", "PAPIER", "BUREAU", "CHAISE", "LAMPE", "MONTRE", "NUAGE", "SOLEIL",
    "ORANGE", "CITRON", "POMME", "MELON", "RADIS", "TIGRE", "ZEBRE", "LION", "OURS", "CERF", "LAPIN", "CANARD", "PIGEON",
    "MOUTON", "CHEVAL", "VACHE", "POULE", "RIVIERE", "MONTAGNE", "VALLEE", "PLAGE", "FORET", "DESERT", "ROUTE", "TRAIN",
    "VELO", "METRO", "TAXI", "CAMION", "FUSEE", "ETOILE", "PLANETE", "COMETE", "NOTE", "LETTRE", "TIMBRE", "COLIS",
    "TULIPE", "JACINTHE", "VIOLETTE", "BANQUE", "CONTRAT", "DOSSIER", "AGENT", "CAISSE", "RECETTE", "DEPENSE"]
    .filter(function (m) { return m.indexOf("Y") < 0; });

  function voyelles(m) { return m.split("").filter(function (c) { return "AEIOU".indexOf(c) >= 0; }).length; }
  function consonnes(m) { return m.length - voyelles(m); }
  function sommeRangs(m) { return m.split("").reduce(function (s, c) { return s + O.rangLettre(c); }, 0); }
  function euros(x) { return U.nombreFr(x, 0) + " €"; }

  function motsDistincts(rng, k, condition) {
    var r = [];
    for (var t = 0; t < 200 && r.length < k; t++) {
      var m = rng.choisir(MOTS);
      if (r.indexOf(m) < 0 && (!condition || condition(m, r))) r.push(m);
    }
    return r.length === k ? r : null;
  }

  function construire(rng, niveau) {
    var v = rng.entier(0, 1);
    var enonce, explication, aRetenir, correct, cands, fmt = euros, donnees, mots;

    if (niveau === 1 && v === 0) {
      mots = motsDistincts(rng, 1, function (m) { return m.length <= 6; });
      if (!mots) return null;
      var m = mots[0];
      correct = sommeRangs(m);
      enonce = "Chaque lettre vaut son rang dans l'alphabet (A = 1, B = 2, …, Z = 26). Quelle est la valeur du mot " + m + ", égale à la somme de ses lettres ?";
      explication = m.split("").map(function (c) { return c + " = " + O.rangLettre(c); }).join(" ; ") + ". Somme : " +
        m.split("").map(O.rangLettre).join(" + ") + " = " + correct + ".";
      aRetenir = "Repères utiles : E = 5, J = 10, O = 15, T = 20, Y = 25.";
      cands = [correct + 1, correct - 1, correct - O.rangLettre(m.charAt(m.length - 1)), correct + 10, correct - 10];
      fmt = function (x) { return U.nombreFr(x, 0); };
      donnees = { type: "rang", mot: m };
    } else if (niveau === 1) {
      mots = motsDistincts(rng, 1, function (w) { return voyelles(w) !== consonnes(w); });
      if (!mots) return null;
      var w = mots[0], a = rng.entier(1, 5), b = rng.entier(2, 7);
      if (a === b) b += 1;
      correct = a * voyelles(w) + b * consonnes(w);
      enonce = "Pour graver un mot, un artisan facture " + euros(a) + " par voyelle (A, E, I, O, U) et " + euros(b) + " par consonne. Combien coûte la gravure du mot " + w + " ?";
      explication = w + " compte " + voyelles(w) + " voyelle" + (voyelles(w) > 1 ? "s" : "") + " et " + consonnes(w) + " consonne" + (consonnes(w) > 1 ? "s" : "") +
        " : " + voyelles(w) + " × " + a + " + " + consonnes(w) + " × " + b + " = " + euros(correct) + ".";
      aRetenir = "Compte séparément voyelles et consonnes avant d'appliquer les tarifs.";
      cands = [b * voyelles(w) + a * consonnes(w), a * w.length, b * w.length, correct + (b - a), correct - (b - a)];
      donnees = { type: "tarif_explicite", mot: w, voyelle: a, consonne: b };
    } else if (niveau === 2) {
      mots = motsDistincts(rng, 3, function (x, deja) { return deja.every(function (y) { return y.length !== x.length; }); });
      if (!mots) return null;
      var pa = rng.entier(2, 6), pb = rng.entier(1, 9);
      var ex = mots.slice(0, 2).map(function (x) { return [x, pa * x.length + pb]; });
      var cible = mots[2];
      correct = pa * cible.length + pb;
      if (ex.some(function (e) { return e[0].length === cible.length; })) return null;
      // Rejet si le prix est aussi proportionnel à la somme des rangs (autre règle simple).
      var k = ex[0][1] / sommeRangs(ex[0][0]);
      if (O.egal(k * sommeRangs(ex[1][0]), ex[1][1]) && !O.egal(k * sommeRangs(cible), correct)) return null;
      enonce = "Dans une boutique, le prix d'une plaque gravée dépend uniquement du nombre de lettres du mot : " +
        ex.map(function (e) { return e[0] + " coûte " + euros(e[1]); }).join(" et ") + ". Combien coûte la plaque " + cible + " ?";
      var dl = ex[1][0].length - ex[0][0].length, dp = ex[1][1] - ex[0][1];
      explication = "Entre " + ex[0][0] + " (" + ex[0][0].length + " lettres) et " + ex[1][0] + " (" + ex[1][0].length + " lettres), le prix varie de " +
        euros(dp) + " pour " + dl + " lettre" + (Math.abs(dl) > 1 ? "s" : "") + " : chaque lettre coûte " + euros(pa) + ". Il reste une part fixe de " +
        euros(ex[0][1]) + " − " + ex[0][0].length + " × " + pa + " = " + euros(pb) + ". " + cible + " compte " + cible.length + " lettres : " +
        cible.length + " × " + pa + " + " + pb + " = " + euros(correct) + ".";
      aRetenir = "Deux exemples permettent de séparer le prix par lettre et la part fixe.";
      cands = [pa * cible.length, Math.round(ex[0][1] / ex[0][0].length * cible.length), correct + pa, correct - pa, correct + 1];
      donnees = { type: "longueur", exemples: ex, mot: cible };
    } else {
      mots = motsDistincts(rng, 4);
      if (!mots) return null;
      var va = rng.entier(1, 6), cb = rng.entier(1, 6);
      if (va === cb) cb += 1;
      var ex3 = mots.slice(0, 3).map(function (x) { return [x, va * voyelles(x) + cb * consonnes(x)]; });
      var cible3 = mots[3];
      correct = va * voyelles(cible3) + cb * consonnes(cible3);
      var e0 = ex3[0][0], e1 = ex3[1][0];
      var det = voyelles(e0) * consonnes(e1) - voyelles(e1) * consonnes(e0);
      if (det === 0) return null;
      if (ex3.some(function (e) { return voyelles(e[0]) === voyelles(cible3) && consonnes(e[0]) === consonnes(cible3); })) return null;
      // Rejet si une règle « prix = α × longueur + β » explique aussi les trois exemples.
      var l0 = e0.length, l1 = e1.length;
      if (l0 !== l1) {
        var al = (ex3[1][1] - ex3[0][1]) / (l1 - l0), be = ex3[0][1] - al * l0;
        if (ex3.every(function (e) { return O.egal(al * e[0].length + be, e[1]); })) return null;
      }
      enonce = "Le prix d'une plaque gravée dépend du nombre de voyelles (A, E, I, O, U) et du nombre de consonnes : " +
        ex3.map(function (e) { return e[0] + " coûte " + euros(e[1]); }).join(", ") + ". Combien coûte la plaque " + cible3 + " ?";
      explication = "Notons v le prix d'une voyelle et c celui d'une consonne. " +
        ex3.slice(0, 2).map(function (e) { return e[0] + " : " + voyelles(e[0]) + "v + " + consonnes(e[0]) + "c = " + e[1]; }).join(" ; ") +
        ". La résolution donne v = " + va + " € et c = " + cb + " €, ce que confirme " + ex3[2][0] + ". " + cible3 + " compte " + voyelles(cible3) +
        " voyelle(s) et " + consonnes(cible3) + " consonne(s) : " + voyelles(cible3) + " × " + va + " + " + consonnes(cible3) + " × " + cb + " = " + euros(correct) + ".";
      aRetenir = "Pose une équation par exemple, résous avec deux d'entre eux, vérifie avec le troisième.";
      cands = [cb * voyelles(cible3) + va * consonnes(cible3), va * cible3.length, cb * cible3.length, correct + va, correct - cb, correct + 1];
      donnees = { type: "voyelles", exemples: ex3, mot: cible3 };
    }
    var c = O.choixNumeriques(correct, cands, fmt, function (x) { return x > 0 && O.entierExact(x); });
    if (!c) return null;
    return {
      enonce: enonce, choix: c.choix, bonne: c.bonne, ordreFixe: true,
      explication: explication, aRetenir: aRetenir,
      piege: "Mal compter les lettres : écris le mot et numérote-les.",
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
