/*
 * IV.G2 — Séries alphanumériques : trouver l'élément suivant.
 * Niveau 1 : lettres à pas constant (5 termes).
 * Niveau 2 : couples lettre-nombre, chaque composante à pas constant (5 termes).
 * Niveau 3 : lettres à pas croissant (6 termes) ou couples lettre à pas croissant et nombre décroissant (5 termes).
 * Rangs de l'alphabet : A = 1 … Z = 26, sans retour au début.
 */
(function (racine) {
  "use strict";
  var CI = racine.CI;
  var U = CI.utils, O = CI.generateurs.outils;
  var FAMILLE = "IV.G2";
  var GEN_VERSION = 1;
  var L = O.lettre;

  function rangs(liste) { return liste.map(function (r) { return L(r) + " (" + r + ")"; }).join(", "); }

  function construire(rng, niveau) {
    var lettres = [], nombres = null, n, i, correctL, correctN = null;
    var explication, aRetenir;
    var variante = niveau === 3 ? rng.entier(0, 1) : 0;

    if (niveau === 1) {
      n = 5;
      var pas = rng.entier(2, 5) * (rng.suivant() < 0.3 ? -1 : 1);
      var debut = pas > 0 ? rng.entier(1, 26 - 5 * pas) : rng.entier(1 - 5 * pas, 26);
      for (i = 0; i <= n; i++) lettres.push(debut + i * pas);
      explication = "Rangs dans l'alphabet : " + rangs(lettres.slice(0, n)) + ". Le pas est constant (" + (pas > 0 ? "+" : "−") + Math.abs(pas) +
        "), donc la lettre suivante est de rang " + lettres[n] + " : " + L(lettres[n]) + ".";
      aRetenir = "Traduis les lettres en rangs (A = 1 … Z = 26) et cherche l'écart constant.";
    } else if (niveau === 2 || variante === 1) {
      n = 5;
      var pl = niveau === 2 ? rng.entier(2, 4) : 0;
      var dl0 = rng.entier(1, 2);
      var l0 = rng.entier(1, 6);
      var k = niveau === 2 ? rng.entier(2, 7) : -rng.entier(2, 6);
      var m0 = niveau === 2 ? rng.entier(1, 20) : rng.entier(40, 70);
      nombres = [];
      for (i = 0; i <= n; i++) {
        lettres.push(niveau === 2 ? l0 + i * pl : l0 + i * dl0 + (i * (i - 1)) / 2);
        nombres.push(m0 + i * k);
      }
      if (lettres[n] > 26 || nombres[n] < 0) return null;
      var ecartsL = [];
      for (i = 1; i <= n; i++) ecartsL.push(lettres[i] - lettres[i - 1]);
      explication = "Les lettres et les nombres évoluent séparément. Lettres : " + rangs(lettres.slice(0, n)) +
        (niveau === 2 ? ", pas constant de " + pl : ", écarts " + ecartsL.slice(0, n - 1).join(", ") + " qui augmentent de 1") +
        ", d'où " + L(lettres[n]) + ". Nombres : " + nombres.slice(0, n).join(", ") + ", " + (k > 0 ? "+" : "−") + Math.abs(k) +
        " à chaque fois, d'où " + nombres[n] + ". Réponse : " + L(lettres[n]) + nombres[n] + ".";
      aRetenir = "Dans une série lettre-nombre, traite séparément la partie lettre et la partie nombre.";
    } else {
      n = 6;
      var s0 = rng.entier(1, 4), d0 = rng.entier(1, 2);
      for (i = 0; i <= n; i++) lettres.push(s0 + i * d0 + (i * (i - 1)) / 2);
      if (lettres[n] > 26) return null;
      var ec = [];
      for (i = 1; i < n; i++) ec.push(lettres[i] - lettres[i - 1]);
      explication = "Rangs : " + rangs(lettres.slice(0, n)) + ". Les écarts valent " + ec.join(", ") +
        " : ils augmentent de 1. L'écart suivant est " + (ec[ec.length - 1] + 1) + ", d'où le rang " + lettres[n] + " : " + L(lettres[n]) + ".";
      aRetenir = "Si l'écart entre lettres n'est pas constant, regarde comment l'écart lui-même évolue.";
    }

    var affL = lettres.slice(0, n);
    correctL = lettres[n];
    if (correctL < 1 || correctL > 26 || affL.some(function (r) { return r < 1 || r > 26; })) return null;
    if (!O.suiteNonAmbigue(affL, correctL)) return null;
    if (nombres) {
      correctN = nombres[n];
      if (!O.suiteNonAmbigue(nombres.slice(0, n), correctN)) return null;
    }

    function texte(r, nb) { return r >= 1 && r <= 26 ? L(r) + (nb === null ? "" : String(nb)) : null; }
    var dernierEcart = affL[n - 1] - affL[n - 2];
    var cands;
    if (nombres) {
      var dk = nombres[n - 1] - nombres[n - 2];
      cands = [
        texte(correctL, correctN + 1), texte(correctL + 1, correctN), texte(correctL - 1, correctN),
        texte(affL[n - 1] + dernierEtapeSansCroissance(affL), correctN), texte(correctL, correctN + dk),
        texte(correctL + 1, correctN + 1), texte(correctL - 1, correctN - 1)
      ];
    } else {
      cands = [
        texte(correctL + 1, null), texte(correctL - 1, null), texte(affL[n - 1] + dernierEcart, null),
        texte(correctL + dernierEcart, null), texte(correctL + 2, null), texte(correctL - 2, null)
      ];
    }
    var c = O.choixTextes(rng, texte(correctL, correctN), cands);
    if (!c) return null;
    var termes = affL.map(function (r, j) { return L(r) + (nombres ? String(nombres[j]) : ""); });
    return {
      enonce: "Quel élément complète logiquement la série suivante ?\n" + termes.join(" ; ") + " ; ?",
      choix: c.choix, bonne: c.bonne, ordreFixe: false,
      explication: explication, aRetenir: aRetenir,
      piege: "Se tromper d'un rang en comptant les lettres « sur les doigts » : écris les rangs.",
      donnees: { termes: termes }
    };
  }

  function dernierEtapeSansCroissance(aff) { return aff[aff.length - 1] - aff[aff.length - 2]; }

  CI.generateurs.enregistrer({
    famille: FAMILLE,
    genVersion: GEN_VERSION,
    generer: function (graine, niveau) {
      return O.tenter(graine, FAMILLE + "|n" + niveau, function (rng) { return construire(rng, niveau); });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
