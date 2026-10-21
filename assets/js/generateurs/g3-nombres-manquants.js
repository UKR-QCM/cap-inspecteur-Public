/*
 * IV.G3 — Nombres manquants dans un tableau.
 * Niveau 1 : deux lignes liées par « × k » ou « + k » ; case manquante en fin de ligne 2.
 * Niveau 2 : deux lignes liées par « × a + b » ou « x² + c » ; case manquante n'importe où en ligne 2.
 * Niveau 3 : grille de 3 lignes (a, b, c) où c dépend de a et b ; c manquant en dernière ligne.
 * L'instance est rejetée si une autre règle simple du même type donne un autre nombre.
 */
(function (racine) {
  "use strict";
  var CI = racine.CI;
  var U = CI.utils, O = CI.generateurs.outils;
  var FAMILLE = "IV.G3";
  var GEN_VERSION = 1;

  /* Règles « ligne 1 → ligne 2 » ajustées sur les colonnes complètes. */
  function reglesLignes(paires) {
    var r = [];
    function verifie(f) { return paires.every(function (p) { return O.egal(f(p[0]), p[1]); }); }
    var p0 = paires[0], p1 = paires[1];
    if (p0[0] !== 0) { var k = p0[1] / p0[0]; if (verifie(function (x) { return k * x; })) r.push({ nom: "× " + k, f: function (x) { return k * x; } }); }
    var c = p0[1] - p0[0];
    if (verifie(function (x) { return x + c; })) r.push({ nom: "+ " + c, f: function (x) { return x + c; } });
    if (p1[0] !== p0[0]) {
      var a = (p1[1] - p0[1]) / (p1[0] - p0[0]), b = p0[1] - a * p0[0];
      if (verifie(function (x) { return a * x + b; })) r.push({ nom: "× " + a + " + " + b, f: function (x) { return a * x + b; } });
    }
    var cc = p0[1] - p0[0] * p0[0];
    if (verifie(function (x) { return x * x + cc; })) r.push({ nom: "x² + " + cc, f: function (x) { return x * x + cc; } });
    return r;
  }

  /* Règles « (a, b) → c » à un paramètre, ajustées sur la première ligne et vérifiées sur les autres. */
  var FORMES_GRILLE = [
    { nom: "somme", g: function (a, b) { return a + b; }, mode: "plus" },
    { nom: "produit", g: function (a, b) { return a * b; }, mode: "plus" },
    { nom: "différence", g: function (a, b) { return a - b; }, mode: "plus" },
    { nom: "somme", g: function (a, b) { return a + b; }, mode: "fois" },
    { nom: "différence", g: function (a, b) { return a - b; }, mode: "fois" },
    { nom: "produit", g: function (a, b) { return a * b; }, mode: "fois" },
    { nom: "double plus", g: function (a, b) { return 2 * a + b; }, mode: "plus" },
    { nom: "double plus", g: function (a, b) { return 2 * a + b; }, mode: "fois" },
    { nom: "carré", g: function (a, b) { return a * a + b; }, mode: "plus" },
    { nom: "carré", g: function (a, b) { return a * a + b; }, mode: "fois" }
  ];

  function reglesGrille(lignes) {
    var r = [];
    FORMES_GRILLE.forEach(function (fm) {
      var l0 = lignes[0];
      var base = fm.g(l0[0], l0[1]);
      var p;
      if (fm.mode === "plus") p = l0[2] - base;
      else { if (base === 0) return; p = l0[2] / base; }
      var f = fm.mode === "plus" ? function (a, b) { return fm.g(a, b) + p; } : function (a, b) { return fm.g(a, b) * p; };
      if (lignes.every(function (l) { return O.egal(f(l[0], l[1]), l[2]); })) r.push({ nom: fm.nom + " " + fm.mode + " " + p, f: f });
    });
    return r;
  }

  function texteTableau(t) { return t.map(function (l) { return l.join(" | "); }).join("\n"); }
  function fmt(x) { return U.nombreFr(x, 0); }

  function construire(rng, niveau) {
    var tableau, donnees, correct, explication, aRetenir, cands, i;
    if (niveau <= 2) {
      var cols = 4;
      var xs = [];
      while (xs.length < cols) { var x = rng.entier(1, niveau === 1 ? 12 : 9); if (xs.indexOf(x) < 0) xs.push(x); }
      if (niveau === 2) xs.sort(function (a, b) { return a - b; });
      var regle, f, desc;
      var v = rng.entier(0, 1);
      if (niveau === 1 && v === 0) { var k = rng.entier(2, 9); f = function (x) { return k * x; }; desc = "multiplié par " + k; regle = { k: k }; }
      else if (niveau === 1) { var c = rng.entier(3, 25); f = function (x) { return x + c; }; desc = "augmenté de " + c; regle = { c: c }; }
      else if (v === 0) {
        var a = rng.entier(2, 5), b = rng.entier(1, 9) * (rng.suivant() < 0.5 ? -1 : 1);
        f = function (x) { return a * x + b; }; desc = "multiplié par " + a + (b > 0 ? ", puis augmenté de " + b : ", puis diminué de " + (-b)); regle = { a: a, b: b };
      } else {
        var cc = rng.entier(-5, 9);
        f = function (x) { return x * x + cc; }; desc = "élevé au carré" + (cc > 0 ? ", puis augmenté de " + cc : cc < 0 ? ", puis diminué de " + (-cc) : ""); regle = { carre: cc };
      }
      var ys = xs.map(f);
      if (ys.some(function (y) { return y < 0; })) return null;
      var manquant = niveau === 1 ? cols - 1 : rng.entier(0, cols - 1);
      correct = ys[manquant];
      var paires = xs.map(function (x, j) { return [x, ys[j]]; }).filter(function (p, j) { return j !== manquant; });
      var regles = reglesLignes(paires);
      if (!regles.length || !regles.every(function (rg) { return O.egal(rg.f(xs[manquant]), correct); })) return null;
      tableau = [["Ligne 1"].concat(xs.map(fmt)), ["Ligne 2"].concat(ys.map(function (y, j) { return j === manquant ? "?" : fmt(y); }))];
      donnees = { type: "lignes", ligne1: xs, ligne2: ys.map(function (y, j) { return j === manquant ? null : y; }) };
      explication = "Dans chaque colonne, le nombre de la ligne 2 est celui de la ligne 1 " + desc + ". Vérification sur une colonne complète : " +
        fmt(paires[0][0]) + " donne " + fmt(paires[0][1]) + ". Pour " + fmt(xs[manquant]) + ", on obtient " + fmt(correct) + ".";
      aRetenir = "Cherche la règle qui transforme chaque nombre du haut en celui du bas, et vérifie-la sur toutes les colonnes.";
      var x0 = xs[manquant];
      cands = [correct + 1, correct - 1, x0 + (paires[0][1] - paires[0][0]), paires[0][0] === 0 ? null : x0 * (paires[0][1] / paires[0][0]),
        correct + x0, correct + 2, correct - 2, correct + 10];
    } else {
      var forme = rng.entier(0, 2);
      var lignes = [];
      var p = forme === 0 ? rng.entier(-6, 6) : forme === 1 ? rng.entier(2, 4) : rng.entier(1, 9);
      var g = forme === 0 ? function (a, b) { return a * b + p; } : forme === 1 ? function (a, b) { return (a + b) * p; } : function (a, b) { return 2 * a + b + p; };
      var noms = [
        "c = a × b " + (p >= 0 ? "+ " + p : "− " + (-p)),
        "c = (a + b) × " + p,
        "c = 2 × a + b + " + p
      ];
      for (i = 0; i < 3; i++) {
        var a1 = rng.entier(2, 9), b1 = rng.entier(2, 9);
        lignes.push([a1, b1, g(a1, b1)]);
      }
      if (lignes.some(function (l) { return l[2] < 0; })) return null;
      if (lignes[0][0] === lignes[1][0] && lignes[0][1] === lignes[1][1]) return null;
      correct = lignes[2][2];
      var rg2 = reglesGrille(lignes.slice(0, 2));
      if (!rg2.length || !rg2.every(function (r) { return O.egal(r.f(lignes[2][0], lignes[2][1]), correct); })) return null;
      tableau = [["a", "b", "c"]].concat(lignes.map(function (l, j) { return [fmt(l[0]), fmt(l[1]), j === 2 ? "?" : fmt(l[2])]; }));
      donnees = { type: "grille", lignes: lignes.map(function (l, j) { return j === 2 ? [l[0], l[1], null] : l.slice(); }) };
      explication = "Sur les deux premières lignes, la troisième colonne suit la règle " + noms[forme] + " : " +
        lignes.slice(0, 2).map(function (l) { return fmt(l[0]) + " et " + fmt(l[1]) + " donnent " + fmt(l[2]); }).join(" ; ") +
        ". Pour " + fmt(lignes[2][0]) + " et " + fmt(lignes[2][1]) + ", on obtient " + fmt(correct) + ".";
      aRetenir = "Dans une grille, teste d'abord somme, produit et différence, puis une correction constante.";
      var l2 = lignes[2];
      cands = [l2[0] + l2[1] + p, l2[0] * l2[1], (l2[0] + l2[1]) * 2, correct + 1, correct - 1, correct + p, correct + 2, correct - 3];
    }
    var ch = O.choixNumeriques(correct, cands, fmt, function (x) { return x >= 0 && O.entierExact(x); });
    if (!ch) return null;
    return {
      enonce: "Quel nombre remplace le point d'interrogation dans le tableau ?\n" + texteTableau(tableau),
      choix: ch.choix, bonne: ch.bonne, ordreFixe: true, tableau: tableau,
      explication: explication, aRetenir: aRetenir,
      piege: "Valider une règle sur une seule colonne alors qu'elle ne marche pas sur les autres.",
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
