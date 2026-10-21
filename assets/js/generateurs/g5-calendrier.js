/*
 * IV.G5 — Calendrier et calculs de jours. Dates réelles du calendrier grégorien.
 * Niveau 1 : jour de la semaine dans N jours ou il y a N jours.
 * Niveau 2 : jour de la semaine d'une date de la même année, ou date N jours plus tard.
 * Niveau 3 : mêmes calculs à travers un 29 février ou d'une année sur l'autre.
 * Les jours de la semaine sont proposés dans l'ordre lundi → dimanche, les dates dans l'ordre chronologique.
 */
(function (racine) {
  "use strict";
  var CI = racine.CI;
  var U = CI.utils, O = CI.generateurs.outils;
  var FAMILLE = "IV.G5";
  var GEN_VERSION = 1;

  function mod7(x) { return ((x % 7) + 7) % 7; }

  function choixJours(correct, cands) {
    var liste = [correct];
    cands.forEach(function (c) { var m = mod7(c); if (liste.length < 4 && liste.indexOf(m) < 0) liste.push(m); });
    for (var k = 1; liste.length < 4 && k < 7; k++) { var m2 = mod7(correct + k * 3); if (liste.indexOf(m2) < 0) liste.push(m2); }
    var tri = liste.slice().sort(function (a, b) { return a - b; });
    return { choix: tri.map(U.nomJour), bonne: tri.indexOf(correct) };
  }

  function choixDates(correct, cands) {
    var liste = [correct];
    cands.forEach(function (c) { if (liste.length < 4 && U.estJour(c) && liste.indexOf(c) < 0) liste.push(c); });
    if (liste.length < 4) return null;
    var tri = liste.slice().sort();
    return { choix: tri.map(U.formaterDate), bonne: tri.indexOf(correct) };
  }

  function dateAleatoire(rng, anneeMin, anneeMax) {
    var a = rng.entier(anneeMin, anneeMax), m = rng.entier(1, 12), j = rng.entier(1, U.joursDansMois(a, m));
    return a + "-" + (m < 10 ? "0" : "") + m + "-" + (j < 10 ? "0" : "") + j;
  }

  /* Vrai si un 29 février tombe dans l'intervalle ]a ; b]. */
  function bissextileEntre(a, b) {
    var na = U.numeroJour(a), nb = U.numeroJour(b);
    for (var y = Number(a.slice(0, 4)); y <= Number(b.slice(0, 4)); y++) {
      if (!U.estBissextile(y)) continue;
      var n = U.numeroJour(y + "-02-29");
      if (n > na && n <= nb) return true;
    }
    return false;
  }

  function construire(rng, niveau) {
    var v = rng.entier(0, 1);
    var enonce, explication, aRetenir, c, donnees;

    if (niveau === 1) {
      var depart = rng.entier(0, 6), n = rng.entier(9, 60), arriere = v === 1;
      var correct = mod7(depart + (arriere ? -n : n));
      enonce = "Aujourd'hui, nous sommes " + U.nomJour(depart) + ". Quel jour de la semaine " +
        (arriere ? "étions-nous il y a " + n + " jours ?" : "serons-nous dans " + n + " jours ?");
      explication = n + " = 7 × " + Math.floor(n / 7) + " + " + (n % 7) + " : les semaines entières ne changent pas le jour. Il reste " + (n % 7) +
        " jour" + (n % 7 > 1 ? "s" : "") + " à " + (arriere ? "retrancher" : "ajouter") + " à " + U.nomJour(depart) + ", ce qui donne " + U.nomJour(correct) + ".";
      aRetenir = "Divise le nombre de jours par 7 : seul le reste fait avancer le jour de la semaine.";
      c = choixJours(correct, [correct + 1, correct - 1, depart + (arriere ? n : -n), depart + (n % 7) + (arriere ? 0 : 1)]);
      donnees = { type: "decalage", depart: depart, jours: arriere ? -n : n };
    } else {
      var avecBissextile = niveau === 3;
      var ref = avecBissextile ? dateAleatoire(rng, 2027, 2031) : dateAleatoire(rng, 2026, 2030);
      var ecart = avecBissextile ? rng.entier(200, 500) : rng.entier(20, 150);
      var cible = U.ajouterJours(ref, ecart);
      if (!avecBissextile && ref.slice(0, 4) !== cible.slice(0, 4)) return null;
      if (!avecBissextile && bissextileEntre(ref, cible)) return null;
      if (avecBissextile && !bissextileEntre(ref, cible)) return null;
      if (v === 0) {
        var jr = U.jourSemaine(ref), jc = U.jourSemaine(cible);
        enonce = "Le " + U.formaterDate(ref) + " est un " + U.nomJour(jr) + ". Quel jour de la semaine sera le " + U.formaterDate(cible) + " ?";
        explication = "Du " + U.formaterDate(ref) + " au " + U.formaterDate(cible) + ", il y a " + ecart + " jours" +
          (avecBissextile ? " (en comptant le 29 février)" : "") + ". " + ecart + " = 7 × " + Math.floor(ecart / 7) + " + " + (ecart % 7) +
          ", donc on avance de " + (ecart % 7) + " jour" + (ecart % 7 > 1 ? "s" : "") + " : " + U.nomJour(jc) + ".";
        aRetenir = avecBissextile ? "Une année bissextile compte 366 jours : vérifie si un 29 février se trouve dans l'intervalle." :
          "Compte les jours mois par mois (30 ou 31, et 28 ou 29 en février), puis garde le reste de la division par 7.";
        c = choixJours(jc, [jc - 1, jc + 1, jr + ((ecart - 1) % 7), jc - 2]);
        donnees = { type: "jour_de_date", reference: ref, jourReference: jr, cible: cible };
      } else {
        enonce = "Quelle date sera-t-il " + ecart + " jours après le " + U.formaterDate(ref) + " ?";
        explication = "On avance mois par mois depuis le " + U.formaterDate(ref) + " en tenant compte de la longueur réelle de chaque mois" +
          (avecBissextile ? ", y compris le 29 février" : "") + " : " + ecart + " jours plus tard, on est le " + U.formaterDate(cible) + ".";
        aRetenir = "Ne compte pas tous les mois à 30 jours : 31 jours en janvier, mars, mai, juillet, août, octobre, décembre.";
        c = choixDates(cible, [U.ajouterJours(cible, 1), U.ajouterJours(cible, -1), avecBissextile ? U.ajouterJours(cible, 1) : U.ajouterJours(cible, 2),
          U.ajouterJours(cible, -2), U.ajouterJours(cible, 3)]);
        donnees = { type: "date_plus", depart: ref, jours: ecart };
      }
    }
    if (!c) return null;
    return {
      enonce: enonce, choix: c.choix, bonne: c.bonne, ordreFixe: true,
      explication: explication, aRetenir: aRetenir,
      piege: "Compter le jour de départ dans l'intervalle (erreur d'un jour).",
      donnees: donnees
    };
  }

  CI.generateurs.enregistrer({
    famille: FAMILLE,
    genVersion: GEN_VERSION,
    generer: function (graine, niveau) {
      return O.tenter(graine, FAMILLE + "|n" + niveau, function (rng) { return construire(rng, niveau); });
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
