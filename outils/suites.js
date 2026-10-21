/*
 * Cap Inspecteur — suites de tests communes à `node outils/tests.js` et à `tests.html`.
 * Script classique : enregistre `CI.tests` ; aucune donnée de test n'est écrite dans `banque/`.
 */
(function (racine) {
  "use strict";
  var CI = racine.CI;
  var U = CI.utils, S = CI.srs, Se = CI.seance, B = CI.bareme, St = CI.stockage, R = CI.referentiel;
  var suites = [];

  function suite(nom, corps) { suites.push({ nom: nom, corps: corps }); }

  function vrai(c, m) { if (!c) throw new Error(m || "condition fausse"); }
  function egal(a, b, m) {
    var ja = JSON.stringify(a), jb = JSON.stringify(b);
    if (ja !== jb) throw new Error((m ? m + " — " : "") + "attendu " + jb + ", obtenu " + ja);
  }
  function proche(a, b, tol, m) {
    if (Math.abs(a - b) > (tol || 1e-6)) throw new Error((m ? m + " — " : "") + "attendu ≈ " + b + ", obtenu " + a);
  }
  function leve(fn, m) {
    var ok = false;
    try { fn(); } catch (e) { ok = true; }
    if (!ok) throw new Error(m || "une erreur était attendue");
  }

  /* ---------- Données de test ---------- */

  var JOUR = "2026-11-10";
  var HIER = U.ajouterJours(JOUR, -1);

  function notionsDuBloc(bloc) {
    if (bloc === "IV") return R.familles.filter(function (f) { return f.bloc === "IV" && !f.generee; }).map(function (f) { return f.id; });
    if (bloc === "V") return R.familles.filter(function (f) { return f.bloc === "V"; }).map(function (f) { return f.id; });
    return R.notions.filter(function (n) { return n.bloc === bloc; }).map(function (n) { return n.id; });
  }

  var compteurs = {};
  function question(notion, options) {
    var o = options || {};
    var rat = R.rattachement(notion);
    compteurs[notion] = (compteurs[notion] || 0) + 1;
    var num = compteurs[notion];
    return Object.assign({
      id: "Q-" + notion + "-" + (num < 10 ? "0" : "") + num,
      bloc: rat.bloc, notion: notion, difficulte: 1,
      enonce: "Question de test " + num + " sur " + notion + " ?",
      choix: ["Réponse A", "Réponse B", "Réponse C", "Réponse D"], bonne: 0, ordreFixe: false,
      explication: "Explication de test.", aRetenir: "À retenir de test.", references: [],
      source: "https://www.legifrance.gouv.fr/", piege: "Piège de test.", voirAussi: [],
      nature: "stable", verifieLe: "2026-10-21", statut: "valide", raisonAVerifier: "", version: 1
    }, o);
  }

  /* n questions par bloc, sur des notions distinctes (puis en boucle). */
  function banque(parBloc) {
    compteurs = {};
    var qs = [];
    Object.keys(parBloc).forEach(function (bloc) {
      var ns = notionsDuBloc(bloc);
      for (var i = 0; i < parBloc[bloc]; i++) qs.push(question(ns[i % ns.length], { difficulte: (i % 2) + 1 }));
    });
    return qs;
  }

  function etatTest(jourCreation) {
    var e = St.etatVide(jourCreation || "2026-10-01", "test");
    e.profil.positionnementLe = "2026-10-01";
    return e;
  }

  function contexte(etat, questions, options) {
    var o = options || {};
    var index = {};
    questions.forEach(function (q) { index[q.id] = q; });
    return {
      etat: etat, jour: o.jour || JOUR, maintenant: o.maintenant || 1000,
      questions: questions, referentiel: R,
      familles: o.familles === undefined ? CI.generateurs.familles() : o.familles,
      lot: o.lot || function () { return null; },
      resoudre: function (item) {
        return item.q ? index[item.q] : CI.generateurs.generer(item.f, item.graine, item.niveau, item.genVersion);
      }
    };
  }

  function marquer(etat, id, props) {
    etat.questions[id] = Object.assign(S.etatInitial(), { vues: 1, b: 2, due: U.ajouterJours(JOUR, 3), derniere: U.ajouterJours(JOUR, -10), dernier: "juste", justes: 1 }, props || {});
  }

  function itemsDuBloc(s, bloc) { return s.items.filter(function (it) { return it.bloc === bloc; }); }
  function nouvelles(s, bloc) { return itemsDuBloc(s, bloc).filter(function (it) { return it.nouvelle; }).length; }

  /* ---------- 1. Répétition espacée ---------- */
  suite("1. Répétition espacée", function (t) {
    t("nouvelle question juste et sûre → boîte 2, revient dans 3 jours", function () {
      var e = S.appliquer(null, "juste", JOUR);
      egal([e.b, e.due, e.serie, e.vues, e.justes], [2, U.ajouterJours(JOUR, 3), 1, 1, 1]);
    });
    t("juste et sûr : la boîte monte d'un cran, 5 au plus, intervalles 1/3/7/16/35", function () {
      [[1, 2, 3], [2, 3, 7], [3, 4, 16], [4, 5, 35], [5, 5, 35]].forEach(function (c) {
        var e = S.appliquer(Object.assign(S.etatInitial(), { b: c[0], vues: 3 }), "juste", JOUR);
        egal([e.b, e.due], [c[1], U.ajouterJours(JOUR, c[2])], "depuis b" + c[0]);
      });
    });
    t("juste avec doute : boîte inchangée (1 au minimum), série remise à 0, retour dans 2 jours", function () {
      var e = S.appliquer(Object.assign(S.etatInitial(), { b: 3, vues: 2, serie: 2 }), "doute", JOUR);
      egal([e.b, e.serie, e.hes, e.due, e.hesitations], [3, 0, true, U.ajouterJours(JOUR, 2), 1]);
      var n = S.appliquer(null, "doute", JOUR);
      egal(n.b, 1);
    });
    t("faux, Ann et sans réponse : boîte 1, en erreur, retour le lendemain, compteur dédié", function () {
      [["faux", "fausses"], ["ann", "abstentions"], ["sans", "sansReponse"]].forEach(function (c) {
        var e = S.appliquer(Object.assign(S.etatInitial(), { b: 4, vues: 5, serie: 4 }), c[0], JOUR);
        egal([e.b, e.err, e.serie, e.due, e[c[1]], e.derniereErreur], [1, true, 0, U.ajouterJours(JOUR, 1), 1, JOUR], c[0]);
      });
    });
    t("l'erreur est résorbée après 3 réussites sûres consécutives", function () {
      var e = S.appliquer(null, "faux", JOUR);
      e = S.appliquer(e, "juste", JOUR); vrai(e.err && !e._resorbee);
      e = S.appliquer(e, "juste", JOUR); vrai(e.err);
      e = S.appliquer(e, "juste", JOUR);
      vrai(!e.err && e._resorbee, "erreur résorbée à la 3e réussite");
    });
    t("une réussite avec doute interrompt la série de sortie d'erreur", function () {
      var e = S.appliquer(null, "faux", JOUR);
      e = S.appliquer(e, "juste", JOUR); e = S.appliquer(e, "doute", JOUR);
      e = S.appliquer(e, "juste", JOUR); e = S.appliquer(e, "juste", JOUR);
      vrai(e.err, "toujours en erreur");
      e = S.appliquer(e, "juste", JOUR);
      vrai(!e.err);
    });
    t("retoursErreur compte les présentations en erreur", function () {
      var e = S.appliquer(null, "faux", JOUR);
      egal(e.retoursErreur, 0);
      e = S.appliquer(e, "faux", JOUR); egal(e.retoursErreur, 1);
      e = S.appliquer(e, "juste", JOUR); egal(e.retoursErreur, 2);
      egal(S.compterRemplacement(e).retoursErreur, 3);
    });
    t("statut d'une question : erreur > hésitation > maîtrisée > en cours > nouvelle", function () {
      egal(S.statutQuestion(null), "nouvelle");
      egal(S.statutQuestion({ vues: 1, err: true, hes: true, b: 5 }), "erreur");
      egal(S.statutQuestion({ vues: 1, err: false, hes: true, b: 5 }), "hesitation");
      egal(S.statutQuestion({ vues: 1, err: false, hes: false, b: 4 }), "maitrisee");
      egal(S.statutQuestion({ vues: 1, err: false, hes: false, b: 3 }), "en_cours");
    });
    t("statut d'une notion", function () {
      var m = { vues: 2, b: 4 }, c = { vues: 1, b: 2 }, er = { vues: 1, b: 1, err: true };
      egal(S.statutNotion([er, m, m]), "fragile");
      egal(S.statutNotion([m, m, m, c]), "maitrisee");
      egal(S.statutNotion([m, m, c]), "en_cours");
      egal(S.statutNotion([m, m, undefined]), "en_cours");
      egal(S.statutNotion([undefined, undefined]), "non_vue");
    });
    t("score de priorité et départage", function () {
      var e = Object.assign(S.etatInitial(), { vues: 2, due: U.ajouterJours(JOUR, -4), dernier: "faux", fausses: 5 });
      egal(S.score(e, JOUR), 3 + 4 + 3);
      var d = Object.assign(S.etatInitial(), { vues: 2, due: JOUR, dernier: "doute", fausses: 1 });
      egal(S.score(d, JOUR), 2 + 0 + 1);
      var a = { id: "Q-b", etat: { due: "2026-11-01" }, score: 5 }, b = { id: "Q-a", etat: { due: "2026-11-03" }, score: 5 }, c = { id: "Q-c", etat: { due: "2026-11-01" }, score: 5 };
      egal([b, c, a].sort(S.comparerPriorite).map(function (x) { return x.id; }), ["Q-b", "Q-c", "Q-a"]);
    });
    t("niveau du générateur selon la boîte de la famille", function () {
      egal([0, 1, 2, 3, 4, 5].map(function (b) { return S.niveauFamille({ b: b }); }), [1, 1, 2, 2, 3, 3]);
    });
  });

  /* ---------- 2. Séance du jour ---------- */
  suite("2. Séance du jour", function (t) {
    t("45 questions : 10/10/10/10/5, présentées bloc par bloc, sans doublon", function () {
      var qs = banque({ I: 30, II: 30, III: 30, IV: 12, V: 12 });
      var s = Se.creerSeanceDuJour(contexte(etatTest(), qs));
      egal(s.items.length, 45);
      egal(["I", "II", "III", "IV", "V"].map(function (b) { return itemsDuBloc(s, b).length; }), [10, 10, 10, 10, 5]);
      var ordre = s.items.map(function (it) { return ["I", "II", "III", "IV", "V"].indexOf(it.bloc); });
      vrai(ordre.every(function (x, i) { return i === 0 || x >= ordre[i - 1]; }), "blocs dans l'ordre I à V");
      var ids = s.items.filter(function (it) { return it.q; }).map(function (it) { return it.q; });
      egal(ids.length, Object.keys(ids.reduce(function (m, x) { m[x] = 1; return m; }, {})).length, "aucun doublon");
    });
    t("plancher adaptatif : les quatre paliers et le premier jour", function () {
      egal(Se.plancher(0, false), { I: 4, II: 4, III: 4, IV: 4, V: 2 });
      egal(Se.plancher(1, false).I + "/" + Se.plancher(40, false).V, "3/1");
      egal([Se.plancher(41, false).I, Se.plancher(80, false).V], [2, 1]);
      egal([Se.plancher(81, false).I, Se.plancher(81, false).V], [1, 0]);
      egal(Se.plancher(0, true), { I: 3, II: 3, III: 3, IV: 3, V: 1 });
    });
    function avecFile(parBlocDues, duesV) {
      var qs = banque({ I: 40, II: 40, III: 40, V: 20 });
      var e = etatTest();
      ["I", "II", "III"].forEach(function (b) {
        qs.filter(function (q) { return q.bloc === b; }).slice(0, parBlocDues).forEach(function (q) {
          marquer(e, q.id, { b: 1, due: HIER, dernier: "juste" });
        });
      });
      qs.filter(function (q) { return q.bloc === "V"; }).slice(0, duesV).forEach(function (q) { marquer(e, q.id, { b: 1, due: HIER }); });
      marquer(e, qs[qs.length - 1].id, { b: 3, due: U.ajouterJours(JOUR, 4) }); // historique non vide, rien de dû
      return Se.creerSeanceDuJour(contexte(e, qs, { familles: {} }));
    }
    t("plancher appliqué : file > 80 → 1 nouvelle par bloc (0 en anglais)", function () {
      var s = avecFile(30, 12);
      egal(s.fileVeille, 102);
      egal([nouvelles(s, "I"), nouvelles(s, "II"), nouvelles(s, "III"), nouvelles(s, "V")], [1, 1, 1, 0]);
    });
    t("plancher appliqué : file de 41 à 80 → 2 nouvelles (1 en anglais)", function () {
      var s = avecFile(17, 5);
      egal(s.fileVeille, 56);
      egal([nouvelles(s, "I"), nouvelles(s, "II"), nouvelles(s, "III"), nouvelles(s, "V")], [2, 2, 2, 1]);
    });
    t("plancher appliqué : file de 1 à 40 → 3 nouvelles (au moins 1 en anglais)", function () {
      var s = avecFile(9, 4);
      egal(s.fileVeille, 31);
      egal([nouvelles(s, "I"), nouvelles(s, "II"), nouvelles(s, "III"), nouvelles(s, "V")], [3, 3, 3, 1]);
    });
    t("plancher appliqué : file vide → 4 et 2", function () {
      var s = avecFile(0, 0);
      egal(s.plancher, { I: 4, II: 4, III: 4, IV: 4, V: 2 });
    });
    t("les places de révision reçoivent les révisions dues les mieux classées", function () {
      var qs = banque({ I: 30, II: 40, III: 40 });
      var e = etatTest();
      var duesI = qs.filter(function (q) { return q.bloc === "I"; }).slice(0, 12);
      duesI.forEach(function (q, k) { marquer(e, q.id, { b: 2, due: U.ajouterJours(JOUR, -(k + 1)), dernier: "juste" }); });
      ["II", "III"].forEach(function (b) { qs.filter(function (q) { return q.bloc === b; }).slice(0, 35).forEach(function (q) { marquer(e, q.id, { b: 1, due: HIER }); }); });
      var s = Se.creerSeanceDuJour(contexte(e, qs, { familles: {} }));
      egal(s.plancher.I, 1);
      var pris = itemsDuBloc(s, "I").filter(function (it) { return !it.nouvelle; }).map(function (it) { return it.q; }).sort();
      egal(pris, duesI.slice(3).map(function (q) { return q.id; }).sort(), "les 9 plus en retard");
    });
    t("pas assez de révisions dues : davantage de nouvelles", function () {
      var qs = banque({ I: 20 });
      var e = etatTest();
      qs.slice(0, 2).forEach(function (q) { marquer(e, q.id, { b: 1, due: HIER }); });
      var s = Se.creerSeanceDuJour(contexte(e, qs, { familles: {} }));
      egal([itemsDuBloc(s, "I").length, nouvelles(s, "I")], [10, 8]);
    });
    t("plus de nouvelles : d'abord les autres révisions dues, puis les non dues les moins maîtrisées", function () {
      var qs = banque({ I: 20 });
      var e = etatTest();
      qs.slice(0, 9).forEach(function (q) { marquer(e, q.id, { b: 2, due: HIER }); });
      qs.slice(9).forEach(function (q, k) { marquer(e, q.id, { b: 1 + (k % 5), due: U.ajouterJours(JOUR, 5), derniere: U.ajouterJours(JOUR, -10 - k) }); });
      var s = Se.creerSeanceDuJour(contexte(e, qs, { familles: {} }));
      var pris = itemsDuBloc(s, "I").map(function (it) { return it.q; });
      egal(pris.length, 10);
      qs.slice(0, 9).forEach(function (q) { vrai(pris.indexOf(q.id) >= 0, "toutes les dues : " + q.id); });
      var nonDue = pris.filter(function (id) { return qs.slice(9).some(function (q) { return q.id === id; }); });
      egal(nonDue.length, 1);
      egal(e.questions[nonDue[0]].b, 1, "la non due la moins maîtrisée");
    });
    t("question sœur : troisième retour en erreur (retoursErreur pair) → sœur déjà vue de la même notion", function () {
      var n = notionsDuBloc("I")[0];
      compteurs = {};
      var a = question(n), bq = question(n), c = question(n);
      var autres = banque({ I: 20 }).filter(function (q) { return q.notion !== n; });
      var qs = [a, bq, c].concat(autres);
      var e = etatTest();
      marquer(e, a.id, { b: 1, err: true, retoursErreur: 2, due: HIER, dernier: "faux", fausses: 3 });
      marquer(e, bq.id, { b: 2, due: U.ajouterJours(JOUR, 2), derniere: U.ajouterJours(JOUR, -6) });
      var ctx = contexte(e, qs, { familles: {} });
      var s = Se.creerSeanceDuJour(ctx);
      var it = s.items.filter(function (x) { return x.remplace === a.id; })[0];
      vrai(it && it.q === bq.id, "remplacée par la sœur vue");
      vrai(!s.items.some(function (x) { return x.q === a.id; }), "la question en erreur n'est pas présentée");
      e.questions[a.id].retoursErreur = 3;
      var s2 = Se.creerSeanceDuJour(contexte(e, qs, { familles: {} }));
      vrai(s2.items.some(function (x) { return x.q === a.id && !x.remplace; }), "retoursErreur impair : présentée");
      e.questions[a.id].retoursErreur = 2;
      delete e.questions[bq.id];
      var s3 = Se.creerSeanceDuJour(contexte(e, qs, { familles: {} }));
      vrai(s3.items.some(function (x) { return x.q === a.id; }), "sans sœur déjà vue : la question elle-même");
    });
    t("question sœur : la question remplacée garde son échéance, son compteur avance à la validation", function () {
      var n = notionsDuBloc("I")[1];
      compteurs = {};
      var a = question(n), bq = question(n);
      var qs = [a, bq].concat(banque({ I: 15, II: 10, III: 10, V: 5 }).filter(function (q) { return q.notion !== n; }));
      var e = etatTest();
      marquer(e, a.id, { b: 1, err: true, retoursErreur: 4, due: HIER, dernier: "faux", fausses: 2 });
      marquer(e, bq.id, { b: 2, due: U.ajouterJours(JOUR, 5), derniere: U.ajouterJours(JOUR, -8) });
      var ctx = contexte(e, qs, { familles: CI.generateurs.familles() });
      var s = Se.stocker(e, Se.creerSeanceDuJour(ctx));
      vrai(s.items.some(function (x) { return x.remplace === a.id; }));
      Se.valider(ctx, s.id);
      egal([e.questions[a.id].due, e.questions[a.id].retoursErreur, e.questions[a.id].vues], [HIER, 5, 1]);
    });
    t("anti-répétition : vue depuis moins de 3 jours et non due → exclue", function () {
      var qs = banque({ I: 12 });
      var e = etatTest();
      marquer(e, qs[0].id, { b: 2, due: U.ajouterJours(JOUR, 2), derniere: HIER });
      var s = Se.creerSeanceDuJour(contexte(e, qs, { familles: {} }));
      vrai(!s.items.some(function (x) { return x.q === qs[0].id; }));
    });
    t("anti-répétition : 2 questions au plus par notion, hors erreurs dues", function () {
      var n = notionsDuBloc("I")[2];
      compteurs = {};
      var meme = [question(n), question(n), question(n), question(n)];
      var qs = meme.concat(banque({ I: 15 }).filter(function (q) { return q.notion !== n; }));
      var s = Se.creerSeanceDuJour(contexte(etatTest(), qs, { familles: {} }));
      vrai(s.items.filter(function (x) { return x.notion === n; }).length <= 2, "nouvelles : 2 au plus");
      var e = etatTest();
      meme.slice(0, 3).forEach(function (q) { marquer(e, q.id, { b: 1, err: true, due: HIER, dernier: "faux", fausses: 1 }); });
      var s2 = Se.creerSeanceDuJour(contexte(e, qs, { familles: {} }));
      egal(s2.items.filter(function (x) { return x.notion === n; }).length, 3, "les erreurs dues échappent à la limite");
    });
    t("anti-répétition : rien de ce qui figure dans un rattrapage en attente", function () {
      var qs = banque({ I: 25 });
      var e = etatTest();
      qs.slice(0, 5).forEach(function (q) { marquer(e, q.id, { b: 1, due: HIER }); });
      var ctxHier = contexte(e, qs, { jour: HIER, familles: {} });
      var hier = Se.stocker(e, Se.creerSeanceDuJour(ctxHier));
      var s = Se.creerSeanceDuJour(contexte(e, qs, { familles: {} }));
      var pris = {};
      hier.items.forEach(function (x) { pris[x.q] = true; });
      vrai(!s.items.some(function (x) { return pris[x.q]; }), "aucun recoupement avec le rattrapage");
    });
    t("séance identique après sérialisation, et recalcul identique", function () {
      var qs = banque({ I: 30, II: 30, III: 30, IV: 12, V: 12 });
      var e = etatTest();
      var ctx = contexte(e, qs);
      var s = Se.creerSeanceDuJour(ctx);
      egal(JSON.parse(JSON.stringify(s)), s);
      egal(Se.creerSeanceDuJour(ctx), s);
      var r = St.deserialiser(St.serialiser(Object.assign(e, { seances: { "J-x": s } })));
      egal(r.seances["J-x"], s);
    });
    t("journée : positionnement requis, puis séance du jour stockée et jamais recalculée", function () {
      var qs = banque({ I: 30, II: 30, III: 30, V: 12 });
      var e = etatTest(); e.profil.positionnementLe = null;
      var r = Se.preparerJournee(contexte(e, qs));
      vrai(r.positionnementRequis && !r.seance);
      e.profil.positionnementLe = "2026-10-01";
      var r2 = Se.preparerJournee(contexte(e, qs));
      vrai(r2.seance && e.seances["J-" + JOUR] === r2.seance);
      qs.forEach(function (q) { marquer(e, q.id, { b: 1, due: HIER }); });
      var r3 = Se.preparerJournee(contexte(e, qs));
      egal(r3.seance, r2.seance, "inchangée malgré une mémoire différente");
    });
    t("rattrapage : un seul à la fois, le plus ancien est abandonné", function () {
      var qs = banque({ I: 40, II: 30, III: 30, V: 12 });
      var e = etatTest();
      var j2 = U.ajouterJours(JOUR, -2);
      Se.stocker(e, Se.creerSeanceDuJour(contexte(e, qs, { jour: j2 })));
      Se.stocker(e, Se.creerSeanceDuJour(contexte(e, qs, { jour: HIER })));
      var r = Se.preparerJournee(contexte(e, qs));
      egal([e.seances["J-" + j2].statut, r.rattrapage.id, r.seance.id], ["abandonnee", "J-" + HIER, "J-" + JOUR]);
    });
    t("niveaux 1 et 2 seulement pendant les 7 jours qui suivent le positionnement", function () {
      compteurs = {};
      var qs = notionsDuBloc("I").slice(0, 20).map(function (n, k) { return question(n, { difficulte: k < 12 ? 3 : 1 }); });
      var e = etatTest(); e.profil.positionnementLe = U.ajouterJours(JOUR, -3);
      var s = Se.creerSeanceDuJour(contexte(e, qs, { familles: {} }));
      var niv = s.items.map(function (x) { return qs.filter(function (q) { return q.id === x.q; })[0].difficulte; });
      vrai(niv.every(function (d) { return d <= 2; }), "aucun niveau 3 les 7 premiers jours");
      e.profil.positionnementLe = U.ajouterJours(JOUR, -20);
      var s2 = Se.creerSeanceDuJour(contexte(e, qs, { familles: {} }));
      vrai(s2.items.length === 10, "ensuite tous niveaux");
    });
    t("test de positionnement : 35 questions du lot 00 et 10 générées de niveau 1 ou 2", function () {
      var qs = banque({ I: 10, II: 10, III: 10, V: 5 });
      var lot = function () { return "00-demarrage"; };
      var r = Se.creerPositionnement(contexte(etatTest(), qs, { lot: lot }));
      egal(r.seance.items.length, 45);
      var gen = itemsDuBloc(r.seance, "IV");
      vrai(gen.every(function (x) { return x.f && x.niveau <= 2; }));
      var r2 = Se.creerPositionnement(contexte(etatTest(), qs.slice(1), { lot: lot }));
      egal([r2.seance, r2.manque], [null, { I: 1 }]);
    });
    t("validation : mémoire, historique, résumé, XP ; puis séance figée", function () {
      var qs = banque({ I: 10, II: 10, III: 10, V: 5 });
      var e = etatTest(); e.profil.positionnementLe = null;
      var ctx = contexte(e, qs, { lot: function () { return "00-demarrage"; } });
      var s = Se.stocker(e, Se.creerPositionnement(ctx).seance);
      s.items.forEach(function (it, i) {
        var bonne = ctx.resoudre(it).bonne;
        if (i % 3 === 0) Se.repondre(s, i, { choix: bonne });
        else if (i % 3 === 1) Se.repondre(s, i, { choix: (bonne + 1) % 4 });
      });
      var r = Se.valider(ctx, s.id);
      egal([r.resume.justes, r.resume.fausses, r.resume.sansReponse], [15, 15, 15]);
      egal(r.resume.points, 7.5);
      egal(s.validee.xp, 10 * 7.5 + 30);
      egal(e.historique.length, 45);
      egal(e.profil.positionnementLe, JOUR);
      egal(Object.keys(e.questions).length, 35);
      egal(Object.keys(e.familles).length > 0, true);
      leve(function () { Se.valider(ctx, s.id); }, "validation irréversible");
      leve(function () { Se.repondre(s, 0, { choix: 1 }); });
    });
    t("réponses : Ann, Je doute et réponse pressentie", function () {
      var s = { statut: "en_cours", items: [{ reponse: null, ann: false, pressentie: null, doute: false, barres: [] }] };
      Se.repondre(s, 0, { choix: 2, doute: true });
      egal([s.items[0].reponse, s.items[0].doute], [2, true]);
      Se.repondre(s, 0, { ann: true });
      egal([s.items[0].reponse, s.items[0].ann, s.items[0].doute], [null, true, false]);
      Se.repondre(s, 0, { doute: true, pressentie: 3 });
      egal([s.items[0].doute, s.items[0].pressentie], [false, 3]);
      Se.repondre(s, 0, { choix: 1 });
      egal([s.items[0].ann, s.items[0].pressentie, s.items[0].reponse], [false, null, 1]);
      Se.barrer(s, 0, 2); Se.barrer(s, 0, 3); Se.barrer(s, 0, 2);
      egal(s.items[0].barres, [3]);
      egal([Se.codeReponse({ ann: true }, 0), Se.codeReponse({ reponse: null }, 0), Se.codeReponse({ reponse: 0, doute: true }, 0), Se.codeReponse({ reponse: 1 }, 0)],
        ["ann", "sans", "doute", "faux"]);
    });
    t("chronomètre persistant", function () {
      var s = { chrono: { cumule: 0, depuis: null } };
      Se.demarrerChrono(s, 1000); Se.suspendreChrono(s, 61000);
      Se.demarrerChrono(s, 100000);
      var copie = JSON.parse(JSON.stringify(s));
      egal(Se.tempsEcoule(copie, 130000), 90000);
    });
    t("révisions du jour : hors séance du jour, item stable, mémoire mise à jour à chaque réponse", function () {
      var qs = banque({ I: 40, II: 30, III: 30, V: 12 });
      var e = etatTest();
      qs.slice(0, 25).forEach(function (q, k) { marquer(e, q.id, { b: 1, due: U.ajouterJours(JOUR, -1 - (k % 4)) }); });
      var ctx = contexte(e, qs, { familles: {} });
      var s = Se.preparerJournee(ctx).seance;
      var dansSeance = {};
      s.items.forEach(function (x) { dansSeance[x.q] = true; });
      var file = Se.fileRevisions(ctx);
      vrai(file.length > 0 && file.every(function (x) { return !dansSeance[x.id]; }));
      var it = Se.prochaineRevision(ctx);
      egal(Se.prochaineRevision(ctx), it, "stable");
      var r = Se.repondreRevision(ctx, { choix: ctx.resoudre(it).bonne });
      egal([r.code, e.revisions.faites, e.historique[e.historique.length - 1].s], ["juste", 1, "rev"]);
      egal(e.questions[it.q].b, 2);
    });
    t("examen blanc et entraînement libre", function () {
      var qs = banque({ I: 30, II: 30, III: 30, IV: 12, V: 12 });
      var e = etatTest();
      var ex = Se.creerExamenBlanc(contexte(e, qs));
      egal([ex.items.length, ex.options.compteARebours, ex.options.pauseSiMasque], [45, true, false]);
      egal(["I", "II", "III", "IV", "V"].map(function (b) { return itemsDuBloc(ex, b).length; }), [10, 10, 10, 10, 5]);
      var l = Se.creerEntrainement(contexte(e, qs), { bloc: "II", nombre: 5 });
      vrai(l.items.length === 5 && l.items.every(function (x) { return x.bloc === "II"; }));
      marquer(e, qs[0].id, { b: 1, err: true, due: HIER });
      var l2 = Se.creerEntrainement(contexte(e, qs), { statut: "erreur", nombre: 10, memoire: false });
      egal([l2.items.length, l2.items[0].q, l2.options.memoire], [1, qs[0].id, false]);
      var l3 = Se.creerEntrainement(contexte(e, qs), { notion: "IV.G4", nombre: 3 });
      vrai(l3.items.length === 3 && l3.items.every(function (x) { return x.f === "IV.G4"; }));
    });
    t("entraînement libre en correction immédiate sans modifier la mémoire", function () {
      var qs = banque({ I: 10 });
      var e = etatTest();
      var ctx = contexte(e, qs, { familles: {} });
      var l = Se.stocker(e, Se.creerEntrainement(ctx, { bloc: "I", nombre: 3, memoire: false }));
      var r = Se.repondreImmediat(ctx, l.id, 0, { choix: ctx.resoudre(l.items[0]).bonne });
      egal(r.code, "juste");
      egal(Object.keys(e.questions).length, 0, "mémoire intacte");
      var v = Se.valider(ctx, l.id);
      egal(v.resume.n, 1, "seules les questions corrigées comptent");
    });
  });

  /* ---------- 3. Mélange des propositions ---------- */
  suite("3. Mélange des propositions", function (t) {
    t("index d'origine retrouvé après sérialisation", function () {
      var qs = banque({ I: 30, II: 30, III: 30, V: 12 });
      var ctx = contexte(etatTest(), qs, { familles: {} });
      var s = Se.creerSeanceDuJour(ctx);
      var copie = JSON.parse(JSON.stringify(s));
      copie.items.forEach(function (it, i) {
        var ordre = Se.ordreAffiche(it);
        egal(ordre.slice().sort(), [0, 1, 2, 3], "permutation");
        egal(ordre, Se.ordreAffiche(s.items[i]), "ordre conservé");
        var q = ctx.resoudre(it);
        var positionAffichee = ordre.indexOf(q.bonne);
        Se.repondre(copie, i, { choix: ordre[positionAffichee] });
        egal(Se.codeReponse(copie.items[i], q.bonne), "juste");
      });
    });
    t("les propositions ne sont pas toujours dans l'ordre d'origine", function () {
      var qs = banque({ I: 30, II: 30, III: 30, V: 12 });
      var s = Se.creerSeanceDuJour(contexte(etatTest(), qs, { familles: {} }));
      vrai(s.items.some(function (it) { return it.ordre.join() !== "0,1,2,3"; }));
    });
    t("ordreFixe : ordre d'origine, jamais mélangé", function () {
      compteurs = {};
      var qs = notionsDuBloc("I").slice(0, 12).map(function (n) {
        return question(n, { ordreFixe: true, choix: ["1958", "1962", "1974", "2008"] });
      });
      var s = Se.creerSeanceDuJour(contexte(etatTest(), qs, { familles: {} }));
      vrai(s.items.every(function (it) { return it.ordre === null; }));
      egal(Se.ordreAffiche(s.items[0]), [0, 1, 2, 3]);
    });
  });

  /* ---------- 4. Barème ---------- */
  suite("4. Barème, calibrage, note estimée", function (t) {
    function issues(j, d, f, a, s) {
      var r = [];
      for (var i = 0; i < j; i++) r.push({ code: "juste", bloc: "I", temps: 10 });
      for (i = 0; i < d; i++) r.push({ code: "doute", bloc: "I", temps: 10 });
      for (i = 0; i < f; i++) r.push({ code: "faux", bloc: "II", temps: 10 });
      for (i = 0; i < a; i++) r.push({ code: "ann", bloc: "II", temps: 10 });
      for (i = 0; i < s; i++) r.push({ code: "sans", bloc: "III", temps: 10 });
      return r;
    }
    t("les trois barèmes et la note sur 20", function () {
      var r = B.resumer(issues(25, 5, 10, 3, 2), 0.5);
      egal([r.n, r.points, r.note], [45, 25, 11.11]);
      egal(r.notes, { "0.25": 12.22, "0.5": 11.11, "1": 8.89 });
      egal(r.parBloc.II.points, -5);
      egal(B.note20(-3, 45), 0, "jamais négative");
      egal(r.temps, 450);
    });
    t("seuils de rentabilité", function () {
      proche(B.seuil(0.25), 0.2); proche(B.seuil(0.5), 1 / 3); proche(B.seuil(1), 0.5);
    });
    function entree(r, d, pr, b, j) { return { k: Math.random().toString(36), j: j || JOUR, s: "jour", b: b || "I", r: r, d: d, pr: pr === undefined ? null : pr, pre: 0 }; }
    t("calibrage : conseils selon le barème", function () {
      var h = [];
      for (var i = 0; i < 5; i++) h.push(entree("doute", 1));
      for (i = 0; i < 7; i++) h.push(entree("faux", 1));
      egal(B.calibrage(h, JOUR, 0.5).global.conseil, "reponds");
      egal(B.calibrage(h, JOUR, 1).global.conseil, "abstiens");
      egal(B.calibrage(h, JOUR, 0.25).parBloc.I.conseil, "reponds");
      var h2 = [];
      for (i = 0; i < 4; i++) h2.push(entree("doute", 1));
      for (i = 0; i < 8; i++) h2.push(entree("faux", 1));
      egal(B.calibrage(h2, JOUR, 0.5).global.conseil, "limite");
      var peu = B.calibrage(h.slice(0, 9), JOUR, 0.5).global;
      egal([peu.assez, peu.conseil], [false, null]);
      var vieux = h.map(function (x) { return Object.assign({}, x, { j: U.ajouterJours(JOUR, -30) }); });
      egal(B.calibrage(vieux, JOUR, 0.5).global.doutes.n, 0, "fenêtre de 30 jours");
    });
    t("coût des abstentions avec réponses pressenties", function () {
      var h = [];
      for (var i = 0; i < 6; i++) h.push(entree("ann", 0, 1));
      for (i = 0; i < 4; i++) h.push(entree("ann", 0, 0));
      h.push(entree("ann", 0, null));
      var c = B.calibrage(h, JOUR, 0.5).global.pressenties;
      egal([c.n, c.justes, c.cout, c.assez], [10, 6, 4, true]);
      egal(B.calibrage(h, JOUR, 1).global.pressenties.cout, 2);
    });
    t("note estimée et fourchette à 95 %", function () {
      var h = [];
      ["I", "II", "III", "IV", "V"].forEach(function (b) {
        for (var i = 0; i < 20; i++) h.push({ k: b + i, j: JOUR, s: "jour", b: b, r: i < 15 ? "juste" : "faux", d: 0, pre: 1 });
      });
      var n = B.noteEstimee(h, JOUR, 0.5);
      vrai(n.disponible);
      egal(n.points, 28.13);
      egal(n.note, 12.5);
      var sigma = Math.sqrt(4 * 10 * 0.421875 * 1.5 + 5 * 0.421875 * 1.25);
      proche(n.basse, Math.round((28.125 - 1.96 * sigma) / 45 * 20 * 100) / 100, 0.011);
      proche(n.haute, Math.round((28.125 + 1.96 * sigma) / 45 * 20 * 100) / 100, 0.011);
      var moins = B.noteEstimee(h.slice(1), JOUR, 0.5);
      egal([moins.disponible, moins.manque], [false, { I: 1 }]);
      var anciennes = h.map(function (x) { return Object.assign({}, x, { j: U.ajouterJours(JOUR, -14) }); });
      vrai(!B.noteEstimee(anciennes, JOUR, 0.5).disponible, "fenêtre de 14 jours");
      var examens = anciennes.map(function (x) { return Object.assign({}, x, { pre: 0, s: "examen" }); });
      vrai(B.noteEstimee(examens, JOUR, 0.5).disponible, "examens blancs sur 30 jours");
    });
  });

  /* ---------- 5. Générateurs ---------- */

  /* Vérification indépendante des générateurs : solveurs écrits séparément du code de génération. */
  var V = (function () {
    var eq = function (a, b) { return Math.abs(a - b) < 1e-9; };
    function suiteRegles(t) {
      var p = [], n = t.length, i;
      var d = []; for (i = 1; i < n; i++) d.push(t[i] - t[i - 1]);
      if (d.every(function (x) { return eq(x, d[0]); })) p.push(t[n - 1] + d[0]);
      if (t[0] !== 0) { var q = t[1] / t[0]; if (t.every(function (x, k) { return k === 0 || eq(x, t[k - 1] * q); })) p.push(t[n - 1] * q); }
      if (n >= 4 && d.every(function (x, k) { return k < 2 || eq(x, d[k - 2]); })) p.push(t[n - 1] + d[d.length - 2]);
      var d2 = []; for (i = 1; i < d.length; i++) d2.push(d[i] - d[i - 1]);
      if (d2.length >= 2 && d2.every(function (x) { return eq(x, d2[0]); })) p.push(t[n - 1] + d[d.length - 1] + d2[0]);
      if (t.every(function (x, k) { return k < 2 || eq(x, t[k - 1] + t[k - 2]); })) p.push(t[n - 1] + t[n - 2]);
      if (!eq(t[1], t[0])) {
        var a = (t[2] - t[1]) / (t[1] - t[0]), b = t[1] - a * t[0];
        if (t.every(function (x, k) { return k === 0 || eq(x, a * t[k - 1] + b); })) p.push(a * t[n - 1] + b);
      }
      if (n >= 6) {
        var ok = true;
        for (i = 4; i < n; i++) if (!eq(t[i] - t[i - 2], t[i - 2] - t[i - 4])) ok = false;
        if (ok) p.push(t[n - 2] + (t[n - 2] - t[n - 4]));
      }
      return p;
    }
    function unique(p) {
      if (!p.length) throw new Error("aucune règle simple ne prolonge la suite");
      p.forEach(function (x) { if (!eq(x, p[0])) throw new Error("deux règles donnent des suites différentes : " + p.join(", ")); });
      return p[0];
    }
    function nombre(texte) { return parseFloat(String(texte).replace(/[^\d,−-]/g, "").replace("−", "-").replace(",", ".")); }
    var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    var JOURS_JS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    function dateUTC(s) { var p = s.split("-").map(Number); return new Date(Date.UTC(p[0], p[1] - 1, p[2])); }
    function texteDate(d) { var j = d.getUTCDate(); return (j === 1 ? "1er" : j) + " " + MOIS[d.getUTCMonth()] + " " + d.getUTCFullYear(); }
    function pgcd(a, b) { return b ? pgcd(b, a % b) : a; }
    function frac(n, d) { var g = pgcd(n, d); n /= g; d /= g; return d === 1 ? String(n) : n + "/" + d; }
    function voy(m) { return m.replace(/[^AEIOU]/g, "").length; }

    var solveurs = {
      "IV.G1": function (q) { return { valeur: unique(suiteRegles(q.donnees.termes)), regles: suiteRegles(q.donnees.termes) }; },
      "IV.G2": function (q) {
        var lettres = q.donnees.termes.map(function (x) { return x.charCodeAt(0) - 64; });
        var nb = q.donnees.termes.map(function (x) { return x.length > 1 ? Number(x.slice(1)) : null; });
        var l = unique(suiteRegles(lettres));
        var r = String.fromCharCode(64 + l);
        if (nb[0] !== null) r += unique(suiteRegles(nb));
        return { texte: r, regles: suiteRegles(lettres) };
      },
      "IV.G3": function (q) {
        var d = q.donnees, p = [];
        if (d.type === "lignes") {
          var k = d.ligne2.indexOf(null);
          var c = d.ligne1.map(function (x, i) { return [x, d.ligne2[i]]; }).filter(function (x, i) { return i !== k; });
          var essais = [
            function (x) { return x * c[0][1] / c[0][0]; },
            function (x) { return x + c[0][1] - c[0][0]; },
            function (x) { var a = (c[1][1] - c[0][1]) / (c[1][0] - c[0][0]); return a * x + c[0][1] - a * c[0][0]; },
            function (x) { return x * x + c[0][1] - c[0][0] * c[0][0]; }
          ];
          essais.forEach(function (f) { if (c.every(function (y) { return eq(f(y[0]), y[1]); })) p.push(f(d.ligne1[k])); });
        } else {
          var L = d.lignes;
          var formes = [function (a, b) { return a + b; }, function (a, b) { return a * b; }, function (a, b) { return a - b; }, function (a, b) { return 2 * a + b; }, function (a, b) { return a * a + b; }];
          formes.forEach(function (g) {
            var plus = L[0][2] - g(L[0][0], L[0][1]);
            if (eq(g(L[1][0], L[1][1]) + plus, L[1][2])) p.push(g(L[2][0], L[2][1]) + plus);
            var base = g(L[0][0], L[0][1]);
            if (base !== 0) { var fois = L[0][2] / base; if (eq(g(L[1][0], L[1][1]) * fois, L[1][2])) p.push(g(L[2][0], L[2][1]) * fois); }
          });
        }
        return { valeur: unique(p) };
      },
      "IV.G4": function (q) {
        var d = q.donnees, fav = 0, tot = 0;
        if (d.type === "de") { for (var x = 1; x <= 6; x++) { tot++; if (x > d.seuil) fav++; } }
        else if (d.type === "deux_des") { for (var a = 1; a <= 6; a++) for (var b = 1; b <= 6; b++) { tot++; if (a + b === d.somme) fav++; } }
        else {
          var boules = [];
          for (var i = 0; i < d.urne.rouges; i++) boules.push("R");
          for (i = 0; i < d.urne.bleues; i++) boules.push("B");
          for (i = 0; i < d.urne.vertes; i++) boules.push("V");
          if (d.evenement === "une_rouge") { boules.forEach(function (c) { tot++; if (c === "R") fav++; }); }
          else {
            var avec = d.evenement.indexOf("avec") >= 0 && d.evenement.indexOf("sans") < 0;
            for (i = 0; i < boules.length; i++) for (var j = 0; j < boules.length; j++) {
              if (!avec && i === j) continue;
              tot++;
              var u = boules[i], w = boules[j];
              if (d.evenement.indexOf("deux_rouges") === 0 && u === "R" && w === "R") fav++;
              if (d.evenement === "une_de_chaque_sans" && u !== w) fav++;
              if (d.evenement === "au_moins_une_rouge_avec" && (u === "R" || w === "R")) fav++;
            }
          }
        }
        return { texte: frac(fav, tot) };
      },
      "IV.G5": function (q) {
        var d = q.donnees;
        if (d.type === "decalage") {
          var jsDepart = (d.depart + 1) % 7;
          return { texte: JOURS_JS[(((jsDepart + d.jours) % 7) + 7) % 7] };
        }
        if (d.type === "jour_de_date") {
          var vrai = dateUTC(d.reference).getUTCDay();
          if (JOURS_JS[vrai] !== JOURS_JS[(d.jourReference + 1) % 7]) throw new Error("jour de référence faux dans l'énoncé");
          return { texte: JOURS_JS[dateUTC(d.cible).getUTCDay()] };
        }
        return { texte: texteDate(new Date(dateUTC(d.depart).getTime() + d.jours * 86400000)) };
      },
      "IV.G6": function (q) {
        var d = q.donnees, v;
        if (d.type === "remise") v = d.prix * (100 - d.taux) / 100;
        else if (d.type === "proportion") v = d.prix1 / d.quantite1 * d.quantite2;
        else if (d.type === "hausse_baisse") v = d.prix * (100 + d.hausse) / 100 * (100 - d.baisse) / 100;
        else if (d.type === "duree") v = d.distance / d.vitesse * 60;
        else if (d.type === "prix_initial") v = d.prixFinal * 100 / (100 + d.hausse);
        else if (d.type === "vitesse_moyenne") v = 2 * d.distance / (d.distance / d.aller + d.distance / d.retour);
        else v = 100 - (100 - d.remise1) * (100 - d.remise2) / 100;
        return { valeur: Math.round(v * 100) / 100 };
      },
      "IV.G7": function (q) {
        var d = q.donnees, v;
        var rang = function (m) { return m.split("").reduce(function (s, c) { return s + c.charCodeAt(0) - 64; }, 0); };
        if (d.type === "rang") v = rang(d.mot);
        else if (d.type === "tarif_explicite") v = voy(d.mot) * d.voyelle + (d.mot.length - voy(d.mot)) * d.consonne;
        else if (d.type === "longueur") {
          var e = d.exemples, a = (e[1][1] - e[0][1]) / (e[1][0].length - e[0][0].length), b = e[0][1] - a * e[0][0].length;
          v = a * d.mot.length + b;
        } else {
          var x = d.exemples;
          var v0 = voy(x[0][0]), c0 = x[0][0].length - v0, v1 = voy(x[1][0]), c1 = x[1][0].length - v1;
          var det = v0 * c1 - v1 * c0;
          var pv = (x[0][1] * c1 - x[1][1] * c0) / det, pc = (v0 * x[1][1] - v1 * x[0][1]) / det;
          x.forEach(function (ex) { if (!eq(voy(ex[0]) * pv + (ex[0].length - voy(ex[0])) * pc, ex[1])) throw new Error("exemples incohérents"); });
          v = voy(d.mot) * pv + (d.mot.length - voy(d.mot)) * pc;
        }
        return { valeur: v };
      }
    };
    return { solveurs: solveurs, nombre: nombre, suiteRegles: suiteRegles };
  })();

  suite("5. Générateurs (chaque famille, chaque niveau, 1 000 graines)", function (t) {
    Object.keys(CI.generateurs.familles()).forEach(function (f) {
      [1, 2, 3].forEach(function (niveau) {
        t(f + " niveau " + niveau, function () {
          for (var g = 0; g < 1000; g++) {
            var q = CI.generateurs.generer(f, g, niveau);
            var lieu = f + " n" + niveau + " graine " + g + " : ";
            vrai(q.choix.length === 4, lieu + "4 choix");
            vrai(q.choix.every(function (c, i) { return q.choix.indexOf(c) === i; }), lieu + "choix distincts");
            egal(JSON.stringify(CI.generateurs.generer(f, g, niveau)), JSON.stringify(q), lieu + "déterminisme");
            vrai(q.explication && q.aRetenir, lieu + "explication et « À retenir »");
            var sol = V.solveurs[f](q);
            var bonne = q.choix[q.bonne];
            if (sol.texte !== undefined) egal(bonne, sol.texte, lieu + "bonne réponse");
            else proche(V.nombre(bonne), sol.valeur, 0.006, lieu + "bonne réponse");
            if (q.ordreFixe && sol.texte === undefined) {
              var vals = q.choix.map(V.nombre);
              vrai(vals.every(function (x, i) { return i === 0 || x > vals[i - 1]; }), lieu + "ordre croissant");
            }
            if (f === "IV.G1" || f === "IV.G2") {
              vrai(q.donnees.termes.length >= 5, lieu + "au moins 5 termes");
              var predictions = sol.regles;
              q.choix.forEach(function (c, i) {
                if (i === q.bonne) return;
                var val = f === "IV.G1" ? V.nombre(c) : c.charCodeAt(0) - 64;
                if (f === "IV.G2" && c.length > 1) return; // couples : la partie nombre suffit à distinguer
                vrai(!predictions.some(function (p) { return Math.abs(p - val) < 1e-9; }), lieu + "distracteur produit par une autre règle : " + c);
              });
            }
          }
        });
      });
    });
  });

  /* ---------- 6. Actualité ---------- */
  suite("6. Actualité", function (t) {
    var bq = CI.banque;
    t("états : périmée, à renouveler avant le concours, à jour", function () {
      egal(bq.etatActualite({ perimeLe: "2026-11-01" }, JOUR, "2026-12-07"), "perimee");
      egal(bq.etatActualite({ perimeLe: "2026-12-01" }, JOUR, "2026-12-07"), "a_renouveler");
      egal(bq.etatActualite({ perimeLe: "2026-12-31" }, JOUR, "2026-12-07"), "ok");
      egal(bq.etatActualite({}, JOUR, "2026-12-07"), "ok");
    });
    t("les questions périmées sortent des séances, celles à renouveler y restent", function () {
      compteurs = {};
      var ns = notionsDuBloc("II");
      var qs = ns.slice(0, 12).map(function (n, k) {
        return question(n, k < 6 ? { nature: "actualite", perimeLe: "2026-11-01" } : { nature: "actualite", perimeLe: "2026-12-01" });
      });
      var s = Se.creerSeanceDuJour(contexte(etatTest(), qs, { familles: {} }));
      var ids = s.items.map(function (x) { return x.q; });
      vrai(qs.slice(0, 6).every(function (q) { return ids.indexOf(q.id) < 0; }), "périmées exclues");
      egal(itemsDuBloc(s, "II").length, 6, "à renouveler incluses");
    });
    t("liste « Actualité à mettre à jour »", function () {
      var b = CI.banque.creer();
      compteurs = {};
      b.ajouter([question("II.B.b.11", { nature: "actualite", perimeLe: "2026-11-01" }),
        question("II.B.b.11", { nature: "actualite", perimeLe: "2026-12-01" }),
        question("II.B.b.11", { nature: "actualite", perimeLe: "2027-06-30" })]);
      var r = b.actualiteAMettreAJour(JOUR, "2026-12-07");
      egal([r.perimees.length, r.aRenouveler.length], [1, 1]);
    });
    t("questions « a_verifier » et signalées exclues sauf réglage", function () {
      compteurs = {};
      var qs = notionsDuBloc("III").slice(0, 12).map(function (n, k) {
        return question(n, k < 3 ? { statut: "a_verifier", source: "", raisonAVerifier: "Vérifier sur cnil.fr" } : {});
      });
      var e = etatTest();
      e.signalements.push({ id: "S-1", q: qs[3].id, retirer: true });
      var s = Se.creerSeanceDuJour(contexte(e, qs, { familles: {} }));
      vrai(!s.items.some(function (x) { return [qs[0].id, qs[1].id, qs[2].id, qs[3].id].indexOf(x.q) >= 0; }));
      e.reglages.inclureAVerifier = true;
      var s2 = Se.creerSeanceDuJour(contexte(e, qs, { familles: {} }));
      vrai(s2.items.some(function (x) { return x.q === qs[0].id; }));
    });
  });

  /* ---------- 7. Dates ---------- */
  suite("7. Dates calendaires", function (t) {
    t("arithmétique calendaire", function () {
      egal(U.ajouterJours("2026-12-31", 1), "2027-01-01");
      egal(U.ajouterJours("2028-02-28", 1), "2028-02-29");
      egal(U.ajouterJours("2027-02-28", 1), "2027-03-01");
      egal(U.ajouterJours("2026-03-01", -1), "2026-02-28");
      egal(U.ecartJours("2026-10-21", "2026-12-07"), 47);
      egal(U.ecartJours("2026-12-07", "2026-10-21"), -47);
      egal(U.jourDeNumero(U.numeroJour("1999-12-31")), "1999-12-31");
      egal([U.nomJour(U.jourSemaine("2026-10-21")), U.nomJour(U.jourSemaine("2026-12-07")), U.nomJour(U.jourSemaine("2000-02-29"))], ["mercredi", "lundi", "mardi"]);
      egal(U.formaterDate("2026-12-01"), "1er décembre 2026");
      vrai(!U.estJour("2027-02-29") && U.estJour("2028-02-29"));
    });
    t("passage de minuit (heure locale)", function () {
      egal(U.jourDe(new Date(2026, 10, 9, 23, 59, 59).getTime()), "2026-11-09");
      egal(U.jourDe(new Date(2026, 10, 10, 0, 0, 1).getTime()), "2026-11-10");
    });
    t("changements d'heure du 25 octobre 2026 et du 28 mars 2027", function () {
      [[2026, 9, 25], [2027, 2, 28]].forEach(function (d) {
        var jour = d[0] + "-" + (d[1] < 9 ? "0" : "") + (d[1] + 1) + "-" + d[2];
        [0, 1, 2, 3, 4, 12, 23].forEach(function (h) { egal(U.jourDe(new Date(d[0], d[1], d[2], h, 30).getTime()), jour, "à " + h + " h 30"); });
        egal(U.ajouterJours(U.ajouterJours(jour, -1), 1), jour);
        egal(U.ecartJours(U.ajouterJours(jour, -1), U.ajouterJours(jour, 1)), 2);
        egal(U.jourDe(new Date(d[0], d[1], d[2] + 1, 0, 30).getTime()), U.ajouterJours(jour, 1));
      });
    });
    t("série de jours", function () {
      var e = etatTest();
      function valide(j) { e.seances["J-" + j] = { id: "J-" + j, type: "jour", statut: "validee", validee: { le: U.numeroJour(j), jour: j, xp: 40, resume: { note: 10 } } }; }
      ["2026-11-05", "2026-11-07", "2026-11-08", "2026-11-09"].forEach(valide);
      egal(CI.stats.serie(e, JOUR), 3, "jusqu'à hier");
      valide(JOUR);
      egal(CI.stats.serie(e, JOUR), 4, "jusqu'à aujourd'hui");
      egal(CI.stats.serie(e, U.ajouterJours(JOUR, 2)), 0, "rompue");
    });
  });

  /* ---------- 8. Sauvegarde ---------- */
  suite("8. Sauvegarde", function (t) {
    function etatRempli() {
      var qs = banque({ I: 30, II: 30, III: 30, V: 12 });
      var e = etatTest();
      var ctx = contexte(e, qs);
      var s = Se.stocker(e, Se.creerSeanceDuJour(ctx));
      s.items.forEach(function (it, i) { if (i % 2) Se.repondre(s, i, { choix: 0 }); });
      Se.valider(ctx, s.id);
      return e;
    }
    t("aller-retour export puis import", function () {
      var e = etatRempli();
      var x = St.exporter(e, JOUR);
      egal(x.nomFichier, "cap-inspecteur-sauvegarde-" + JOUR + ".json");
      var r = St.analyserImport(x.contenu);
      vrai(r.ok, r.erreurs.join(" "));
      egal(r.etat, e);
      egal([r.apercu.seances, r.apercu.questionsVues > 0, r.apercu.debut, r.apercu.fin], [1, true, JOUR, JOUR]);
      vrai(!St.analyserImport("pas du json").ok && !St.analyserImport('{"a":1}').ok);
    });
    t("fusion : l'état le plus récent l'emporte, séances et historique réunis, XP recalculée", function () {
      var a = etatTest(), b = etatTest();
      a.questions["Q-1"] = Object.assign(S.etatInitial(), { vues: 1, b: 2, derniere: "2026-11-01" });
      b.questions["Q-1"] = Object.assign(S.etatInitial(), { vues: 2, b: 3, derniere: "2026-11-05" });
      a.questions["Q-2"] = Object.assign(S.etatInitial(), { vues: 4, b: 4, derniere: "2026-11-06" });
      b.questions["Q-2"] = Object.assign(S.etatInitial(), { vues: 1, b: 1, derniere: "2026-11-02" });
      b.questions["Q-3"] = Object.assign(S.etatInitial(), { vues: 1, b: 2, derniere: "2026-11-02" });
      a.seances["J-2026-11-01"] = { id: "J-2026-11-01", type: "jour", statut: "validee", validee: { le: 1, jour: "2026-11-01", xp: 50, resume: { note: 10 } }, items: [] };
      b.seances["J-2026-11-02"] = { id: "J-2026-11-02", type: "jour", statut: "validee", validee: { le: 2, jour: "2026-11-02", xp: 70, resume: { note: 12 } }, items: [] };
      a.historique = [{ k: "a1", j: "2026-11-01", s: "rev", r: "juste" }];
      b.historique = [{ k: "a1", j: "2026-11-01", s: "rev", r: "juste" }, { k: "b1", j: "2026-11-02", s: "rev", r: "juste", res: 1 }];
      var r = St.fusionner(a, b);
      egal([r.etat.questions["Q-1"].b, r.etat.questions["Q-2"].b, r.etat.questions["Q-3"].b], [3, 4, 2]);
      egal(Object.keys(r.etat.seances).sort(), ["J-2026-11-01", "J-2026-11-02"]);
      egal(r.etat.historique.length, 2);
      egal(CI.stats.xpTotal(r.etat), 50 + 70 + 2 + 2 + 20);
      egal(CI.stats.serie(r.etat, "2026-11-03"), 2);
    });
    t("une séance en cours n'est jamais écrasée sans confirmation", function () {
      var a = etatTest(), b = etatTest();
      a.seances["J-x"] = { id: "J-x", statut: "en_cours", items: [{ reponse: 1 }] };
      b.seances["J-x"] = { id: "J-x", statut: "en_cours", items: [{ reponse: 2 }] };
      var r = St.fusionner(a, b);
      egal([r.conflits, r.etat.seances["J-x"].items[0].reponse], [["J-x"], 1]);
      egal(St.fusionner(a, b, { ecraserEnCours: true }).etat.seances["J-x"].items[0].reponse, 2);
      egal(St.remplacer(a, b).etat, null);
      egal(St.remplacer(a, b, { ecraserEnCours: true }).etat.seances["J-x"].items[0].reponse, 2);
    });
    t("migrate() d'un état au schéma 0", function () {
      var v0 = { profil: { id: "p", pseudo: "Léa" }, etatsQuestions: { "Q-1": { b: 2, due: "2026-11-01", vues: 1 } }, seances: {} };
      var m = St.migrate(v0);
      egal([m.schemaVersion, m.questions["Q-1"].b, Array.isArray(m.historique), m.profil.penalite, m.profil.pseudo, m.reglages.objectifRevisions],
        [1, 2, true, 0.5, "Léa", 40]);
      vrai(m.etatsQuestions === undefined);
      leve(function () { St.migrate({ schemaVersion: 99 }); });
    });
    t("lecture, écriture, erreurs de stockage et écriture regroupée", function () {
      var memo = {};
      var faux = { getItem: function (k) { return k in memo ? memo[k] : null; }, setItem: function (k, v) { memo[k] = v; } };
      egal(St.charger(faux).etat, null);
      var e = etatTest();
      vrai(St.sauvegarder(faux, e).ok);
      egal(St.charger(faux).etat, e);
      var plein = { getItem: function () { throw new Error("indisponible"); }, setItem: function () { throw new Error("quota dépassé"); } };
      egal(St.sauvegarder(plein, e).erreur, "quota dépassé");
      egal(St.charger(plein).erreur, "indisponible");
      var appels = 0, taches = [];
      var minuterie = { poser: function (fn) { taches.push(fn); return taches.length; }, annuler: function (id) { taches[id - 1] = null; } };
      var p = St.planificateur({ setItem: function () { appels += 1; } }, { minuterie: minuterie });
      p.programmer(e); p.programmer(e); p.programmer(e);
      taches.forEach(function (fn) { if (fn) fn(); });
      egal(appels, 1);
      vrai(St.taille(e) > 100);
    });
  });

  /* ---------- 9. Banque et référentiel ---------- */
  suite("9. Banque et référentiel", function (t) {
    t("banque réelle : aucune erreur d'intégrité", function () {
      var r = CI.banque.controler(R);
      egal(r.erreurs.slice(0, 5), [], r.erreurs.length + " erreur(s)");
    });
    t("le contrôle détecte chaque défaut", function () {
      compteurs = {};
      var ok = question("I.C.1.a.01");
      egal(CI.banque.controlerQuestion(ok, R), []);
      var cas = [
        [{ choix: ["A", "B", "C"] }, "4 choix"],
        [{ choix: ["A", "B", "A", "D"] }, "double"],
        [{ bonne: 4 }, "bonne"],
        [{ notion: "III.A.5.a.01", id: "Q-III.A.5.a.01-01" }, "inconnue"],
        [{ notion: "IV.G1", id: "Q-IV.G1-01", bloc: "IV" }, "générée"],
        [{ bloc: "II" }, "incohérent"],
        [{ source: "" }, "source"],
        [{ verifieLe: "" }, "verifieLe"],
        [{ statut: "a_verifier", raisonAVerifier: "" }, "raisonAVerifier"],
        [{ nature: "actualite" }, "perimeLe"],
        [{ id: "Q-I.C.1.a.02-01" }, "mal formé"],
        [{ ordreFixe: true, choix: ["2008", "1958", "1962", "1974"] }, "croissant"],
        [{ ordreFixe: true }, "nombres ou des dates"],
        [{ explication: "" }, "explication"]
      ];
      cas.forEach(function (c) {
        var q = Object.assign({}, ok, c[0]);
        var e = CI.banque.controlerQuestion(q, R);
        vrai(e.some(function (x) { return x.message.indexOf(c[1]) >= 0; }), "défaut non détecté : " + c[1] + " (" + JSON.stringify(e) + ")");
      });
    });
    t("versions, retraits et identifiants en double", function () {
      var b = CI.banque.creer();
      compteurs = {};
      var q = question("I.C.3.a.03");
      b.ajouter([q], { lot: "01" });
      b.ajouter([Object.assign({}, q, { version: 2, enonce: "Version corrigée ?" })], { lot: "correctif" });
      egal([b.toutes().length, b.question(q.id).enonce, b.lot(q.id)], [1, "Version corrigée ?", "correctif"]);
      b.ajouter([Object.assign({}, q, { version: 1, enonce: "Ancienne" })]);
      egal(b.question(q.id).version, 2, "une version inférieure ne remplace pas");
      b.ajouter([Object.assign({}, q, { version: 2, enonce: "Autre contenu" })]);
      vrai(b.controler(R).erreurs.some(function (x) { return x.message.indexOf("double") >= 0; }), "doublon détecté");
      b.retirer([{ id: q.id, raison: "texte abrogé" }]);
      egal([b.toutes().length, b.estRetiree(q.id), b.question(q.id) !== null], [0, true, true]);
    });
    t("référentiel : identifiants uniques, lignes couvertes, renvois valides, aucune compétence CRCN exclue", function () {
      var ids = {};
      R.notions.forEach(function (n) { vrai(!ids[n.id], "doublon " + n.id); ids[n.id] = true; vrai(n.id.indexOf(n.ligne + ".") === 0); });
      R.lignes.forEach(function (l) { vrai(R.notionsDeLigne(l.id).length > 0, "ligne vide " + l.id); });
      R.notions.forEach(function (n) {
        n.voirAussi.forEach(function (v) { vrai(R.ligne(v), "renvoi inconnu " + v); });
        if (n.centrale) vrai(n.justification && n.criteres.length, "centrale sans justification " + n.id);
      });
      var exclues = R.crcnExclues.map(function (c) { return c.id; });
      R.lignes.forEach(function (l) { vrai(!l.crcn || exclues.indexOf(l.crcn) < 0, "compétence exclue " + l.id); });
      egal(R.lignes.filter(function (l) { return l.crcn; }).length, 12);
      egal(R.lignes.length, 60);
    });
  });

  /* ---------- 10. Simulation ---------- */
  suite("10. Simulation de 90 jours", function (t) {
    t("file ≤ 120, séances 10/10/10/10/5, plancher de nouvelles respecté", function () {
      if (!CI.simulation) throw new Error("outils/simulation.js n'est pas chargé");
      var r = CI.simulation.simuler(CI);
      egal(r.erreurs.slice(0, 5), [], r.erreurs.length + " anomalie(s)");
      vrai(r.fileMax <= 120, "file maximale " + r.fileMax);
      t.note("file restante maximale : " + r.fileMax + " (le " + r.jourMax + ")");
    });
  });

  /* ---------- Exécution ---------- */
  function executer(rapporter) {
    var total = 0, echecs = [], notes = [];
    suites.forEach(function (s) {
      rapporter({ type: "suite", nom: s.nom });
      var tests = [];
      var t = function (nom, fn) { tests.push({ nom: nom, fn: fn }); };
      t.note = function (m) { notes.push(m); rapporter({ type: "note", message: m }); };
      s.corps(t);
      tests.forEach(function (x) {
        total += 1;
        var debut = Date.now();
        try {
          x.fn();
          rapporter({ type: "ok", nom: x.nom, ms: Date.now() - debut });
        } catch (e) {
          echecs.push({ suite: s.nom, test: x.nom, message: e && e.message ? e.message : String(e) });
          rapporter({ type: "echec", nom: x.nom, message: e && e.message ? e.message : String(e) });
        }
      });
    });
    return { total: total, echecs: echecs, notes: notes };
  }

  CI.tests = { suites: suites, executer: executer };
})(typeof window !== "undefined" ? window : globalThis);
