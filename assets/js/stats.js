/*
 * Cap Inspecteur — calculs du tableau de bord, XP et série. Sans DOM.
 */
(function (racine) {
  "use strict";
  var CI = racine.CI = racine.CI || {};
  var U = CI.utils, S = CI.srs;

  var XP_REVISION_JUSTE = 2;
  var XP_ERREUR_RESORBEE = 20;

  function seancesValidees(etat) {
    return Object.keys(etat.seances || {}).map(function (k) { return etat.seances[k]; })
      .filter(function (s) { return s.statut === "validee" && s.validee; })
      .sort(function (a, b) { return a.validee.le - b.validee.le || (a.id < b.id ? -1 : 1); });
  }

  /* XP : séance du jour, positionnement ou examen blanc : 10 × max(0, points) + 30 ;
     révisions du jour : +2 par bonne réponse sûre ; +20 par erreur résorbée. */
  function journalXp(etat) {
    var j = [];
    seancesValidees(etat).forEach(function (s) {
      if (s.validee.xp > 0) j.push({ jour: s.validee.jour, xp: s.validee.xp, motif: s.type });
    });
    (etat.historique || []).forEach(function (e) {
      if (e.s === "rev" && e.r === "juste") j.push({ jour: e.j, xp: XP_REVISION_JUSTE, motif: "revision" });
      if (e.res === 1) j.push({ jour: e.j, xp: XP_ERREUR_RESORBEE, motif: "erreur_resorbee" });
    });
    return j.sort(function (a, b) { return a.jour < b.jour ? -1 : a.jour > b.jour ? 1 : 0; });
  }

  function xpTotal(etat) {
    return Math.round(journalXp(etat).reduce(function (s, e) { return s + e.xp; }, 0) * 10) / 10;
  }

  function serie(etat, jour) {
    var jours = {};
    seancesValidees(etat).forEach(function (s) { jours[s.validee.jour] = true; });
    var d = jours[jour] ? jour : U.ajouterJours(jour, -1);
    var n = 0;
    while (jours[d]) { n += 1; d = U.ajouterJours(d, -1); }
    return n;
  }

  function joursRestants(jour, dateConcours) { return U.ecartJours(jour, dateConcours); }

  function courbeNotes(etat) {
    return seancesValidees(etat).filter(function (s) { return s.type !== "libre"; })
      .map(function (s) { return { jour: s.validee.jour, id: s.id, type: s.type, note: s.validee.resume.note }; });
  }

  function moyenneRecente(etat, n, exclureId) {
    var c = courbeNotes(etat).filter(function (x) { return x.id !== exclureId; }).slice(-n);
    if (!c.length) return null;
    return Math.round(c.reduce(function (s, x) { return s + x.note; }, 0) / c.length * 100) / 100;
  }

  function tauxParBloc(etat, jour, jours) {
    var r = {};
    ["I", "II", "III", "IV", "V"].forEach(function (b) { r[b] = { n: 0, justes: 0, taux: null }; });
    (etat.historique || []).forEach(function (e) {
      var ec = U.ecartJours(e.j, jour);
      if (ec < 0 || ec >= jours || !r[e.b]) return;
      r[e.b].n += 1;
      if (e.r === "juste" || e.r === "doute") r[e.b].justes += 1;
    });
    Object.keys(r).forEach(function (b) { r[b].taux = r[b].n ? r[b].justes / r[b].n : null; });
    return r;
  }

  function questionsParNotion(questions) {
    var m = {};
    questions.forEach(function (q) { (m[q.notion] = m[q.notion] || []).push(q); });
    return m;
  }

  function statutNotion(etat, liste) {
    return S.statutNotion(liste.map(function (q) { return etat.questions[q.id]; }));
  }

  function couverture(referentiel, questions, etat) {
    var pn = questionsParNotion(questions);
    return referentiel.lignes.map(function (l) {
      var notions = referentiel.notionsDeLigne(l.id).filter(function (n) { return pn[n.id]; });
      var vues = 0, maitrisees = 0;
      notions.forEach(function (n) {
        var st = statutNotion(etat, pn[n.id]);
        if (st !== "non_vue") vues += 1;
        if (st === "maitrisee") maitrisees += 1;
      });
      var d = notions.length;
      return {
        ligne: l.id, libelle: l.libelle, bloc: l.bloc, notions: referentiel.notionsDeLigne(l.id).length,
        disponibles: d, vues: vues, maitrisees: maitrisees,
        pctVues: d ? Math.round(vues / d * 100) : 0, pctMaitrisees: d ? Math.round(maitrisees / d * 100) : 0
      };
    });
  }

  function notionsFragiles(referentiel, questions, etat, n) {
    var pn = questionsParNotion(questions);
    var r = [];
    Object.keys(pn).forEach(function (id) {
      var notion = referentiel.rattachement(id);
      if (!notion) return;
      var etats = pn[id].map(function (q) { return etat.questions[q.id]; });
      if (S.statutNotion(etats) !== "fragile") return;
      var enErreur = etats.filter(function (e) { return e && e.err; }).length;
      var fausses = etats.reduce(function (s, e) { return s + (e ? e.fausses + e.abstentions + e.sansReponse : 0); }, 0);
      r.push({ notion: id, libelle: notion.libelle, enErreur: enErreur, ratees: fausses });
    });
    return r.sort(function (a, b) { return b.enErreur - a.enErreur || b.ratees - a.ratees || (a.notion < b.notion ? -1 : 1); }).slice(0, n || 5);
  }

  function plusRatees(etat, n) {
    return Object.keys(etat.questions || {}).map(function (id) {
      var e = etat.questions[id];
      return { id: id, ratees: e.fausses + e.abstentions + e.sansReponse, vues: e.vues };
    }).filter(function (x) { return x.ratees > 0; })
      .sort(function (a, b) { return b.ratees - a.ratees || (a.id < b.id ? -1 : 1); }).slice(0, n || 10);
  }

  /* Projection : notions disponibles (blocs I à III) vues le jour du concours, au rythme
     des notions découvertes pendant les 14 derniers jours. */
  function projection(referentiel, questions, etat, jour, dateConcours) {
    var pn = questionsParNotion(questions);
    var dispo = Object.keys(pn).filter(function (id) { return referentiel.notion(id); });
    var premiere = {};
    (etat.historique || []).forEach(function (e) {
      if (e.n && referentiel.notion(e.n) && (!premiere[e.n] || e.j < premiere[e.n])) premiere[e.n] = e.j;
    });
    var vues = dispo.filter(function (id) { return premiere[id]; }).length;
    var recentes = dispo.filter(function (id) {
      if (!premiere[id]) return false;
      var ec = U.ecartJours(premiere[id], jour);
      return ec >= 0 && ec < 14;
    }).length;
    var rythme = recentes / 14;
    var restants = Math.max(0, U.ecartJours(jour, dateConcours));
    var prevues = Math.min(dispo.length, vues + rythme * restants);
    return {
      disponibles: dispo.length, vues: vues, rythmeParJour: Math.round(rythme * 100) / 100,
      pctAuConcours: dispo.length ? Math.round(prevues / dispo.length * 100) : 0
    };
  }

  CI.stats = {
    journalXp: journalXp,
    xpTotal: xpTotal,
    serie: serie,
    joursRestants: joursRestants,
    courbeNotes: courbeNotes,
    moyenneRecente: moyenneRecente,
    tauxParBloc: tauxParBloc,
    couverture: couverture,
    notionsFragiles: notionsFragiles,
    plusRatees: plusRatees,
    projection: projection
  };
})(typeof window !== "undefined" ? window : globalThis);
