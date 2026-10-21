/*
 * Cap Inspecteur — répétition espacée (boîtes de Leitner adaptées). Sans DOM.
 *
 * Algorithme, en clair :
 *  - Chaque question (et chaque famille générée du bloc IV) est dans une boîte de 0 à 5.
 *    Boîte 0 = jamais vue. Intervalles : b1 = 1 jour, b2 = 3, b3 = 7, b4 = 16, b5 = 35.
 *  - Juste et sûr : une question nouvelle passe directement en boîte 2, sinon elle monte
 *    d'une boîte (5 au plus). Elle revient après l'intervalle de sa boîte.
 *    Une question en erreur sort de l'erreur après 3 réussites sûres de suite.
 *  - Juste avec doute : la boîte ne bouge pas (1 au minimum), la question revient dans 2 jours.
 *  - Faux, abstention (Ann) ou sans réponse : retour en boîte 1, la question est marquée
 *    « en erreur » et revient le lendemain.
 *  - Les dates sont des jours calendaires locaux.
 */
(function (racine) {
  "use strict";
  var CI = racine.CI = racine.CI || {};
  var U = CI.utils;

  var INTERVALLES = { 1: 1, 2: 3, 3: 7, 4: 16, 5: 35 };
  var CODES = ["juste", "doute", "faux", "ann", "sans"];

  function etatInitial() {
    return {
      b: 0, due: null, vues: 0, justes: 0, fausses: 0, abstentions: 0, sansReponse: 0,
      hesitations: 0, serie: 0, err: false, hes: false, retoursErreur: 0,
      derniere: null, derniereErreur: null, tempsMoyen: 0, dernier: null
    };
  }

  function completer(etat) {
    var e = etatInitial();
    if (etat) Object.keys(etat).forEach(function (k) { if (k.charAt(0) !== "_") e[k] = etat[k]; });
    return e;
  }

  function appliquer(etat, code, jour, options) {
    if (CODES.indexOf(code) < 0) throw new Error("Code de résultat inconnu : " + code);
    var o = options || {};
    var e = completer(etat);
    var etaitEnErreur = e.err;
    var temps = typeof o.temps === "number" && o.temps >= 0 ? o.temps : 0;

    e.tempsMoyen = Math.round(((e.tempsMoyen * e.vues) + temps) / (e.vues + 1) * 10) / 10;
    e.vues += 1;
    e.derniere = jour;
    e.dernier = code;
    if (o.doute || code === "doute") e.hesitations += 1;
    if (etaitEnErreur) e.retoursErreur += 1;

    if (code === "juste") {
      e.b = e.b === 0 ? 2 : Math.min(e.b + 1, 5);
      e.serie += 1;
      e.justes += 1;
      e.hes = false;
      e.due = U.ajouterJours(jour, INTERVALLES[e.b]);
      if (e.err && e.serie >= 3) {
        e.err = false;
        e.retoursErreur = 0;
        e._resorbee = true;
      }
    } else if (code === "doute") {
      e.b = Math.max(e.b, 1);
      e.serie = 0;
      e.justes += 1;
      e.hes = true;
      e.due = U.ajouterJours(jour, 2);
    } else {
      e.b = 1;
      e.serie = 0;
      if (!etaitEnErreur) e.retoursErreur = 0;
      e.err = true;
      e.derniereErreur = jour;
      e.due = U.ajouterJours(jour, 1);
      if (code === "faux") e.fausses += 1;
      else if (code === "ann") e.abstentions += 1;
      else e.sansReponse += 1;
    }
    return e;
  }

  /* Question remplacée par une sœur : compte comme un retour en erreur. */
  function compterRemplacement(etat) {
    var e = completer(etat);
    if (e.err) e.retoursErreur += 1;
    return e;
  }

  function statutQuestion(etat) {
    if (!etat || !etat.vues) return "nouvelle";
    if (etat.err) return "erreur";
    if (etat.hes) return "hesitation";
    if (etat.b >= 4) return "maitrisee";
    return "en_cours";
  }

  /* `etats` : un élément par question existante de la notion (undefined si jamais vue). */
  function statutNotion(etats) {
    var liste = etats || [];
    if (!liste.length) return "non_vue";
    var vues = liste.filter(function (e) { return e && e.vues > 0; });
    if (vues.some(function (e) { return e.err; })) return "fragile";
    if (!vues.length) return "non_vue";
    if (vues.length === liste.length) {
      var maitrisees = vues.filter(function (e) { return statutQuestion(e) === "maitrisee"; }).length;
      if (maitrisees / liste.length >= 0.7) return "maitrisee";
    }
    return "en_cours";
  }

  function estDue(etat, jour) { return !!(etat && etat.vues > 0 && etat.due && etat.due <= jour); }

  function typeDernier(etat) {
    var d = etat && etat.dernier;
    if (d === "faux" || d === "ann" || d === "sans") return 3;
    if (d === "doute") return 2;
    if (d === "juste") return 1;
    return etat && etat.err ? 3 : 1;
  }

  function score(etat, jour) {
    if (!etat || !etat.due) return 0;
    return typeDernier(etat) + Math.max(0, U.ecartJours(etat.due, jour)) + Math.min(etat.fausses || 0, 3);
  }

  function comparerPriorite(a, b) {
    if (b.score !== a.score) return b.score - a.score;
    var da = a.etat && a.etat.due ? a.etat.due : "", db = b.etat && b.etat.due ? b.etat.due : "";
    if (da !== db) return da < db ? -1 : 1;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  }

  function niveauFamille(etat) {
    var b = etat ? etat.b : 0;
    return b <= 1 ? 1 : b <= 3 ? 2 : 3;
  }

  CI.srs = {
    INTERVALLES: INTERVALLES,
    CODES: CODES,
    etatInitial: etatInitial,
    appliquer: appliquer,
    compterRemplacement: compterRemplacement,
    statutQuestion: statutQuestion,
    statutNotion: statutNotion,
    estDue: estDue,
    typeDernier: typeDernier,
    score: score,
    comparerPriorite: comparerPriorite,
    niveauFamille: niveauFamille
  };
})(typeof window !== "undefined" ? window : globalThis);
