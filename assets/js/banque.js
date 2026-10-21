/*
 * Cap Inspecteur — banque de questions : chargement, index, versions, retraits,
 * contrôle d'intégrité. Sans DOM.
 */
(function (racine) {
  "use strict";
  var CI = racine.CI = racine.CI || {};

  function creerBanque() {
    var registre = {};      // id → question (dernière version)
    var lots = {};          // id → identifiant du lot qui a fourni la version courante
    var retraits = {};      // id → { id, raison }
    var ordre = [];         // ordre d'arrivée des identifiants
    var doublons = [];      // { id, lot } : même identifiant et même version avec un contenu différent
    var cacheActives = null;
    var cacheParNotion = null;

    function invalider() { cacheActives = null; cacheParNotion = null; }

    function ajouter(questions, meta) {
      var lot = meta && meta.lot ? meta.lot : null;
      (questions || []).forEach(function (q) {
        if (!q || typeof q.id !== "string") return;
        var existante = registre[q.id];
        var v = typeof q.version === "number" ? q.version : 1;
        if (existante) {
          var ve = typeof existante.version === "number" ? existante.version : 1;
          if (v === ve && JSON.stringify(existante) !== JSON.stringify(q)) doublons.push({ id: q.id, lot: lot });
          if (v <= ve) return; // une version inférieure ou égale ne remplace pas
        } else {
          ordre.push(q.id);
        }
        registre[q.id] = q;
        if (lot) lots[q.id] = lot;
        else if (!existante) lots[q.id] = null;
      });
      invalider();
    }

    function retirer(liste) {
      (liste || []).forEach(function (r) {
        if (r && typeof r.id === "string") retraits[r.id] = { id: r.id, raison: r.raison || "" };
      });
      invalider();
    }

    function toutes() {
      if (!cacheActives) {
        cacheActives = ordre.filter(function (id) { return !retraits[id]; })
          .map(function (id) { return registre[id]; });
      }
      return cacheActives;
    }

    function parNotion(id) {
      if (!cacheParNotion) {
        cacheParNotion = {};
        toutes().forEach(function (q) {
          (cacheParNotion[q.notion] = cacheParNotion[q.notion] || []).push(q);
        });
      }
      return cacheParNotion[id] || [];
    }

    function question(id) { return registre[id] || null; }
    function estRetiree(id) { return !!retraits[id]; }
    function listeRetraits() { return Object.keys(retraits).map(function (k) { return retraits[k]; }); }
    function lotDe(id) { return lots[id] || null; }

    function reinitialiser() {
      registre = {}; lots = {}; retraits = {}; ordre = []; doublons = [];
      invalider();
    }

    /* ---------- Actualité ---------- */

    function etatActualite(q, jour, dateConcours) {
      if (!q || !q.perimeLe) return "ok";
      if (q.perimeLe < jour) return "perimee";
      if (dateConcours && q.perimeLe < dateConcours) return "a_renouveler";
      return "ok";
    }

    function actualiteAMettreAJour(jour, dateConcours) {
      var r = { perimees: [], aRenouveler: [] };
      toutes().forEach(function (q) {
        var e = etatActualite(q, jour, dateConcours);
        if (e === "perimee") r.perimees.push(q);
        else if (e === "a_renouveler") r.aRenouveler.push(q);
      });
      return r;
    }

    /* ---------- Contrôle d'intégrité ---------- */

    var OBLIGATOIRES = ["id", "bloc", "notion", "difficulte", "enonce", "choix", "bonne", "explication",
      "aRetenir", "references", "piege", "nature", "statut", "version"];

    function estNombre(s) {
      return /^[−-]?\d[\d\s ]*(,\d+)?\s*(%|€|km|h|min|ans?)?$/.test(String(s).trim());
    }
    function valeurNombre(s) {
      return parseFloat(String(s).replace(/[\s €%a-z]/gi, "").replace("−", "-").replace(",", "."));
    }

    function controlerQuestion(q, referentiel, utils, vus) {
      var e = [];
      function err(m) { e.push({ id: q && q.id ? q.id : "(sans id)", message: m }); }
      if (!q || typeof q !== "object") { err("question absente ou invalide"); return e; }
      OBLIGATOIRES.forEach(function (c) { if (q[c] === undefined || q[c] === null || q[c] === "") err("champ obligatoire manquant : " + c); });
      if (vus[q.id]) err("identifiant en double");
      vus[q.id] = true;

      var rat = referentiel ? referentiel.rattachement(q.notion) : null;
      if (!rat) err("notion ou famille inconnue : " + q.notion);
      else {
        if (rat.bloc !== q.bloc) err("bloc " + q.bloc + " incohérent avec " + q.notion + " (bloc " + rat.bloc + ")");
        if (rat.generee) err("famille générée par le code : aucune question rédigée attendue");
        if (rat.crcn && referentiel.crcnExclues.some(function (x) { return x.id === rat.crcn; })) err("compétence CRCN exclue");
      }
      var attendu = "Q-" + q.notion + "-";
      if (typeof q.id !== "string" || q.id.indexOf(attendu) !== 0 || !/^\d{2,}$/.test(q.id.slice(attendu.length))) {
        err("identifiant mal formé (attendu " + attendu + "nn)");
      }
      if (!Array.isArray(q.choix) || q.choix.length !== 4) err("il faut exactement 4 choix");
      else {
        var norm = q.choix.map(function (c) { return String(c).trim().toLowerCase(); });
        if (norm.some(function (c) { return !c; })) err("choix vide");
        if (norm.filter(function (c, i) { return norm.indexOf(c) !== i; }).length) err("choix en double");
        if (q.ordreFixe) {
          var dates = q.choix.every(function (c) { return /^\d{4}(-\d{2}-\d{2})?$/.test(String(c).trim()); });
          var nombres = q.choix.every(estNombre);
          if (!dates && !nombres) err("ordreFixe exige des nombres ou des dates");
          else {
            var vals = q.choix.map(function (c) { return dates ? String(c).trim() : valeurNombre(c); });
            for (var i = 1; i < vals.length; i++) if (!(vals[i - 1] < vals[i])) { err("ordreFixe : choix non rangés par ordre croissant"); break; }
          }
        }
      }
      if (!(q.bonne === 0 || q.bonne === 1 || q.bonne === 2 || q.bonne === 3)) err("bonne doit valoir 0, 1, 2 ou 3");
      if ([1, 2, 3].indexOf(q.difficulte) < 0) err("difficulte doit valoir 1, 2 ou 3");
      if (["I", "II", "III", "IV", "V"].indexOf(q.bloc) < 0) err("bloc inconnu");
      if (["stable", "actualite"].indexOf(q.nature) < 0) err("nature inconnue");
      if (["valide", "a_verifier"].indexOf(q.statut) < 0) err("statut inconnu");
      if (typeof q.version !== "number" || q.version < 1) err("version doit être un entier ≥ 1");
      if (!Array.isArray(q.references)) err("references doit être une liste");
      if (q.statut === "valide") {
        if (!q.source || !/^https?:\/\/\S+$/.test(q.source)) err("statut valide sans source (URL)");
        if (!utils.estJour(q.verifieLe)) err("statut valide sans verifieLe");
      }
      if (q.statut === "a_verifier" && !q.raisonAVerifier) err("a_verifier sans raisonAVerifier");
      if (q.nature === "actualite" && !utils.estJour(q.perimeLe)) err("actualite sans perimeLe");
      if (q.verifieLe && !utils.estJour(q.verifieLe)) err("verifieLe invalide");
      if (q.perimeLe && !utils.estJour(q.perimeLe)) err("perimeLe invalide");
      return e;
    }

    function controler(referentiel) {
      var utils = CI.utils;
      var vus = {};
      var erreurs = [];
      var avertissements = [];
      ordre.forEach(function (id) {
        erreurs = erreurs.concat(controlerQuestion(registre[id], referentiel, utils, vus));
      });
      doublons.forEach(function (d) {
        erreurs.push({ id: d.id, message: "identifiant en double (même version, contenu différent" + (d.lot ? ", lot " + d.lot : "") + ")" });
      });
      Object.keys(retraits).forEach(function (id) {
        if (!registre[id]) avertissements.push({ id: id, message: "retrait d'une question inconnue" });
      });
      return { erreurs: erreurs, avertissements: avertissements, total: ordre.length, actives: toutes().length };
    }

    return {
      ajouter: ajouter,
      retirer: retirer,
      toutes: toutes,
      question: question,
      estRetiree: estRetiree,
      retraits: listeRetraits,
      lot: lotDe,
      parNotion: parNotion,
      controler: controler,
      controlerQuestion: function (q, referentiel) { return controlerQuestion(q, referentiel, CI.utils, {}); },
      etatActualite: etatActualite,
      actualiteAMettreAJour: actualiteAMettreAJour,
      reinitialiser: reinitialiser
    };
  }

  CI.banque = creerBanque();
  CI.banque.creer = creerBanque;
})(typeof window !== "undefined" ? window : globalThis);
