/*
 * IV.G1 — Suites numériques : trouver le terme suivant.
 * Niveau 1 : arithmétique ou géométrique (5 termes affichés).
 * Niveau 2 : écarts croissants (ordre 2), écarts alternés ou suites entrelacées (6 termes).
 * Niveau 3 : suite de type Fibonacci ou affine (×a + b) (6 termes).
 * Toute instance qu'une autre règle simple prolonge autrement est rejetée.
 */
(function (racine) {
  "use strict";
  var CI = racine.CI;
  var U = CI.utils, O = CI.generateurs.outils;
  var FAMILLE = "IV.G1";
  var GEN_VERSION = 1;

  function liste(t) { return t.map(function (x) { return U.nombreFr(x, 0); }).join(" ; "); }
  function ecarts(t) { var d = []; for (var i = 1; i < t.length; i++) d.push(t[i] - t[i - 1]); return d; }
  function signe(x) { return (x >= 0 ? "+" : "−") + " " + U.nombreFr(Math.abs(x), 0); }

  function construire(rng, niveau) {
    var t = [], regle, explication, aRetenir, distracteurs = [];
    var n, i, correct;
    var choix = niveau === 1 ? rng.entier(0, 1) : niveau === 2 ? rng.entier(0, 2) : rng.entier(0, 1);

    if (niveau === 1 && choix === 0) {
      n = 5;
      var u0 = rng.entier(1, 40), r = rng.entier(2, 15) * (rng.suivant() < 0.25 ? -1 : 1);
      if (r < 0) u0 += 80;
      for (i = 0; i <= n; i++) t.push(u0 + i * r);
      regle = "arithmetique";
      correct = t[n];
      explication = "L'écart entre deux termes consécutifs est constant : " + signe(r) + ". Le terme suivant vaut donc " +
        U.nombreFr(t[n - 1], 0) + " " + signe(r) + " = " + U.nombreFr(correct, 0) + ".";
      aRetenir = "Commence toujours par calculer les écarts entre termes consécutifs.";
      distracteurs = [correct + r, correct - r, t[n - 1] + r + (r > 0 ? 1 : -1), correct + 2];
    } else if (niveau === 1) {
      n = 5;
      var g0 = rng.entier(1, 6), q = rng.entier(2, 3);
      for (i = 0; i <= n; i++) t.push(g0 * Math.pow(q, i));
      regle = "geometrique";
      correct = t[n];
      explication = "Chaque terme est le précédent multiplié par " + q + ". Le terme suivant vaut " +
        U.nombreFr(t[n - 1], 0) + " × " + q + " = " + U.nombreFr(correct, 0) + ".";
      aRetenir = "Si les écarts grandissent vite, teste un rapport constant (multiplication).";
      distracteurs = [t[n - 1] + (t[n - 1] - t[n - 2]), t[n - 1] * q + q, t[n - 1] * (q + 1), correct - t[n - 1] / q];
    } else if (niveau === 2 && choix === 0) {
      n = 6;
      var a0 = rng.entier(1, 30), d0 = rng.entier(1, 6), k = rng.entier(1, 4);
      t.push(a0);
      for (i = 1; i <= n; i++) t.push(t[i - 1] + d0 + (i - 1) * k);
      regle = "ordre2";
      correct = t[n];
      var dd = ecarts(t.slice(0, n));
      explication = "Les écarts successifs sont " + dd.map(function (x) { return U.nombreFr(x, 0); }).join(", ") +
        " : ils augmentent de " + k + " à chaque fois. L'écart suivant est " + U.nombreFr(dd[dd.length - 1] + k, 0) +
        ", donc le terme suivant vaut " + U.nombreFr(t[n - 1], 0) + " + " + U.nombreFr(dd[dd.length - 1] + k, 0) + " = " + U.nombreFr(correct, 0) + ".";
      aRetenir = "Écarts non constants : calcule les écarts des écarts (différences d'ordre 2).";
      distracteurs = [t[n - 1] + dd[dd.length - 1], correct + k, correct - 1, t[n - 1] + dd[dd.length - 1] + 2 * k];
    } else if (niveau === 2 && choix === 1) {
      n = 6;
      var p = rng.entier(2, 12), m = rng.entier(1, 9) * (rng.suivant() < 0.5 ? -1 : 1);
      if (p === m || p === -m) m += 1;
      var b0 = rng.entier(10, 40);
      t.push(b0);
      for (i = 1; i <= n; i++) t.push(t[i - 1] + (i % 2 === 1 ? p : m));
      regle = "alternee";
      correct = t[n];
      explication = "Les opérations alternent : " + signe(p) + ", puis " + signe(m) + ". Après " + signe(m) +
        ", on applique de nouveau " + signe(p) + " : " + U.nombreFr(t[n - 1], 0) + " " + signe(p) + " = " + U.nombreFr(correct, 0) + ".";
      aRetenir = "Quand les écarts reviennent par paires, la suite alterne deux opérations.";
      distracteurs = [t[n - 1] + m, correct + m, correct - 1, correct + 1];
    } else if (niveau === 2) {
      n = 6;
      var e0 = rng.entier(1, 20), e1 = rng.entier(30, 60), pe = rng.entier(2, 9), pi = -rng.entier(2, 9);
      for (i = 0; i <= n; i++) t.push(i % 2 === 0 ? e0 + (i / 2) * pe : e1 + ((i - 1) / 2) * pi);
      regle = "entrelacee";
      correct = t[n];
      explication = "Deux suites sont entrelacées. Termes de rang impair : " +
        [t[0], t[2], t[4]].map(function (x) { return U.nombreFr(x, 0); }).join(", ") + " (" + signe(pe) + " à chaque fois). Termes de rang pair : " +
        [t[1], t[3], t[5]].map(function (x) { return U.nombreFr(x, 0); }).join(", ") + " (" + signe(pi) + "). Le 7e terme appartient à la première suite : " +
        U.nombreFr(t[4], 0) + " " + signe(pe) + " = " + U.nombreFr(correct, 0) + ".";
      aRetenir = "Si la suite monte et descend sans régularité apparente, sépare les termes de rang pair et de rang impair.";
      distracteurs = [t[5] + pi, t[n - 1] + pe, correct + pe, correct - 1];
    } else if (choix === 0) {
      n = 6;
      var f0 = rng.entier(1, 9), f1 = rng.entier(1, 9);
      if (f0 === f1) f1 += 1;
      t = [f0, f1];
      for (i = 2; i <= n; i++) t.push(t[i - 1] + t[i - 2]);
      regle = "fibonacci";
      correct = t[n];
      explication = "À partir du troisième terme, chaque terme est la somme des deux précédents (" +
        U.nombreFr(t[0], 0) + " + " + U.nombreFr(t[1], 0) + " = " + U.nombreFr(t[2], 0) + ", etc.). Le terme suivant vaut " +
        U.nombreFr(t[n - 2], 0) + " + " + U.nombreFr(t[n - 1], 0) + " = " + U.nombreFr(correct, 0) + ".";
      aRetenir = "Teste la somme des deux termes précédents quand les écarts reproduisent la suite elle-même.";
      distracteurs = [t[n - 1] + (t[n - 1] - t[n - 2]), 2 * t[n - 1], correct + t[n - 3], correct - 1];
    } else {
      n = 6;
      var a = rng.entier(2, 3), b = rng.entier(-4, 5);
      if (b === 0) b = 1;
      var c0 = rng.entier(1, 5);
      t = [c0];
      for (i = 1; i <= n; i++) t.push(a * t[i - 1] + b);
      if (t[n] > 5000) return null;
      regle = "affine";
      correct = t[n];
      explication = "Chaque terme s'obtient en multipliant le précédent par " + a + " puis en ajoutant " + (b >= 0 ? b : "(" + b + ")") +
        " : " + U.nombreFr(t[0], 0) + " × " + a + " " + signe(b) + " = " + U.nombreFr(t[1], 0) + ". Le terme suivant vaut " +
        U.nombreFr(t[n - 1], 0) + " × " + a + " " + signe(b) + " = " + U.nombreFr(correct, 0) + ".";
      aRetenir = "Si chaque terme est à peu près le double (ou le triple) du précédent, cherche la correction constante ajoutée.";
      distracteurs = [a * t[n - 1], a * t[n - 1] + 2 * b, t[n - 1] + (t[n - 1] - t[n - 2]), correct + a];
    }

    var affiches = t.slice(0, n);
    if (affiches.some(function (x) { return x < 0; }) || correct < 0) return null;
    if (!O.suiteNonAmbigue(affiches, correct)) return null;
    var interdits = O.reglesCompatibles(affiches).map(function (x) { return x.suivant; });
    var cands = distracteurs.concat([correct + 1, correct - 2, correct + 3, correct + 10, correct - 10]);
    var c = O.choixNumeriques(correct, cands, function (x) { return U.nombreFr(x, 0); }, function (x) {
      return x >= 0 && O.entierExact(x) && affiches.indexOf(x) < 0 && !interdits.some(function (v) { return O.egal(v, x); });
    });
    if (!c) return null;
    return {
      enonce: "Quel nombre prolonge logiquement la suite suivante ?\n" + liste(affiches) + " ; ?",
      choix: c.choix, bonne: c.bonne, ordreFixe: true,
      explication: explication, aRetenir: aRetenir,
      piege: "S'arrêter à la première régularité sans vérifier qu'elle vaut pour tous les termes.",
      donnees: { termes: affiches }
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
