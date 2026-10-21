/*
 * Cap Inspecteur — séances : séance du jour, rattrapage, test de positionnement,
 * révisions du jour, examen blanc, entraînement libre, réponses, validation. Sans DOM.
 *
 * Les fonctions qui le précisent modifient `ctx.etat` en place ; les autres sont pures.
 */
(function (racine) {
  "use strict";
  var CI = racine.CI = racine.CI || {};
  var U = CI.utils, S = CI.srs, B = CI.bareme;

  var BLOCS = ["I", "II", "III", "IV", "V"];
  var PLACES = { I: 10, II: 10, III: 10, IV: 10, V: 5 };
  var LOT_DEMARRAGE = "00-demarrage";
  var MAX_PAR_NOTION = 2;
  var MAX_NOUVELLES_REDIGEES_IV = 2;
  var REPARTITION_NIVEAUX = [0.40, 0.45, 0.15];

  /* Réglages de l'algorithme (modifiables pour la simulation et les tests).
     soeurs : activer le remplacement d'une révision en erreur par une question sœur.
     soeursDejaVues : la sœur doit être déjà vue (et non maîtrisée). Une sœur nouvelle ajouterait
     une nouvelle question hors plancher : la simulation sur 90 jours montre qu'alors la file
     restante dépasse 120 (jusqu'à 226) ; avec des sœurs déjà vues, elle reste sous 100. */
  var PARAMETRES = { soeurs: true, soeursDejaVues: true };

  /* ---------- Contexte ---------- */

  function contexte(etat, jour, maintenant) {
    return {
      etat: etat, jour: jour, maintenant: maintenant,
      questions: CI.banque.toutes(),
      referentiel: CI.referentiel,
      familles: CI.generateurs ? CI.generateurs.familles() : {},
      lot: function (id) { return CI.banque.lot(id); },
      resoudre: function (item) {
        return item.q ? CI.banque.question(item.q) : CI.generateurs.generer(item.f, item.graine, item.niveau, item.genVersion);
      }
    };
  }

  function profilId(ctx) { return (ctx.etat.profil && ctx.etat.profil.id) || "profil"; }
  function etatQuestion(ctx, id) { return ctx.etat.questions[id]; }
  function etatFamille(ctx, f) { return ctx.etat.familles[f]; }
  function vueRecente(e, jour) { return !!(e && e.derniere && U.ecartJours(e.derniere, jour) < 3); }
  function jamaisVue(e) { return !e || !e.vues; }

  /* ---------- Éligibilité et file ---------- */

  function signaleesRetirees(etat) {
    var r = {};
    (etat.signalements || []).forEach(function (s) { if (s.retirer) r[s.q] = true; });
    return r;
  }

  function eligibleAvec(q, ctx, retirees) {
    if (!q) return false;
    if (q.perimeLe && q.perimeLe < ctx.jour) return false;
    if (q.statut === "a_verifier" && !(ctx.etat.reglages && ctx.etat.reglages.inclureAVerifier)) return false;
    if (retirees[q.id]) return false;
    return true;
  }

  function eligible(q, ctx) { return eligibleAvec(q, ctx, signaleesRetirees(ctx.etat)); }

  function questionsEligibles(ctx) {
    var retirees = signaleesRetirees(ctx.etat);
    return ctx.questions.filter(function (q) { return eligibleAvec(q, ctx, retirees); });
  }

  function fileRestante(ctx, jour) {
    var n = 0;
    questionsEligibles(ctx).forEach(function (q) { if (S.estDue(etatQuestion(ctx, q.id), jour)) n += 1; });
    Object.keys(ctx.familles || {}).forEach(function (f) { if (S.estDue(etatFamille(ctx, f), jour)) n += 1; });
    return n;
  }

  function plancher(fileVeille, premierJour) {
    var p = function (a, v) { return { I: a, II: a, III: a, IV: a, V: v }; };
    if (premierJour) return p(3, 1);
    if (fileVeille === 0) return p(4, 2);
    if (fileVeille <= 40) return p(3, 1);
    if (fileVeille <= 80) return p(2, 1);
    return p(1, 0);
  }

  function seancesEnCours(etat) {
    return Object.keys(etat.seances || {}).map(function (k) { return etat.seances[k]; })
      .filter(function (s) { return s.statut === "en_cours"; });
  }

  function idsDeSeance(s) {
    var r = {};
    s.items.forEach(function (it) { if (it.q) r[it.q] = true; if (it.remplace) r[it.remplace] = true; });
    return r;
  }

  function idsRattrapage(ctx) {
    var r = {};
    seancesEnCours(ctx.etat).forEach(function (s) {
      if (s.type === "jour" && s.jour < ctx.jour) Object.assign(r, idsDeSeance(s));
    });
    return r;
  }

  /* ---------- Construction d'items ---------- */

  function itemQuestion(q, rng, ctx, remplace) {
    var it = {
      q: q.id, bloc: q.bloc, notion: q.notion,
      ordre: q.ordreFixe ? null : rng.melanger([0, 1, 2, 3]),
      nouvelle: jamaisVue(etatQuestion(ctx, q.id)),
      reponse: null, ann: false, pressentie: null, doute: false, barres: [], temps: 0
    };
    if (remplace) it.remplace = remplace;
    return it;
  }

  function itemGenere(f, graine, niveau, ctx) {
    return {
      f: f, graine: graine >>> 0, genVersion: ctx.familles[f], niveau: niveau,
      bloc: "IV", notion: f, ordre: null, nouvelle: true,
      reponse: null, ann: false, pressentie: null, doute: false, barres: [], temps: 0
    };
  }

  function nouvelleSeance(id, type, ctx, items, options) {
    var tempsCible = (ctx.etat.profil && ctx.etat.profil.tempsCible) || 3900;
    return {
      id: id, type: type, jour: ctx.jour, statut: "en_cours", creeLe: ctx.maintenant,
      options: Object.assign({ mode: "examen", memoire: true, dureeCible: tempsCible, compteARebours: false, pauseSiMasque: true }, options || {}),
      items: items, courant: 0, chrono: { cumule: 0, depuis: null }, validee: null, abandonneeLe: null
    };
  }

  /* ---------- Sélection des nouvelles questions ---------- */

  function notionsVues(ctx) {
    var vues = {};
    ctx.questions.forEach(function (q) {
      var e = etatQuestion(ctx, q.id);
      if (e && e.vues) vues[q.notion] = true;
    });
    return vues;
  }

  function estCentrale(ctx, idNotion) {
    var n = ctx.referentiel && ctx.referentiel.notion ? ctx.referentiel.notion(idNotion) : null;
    return !!(n && n.centrale);
  }

  function restreindreNiveaux(ctx) {
    var p = ctx.etat.profil && ctx.etat.profil.positionnementLe;
    if (!p) return false;
    var e = U.ecartJours(p, ctx.jour);
    return e >= 0 && e <= 7;
  }

  /* Trie les candidates : notions jamais vues, puis centrales, puis ordre pseudo-aléatoire par notion. */
  function trierNouvelles(cands, ctx, sel) {
    var vues = notionsVues(ctx);
    return cands.map(function (q) {
      return {
        q: q,
        k1: vues[q.notion] ? 1 : 0,
        k2: estCentrale(ctx, q.notion) ? 0 : 1,
        k3: U.hacher(sel + "|" + q.notion),
        k4: U.hacher(sel + "|" + q.id)
      };
    }).sort(function (a, b) {
      return a.k1 - b.k1 || a.k2 - b.k2 || a.k3 - b.k3 || a.k4 - b.k4 || (a.q.id < b.q.id ? -1 : 1);
    }).map(function (x) { return x.q; });
  }

  function choisirNouvelles(cands, n, ctx, rng, peut, prendre, sel) {
    if (n <= 0) return 0;
    var restreint = restreindreNiveaux(ctx);
    var liste = trierNouvelles(cands.filter(function (q) { return !restreint || q.difficulte <= 2; }), ctx, sel);
    var quota = { 1: 0, 2: 0, 3: 0 };
    for (var k = 0; k < n; k++) {
      var x = rng.suivant();
      var niv;
      if (restreint) niv = x < 0.5 ? 1 : 2;
      else niv = x < REPARTITION_NIVEAUX[0] ? 1 : x < REPARTITION_NIVEAUX[0] + REPARTITION_NIVEAUX[1] ? 2 : 3;
      quota[niv] += 1;
    }
    var pris = 0, parNotion = {};
    function passe(condition) {
      for (var i = 0; i < liste.length && pris < n; i++) {
        var q = liste[i];
        if (!peut(q, false) || !condition(q)) continue;
        prendre(q);
        parNotion[q.notion] = (parNotion[q.notion] || 0) + 1;
        if (quota[q.difficulte] > 0) quota[q.difficulte] -= 1;
        pris += 1;
      }
    }
    passe(function (q) { return !parNotion[q.notion] && quota[q.difficulte] > 0; });
    passe(function (q) { return quota[q.difficulte] > 0; });
    passe(function () { return true; });
    return pris;
  }

  /* ---------- Séance du jour ---------- */

  function creerSeanceDuJour(ctx) {
    var jour = ctx.jour, etat = ctx.etat;
    var sel = jour + "|" + profilId(ctx);
    var rng = U.alea(U.hacher(sel + "|jour"));
    var premierJour = !Object.keys(etat.questions || {}).length && !Object.keys(etat.familles || {}).length;
    var fileVeille = premierJour ? 0 : fileRestante(ctx, U.ajouterJours(jour, -1));
    var pl = plancher(fileVeille, premierJour);
    var exclus = idsRattrapage(ctx);
    var eligibles = questionsEligibles(ctx).filter(function (q) { return !exclus[q.id]; });
    var items = [];
    var choisis = {}, compteNotion = {};

    function peut(q, exempte) {
      if (choisis[q.id]) return false;
      if (!exempte && (compteNotion[q.notion] || 0) >= MAX_PAR_NOTION) return false;
      return true;
    }

    BLOCS.forEach(function (bloc) {
      var places = PLACES[bloc];
      var blocItems = [];
      var pool = eligibles.filter(function (q) { return q.bloc === bloc; });

      function prendre(q, remplace) {
        choisis[q.id] = true;
        if (remplace) choisis[remplace] = true;
        compteNotion[q.notion] = (compteNotion[q.notion] || 0) + 1;
        blocItems.push(itemQuestion(q, rng, ctx, remplace));
      }

      var dues = pool.filter(function (q) { return S.estDue(etatQuestion(ctx, q.id), jour); })
        .map(function (q) { var e = etatQuestion(ctx, q.id); return { id: q.id, q: q, etat: e, score: S.score(e, jour) }; })
        .sort(S.comparerPriorite);
      var nouvelles = pool.filter(function (q) { return jamaisVue(etatQuestion(ctx, q.id)); });
      var nonDues = pool.filter(function (q) {
        var e = etatQuestion(ctx, q.id);
        return e && e.vues && !S.estDue(e, jour) && !vueRecente(e, jour);
      }).sort(function (a, b) {
        var ea = etatQuestion(ctx, a.id), eb = etatQuestion(ctx, b.id);
        return ea.b - eb.b || (ea.derniere < eb.derniere ? -1 : ea.derniere > eb.derniere ? 1 : 0) || (a.id < b.id ? -1 : 1);
      });

      function soeur(q) {
        var cands = pool.filter(function (x) {
          if (x.notion !== q.notion || x.id === q.id || choisis[x.id]) return false;
          var e = etatQuestion(ctx, x.id);
          if (S.statutQuestion(e) === "maitrisee") return false;
          if (PARAMETRES.soeursDejaVues && jamaisVue(e)) return false;
          if (vueRecente(e, jour) && !S.estDue(e, jour)) return false;
          return true;
        }).sort(function (a, b) {
          var ea = etatQuestion(ctx, a.id), eb = etatQuestion(ctx, b.id);
          var na = jamaisVue(ea) ? 0 : 1, nb = jamaisVue(eb) ? 0 : 1;
          return na - nb || (ea ? ea.b : 0) - (eb ? eb.b : 0) || (a.id < b.id ? -1 : 1);
        });
        return cands[0] || null;
      }

      function prendreDue(d) {
        var exempte = !!d.etat.err;
        if (!peut(d.q, exempte)) return false;
        if (PARAMETRES.soeurs && d.etat.err && d.etat.retoursErreur >= 2 && d.etat.retoursErreur % 2 === 0) {
          var s = soeur(d.q);
          if (s) { prendre(s, d.id); return true; }
        }
        prendre(d.q);
        return true;
      }

      function prendreDues(limite) {
        for (var i = 0; i < dues.length && blocItems.length < limite; i++) {
          if (!choisis[dues[i].id]) prendreDue(dues[i]);
        }
      }

      function prendreNonDues(limite) {
        for (var i = 0; i < nonDues.length && blocItems.length < limite; i++) {
          if (peut(nonDues[i], false)) prendre(nonDues[i]);
        }
      }

      var nbRevision = places - pl[bloc];
      prendreDues(nbRevision);

      if (bloc === "IV" && Object.keys(ctx.familles || {}).length) {
        var reste = places - blocItems.length;
        choisirNouvelles(nouvelles, Math.min(MAX_NOUVELLES_REDIGEES_IV, reste), ctx, rng, peut, function (q) { prendre(q); }, sel);
        var nbGeneres = places - blocItems.length;
        genererFamilles(ctx, nbGeneres, sel).forEach(function (it) { blocItems.push(it); });
      } else {
        choisirNouvelles(nouvelles, places - blocItems.length, ctx, rng, peut, function (q) { prendre(q); }, sel);
        prendreDues(places);
        prendreNonDues(places);
        // Dernier recours (banque trop petite) : toute question non choisie du bloc, hors vues récentes
        // et hors niveau 3 pendant les 7 jours qui suivent le positionnement.
        var restreint = restreindreNiveaux(ctx);
        for (var i = 0; i < pool.length && blocItems.length < places; i++) {
          var x = pool[i];
          if (choisis[x.id] || vueRecente(etatQuestion(ctx, x.id), jour)) continue;
          if (restreint && jamaisVue(etatQuestion(ctx, x.id)) && x.difficulte > 2) continue;
          prendre(x);
        }
      }
      rng.melanger(blocItems).forEach(function (it) { items.push(it); });
    });

    var s = nouvelleSeance("J-" + jour, "jour", ctx, items, {});
    s.plancher = pl;
    s.fileVeille = fileVeille;
    return s;
  }

  /* Questions générées : familles dues d'abord (priorité), puis la moins récemment vue ; 2 au plus par famille. */
  function ordreFamilles(ctx) {
    var jour = ctx.jour;
    var fams = Object.keys(ctx.familles || {}).sort();
    var dues = fams.filter(function (f) { return S.estDue(etatFamille(ctx, f), jour); })
      .map(function (f) { var e = etatFamille(ctx, f); return { id: f, etat: e, score: S.score(e, jour) }; })
      .sort(S.comparerPriorite).map(function (x) { return x.id; });
    var autres = fams.filter(function (f) { return dues.indexOf(f) < 0; }).sort(function (a, b) {
      var ea = etatFamille(ctx, a), eb = etatFamille(ctx, b);
      var da = ea && ea.derniere ? ea.derniere : "", db = eb && eb.derniere ? eb.derniere : "";
      if (da !== db) return da < db ? -1 : 1;
      return a < b ? -1 : 1;
    });
    return dues.concat(autres);
  }

  function genererFamilles(ctx, n, sel) {
    var ordre = ordreFamilles(ctx);
    var restreint = restreindreNiveaux(ctx);
    var res = [];
    for (var passe = 0; passe < 2 && res.length < n; passe++) {
      for (var i = 0; i < ordre.length && res.length < n; i++) {
        var f = ordre[i];
        var niveau = S.niveauFamille(etatFamille(ctx, f));
        if (restreint) niveau = Math.min(niveau, 2);
        res.push(itemGenere(f, U.hacher(sel + "|gen|" + f + "|" + passe), niveau, ctx));
      }
    }
    return res;
  }

  /* ---------- Journée : séance du jour et rattrapage ---------- */

  function stocker(etat, seance) { etat.seances[seance.id] = seance; return seance; }

  function abandonner(etat, id, maintenant) {
    var s = etat.seances[id];
    if (!s || s.statut !== "en_cours") return null;
    s.statut = "abandonnee";
    s.abandonneeLe = maintenant;
    return s;
  }

  function preparerJournee(ctx) {
    var etat = ctx.etat, jour = ctx.jour;
    var pendantes = seancesEnCours(etat).filter(function (s) { return s.type === "jour" && s.jour < jour; })
      .sort(function (a, b) { return a.jour < b.jour ? -1 : 1; });
    while (pendantes.length > 1) abandonner(etat, pendantes.shift().id, ctx.maintenant);
    var rattrapage = pendantes[0] || null;
    var positionnementRequis = !etat.profil.positionnementLe;
    var seance = etat.seances["J-" + jour] || null;
    if (!seance && !positionnementRequis && etat.profil.positionnementLe !== jour) {
      seance = stocker(etat, creerSeanceDuJour(ctx));
    }
    return { seance: seance, rattrapage: rattrapage, positionnementRequis: positionnementRequis };
  }

  /* ---------- Test de positionnement ---------- */

  function creerPositionnement(ctx) {
    var sel = ctx.jour + "|" + profilId(ctx) + "|positionnement";
    var rng = U.alea(U.hacher(sel));
    var lotDe = ctx.lot || function () { return null; };
    var dem = ctx.questions.filter(function (q) { return lotDe(q.id) === LOT_DEMARRAGE && q.difficulte <= 2; });
    var manque = {}, complet = true, items = [];
    BLOCS.forEach(function (bloc) {
      var blocItems = [];
      if (bloc === "IV") {
        var fams = Object.keys(ctx.familles || {}).sort();
        if (!fams.length) { manque.IV = PLACES.IV; complet = false; return; }
        for (var k = 0; k < PLACES.IV; k++) {
          var f = fams[k % fams.length];
          blocItems.push(itemGenere(f, U.hacher(sel + "|" + k), (k % 2) + 1, ctx));
        }
      } else {
        var cands = dem.filter(function (q) { return q.bloc === bloc; });
        if (cands.length < PLACES[bloc]) { manque[bloc] = PLACES[bloc] - cands.length; complet = false; return; }
        rng.melanger(cands).slice(0, PLACES[bloc]).forEach(function (q) { blocItems.push(itemQuestion(q, rng, ctx)); });
      }
      rng.melanger(blocItems).forEach(function (it) { items.push(it); });
    });
    if (!complet) return { seance: null, manque: manque };
    return { seance: nouvelleSeance("P-" + ctx.jour, "positionnement", ctx, items, {}), manque: {} };
  }

  /* ---------- Examen blanc ---------- */

  function numeroSuivant(etat, prefixe) {
    var n = 1;
    while (etat.seances[prefixe + n]) n += 1;
    return n;
  }

  function creerExamenBlanc(ctx) {
    var sel = ctx.jour + "|" + profilId(ctx) + "|examen|" + numeroSuivant(ctx.etat, "E-" + ctx.jour + "-");
    var rng = U.alea(U.hacher(sel));
    var eligibles = questionsEligibles(ctx);
    var items = [];
    BLOCS.forEach(function (bloc) {
      var pool = eligibles.filter(function (q) { return q.bloc === bloc; });
      var nouvelles = rng.melanger(pool.filter(function (q) { return jamaisVue(etatQuestion(ctx, q.id)); }));
      var vues = pool.filter(function (q) { return !jamaisVue(etatQuestion(ctx, q.id)); }).sort(function (a, b) {
        var da = etatQuestion(ctx, a.id).derniere, db = etatQuestion(ctx, b.id).derniere;
        return da < db ? -1 : da > db ? 1 : (a.id < b.id ? -1 : 1);
      });
      var blocItems = [];
      var places = PLACES[bloc];
      if (bloc === "IV" && Object.keys(ctx.familles || {}).length) {
        nouvelles.slice(0, 3).forEach(function (q) { blocItems.push(itemQuestion(q, rng, ctx)); });
        genererFamilles(ctx, places - blocItems.length, sel).forEach(function (it) { blocItems.push(it); });
      } else {
        nouvelles.concat(vues).slice(0, places).forEach(function (q) { blocItems.push(itemQuestion(q, rng, ctx)); });
      }
      rng.melanger(blocItems).forEach(function (it) { items.push(it); });
    });
    var id = "E-" + ctx.jour + "-" + numeroSuivant(ctx.etat, "E-" + ctx.jour + "-");
    return nouvelleSeance(id, "examen", ctx, items, { compteARebours: true, pauseSiMasque: false });
  }

  /* ---------- Entraînement libre ---------- */

  function correspondStatut(e, statut) {
    if (!statut) return true;
    var st = S.statutQuestion(e);
    if (statut === "nouvelles") return st === "nouvelle";
    if (statut === "erreur") return st === "erreur";
    if (statut === "hesitation") return st === "hesitation";
    if (statut === "maitrisees") return st === "maitrisee";
    if (statut === "abstentions") return !!(e && e.abstentions > 0);
    return true;
  }

  function creerEntrainement(ctx, filtres) {
    var f = filtres || {};
    var n = f.nombre || 20;
    var sel = ctx.jour + "|" + profilId(ctx) + "|libre|" + numeroSuivant(ctx.etat, "L-" + ctx.jour + "-");
    var rng = U.alea(U.hacher(sel));
    var cands = questionsEligibles(ctx).filter(function (q) {
      if (f.bloc && q.bloc !== f.bloc) return false;
      if (f.ligne && q.notion.indexOf(f.ligne + ".") !== 0) return false;
      if (f.notion && q.notion !== f.notion) return false;
      if (f.difficulte && q.difficulte !== f.difficulte) return false;
      return correspondStatut(etatQuestion(ctx, q.id), f.statut);
    });
    var items = rng.melanger(cands).slice(0, n).map(function (q) { return itemQuestion(q, rng, ctx); });
    var famillesVisees = Object.keys(ctx.familles || {}).filter(function (fam) {
      if (f.notion) return f.notion === fam;
      return f.bloc === "IV" && !f.ligne && !f.statut;
    });
    for (var k = 0; items.length < n && famillesVisees.length && k < 1000; k++) {
      var fam = famillesVisees[k % famillesVisees.length];
      var niveau = f.difficulte || S.niveauFamille(etatFamille(ctx, fam));
      items.push(itemGenere(fam, U.hacher(sel + "|" + k), niveau, ctx));
    }
    var id = "L-" + ctx.jour + "-" + numeroSuivant(ctx.etat, "L-" + ctx.jour + "-");
    return nouvelleSeance(id, "libre", ctx, items, {
      mode: f.mode === "examen" ? "examen" : "immediat",
      memoire: f.memoire !== false
    });
  }

  /* ---------- Réponses et chronomètre ---------- */

  function verifierEnCours(seance) {
    if (!seance || seance.statut !== "en_cours") throw new Error("La séance n'est plus modifiable.");
  }

  function appliquerReponse(item, r) {
    if (r.ann === true) { item.ann = true; item.reponse = null; item.doute = false; }
    else if (r.ann === false) { item.ann = false; item.pressentie = null; }
    if (Object.prototype.hasOwnProperty.call(r, "choix")) {
      if (r.choix === null) item.reponse = null;
      else if ([0, 1, 2, 3].indexOf(r.choix) >= 0) { item.reponse = r.choix; item.ann = false; item.pressentie = null; }
    }
    if (Object.prototype.hasOwnProperty.call(r, "doute")) item.doute = item.ann ? false : !!r.doute;
    if (Object.prototype.hasOwnProperty.call(r, "pressentie")) {
      item.pressentie = item.ann && [0, 1, 2, 3].indexOf(r.pressentie) >= 0 ? r.pressentie : null;
    }
    return item;
  }

  function repondre(seance, index, r) {
    verifierEnCours(seance);
    return appliquerReponse(seance.items[index], r || {});
  }

  function barrer(seance, index, choix) {
    verifierEnCours(seance);
    var it = seance.items[index];
    var i = it.barres.indexOf(choix);
    if (i >= 0) it.barres.splice(i, 1); else it.barres.push(choix);
    return it;
  }

  function ordreAffiche(item) { return item.ordre ? item.ordre.slice() : [0, 1, 2, 3]; }

  function demarrerChrono(seance, maintenant) { if (seance.chrono.depuis === null) seance.chrono.depuis = maintenant; }
  function suspendreChrono(seance, maintenant) {
    if (seance.chrono.depuis !== null) {
      seance.chrono.cumule += Math.max(0, maintenant - seance.chrono.depuis);
      seance.chrono.depuis = null;
    }
  }
  function tempsEcoule(seance, maintenant) {
    return seance.chrono.cumule + (seance.chrono.depuis !== null ? Math.max(0, maintenant - seance.chrono.depuis) : 0);
  }
  function ajouterTemps(seance, index, secondes) {
    var it = seance.items[index];
    it.temps = Math.round((it.temps + Math.max(0, secondes)) * 10) / 10;
    return it;
  }

  function recapitulatif(seance, maintenant) {
    var r = { sansReponse: 0, doutes: 0, abstentions: 0, repondues: 0, temps: Math.round(tempsEcoule(seance, maintenant || 0) / 1000) };
    seance.items.forEach(function (it) {
      if (it.ann) r.abstentions += 1;
      else if (it.reponse === null) r.sansReponse += 1;
      else r.repondues += 1;
      if (it.doute) r.doutes += 1;
    });
    return r;
  }

  function codeReponse(item, bonne) {
    if (item.ann) return "ann";
    if (item.reponse === null || item.reponse === undefined) return "sans";
    if (item.reponse === bonne) return item.doute ? "doute" : "juste";
    return "faux";
  }

  /* ---------- Mémoire et historique ---------- */

  function memoriser(ctx, item, code) {
    var etat = ctx.etat;
    var table = item.q ? etat.questions : etat.familles;
    var cle = item.q || item.f;
    var nouvel = S.appliquer(table[cle], code, ctx.jour, { doute: item.doute, temps: item.temps });
    var res = nouvel._resorbee ? 1 : 0;
    delete nouvel._resorbee;
    table[cle] = nouvel;
    return res;
  }

  function journaliser(ctx, k, source, item, code, bonne, res, memoire) {
    ctx.etat.historique.push({
      k: k, j: ctx.jour, s: source,
      q: item.q || null, f: item.f || null, b: item.bloc, n: item.notion,
      r: code, d: item.doute ? 1 : 0,
      pr: item.ann && item.pressentie !== null && item.pressentie !== undefined ? (item.pressentie === bonne ? 1 : 0) : null,
      t: Math.round(item.temps || 0), pre: item.nouvelle ? 1 : 0, res: res, m: memoire ? 1 : 0
    });
  }

  var SOURCE = { jour: "jour", positionnement: "positionnement", examen: "examen", libre: "libre" };

  function valider(ctx, id) {
    var etat = ctx.etat;
    var seance = etat.seances[id];
    verifierEnCours(seance);
    suspendreChrono(seance, ctx.maintenant);
    var immediat = seance.options.mode === "immediat";
    var memoire = seance.options.memoire !== false;
    var issues = [], resorbees = 0;
    seance.items.forEach(function (item, i) {
      if (immediat && !item.corrige) { delete item.barres; return; } // jamais présentée : hors résumé
      var q = ctx.resoudre(item);
      var bonne = q ? q.bonne : -1;
      var code = codeReponse(item, bonne);
      if (!immediat) {
        var res = 0;
        if (memoire && q) {
          if (item.remplace) etat.questions[item.remplace] = S.compterRemplacement(etat.questions[item.remplace]);
          res = memoriser(ctx, item, code);
        }
        resorbees += res;
        journaliser(ctx, seance.id + "#" + i, SOURCE[seance.type], item, code, bonne, res, memoire);
      } else if (item._res) {
        resorbees += 1;
      }
      delete item._res;
      delete item.barres;
      issues.push({ code: code, bloc: item.bloc, temps: item.temps });
    });
    var resume = B.resumer(issues, etat.profil.penalite);
    resume.resorbees = resorbees;
    var xp = seance.type === "libre" ? 0 : 10 * Math.max(0, resume.points) + 30;
    seance.statut = "validee";
    seance.validee = { le: ctx.maintenant, jour: ctx.jour, resume: resume, xp: Math.round(xp * 10) / 10 };
    if (seance.type === "positionnement") etat.profil.positionnementLe = ctx.jour;
    return { seance: seance, resume: resume };
  }

  /* Correction immédiate dans une séance d'entraînement libre. */
  function repondreImmediat(ctx, id, index, r) {
    var seance = ctx.etat.seances[id];
    verifierEnCours(seance);
    var item = seance.items[index];
    if (item.corrige) throw new Error("Question déjà corrigée.");
    appliquerReponse(item, r || {});
    var q = ctx.resoudre(item);
    var code = codeReponse(item, q.bonne);
    var memoire = seance.options.memoire !== false;
    var res = memoire ? memoriser(ctx, item, code) : 0;
    if (res) item._res = 1;
    item.corrige = true;
    journaliser(ctx, seance.id + "#" + index, "libre", item, code, q.bonne, res, memoire);
    return { code: code, bonne: q.bonne, question: q };
  }

  /* ---------- Révisions du jour ---------- */

  function fileRevisions(ctx) {
    var jour = ctx.jour;
    var exclus = idsRattrapage(ctx);
    var famillesExclues = {};
    ["J-" + jour, "P-" + jour].forEach(function (id) {
      var s = ctx.etat.seances[id];
      if (s && s.statut === "en_cours") {
        Object.assign(exclus, idsDeSeance(s));
        s.items.forEach(function (it) { if (it.f) famillesExclues[it.f] = true; });
      }
    });
    var liste = questionsEligibles(ctx).filter(function (q) {
      return !exclus[q.id] && S.estDue(etatQuestion(ctx, q.id), jour);
    }).map(function (q) {
      var e = etatQuestion(ctx, q.id);
      return { id: q.id, q: q, etat: e, score: S.score(e, jour) };
    });
    Object.keys(ctx.familles || {}).forEach(function (f) {
      var e = etatFamille(ctx, f);
      if (!famillesExclues[f] && S.estDue(e, jour)) liste.push({ id: f, f: f, etat: e, score: S.score(e, jour) });
    });
    return liste.sort(S.comparerPriorite);
  }

  function revisionsDuJour(etat, jour) {
    if (!etat.revisions || etat.revisions.jour !== jour) etat.revisions = { jour: jour, faites: 0, compteur: 0, courant: null };
    return etat.revisions;
  }

  function prochaineRevision(ctx) {
    var rv = revisionsDuJour(ctx.etat, ctx.jour);
    if (rv.courant) return rv.courant;
    var liste = fileRevisions(ctx);
    if (!liste.length) return null;
    var x = liste[0];
    var sel = ctx.jour + "|" + profilId(ctx) + "|rev|" + rv.compteur;
    var rng = U.alea(U.hacher(sel));
    rv.courant = x.q ? itemQuestion(x.q, rng, ctx) : itemGenere(x.f, U.hacher(sel + "|" + x.f), S.niveauFamille(x.etat), ctx);
    return rv.courant;
  }

  function repondreRevision(ctx, r) {
    var rv = revisionsDuJour(ctx.etat, ctx.jour);
    var item = rv.courant;
    if (!item) throw new Error("Aucune révision en cours.");
    appliquerReponse(item, r || {});
    var q = ctx.resoudre(item);
    var code = codeReponse(item, q.bonne);
    var res = memoriser(ctx, item, code);
    rv.compteur += 1;
    rv.faites += 1;
    journaliser(ctx, "R-" + ctx.jour + "-" + rv.compteur, "rev", item, code, q.bonne, res, true);
    rv.courant = null;
    return { code: code, bonne: q.bonne, question: q, resorbee: !!res };
  }

  CI.seance = {
    BLOCS: BLOCS,
    PLACES: PLACES,
    LOT_DEMARRAGE: LOT_DEMARRAGE,
    PARAMETRES: PARAMETRES,
    contexte: contexte,
    plancher: plancher,
    fileRestante: fileRestante,
    eligible: eligible,
    creerSeanceDuJour: creerSeanceDuJour,
    preparerJournee: preparerJournee,
    creerPositionnement: creerPositionnement,
    creerExamenBlanc: creerExamenBlanc,
    creerEntrainement: creerEntrainement,
    stocker: stocker,
    abandonner: abandonner,
    seancesEnCours: seancesEnCours,
    repondre: repondre,
    barrer: barrer,
    ordreAffiche: ordreAffiche,
    demarrerChrono: demarrerChrono,
    suspendreChrono: suspendreChrono,
    tempsEcoule: tempsEcoule,
    ajouterTemps: ajouterTemps,
    recapitulatif: recapitulatif,
    codeReponse: codeReponse,
    valider: valider,
    repondreImmediat: repondreImmediat,
    fileRevisions: fileRevisions,
    prochaineRevision: prochaineRevision,
    repondreRevision: repondreRevision
  };
})(typeof window !== "undefined" ? window : globalThis);
