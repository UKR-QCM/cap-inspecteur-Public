/*
 * Cap Inspecteur — utilitaires sans DOM.
 * Dates calendaires locales (jamais d'arithmétique en millisecondes),
 * générateur pseudo-aléatoire initialisable, petites aides de formatage.
 */
(function (racine) {
  "use strict";
  var CI = racine.CI = racine.CI || {};

  var JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août",
    "septembre", "octobre", "novembre", "décembre"];

  function deuxChiffres(n) { return (n < 10 ? "0" : "") + n; }

  function formerJour(a, m, j) {
    return String(a) + "-" + deuxChiffres(m) + "-" + deuxChiffres(j);
  }

  /* Jour local d'un instant (ms). Le fuseau est celui de l'appareil. */
  function jourDe(ms) {
    var d = new Date(ms);
    return formerJour(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }

  function estBissextile(a) { return (a % 4 === 0 && a % 100 !== 0) || a % 400 === 0; }

  function joursDansMois(a, m) {
    return [31, estBissextile(a) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
  }

  function estJour(s) {
    if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
    var p = s.split("-").map(Number);
    return p[1] >= 1 && p[1] <= 12 && p[2] >= 1 && p[2] <= joursDansMois(p[0], p[1]);
  }

  function decomposer(jour) {
    if (!estJour(jour)) throw new Error("Jour invalide : " + jour);
    var p = jour.split("-").map(Number);
    return { a: p[0], m: p[1], j: p[2] };
  }

  /* Numéro de jour (algorithme « days from civil », calendrier grégorien proleptique).
     0 = 1970-01-01. Calcul purement entier. */
  function numeroJour(jour) {
    var d = decomposer(jour);
    var a = d.m <= 2 ? d.a - 1 : d.a;
    var ere = Math.floor(a / 400);
    var ade = a - ere * 400;
    var mp = (d.m + 9) % 12;
    var adj = Math.floor((153 * mp + 2) / 5) + d.j - 1;
    var ad4 = ade * 365 + Math.floor(ade / 4) - Math.floor(ade / 100) + adj;
    return ere * 146097 + ad4 - 719468;
  }

  function jourDeNumero(n) {
    var z = n + 719468;
    var ere = Math.floor(z / 146097);
    var dde = z - ere * 146097;
    var ade = Math.floor((dde - Math.floor(dde / 1460) + Math.floor(dde / 36524) - Math.floor(dde / 146096)) / 365);
    var a = ade + ere * 400;
    var dda = dde - (365 * ade + Math.floor(ade / 4) - Math.floor(ade / 100));
    var mp = Math.floor((5 * dda + 2) / 153);
    var j = dda - Math.floor((153 * mp + 2) / 5) + 1;
    var m = mp < 10 ? mp + 3 : mp - 9;
    return formerJour(m <= 2 ? a + 1 : a, m, j);
  }

  function ajouterJours(jour, n) { return jourDeNumero(numeroJour(jour) + n); }
  function ecartJours(a, b) { return numeroJour(b) - numeroJour(a); }

  /* 0 = lundi … 6 = dimanche. Le 1970-01-01 était un jeudi (3). */
  function jourSemaine(jour) { return ((numeroJour(jour) % 7) + 7 + 3) % 7; }

  function nomJour(i) { return JOURS[i]; }
  function nomMois(m) { return MOIS[m - 1]; }

  function formaterDate(jour) {
    var d = decomposer(jour);
    return (d.j === 1 ? "1er" : String(d.j)) + " " + MOIS[d.m - 1] + " " + d.a;
  }

  /* FNV-1a 32 bits. */
  function hacher(chaine) {
    var h = 0x811c9dc5;
    var s = String(chaine);
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h >>> 0;
  }

  /* mulberry32 : générateur pseudo-aléatoire initialisable. */
  function alea(graine) {
    var etat = (typeof graine === "number" ? graine : hacher(graine)) >>> 0;
    function suivant() {
      etat = (etat + 0x6D2B79F5) >>> 0;
      var t = etat;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    return {
      suivant: suivant,
      entier: function (min, max) { return min + Math.floor(suivant() * (max - min + 1)); },
      choisir: function (tab) { return tab[Math.floor(suivant() * tab.length)]; },
      melanger: function (tab) {
        var r = tab.slice();
        for (var i = r.length - 1; i > 0; i--) {
          var k = Math.floor(suivant() * (i + 1));
          var x = r[i]; r[i] = r[k]; r[k] = x;
        }
        return r;
      }
    };
  }

  function cloner(o) { return o === undefined ? undefined : JSON.parse(JSON.stringify(o)); }

  /* Nombre au format français : virgule décimale, espace fine insécable pour les milliers. */
  function nombreFr(x, decimales) {
    var d = decimales === undefined ? 2 : decimales;
    var arrondi = Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
    var neg = arrondi < 0;
    var s = Math.abs(arrondi).toFixed(d);
    if (s.indexOf(".") >= 0) s = s.replace(/0+$/, "").replace(/\.$/, "");
    var parts = s.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return (neg ? "−" : "") + parts.join(",");
  }

  function pgcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = b; b = a % b; a = t; }
    return a;
  }

  function fraction(n, d) {
    if (d === 0) throw new Error("Dénominateur nul");
    var g = pgcd(n, d) || 1;
    var s = d < 0 ? -1 : 1;
    return { n: s * n / g, d: s * d / g };
  }

  function fractionTexte(n, d) {
    var f = fraction(n, d);
    return f.d === 1 ? String(f.n) : f.n + "/" + f.d;
  }

  CI.utils = {
    jourDe: jourDe,
    estJour: estJour,
    estBissextile: estBissextile,
    joursDansMois: joursDansMois,
    numeroJour: numeroJour,
    jourDeNumero: jourDeNumero,
    ajouterJours: ajouterJours,
    ecartJours: ecartJours,
    jourSemaine: jourSemaine,
    nomJour: nomJour,
    nomMois: nomMois,
    formaterDate: formaterDate,
    hacher: hacher,
    alea: alea,
    cloner: cloner,
    nombreFr: nombreFr,
    pgcd: pgcd,
    fraction: fraction,
    fractionTexte: fractionTexte
  };
})(typeof window !== "undefined" ? window : globalThis);
