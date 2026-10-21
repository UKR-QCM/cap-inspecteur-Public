#!/usr/bin/env node
/*
 * Cap Inspecteur — exécute dans Node les mêmes suites que tests.html.
 * Usage : node outils/tests.js [filtre]   (filtre : partie du nom d'une suite, ex. « 5. »)
 * Code de retour non nul en cas d'échec.
 */
"use strict";
process.env.TZ = process.env.TZ || "Europe/Paris"; // les tests de changement d'heure visent ce fuseau

const { chargerContexte, executer, fichiersLots } = require("./charger.js");

const contexte = chargerContexte({ lots: true });
executer(contexte, "outils/simulation.js");
executer(contexte, "outils/suites.js");
const CI = contexte.CI;

const filtre = process.argv[2];
if (filtre) CI.tests.suites.splice(0, CI.tests.suites.length, ...CI.tests.suites.filter((s) => s.nom.indexOf(filtre) >= 0));

const VERT = "\x1b[32m", ROUGE = "\x1b[31m", GRIS = "\x1b[90m", RAZ = "\x1b[0m";
const debut = Date.now();
const r = CI.tests.executer((e) => {
  if (e.type === "suite") console.log("\n" + e.nom);
  else if (e.type === "ok") console.log("  " + VERT + "✓" + RAZ + " " + e.nom + GRIS + (e.ms > 200 ? " (" + e.ms + " ms)" : "") + RAZ);
  else if (e.type === "echec") console.log("  " + ROUGE + "✗ " + e.nom + RAZ + "\n      " + e.message);
  else if (e.type === "note") console.log("    " + GRIS + e.message + RAZ);
});

const banque = CI.banque.controler(CI.referentiel);
console.log("\nBanque : " + banque.actives + " question(s) active(s) dans " + fichiersLots().length + " lot(s).");
console.log((r.echecs.length ? ROUGE : VERT) + r.total + " tests, " + r.echecs.length + " échec(s)" + RAZ + GRIS + " — " + ((Date.now() - debut) / 1000).toFixed(1) + " s" + RAZ);
process.exit(r.echecs.length ? 1 : 0);
