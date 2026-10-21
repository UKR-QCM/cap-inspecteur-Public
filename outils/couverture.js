#!/usr/bin/env node
/*
 * Cap Inspecteur — couverture de la banque face aux cibles.
 * Usage : node outils/couverture.js [--prefixe I.C] [--detail] [--json]
 *  - par ligne (et par notion avec --detail ou --prefixe) : questions existantes / cibles des vagues 1 et 2 ;
 *  - questions « a_verifier » ; questions d'actualité qui périment avant le concours ;
 *  - répartition des difficultés ; totaux par bloc et global.
 */
"use strict";
const { charger } = require("./charger.js");

const args = process.argv.slice(2);
const prefixe = args.includes("--prefixe") ? args[args.indexOf("--prefixe") + 1] : null;
const detail = args.includes("--detail") || !!prefixe;
const enJson = args.includes("--json");

const CI = charger();
const R = CI.referentiel;
const CONCOURS = R.dateConcours;
const questions = CI.banque.toutes();

function vide() { return { questions: 0, v1: 0, v2: 0, aVerifier: 0, perimeAvant: 0, d: { 1: 0, 2: 0, 3: 0 }, unites: 0, unitesAtteintes: 0 }; }
function cumuler(a, b) {
  ["questions", "v1", "v2", "aVerifier", "perimeAvant", "unites", "unitesAtteintes"].forEach((k) => { a[k] += b[k]; });
  [1, 2, 3].forEach((n) => { a.d[n] += b.d[n]; });
}

function statsUnite(id, v1, v2) {
  const qs = questions.filter((q) => q.notion === id);
  const s = vide();
  s.questions = qs.length; s.v1 = v1; s.v2 = v2; s.unites = 1;
  s.unitesAtteintes = qs.length >= v1 && v1 > 0 ? 1 : 0;
  qs.forEach((q) => {
    if (q.statut === "a_verifier") s.aVerifier += 1;
    if (q.nature === "actualite" && q.perimeLe && q.perimeLe < CONCOURS) s.perimeAvant += 1;
    if (s.d[q.difficulte] !== undefined) s.d[q.difficulte] += 1;
  });
  return s;
}

function visible(id) { return !prefixe || id === prefixe || id.indexOf(prefixe + ".") === 0 || id.indexOf(prefixe) === 0; }

const resultat = { lignes: [], familles: [], blocs: {}, global: vide() };
R.blocs.forEach((b) => { resultat.blocs[b.id] = vide(); });

R.lignes.forEach((l) => {
  const notions = R.notionsDeLigne(l.id).filter((n) => visible(n.id));
  if (!notions.length) return;
  const sl = vide();
  const detailNotions = notions.map((n) => {
    const s = statsUnite(n.id, n.cibleVague1, n.cibleVague2);
    cumuler(sl, s);
    return Object.assign({ id: n.id, libelle: n.libelle, centrale: n.centrale }, s);
  });
  resultat.lignes.push(Object.assign({ id: l.id, libelle: l.libelle, bloc: l.bloc, notions: detailNotions }, sl));
  cumuler(resultat.blocs[l.bloc], sl);
  cumuler(resultat.global, sl);
});

R.familles.filter((f) => !f.generee && visible(f.id)).forEach((f) => {
  const s = statsUnite(f.id, f.cibleVague1, f.cibleVague2);
  resultat.familles.push(Object.assign({ id: f.id, libelle: f.libelle, bloc: f.bloc }, s));
  cumuler(resultat.blocs[f.bloc], s);
  cumuler(resultat.global, s);
});

if (enJson) { console.log(JSON.stringify(resultat, null, 2)); process.exit(0); }

function pct(a, b) { return b ? Math.round(a / b * 100) + " %" : "—"; }
function ligneTexte(id, s, libelle) {
  return [id.padEnd(13), String(s.questions).padStart(4), (s.v1 + "").padStart(5), pct(s.questions, s.v1).padStart(6), (s.v2 + "").padStart(5),
    String(s.aVerifier).padStart(5), String(s.perimeAvant).padStart(5), (s.d[1] + "/" + s.d[2] + "/" + s.d[3]).padStart(9), " " + (libelle || "")].join(" ");
}
console.log("Couverture de la banque" + (prefixe ? " (préfixe " + prefixe + ")" : "") + " — concours le " + CONCOURS);
console.log(["Unité".padEnd(13), "Qst".padStart(4), "Cib.1".padStart(5), "% V1".padStart(6), "Cib.2".padStart(5), "à vér".padStart(5), "périm".padStart(5), "N1/N2/N3".padStart(9), " Libellé"].join(" "));
resultat.lignes.forEach((l) => {
  console.log(ligneTexte(l.id, l, l.libelle.slice(0, 60)));
  if (detail) l.notions.forEach((n) => console.log(ligneTexte("  " + n.id.slice(l.id.length + 1) + (n.centrale ? "★" : ""), n, (n.questions >= n.v1 ? "✓ " : "· ") + n.libelle.slice(0, 55))));
});
resultat.familles.forEach((f) => console.log(ligneTexte(f.id, f, (f.questions >= f.v1 ? "✓ " : "· ") + f.libelle.slice(0, 58))));
console.log("\nTotaux (unités = notions ou familles rédigées ; « atteintes » = cible de vague 1 atteinte)");
Object.keys(resultat.blocs).forEach((b) => {
  const s = resultat.blocs[b];
  if (!s.unites) return;
  console.log(ligneTexte("Bloc " + b, s, s.unitesAtteintes + "/" + s.unites + " unités atteintes ; notions couvertes : " +
    (b === "IV" || b === "V" ? "—" : resultat.lignes.filter((l) => l.bloc === b).reduce((t, l) => t + l.notions.filter((n) => n.questions > 0).length, 0) + "/" + s.unites)));
});
console.log(ligneTexte("TOTAL", resultat.global, resultat.global.unitesAtteintes + "/" + resultat.global.unites + " unités atteintes"));
