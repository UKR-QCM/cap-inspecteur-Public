/*
 * Cap Inspecteur — simulation de 90 jours d'utilisation.
 *
 * Conditions : banque fictive de 420 / 330 / 270 / 250 / 230 questions (blocs I à V),
 * familles générées réelles pour le bloc IV, séance du jour validée chaque jour,
 * puis 40 révisions du jour. Profil de réussite simulé :
 *   première rencontre : 50 % juste et sûr, 15 % juste avec doute, 35 % faux ou Ann ;
 *   b1 : 60 % et 12 % ; b2 : 70 % et 10 % ; b3 : 80 % et 8 % ; b4 : 85 % et 5 % ; b5 : 90 % et 4 %.
 * Attendus : file restante en fin de journée toujours ≤ 120 ; 45 questions par séance
 * réparties 10/10/10/10/5 ; chaque bloc reçoit son plancher de nouvelles tant qu'il en reste.
 *
 * Script classique : exécuté dans le navigateur (tests.html) ou dans Node (`node outils/simulation.js`).
 */
(function (racine) {
  "use strict";

  var PROFIL = { 0: [0.50, 0.15], 1: [0.60, 0.12], 2: [0.70, 0.10], 3: [0.80, 0.08], 4: [0.85, 0.05], 5: [0.90, 0.04] };
  var TAILLES = { I: 420, II: 330, III: 270, IV: 250, V: 230 };
  var PLACES = { I: 10, II: 10, III: 10, IV: 10, V: 5 };
  var LIMITE_FILE = 120;

  function banqueFictive(CI) {
    var R = CI.referentiel;
    var questions = [];
    Object.keys(TAILLES).forEach(function (bloc) {
      var cibles = bloc === "IV" ? R.familles.filter(function (f) { return f.bloc === "IV" && !f.generee; }).map(function (f) { return f.id; })
        : bloc === "V" ? R.familles.filter(function (f) { return f.bloc === "V"; }).map(function (f) { return f.id; })
          : R.notions.filter(function (n) { return n.bloc === bloc; }).map(function (n) { return n.id; });
      var compteur = {};
      for (var i = 0; i < TAILLES[bloc]; i++) {
        var notion = cibles[i % cibles.length];
        compteur[notion] = (compteur[notion] || 0) + 1;
        var x = (i * 7) % 20;
        questions.push({
          id: "Q-" + notion + "-" + (compteur[notion] < 10 ? "0" : "") + compteur[notion],
          bloc: bloc, notion: notion, difficulte: x < 8 ? 1 : x < 17 ? 2 : 3,
          ordreFixe: false, statut: "valide", nature: "stable", bonne: 0, version: 1
        });
      }
    });
    return questions;
  }

  function simuler(CI, options) {
    var o = options || {};
    var U = CI.utils, S = CI.seance;
    var jours = o.jours || 90;
    var debut = o.debut || "2026-10-22";
    var rng = U.alea(o.graine || 20261207);
    var questions = banqueFictive(CI);
    var etat = CI.stockage.etatVide(debut, "simulation");
    etat.profil.positionnementLe = U.ajouterJours(debut, -1);
    var familles = CI.generateurs.familles();
    var erreurs = [];
    var journal = [];
    var fileMax = 0, jourMax = null;
    var nouvellesTotal = { I: 0, II: 0, III: 0, IV: 0, V: 0 };

    function tirer(etatMemoire) {
      var b = etatMemoire && etatMemoire.vues ? Math.max(1, etatMemoire.b) : 0;
      var p = PROFIL[b], x = rng.suivant();
      if (x < p[0]) return "juste";
      if (x < p[0] + p[1]) return "doute";
      return rng.suivant() < 0.75 ? "faux" : "ann";
    }

    function repondreSelon(item, code) {
      if (code === "juste") { item.reponse = 0; item.doute = false; }
      else if (code === "doute") { item.reponse = 0; item.doute = true; }
      else if (code === "faux") { item.reponse = 1; item.doute = rng.suivant() < 0.3; }
      else { item.ann = true; item.reponse = null; }
      item.temps = 60;
    }

    for (var d = 0; d < jours; d++) {
      var jour = U.ajouterJours(debut, d);
      var ctx = {
        etat: etat, jour: jour, maintenant: d * 86400000,
        questions: questions, referentiel: CI.referentiel, familles: familles,
        lot: function () { return null; },
        resoudre: function () { return { bonne: 0 }; }
      };
      var nonVues = {};
      Object.keys(PLACES).forEach(function (b) {
        nonVues[b] = questions.filter(function (q) { return q.bloc === b && !(etat.questions[q.id] && etat.questions[q.id].vues); }).length;
      });
      var prep = S.preparerJournee(ctx);
      var s = prep.seance;
      if (!s) { erreurs.push(jour + " : aucune séance du jour"); continue; }
      if (s.items.length !== 45) erreurs.push(jour + " : " + s.items.length + " questions au lieu de 45");
      var parBloc = {}, nouvelles = {};
      s.items.forEach(function (it) {
        parBloc[it.bloc] = (parBloc[it.bloc] || 0) + 1;
        if (it.nouvelle) nouvelles[it.bloc] = (nouvelles[it.bloc] || 0) + 1;
      });
      Object.keys(PLACES).forEach(function (b) {
        if ((parBloc[b] || 0) !== PLACES[b]) erreurs.push(jour + " : bloc " + b + " = " + (parBloc[b] || 0) + " questions");
        var attendu = b === "IV" ? s.plancher[b] : Math.min(s.plancher[b], nonVues[b]);
        if ((nouvelles[b] || 0) < attendu) erreurs.push(jour + " : bloc " + b + " a reçu " + (nouvelles[b] || 0) + " nouvelles pour un plancher de " + s.plancher[b]);
        nouvellesTotal[b] += nouvelles[b] || 0;
      });
      s.items.forEach(function (it) {
        repondreSelon(it, tirer(it.q ? etat.questions[it.q] : etat.familles[it.f]));
      });
      S.valider(ctx, s.id);
      var faites = 0;
      while (faites < 40) {
        var item = S.prochaineRevision(ctx);
        if (!item) break;
        var code = tirer(item.q ? etat.questions[item.q] : etat.familles[item.f]);
        var rep = code === "ann" ? { ann: true } : { choix: code === "faux" ? 1 : 0, doute: code === "doute" };
        S.repondreRevision(ctx, rep);
        faites += 1;
      }
      var file = S.fileRestante(ctx, jour);
      if (file > fileMax) { fileMax = file; jourMax = jour; }
      if (file > LIMITE_FILE) erreurs.push(jour + " : file restante de " + file + " (> " + LIMITE_FILE + ")");
      journal.push({ jour: jour, file: file, plancher: s.plancher, nouvelles: nouvelles, revisions: faites });
    }
    var vues = {};
    Object.keys(PLACES).forEach(function (b) {
      vues[b] = questions.filter(function (q) { return q.bloc === b && etat.questions[q.id] && etat.questions[q.id].vues; }).length;
    });
    return { jours: jours, fileMax: fileMax, jourMax: jourMax, nouvellesTotal: nouvellesTotal, vues: vues, journal: journal, erreurs: erreurs };
  }

  function rapport(r) {
    var l = [];
    l.push("Simulation sur " + r.jours + " jours");
    l.push("File restante maximale : " + r.fileMax + " (le " + r.jourMax + ") ; limite : " + LIMITE_FILE);
    l.push("Nouvelles vues par bloc (questions générées comprises pour IV) : " +
      Object.keys(r.nouvellesTotal).map(function (b) { return b + " " + r.nouvellesTotal[b]; }).join(", "));
    l.push("Questions rédigées vues à la fin : " + Object.keys(r.vues).map(function (b) { return b + " " + r.vues[b] + "/" + TAILLES[b]; }).join(", "));
    var paliers = {};
    r.journal.forEach(function (j) { var k = j.plancher.I + "/" + j.plancher.V; paliers[k] = (paliers[k] || 0) + 1; });
    l.push("Jours par palier de plancher (I à IV / V) : " + Object.keys(paliers).sort().map(function (k) { return k + " → " + paliers[k]; }).join(", "));
    l.push(r.erreurs.length ? "ÉCHEC : " + r.erreurs.length + " anomalie(s)\n  " + r.erreurs.slice(0, 20).join("\n  ") : "Tous les attendus sont respectés.");
    return l.join("\n");
  }

  var api = { simuler: simuler, rapport: rapport, banqueFictive: banqueFictive, LIMITE_FILE: LIMITE_FILE };
  if (racine && racine.CI) racine.CI.simulation = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));

if (typeof require !== "undefined" && typeof module !== "undefined" && require.main === module) {
  process.env.TZ = process.env.TZ || "Europe/Paris";
  var charger = require("./charger.js");
  var CI = charger.charger({ lots: false });
  var r = module.exports.simuler(CI);
  console.log(module.exports.rapport(r));
  process.exit(r.erreurs.length ? 1 : 0);
}
