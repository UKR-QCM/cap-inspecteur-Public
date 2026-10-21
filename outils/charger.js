/*
 * Charge les modules de l'application dans Node, tels quels (module vm, faux `window`).
 * Utilisé par tests.js, couverture.js, existant.js, simulation.js et preparer.js.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RACINE = path.join(__dirname, "..");

const MODULES = [
  "assets/js/utils.js",
  "assets/js/banque.js",
  "banque/referentiel.js",
  "assets/js/srs.js",
  "assets/js/bareme.js",
  "assets/js/seance.js",
  "assets/js/stats.js",
  "assets/js/stockage.js",
  "assets/js/generateurs/registre.js"
];

function fichiersGenerateurs() {
  const dossier = path.join(RACINE, "assets/js/generateurs");
  return fs.readdirSync(dossier).filter((f) => /^g\d+-.*\.js$/.test(f)).sort()
    .map((f) => "assets/js/generateurs/" + f);
}

function fichiersLots() {
  const dossier = path.join(RACINE, "banque/lots");
  if (!fs.existsSync(dossier)) return [];
  return fs.readdirSync(dossier).filter((f) => f.endsWith(".js")).sort().map((f) => "banque/lots/" + f);
}

function executer(contexte, relatif) {
  const fichier = path.join(RACINE, relatif);
  vm.runInContext(fs.readFileSync(fichier, "utf8"), contexte, { filename: relatif });
}

/* options.lots : charger aussi la banque (true par défaut). Renvoie le contexte vm (contexte.CI). */
function chargerContexte(options) {
  const o = Object.assign({ lots: true }, options || {});
  const contexte = { console: console };
  contexte.window = contexte;
  contexte.globalThis = contexte;
  vm.createContext(contexte);
  MODULES.concat(fichiersGenerateurs()).forEach((f) => executer(contexte, f));
  if (o.lots) fichiersLots().forEach((f) => executer(contexte, f));
  return contexte;
}

function charger(options) { return chargerContexte(options).CI; }

module.exports = { charger, chargerContexte, executer, RACINE, MODULES, fichiersGenerateurs, fichiersLots };
