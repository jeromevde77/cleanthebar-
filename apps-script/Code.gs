/**
 * CleanTheClub — Rugby Club La Hulpe
 * Backend Google Apps Script : enregistre chaque inscription
 * dans une feuille Google Sheet.
 *
 * Installation : voir GUIDE.md (étape 2).
 * En résumé :
 *   1. Crée un Google Sheet.
 *   2. Extensions > Apps Script, colle ce code.
 *   3. Déployer > Nouveau déploiement > "Application Web"
 *      - Exécuter en tant que : Moi
 *      - Qui a accès : "Tout le monde"
 *   4. Copie l'URL /exec et colle-la dans assets/script.js
 */

var SHEET_NAME = "Inscriptions";
var ENTETES = [
  "Horodatage",
  "Prénom",
  "Nom",
  "Email",
  "Téléphone",
  "Nb participants",
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // évite les écritures simultanées

    var sheet = getSheet_();
    var p = (e && e.parameter) || {};

    sheet.appendRow([
      new Date(),
      p.prenom || "",
      p.nom || "",
      p.email || "",
      p.telephone || "",
      p.participants || "",
    ]);

    return jsonOut_({ result: "ok" });
  } catch (err) {
    return jsonOut_({ result: "error", message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Permet de tester l'URL dans le navigateur (doit afficher un petit message). */
function doGet() {
  return ContentService.createTextOutput(
    "CleanTheClub : endpoint actif ✅"
  ).setMimeType(ContentService.MimeType.TEXT);
}

/** Récupère (ou crée) la feuille avec ses en-têtes. */
function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(ENTETES);
    sheet.getRange(1, 1, 1, ENTETES.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(
    JSON.stringify(obj)
  ).setMimeType(ContentService.MimeType.JSON);
}
