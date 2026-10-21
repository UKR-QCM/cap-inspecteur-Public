/*
 * Cap Inspecteur — registre des générateurs du bloc IV et outils partagés.
 * Un générateur : { famille, genVersion, generer(graine, niveau), anciennes?: { v: generer } }.
 * Même graine + même genVersion + même niveau → même question.
 */
(function (racine) {
  "use strict";
  var CI = racine.CI = racine.CI || {};
  var U = CI.utils;

  var registre = {};

  function enregistrer(g) {
    if (!g || !g.famille || typeof g.generer !== "function" || typeof g.genVersion !== "number") {
      throw new Error("Générateur invalide.");
    }
    registre[g.famille] = g;
  }

  function familles() {
    var r = {};
    Object.keys(registre).sort().forEach(function (f) { r[f] = registre[f].genVersion; });
    return r;
  }

  function verifierSortie(sortie, famille) {
    if (!sortie || typeof sortie.enonce !== "string" || !sortie.enonce) throw new Error(famille + " : énoncé manquant");
    if (!Array.isArray(sortie.choix) || sortie.choix.length !== 4) throw new Error(famille + " : 4 choix attendus");
    var vus = {};
    sortie.choix.forEach(function (c) {
      if (typeof c !== "string" || !c) throw new Error(famille + " : choix vide");
      if (vus[c]) throw new Error(famille + " : choix en double");
      vus[c] = true;
    });
    if ([0, 1, 2, 3].indexOf(sortie.bonne) < 0) throw new Error(famille + " : index de bonne réponse invalide");
  }

  function generer(famille, graine, niveau, genVersion) {
    var g = registre[famille];
    if (!g) throw new Error("Famille générée inconnue : " + famille);
    var v = genVersion === undefined || genVersion === null ? g.genVersion : genVersion;
    var fn = v === g.genVersion ? g.generer : (g.anciennes && g.anciennes[v]);
    if (!fn) throw new Error("Version " + v + " du générateur " + famille + " indisponible");
    var n = niveau === 2 || niveau === 3 ? niveau : 1;
    var s = fn(graine >>> 0, n);
    verifierSortie(s, famille);
    return {
      id: "G-" + famille + "-v" + v + "-n" + n + "-" + (graine >>> 0),
      bloc: "IV", notion: famille, difficulte: n, generee: true, genVersion: v,
      enonce: s.enonce, choix: s.choix, bonne: s.bonne, ordreFixe: !!s.ordreFixe,
      explication: s.explication, aRetenir: s.aRetenir,
      tableau: s.tableau || null, svg: s.svg || null, alt: s.alt || null,
      donnees: s.donnees || null,
      references: [], source: "", piege: s.piege || "", nature: "stable", statut: "valide", version: 1
    };
  }

  /* ---------- Outils partagés ---------- */

  /* Essaie des tirages successifs (graine, 0), (graine, 1)… jusqu'à une instance acceptée. */
  function tenter(graine, famille, construire) {
    for (var t = 0; t < 500; t++) {
      var rng = U.alea(U.hacher(famille + "|" + graine + "|" + t));
      var r = construire(rng);
      if (r) return r;
    }
    throw new Error(famille + " : aucune instance valide pour la graine " + graine);
  }

  function egal(a, b) { return Math.abs(a - b) < 1e-9; }
  function entierExact(x) { return egal(x, Math.round(x)); }

  /* Règles simples qui prolongent des termes numériques ; renvoie [{ regle, suivant }]. */
  function reglesCompatibles(t) {
    var r = [];
    var n = t.length;
    if (n < 3) return r;
    var d = [];
    for (var i = 1; i < n; i++) d.push(t[i] - t[i - 1]);
    if (d.every(function (x) { return egal(x, d[0]); })) r.push({ regle: "arithmetique", suivant: t[n - 1] + d[0] });
    if (t.every(function (x) { return x !== 0; })) {
      var q = t[1] / t[0];
      var ok = true;
      for (i = 1; i < n; i++) if (!egal(t[i - 1] * q, t[i])) ok = false;
      if (ok) r.push({ regle: "geometrique", suivant: t[n - 1] * q });
    }
    if (n >= 4) {
      var alt = true;
      for (i = 2; i < d.length; i++) if (!egal(d[i], d[i - 2])) alt = false;
      if (alt) r.push({ regle: "alternee", suivant: t[n - 1] + d[d.length - 2] });
    }
    if (n >= 4) {
      var d2 = [];
      for (i = 1; i < d.length; i++) d2.push(d[i] - d[i - 1]);
      if (d2.every(function (x) { return egal(x, d2[0]); })) r.push({ regle: "ordre2", suivant: t[n - 1] + d[d.length - 1] + d2[0] });
    }
    var fib = true;
    for (i = 2; i < n; i++) if (!egal(t[i], t[i - 1] + t[i - 2])) fib = false;
    if (fib) r.push({ regle: "fibonacci", suivant: t[n - 1] + t[n - 2] });
    if (!egal(t[1], t[0])) {
      var a = (t[2] - t[1]) / (t[1] - t[0]);
      var b = t[1] - a * t[0];
      var aff = true;
      for (i = 1; i < n; i++) if (!egal(a * t[i - 1] + b, t[i])) aff = false;
      if (aff) r.push({ regle: "affine", suivant: a * t[n - 1] + b });
    }
    if (n >= 6) {
      var pairs = t.filter(function (x, k) { return k % 2 === 0; });
      var impairs = t.filter(function (x, k) { return k % 2 === 1; });
      var ap = pairs.every(function (x, k) { return k === 0 || egal(x - pairs[k - 1], pairs[1] - pairs[0]); });
      var ai = impairs.every(function (x, k) { return k === 0 || egal(x - impairs[k - 1], impairs[1] - impairs[0]); });
      if (ap && ai) {
        var suivant = n % 2 === 0 ? pairs[pairs.length - 1] + pairs[1] - pairs[0] : impairs[impairs.length - 1] + impairs[1] - impairs[0];
        r.push({ regle: "entrelacee", suivant: suivant });
      }
    }
    return r;
  }

  /* Vrai si toutes les règles compatibles donnent `attendu` et qu'au moins une est compatible. */
  function suiteNonAmbigue(termes, attendu) {
    var r = reglesCompatibles(termes);
    return r.length > 0 && r.every(function (x) { return egal(x.suivant, attendu); });
  }

  var ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  function lettre(rang) { return ALPHABET.charAt(rang - 1); }
  function rangLettre(c) { return ALPHABET.indexOf(String(c).toUpperCase()) + 1; }

  /* Choix numériques : valeurs distinctes, rangées par ordre croissant (ordreFixe). */
  function choixNumeriques(correct, candidats, format, filtre) {
    var f = format || function (x) { return U.nombreFr(x, 2); };
    var ok = filtre || function () { return true; };
    var vals = [correct];
    var textes = [f(correct)];
    for (var i = 0; i < candidats.length && vals.length < 4; i++) {
      var c = candidats[i];
      if (typeof c !== "number" || !isFinite(c) || !ok(c)) continue;
      var tx = f(c);
      if (textes.indexOf(tx) >= 0 || vals.some(function (v) { return egal(v, c); })) continue;
      vals.push(c); textes.push(tx);
    }
    if (vals.length < 4) return null;
    var idx = [0, 1, 2, 3].sort(function (a, b) { return vals[a] - vals[b]; });
    return { choix: idx.map(function (k) { return textes[k]; }), bonne: idx.indexOf(0), ordreFixe: true };
  }

  /* Choix textuels : distincts, mélangés de façon déterministe. */
  function choixTextes(rng, correct, candidats) {
    var liste = [correct];
    for (var i = 0; i < candidats.length && liste.length < 4; i++) {
      if (candidats[i] && liste.indexOf(candidats[i]) < 0) liste.push(candidats[i]);
    }
    if (liste.length < 4) return null;
    var ordre = rng.melanger([0, 1, 2, 3]);
    return { choix: ordre.map(function (k) { return liste[k]; }), bonne: ordre.indexOf(0), ordreFixe: false };
  }

  CI.generateurs = {
    enregistrer: enregistrer,
    familles: familles,
    generer: generer,
    reinitialiser: function () { registre = {}; },
    outils: {
      tenter: tenter,
      egal: egal,
      entierExact: entierExact,
      reglesCompatibles: reglesCompatibles,
      suiteNonAmbigue: suiteNonAmbigue,
      lettre: lettre,
      rangLettre: rangLettre,
      choixNumeriques: choixNumeriques,
      choixTextes: choixTextes
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
