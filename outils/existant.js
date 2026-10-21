#!/usr/bin/env node
/*
 * Cap Inspecteur — liste les questions déjà écrites pour un préfixe de notion ou de famille,
 * pour éviter les doublons et continuer la numérotation.
 * Usage : node outils/existant.js <préfixe>      ex. : I.C.1   II.B.b.03   V.2   IV.R
 */
"use strict";
const { charger } = require("./charger.js");

const prefixe = process.argv[2];
if (!prefixe) {
  console.error("Usage : node outils/existant.js <préfixe de notion ou de famille>");
  process.exit(2);
}

const CI = charger();
const R = CI.referentiel;
const correspond = (id) => id === prefixe || id.indexOf(prefixe) === 0;

const unites = R.notions.filter((n) => correspond(n.id)).map((n) => ({ id: n.id, libelle: n.libelle, centrale: n.centrale, v1: n.cibleVague1 }))
  .concat(R.familles.filter((f) => !f.generee && correspond(f.id)).map((f) => ({ id: f.id, libelle: f.libelle, centrale: false, v1: f.cibleVague1 })));

if (!unites.length) {
  console.error("Aucune notion ni famille rédigée ne commence par « " + prefixe + " ».");
  process.exit(1);
}

let total = 0;
unites.forEach((u) => {
  const qs = CI.banque.toutes().filter((q) => q.notion === u.id);
  const tous = qs.map((q) => q.id).concat(CI.banque.retraits().map((r) => r.id).filter((id) => id.indexOf("Q-" + u.id + "-") === 0));
  const max = tous.reduce((m, id) => Math.max(m, parseInt(id.slice(("Q-" + u.id + "-").length), 10) || 0), 0);
  const suivant = "Q-" + u.id + "-" + String(max + 1).padStart(2, "0");
  console.log("\n" + u.id + (u.centrale ? " ★" : "") + " — " + u.libelle);
  console.log("  " + qs.length + " question(s), cible de vague 1 : " + u.v1 + " ; prochain identifiant : " + suivant);
  qs.forEach((q) => {
    total += 1;
    console.log("  • " + q.id + "  [angle : " + (q.angle || "—") + ", niveau " + q.difficulte + ", " + q.statut + (q.nature === "actualite" ? ", actualité → " + q.perimeLe : "") + ", v" + q.version + "]");
    console.log("      " + q.enonce.replace(/\s+/g, " "));
    console.log("      → " + q.choix[q.bonne]);
  });
});
console.log("\n" + total + " question(s) au total pour « " + prefixe + " ».");
