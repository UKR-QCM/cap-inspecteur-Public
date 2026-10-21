/*
 * Cap Inspecteur — stockage local, migration, export, import et fusion.
 * Seules `charger`, `sauvegarder` et `planificateur` touchent un objet de stockage
 * (localStorage ou équivalent passé en paramètre) ; le reste est pur.
 */
(function (racine) {
  "use strict";
  var CI = racine.CI = racine.CI || {};
  var U = CI.utils;

  var CLE = "capinspecteur:v1";
  var SCHEMA = 1;
  var APPLICATION = "cap-inspecteur";

  function profilParDefaut(jour, id) {
    return {
      id: id || "profil", pseudo: "", dateConcours: "2026-12-07", penalite: 0.5, tempsCible: 3900,
      creeLe: jour || null, positionnementLe: null
    };
  }

  function reglagesParDefaut() {
    return { objectifRevisions: 40, inclureAVerifier: false, animationsReduites: false };
  }

  function etatVide(jour, idProfil) {
    return {
      schemaVersion: SCHEMA,
      profil: profilParDefaut(jour, idProfil),
      reglages: reglagesParDefaut(),
      questions: {},
      familles: {},
      seances: {},
      historique: [],
      revisions: { jour: jour || null, faites: 0, compteur: 0, courant: null },
      signalements: [],
      dernierExport: null,
      installationVue: false
    };
  }

  function completer(cible, defauts) {
    Object.keys(defauts).forEach(function (k) {
      if (cible[k] === undefined || cible[k] === null && defauts[k] !== null && typeof defauts[k] === "object") cible[k] = defauts[k];
    });
    return cible;
  }

  /* Porte un état au schéma courant. Schéma 0 : pas de `schemaVersion`,
     états des questions sous `etatsQuestions`, pas d'historique. */
  function migrate(obj) {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) throw new Error("Sauvegarde illisible.");
    var e = U.cloner(obj);
    var v = typeof e.schemaVersion === "number" ? e.schemaVersion : 0;
    if (v > SCHEMA) throw new Error("Sauvegarde créée par une version plus récente de l'application.");
    if (v === 0) {
      if (e.etatsQuestions && !e.questions) e.questions = e.etatsQuestions;
      delete e.etatsQuestions;
      if (!Array.isArray(e.historique)) e.historique = [];
      e.schemaVersion = 1;
    }
    var vide = etatVide(e.profil && e.profil.creeLe, e.profil && e.profil.id);
    completer(e, vide);
    e.profil = completer(e.profil || {}, vide.profil);
    e.reglages = completer(e.reglages || {}, vide.reglages);
    e.schemaVersion = SCHEMA;
    return e;
  }

  function serialiser(etat) { return JSON.stringify(etat); }
  function deserialiser(texte) { return migrate(JSON.parse(texte)); }

  function octets(texte) {
    if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(texte).length;
    return unescape(encodeURIComponent(texte)).length;
  }

  function taille(etat) { return octets(serialiser(etat)); }

  /* ---------- Accès au stockage ---------- */

  function charger(stockage) {
    try {
      var t = stockage.getItem(CLE);
      if (t === null || t === undefined) return { etat: null, erreur: null };
      return { etat: deserialiser(t), erreur: null };
    } catch (e) {
      return { etat: null, erreur: e && e.message ? e.message : String(e) };
    }
  }

  function sauvegarder(stockage, etat) {
    try {
      var t = serialiser(etat);
      stockage.setItem(CLE, t);
      return { ok: true, erreur: null, octets: octets(t) };
    } catch (e) {
      return { ok: false, erreur: e && e.message ? e.message : String(e), octets: 0 };
    }
  }

  /* Écriture regroupée : une seule écriture `delai` ms après la dernière action. */
  function planificateur(stockage, options) {
    var o = options || {};
    var delai = typeof o.delai === "number" ? o.delai : 300;
    var minuterie = o.minuterie || {
      poser: function (fn, ms) { return setTimeout(fn, ms); },
      annuler: function (id) { clearTimeout(id); }
    };
    var enAttente = null, dernierEtat = null;
    function ecrire() {
      enAttente = null;
      var r = sauvegarder(stockage, dernierEtat);
      if (o.surSauvegarde) o.surSauvegarde(r);
      return r;
    }
    return {
      programmer: function (etat) {
        dernierEtat = etat;
        if (enAttente !== null) minuterie.annuler(enAttente);
        enAttente = minuterie.poser(ecrire, delai);
      },
      forcer: function () {
        if (enAttente !== null) minuterie.annuler(enAttente);
        return dernierEtat ? ecrire() : null;
      }
    };
  }

  /* ---------- Export et import ---------- */

  function exporter(etat, jour) {
    return {
      nomFichier: "cap-inspecteur-sauvegarde-" + jour + ".json",
      contenu: JSON.stringify({ application: APPLICATION, exporteLe: jour, etat: etat })
    };
  }

  function bornes(etat) {
    var jours = [];
    (etat.historique || []).forEach(function (e) { if (U.estJour(e.j)) jours.push(e.j); });
    Object.keys(etat.seances || {}).forEach(function (k) { if (U.estJour(etat.seances[k].jour)) jours.push(etat.seances[k].jour); });
    jours.sort();
    return { debut: jours[0] || null, fin: jours[jours.length - 1] || null };
  }

  function analyserImport(texte) {
    var erreurs = [];
    var donnees;
    try { donnees = JSON.parse(texte); } catch (e) { return { ok: false, erreurs: ["Le fichier n'est pas un JSON valide."], etat: null, apercu: null }; }
    if (!donnees || donnees.application !== APPLICATION || !donnees.etat) {
      return { ok: false, erreurs: ["Ce fichier n'est pas une sauvegarde Cap Inspecteur."], etat: null, apercu: null };
    }
    var etat;
    try { etat = migrate(donnees.etat); } catch (e) { return { ok: false, erreurs: [e.message], etat: null, apercu: null }; }
    if (typeof etat.questions !== "object" || Array.isArray(etat.questions)) erreurs.push("États des questions illisibles.");
    if (typeof etat.seances !== "object" || Array.isArray(etat.seances)) erreurs.push("Séances illisibles.");
    if (!Array.isArray(etat.historique)) erreurs.push("Historique illisible.");
    Object.keys(etat.questions || {}).forEach(function (id) {
      var q = etat.questions[id];
      if (!q || typeof q.b !== "number" || q.b < 0 || q.b > 5 || (q.due !== null && !U.estJour(q.due))) erreurs.push("État invalide pour " + id + ".");
    });
    if (erreurs.length) return { ok: false, erreurs: erreurs.slice(0, 10), etat: null, apercu: null };
    var b = bornes(etat);
    var seances = Object.keys(etat.seances).filter(function (k) { return etat.seances[k].statut === "validee"; }).length;
    var vues = Object.keys(etat.questions).filter(function (k) { return etat.questions[k].vues > 0; }).length;
    return { ok: true, erreurs: [], etat: etat, apercu: { debut: b.debut, fin: b.fin, seances: seances, questionsVues: vues } };
  }

  function plusRecent(a, b) {
    var da = a && a.derniere ? a.derniere : "", db = b && b.derniere ? b.derniere : "";
    if (da !== db) return da > db;
    return (a ? a.vues : 0) > (b ? b.vues : 0);
  }

  function fusionnerEtats(local, importe, cleTable) {
    var r = U.cloner(local[cleTable] || {});
    var imp = importe[cleTable] || {};
    Object.keys(imp).forEach(function (id) {
      if (!r[id] || plusRecent(imp[id], r[id])) r[id] = U.cloner(imp[id]);
    });
    return r;
  }

  var RANG = { validee: 3, en_cours: 2, abandonnee: 1 };

  function fusionner(local, importe, options) {
    var o = options || {};
    var res = U.cloner(local);
    var conflits = [];
    res.questions = fusionnerEtats(local, importe, "questions");
    res.familles = fusionnerEtats(local, importe, "familles");

    Object.keys(importe.seances || {}).forEach(function (id) {
      var si = importe.seances[id], sl = res.seances[id];
      if (!sl) { res.seances[id] = U.cloner(si); return; }
      if (JSON.stringify(sl) === JSON.stringify(si)) return;
      if (sl.statut === "en_cours" && !o.ecraserEnCours) { conflits.push(id); return; }
      if (sl.statut === "en_cours" || RANG[si.statut] > RANG[sl.statut]) res.seances[id] = U.cloner(si);
    });

    var cles = {};
    res.historique.forEach(function (e) { cles[e.k] = true; });
    (importe.historique || []).forEach(function (e) { if (!cles[e.k]) { res.historique.push(U.cloner(e)); cles[e.k] = true; } });
    res.historique.sort(function (a, b) { return a.j < b.j ? -1 : a.j > b.j ? 1 : 0; });

    var sig = {};
    res.signalements.forEach(function (s) { sig[s.id] = true; });
    (importe.signalements || []).forEach(function (s) { if (!sig[s.id]) res.signalements.push(U.cloner(s)); });

    var pl = res.profil.positionnementLe, pi = importe.profil && importe.profil.positionnementLe;
    if (pi && (!pl || pi < pl)) res.profil.positionnementLe = pi;
    if (importe.dernierExport && (!res.dernierExport || importe.dernierExport > res.dernierExport)) res.dernierExport = importe.dernierExport;
    if (importe.revisions && importe.revisions.jour && (!res.revisions.jour || importe.revisions.jour > res.revisions.jour)) {
      res.revisions = U.cloner(importe.revisions);
    }
    return { etat: res, conflits: conflits };
  }

  function remplacer(local, importe, options) {
    var o = options || {};
    var conflits = Object.keys(local.seances || {}).filter(function (id) {
      var sl = local.seances[id];
      if (sl.statut !== "en_cours") return false;
      var si = importe.seances && importe.seances[id];
      return !si || JSON.stringify(si) !== JSON.stringify(sl);
    });
    if (conflits.length && !o.ecraserEnCours) return { etat: null, conflits: conflits };
    return { etat: U.cloner(importe), conflits: [] };
  }

  CI.stockage = {
    CLE: CLE,
    SCHEMA: SCHEMA,
    etatVide: etatVide,
    migrate: migrate,
    serialiser: serialiser,
    deserialiser: deserialiser,
    charger: charger,
    sauvegarder: sauvegarder,
    planificateur: planificateur,
    exporter: exporter,
    analyserImport: analyserImport,
    fusionner: fusionner,
    remplacer: remplacer,
    taille: taille
  };
})(typeof window !== "undefined" ? window : globalThis);
