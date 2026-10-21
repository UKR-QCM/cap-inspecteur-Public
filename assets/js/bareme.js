/*
 * Cap Inspecteur — barème, calibrage et note estimée. Sans DOM.
 *
 * Le barème officiel du QCM n'est pas publié : +1 par bonne réponse, 0 pour Ann ou
 * sans réponse, et une pénalité réglable (0,25 ; 0,5 par défaut ; 1) par réponse fausse.
 */
(function (racine) {
  "use strict";
  var CI = racine.CI = racine.CI || {};
  var U = CI.utils;

  var PENALITES = [0.25, 0.5, 1];
  var BLOCS = ["I", "II", "III", "IV", "V"];
  var QUESTIONS_EPREUVE = { I: 10, II: 10, III: 10, IV: 10, V: 5 };
  var MARGE_LIMITE = 0.05;
  var MINIMUM_CALIBRAGE = 10;
  var MINIMUM_ESTIMATION = 20;

  function arrondi(x, d) { var p = Math.pow(10, d === undefined ? 2 : d); return Math.round(x * p) / p; }

  function points(compte, penalite) {
    return (compte.justes || 0) + (compte.doutesJustes || 0) - penalite * (compte.fausses || 0);
  }

  function note20(pts, n) { return n > 0 ? Math.max(0, pts) / n * 20 : 0; }

  function seuil(penalite) { return penalite / (1 + penalite); }

  function compteVide() { return { n: 0, justes: 0, doutesJustes: 0, fausses: 0, abstentions: 0, sansReponse: 0 }; }

  function compter(c, code) {
    c.n += 1;
    if (code === "juste") c.justes += 1;
    else if (code === "doute") c.doutesJustes += 1;
    else if (code === "faux") c.fausses += 1;
    else if (code === "ann") c.abstentions += 1;
    else c.sansReponse += 1;
  }

  function resumer(issues, penalite) {
    var total = compteVide();
    var parBloc = {};
    var temps = 0;
    (issues || []).forEach(function (i) {
      compter(total, i.code);
      if (i.bloc) { parBloc[i.bloc] = parBloc[i.bloc] || compteVide(); compter(parBloc[i.bloc], i.code); }
      temps += i.temps || 0;
    });
    Object.keys(parBloc).forEach(function (b) { parBloc[b].points = arrondi(points(parBloc[b], penalite)); });
    var notes = {};
    PENALITES.forEach(function (p) { notes[String(p)] = arrondi(note20(points(total, p), total.n)); });
    var pts = points(total, penalite);
    return {
      n: total.n, justes: total.justes, doutesJustes: total.doutesJustes, fausses: total.fausses,
      abstentions: total.abstentions, sansReponse: total.sansReponse,
      points: arrondi(pts), note: arrondi(note20(pts, total.n)), notes: notes,
      parBloc: parBloc, temps: Math.round(temps), resorbees: 0
    };
  }

  function dansFenetre(entree, jour, jours) {
    var e = U.ecartJours(entree.j, jour);
    return e >= 0 && e < jours;
  }

  function calibrerGroupe(entrees, penalite) {
    var doutes = entrees.filter(function (e) { return e.d === 1 && (e.r === "doute" || e.r === "faux"); });
    var dj = doutes.filter(function (e) { return e.r === "doute"; }).length;
    var pres = entrees.filter(function (e) { return e.r === "ann" && (e.pr === 0 || e.pr === 1); });
    var pj = pres.filter(function (e) { return e.pr === 1; }).length;
    var s = seuil(penalite);
    var taux = doutes.length ? dj / doutes.length : null;
    var assez = doutes.length >= MINIMUM_CALIBRAGE;
    var conseil = null, calcul = "";
    if (assez) {
      var gain = taux - (1 - taux) * penalite;
      conseil = taux > s + MARGE_LIMITE ? "reponds" : taux < s - MARGE_LIMITE ? "abstiens" : "limite";
      calcul = "Quand tu doutes, tu as raison " + U.nombreFr(taux * 100, 0) + " % du temps. Répondre rapporte en moyenne " +
        U.nombreFr(taux, 2) + " − " + U.nombreFr(1 - taux, 2) + " × " + U.nombreFr(penalite, 2) + " = " +
        U.nombreFr(gain, 2) + " point par question ; s'abstenir rapporte 0. Seuil de rentabilité : " +
        U.nombreFr(s * 100, 1) + " %.";
    }
    return {
      doutes: { n: doutes.length, justes: dj, taux: taux },
      seuil: s,
      conseil: conseil,
      calcul: calcul,
      assez: assez,
      pressenties: {
        n: pres.length, justes: pj,
        taux: pres.length ? pj / pres.length : null,
        cout: arrondi(pj - penalite * (pres.length - pj)),
        assez: pres.length >= MINIMUM_CALIBRAGE
      }
    };
  }

  function calibrage(historique, jour, penalite) {
    var recentes = (historique || []).filter(function (e) { return dansFenetre(e, jour, 30); });
    var parBloc = {};
    BLOCS.forEach(function (b) {
      parBloc[b] = calibrerGroupe(recentes.filter(function (e) { return e.b === b; }), penalite);
    });
    return { global: calibrerGroupe(recentes, penalite), parBloc: parBloc };
  }

  function noteEstimee(historique, jour, penalite) {
    var vus = {};
    var entrees = (historique || []).filter(function (e) {
      var garder = (e.pre === 1 && dansFenetre(e, jour, 14)) || (e.s === "examen" && dansFenetre(e, jour, 30));
      if (!garder || vus[e.k]) return false;
      vus[e.k] = true;
      return true;
    });
    var parBloc = {}, manque = {}, disponible = true;
    var totalPoints = 0, variance = 0;
    BLOCS.forEach(function (b) {
      var liste = entrees.filter(function (e) { return e.b === b; });
      var N = liste.length;
      var j = liste.filter(function (e) { return e.r === "juste" || e.r === "doute"; }).length;
      var f = liste.filter(function (e) { return e.r === "faux"; }).length;
      var a = N - j - f;
      var nb = QUESTIONS_EPREUVE[b];
      var info = { observees: N, tauxJustes: N ? j / N : null, tauxFausses: N ? f / N : null, tauxAbstentions: N ? a / N : null };
      if (N < MINIMUM_ESTIMATION) {
        disponible = false;
        manque[b] = MINIMUM_ESTIMATION - N;
      } else {
        var pJ = j / N, pF = f / N;
        var moyenne = pJ - penalite * pF;
        var varQ = pJ + pF * penalite * penalite - moyenne * moyenne;
        info.pointsAttendus = arrondi(nb * moyenne);
        totalPoints += nb * moyenne;
        variance += nb * varQ * (1 + nb / N);
      }
      parBloc[b] = info;
    });
    if (!disponible) return { disponible: false, manque: manque, parBloc: parBloc };
    var ecart = 1.96 * Math.sqrt(variance);
    return {
      disponible: true, manque: {}, parBloc: parBloc,
      points: arrondi(totalPoints),
      note: arrondi(note20(totalPoints, 45)),
      basse: arrondi(note20(totalPoints - ecart, 45)),
      haute: arrondi(Math.min(20, note20(totalPoints + ecart, 45)))
    };
  }

  CI.bareme = {
    PENALITES: PENALITES,
    QUESTIONS_EPREUVE: QUESTIONS_EPREUVE,
    points: points,
    note20: note20,
    seuil: seuil,
    resumer: resumer,
    calibrage: calibrage,
    noteEstimee: noteEstimee
  };
})(typeof window !== "undefined" ? window : globalThis);
