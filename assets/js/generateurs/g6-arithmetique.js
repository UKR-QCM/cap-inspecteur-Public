/*
 * IV.G6 — Problèmes arithmétiques : prix, pourcentages, proportions, vitesses.
 * Niveau 1 : remise en pourcentage, proportionnalité simple.
 * Niveau 2 : hausse puis baisse successives, durée d'un trajet.
 * Niveau 3 : prix initial avant une hausse, vitesse moyenne d'un aller-retour, remises successives.
 * Les résultats sont exacts au centime ou à l'unité ; les choix sont rangés par ordre croissant.
 */
(function (racine) {
  "use strict";
  var CI = racine.CI;
  var U = CI.utils, O = CI.generateurs.outils;
  var FAMILLE = "IV.G6";
  var GEN_VERSION = 1;

  function euros(x) {
    var c = Math.round(x * 100);
    if (c % 100 === 0) return U.nombreFr(c / 100, 0) + " €";
    var t = U.nombreFr(c / 100, 2);
    if (/,\d$/.test(t)) t += "0";
    return t + " €";
  }
  function unite(u) { return function (x) { return U.nombreFr(x, 2) + " " + u; }; }
  function centimes(x) { return Math.abs(Math.round(x * 100) - x * 100) < 1e-6; }
  function arr(x) { return Math.round(x * 100) / 100; }

  var ALLER_RETOUR = [[60, 40], [90, 60], [30, 60], [120, 80], [50, 75], [40, 60], [20, 30], [60, 90], [80, 120], [45, 90], [30, 70], [70, 105]];

  function construire(rng, niveau) {
    var v = rng.entier(0, niveau === 3 ? 2 : 1);
    var correct, cands, fmt, enonce, explication, aRetenir, donnees;

    if (niveau === 1 && v === 0) {
      var P = rng.entier(2, 30) * 10, r = rng.choisir([10, 15, 20, 25, 30, 40]);
      correct = arr(P * (1 - r / 100));
      enonce = "Un article coûte " + euros(P) + ". Il bénéficie d'une remise de " + r + " %. Quel est son nouveau prix ?";
      explication = "La remise vaut " + r + " % de " + euros(P) + ", soit " + euros(P * r / 100) + ". Nouveau prix : " + euros(P) + " − " +
        euros(P * r / 100) + " = " + euros(correct) + ". Plus rapide : " + euros(P) + " × " + U.nombreFr(1 - r / 100, 2) + ".";
      aRetenir = "Baisser de r %, c'est multiplier par (1 − r/100).";
      cands = [P - r, arr(P * r / 100), arr(P * (1 + r / 100)), arr(P * (1 - r / 1000)), correct + 10];
      fmt = euros;
      donnees = { type: "remise", prix: P, taux: r };
    } else if (niveau === 1) {
      var u = rng.entier(2, 16) * 0.25, q1 = rng.entier(2, 6), q2 = rng.entier(3, 12);
      if (q1 === q2) return null;
      var t1 = arr(u * q1);
      correct = arr(u * q2);
      enonce = q1 + " cahiers identiques coûtent " + euros(t1) + ". Combien coûtent " + q2 + " de ces cahiers ?";
      explication = "Prix d'un cahier : " + euros(t1) + " ÷ " + q1 + " = " + euros(u) + ". Pour " + q2 + " cahiers : " + q2 + " × " + euros(u) + " = " + euros(correct) + ".";
      aRetenir = "Proportionnalité : passe par le prix unitaire, puis multiplie.";
      cands = [arr(t1 + (q2 - q1)), arr(u * (q2 + 1)), arr(u * (q2 - 1)), arr(t1 * q2), arr(correct + 1)];
      fmt = euros;
      donnees = { type: "proportion", quantite1: q1, prix1: t1, quantite2: q2 };
    } else if (niveau === 2 && v === 0) {
      var P2 = rng.entier(4, 40) * 25, a = rng.choisir([10, 20, 25, 40, 50]), b = rng.choisir([10, 20, 25, 40, 50]);
      correct = arr(P2 * (1 + a / 100) * (1 - b / 100));
      if (!centimes(P2 * (1 + a / 100) * (1 - b / 100))) return null;
      enonce = "Le prix d'un appareil, d'abord de " + euros(P2) + ", augmente de " + a + " %, puis baisse de " + b + " %. Quel est son prix final ?";
      explication = "Après la hausse : " + euros(P2) + " × " + U.nombreFr(1 + a / 100, 2) + " = " + euros(arr(P2 * (1 + a / 100))) +
        ". Après la baisse : " + euros(arr(P2 * (1 + a / 100))) + " × " + U.nombreFr(1 - b / 100, 2) + " = " + euros(correct) + ".";
      aRetenir = "Des pourcentages successifs se multiplient ; ils ne s'additionnent pas.";
      cands = [arr(P2 * (1 + (a - b) / 100)), P2, arr(P2 * (1 - a / 100) * (1 + b / 100)), arr(correct + 5), arr(correct - 5)];
      fmt = euros;
      donnees = { type: "hausse_baisse", prix: P2, hausse: a, baisse: b };
    } else if (niveau === 2) {
      var vit = rng.choisir([30, 40, 45, 50, 60, 75, 80, 90, 120]), minutes = rng.choisir([20, 30, 40, 45, 50, 80, 90, 100]);
      var d = vit * minutes / 60;
      if (!O.entierExact(d)) return null;
      correct = minutes;
      enonce = "Un véhicule roule à la vitesse constante de " + vit + " km/h. Combien de minutes lui faut-il pour parcourir " + U.nombreFr(d, 0) + " km ?";
      explication = "Durée = distance ÷ vitesse = " + U.nombreFr(d, 0) + " ÷ " + vit + " = " + U.nombreFr(d / vit, 4) + " h, soit " +
        U.nombreFr(d / vit, 4) + " × 60 = " + minutes + " minutes.";
      aRetenir = "Durée en heures = distance ÷ vitesse ; multiplie par 60 pour obtenir des minutes (et non par 100).";
      cands = [arr(d / vit * 100), arr(vit / d * 60), minutes + 10, minutes - 5, minutes + 15];
      fmt = unite("min");
      donnees = { type: "duree", vitesse: vit, distance: d };
    } else if (v === 0) {
      var orig = rng.entier(4, 60) * 10, h = rng.choisir([10, 20, 25, 50]);
      var apres = arr(orig * (1 + h / 100));
      correct = orig;
      enonce = "Après une hausse de " + h + " %, un abonnement coûte " + euros(apres) + ". Quel était son prix avant la hausse ?";
      explication = "Prix après hausse = prix initial × " + U.nombreFr(1 + h / 100, 2) + ". Donc prix initial = " + euros(apres) + " ÷ " +
        U.nombreFr(1 + h / 100, 2) + " = " + euros(orig) + ".";
      aRetenir = "Pour retrouver un prix avant une hausse de r %, divise par (1 + r/100) : ne retranche pas r %.";
      cands = [arr(apres * (1 - h / 100)), arr(apres - h), arr(apres / (1 + h / 1000)), arr(orig + 10), arr(orig - 10)];
      fmt = euros;
      donnees = { type: "prix_initial", prixFinal: apres, hausse: h };
    } else if (v === 1) {
      var pr = rng.choisir(ALLER_RETOUR);
      var dist = rng.choisir([30, 60, 90, 120, 180]);
      correct = 2 * pr[0] * pr[1] / (pr[0] + pr[1]);
      if (!O.entierExact(correct)) return null;
      enonce = "Un automobiliste parcourt " + dist + " km à l'aller à " + pr[0] + " km/h, puis revient par la même route à " + pr[1] +
        " km/h. Quelle est sa vitesse moyenne sur l'ensemble du trajet ?";
      explication = "Durée aller : " + dist + " ÷ " + pr[0] + " = " + U.nombreFr(dist / pr[0], 3) + " h ; durée retour : " + dist + " ÷ " + pr[1] + " = " +
        U.nombreFr(dist / pr[1], 3) + " h. Vitesse moyenne = distance totale ÷ durée totale = " + (2 * dist) + " ÷ " +
        U.nombreFr(dist / pr[0] + dist / pr[1], 3) + " = " + U.nombreFr(correct, 0) + " km/h.";
      aRetenir = "La vitesse moyenne d'un aller-retour n'est pas la moyenne des deux vitesses : elle est plus proche de la plus lente.";
      cands = [(pr[0] + pr[1]) / 2, Math.max(pr[0], pr[1]) - 5, correct + 2, correct - 2, Math.min(pr[0], pr[1])];
      fmt = unite("km/h");
      donnees = { type: "vitesse_moyenne", distance: dist, aller: pr[0], retour: pr[1] };
    } else {
      var r1 = rng.choisir([10, 20, 25, 30, 40, 50]), r2 = rng.choisir([10, 20, 25, 30, 40, 50]);
      correct = arr(100 - (100 - r1) * (100 - r2) / 100);
      enonce = "Un magasin applique une remise de " + r1 + " %, puis une seconde remise de " + r2 + " % sur le prix déjà réduit. Quelle est la remise totale en pourcentage du prix initial ?";
      explication = "Le prix est multiplié par " + U.nombreFr(1 - r1 / 100, 2) + " puis par " + U.nombreFr(1 - r2 / 100, 2) + ", soit par " +
        U.nombreFr((1 - r1 / 100) * (1 - r2 / 100), 4) + ". Il reste " + U.nombreFr(100 - correct, 2) + " % du prix : la remise totale est de " +
        U.nombreFr(correct, 2) + " %.";
      aRetenir = "Deux remises successives de a % et b % font moins que a + b %.";
      cands = [r1 + r2, arr((r1 + r2) / 2), arr(r1 * r2 / 100), correct + 1, correct - 2];
      fmt = unite("%");
      donnees = { type: "remises_successives", remise1: r1, remise2: r2 };
    }
    var c = O.choixNumeriques(correct, cands, fmt, function (x) { return x > 0; });
    if (!c) return null;
    return {
      enonce: enonce, choix: c.choix, bonne: c.bonne, ordreFixe: true,
      explication: explication, aRetenir: aRetenir,
      piege: "Additionner des pourcentages successifs ou faire la moyenne de deux vitesses.",
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
