#!/usr/bin/env node
/*
 * Cap Inspecteur — prépare la publication :
 *  - banque/manifest.js : liste des lots (ordre alphabétique) et version de la banque ;
 *  - sw-liste.js : liste de préchargement du service worker et version du cache.
 * Les versions sont des empreintes du contenu : rien ne change si aucun fichier ne change.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { RACINE, fichiersLots } = require("./charger.js");

function empreinte(fichiers) {
  const h = crypto.createHash("sha1");
  fichiers.forEach((f) => { h.update(f + "\n"); h.update(fs.readFileSync(path.join(RACINE, f))); });
  return h.digest("hex").slice(0, 12);
}

function lister(dossier, filtre) {
  const abs = path.join(RACINE, dossier);
  if (!fs.existsSync(abs)) return [];
  let r = [];
  fs.readdirSync(abs, { withFileTypes: true }).forEach((e) => {
    const rel = dossier + "/" + e.name;
    if (e.isDirectory()) r = r.concat(lister(rel, filtre));
    else if (!filtre || filtre(rel)) r.push(rel);
  });
  return r;
}

function ecrireSiDifferent(relatif, contenu) {
  const abs = path.join(RACINE, relatif);
  const avant = fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : null;
  if (avant !== contenu) fs.writeFileSync(abs, contenu);
  return avant !== contenu;
}

// 1. Manifeste des lots
const lots = fichiersLots();
const versionBanque = empreinte(lots.concat(["banque/referentiel.js"]));
const manifeste =
  "/* Fichier généré par outils/preparer.js — ne pas modifier à la main. */\n" +
  "(function (racine) {\n" +
  "  var CI = racine.CI = racine.CI || {};\n" +
  "  CI.manifeste = " + JSON.stringify({ version: versionBanque, lots: lots }, null, 2).replace(/\n/g, "\n  ") + ";\n" +
  "})(typeof window !== \"undefined\" ? window : globalThis);\n";
const m1 = ecrireSiDifferent("banque/manifest.js", manifeste);

// 2. Liste de préchargement du service worker
const racineFichiers = ["index.html", "manifest.webmanifest"].filter((f) => fs.existsSync(path.join(RACINE, f)));
const precache = racineFichiers
  .concat(lister("assets"))
  .concat(["banque/referentiel.js", "banque/manifest.js"])
  .concat(lots)
  .filter((f) => !/(^|\/)\./.test(f))
  .sort();
const versionCache = empreinte(precache);
const liste =
  "/* Fichier généré par outils/preparer.js — ne pas modifier à la main. Lu par sw.js. */\n" +
  "self.CI_VERSION = " + JSON.stringify(versionCache) + ";\n" +
  "self.CI_PRECACHE = " + JSON.stringify(["./"].concat(precache), null, 2) + ";\n";
const m2 = ecrireSiDifferent("sw-liste.js", liste);

console.log("Lots : " + lots.length + " ; version de la banque : " + versionBanque + (m1 ? " (manifeste mis à jour)" : " (inchangé)"));
console.log("Préchargement : " + precache.length + " fichiers ; version du cache : " + versionCache + (m2 ? " (sw-liste.js mis à jour)" : " (inchangé)"));
