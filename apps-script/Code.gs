/**
 * Inscription Nettoyage — Rugby Club La Hulpe
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

// --- Email de confirmation envoyé à l'inscrit ---
var ENVOYER_EMAIL = true; // mettre à false pour désactiver
var EXPEDITEUR = "Rugby Club La Hulpe";
var REPONDRE_A = "communication@rclh.be"; // adresse de réponse (mets celle du club)

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

    envoyerConfirmation_(p); // email de confirmation (sans bloquer l'inscription)

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
    "Inscription Nettoyage : endpoint actif ✅"
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

/**
 * Envoie un email de confirmation à l'inscrit.
 * Une erreur d'envoi n'interrompt jamais l'inscription (try/catch).
 */
function envoyerConfirmation_(p) {
  if (!ENVOYER_EMAIL) return;
  var email = (p.email || "").trim();
  if (!email) return;

  try {
    var prenom = (p.prenom || "").trim();
    var bonjour = prenom ? "Bonjour " + prenom : "Bonjour";

    var html =
      '<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:auto;border:1px solid #eee;border-radius:14px;overflow:hidden">' +
        '<div style="background:#0c3327;color:#fff;padding:22px 24px;text-align:center">' +
          '<div style="letter-spacing:2px;font-size:12px;color:#ffd9e1">RUGBY CLUB LA HULPE · ONE TEAM</div>' +
          '<h1 style="margin:8px 0 0;font-size:22px;color:#f00050">Inscription confirmée !</h1>' +
        '</div>' +
        '<div style="padding:24px;color:#222;font-size:15px;line-height:1.55">' +
          '<p>' + bonjour + ',</p>' +
          '<p>Merci, ton inscription pour la journée <strong>« Notre club, notre fierté, nettoyons-le ! »</strong> est bien enregistrée. 💚</p>' +
          '<table style="width:100%;border-collapse:collapse;margin:18px 0">' +
            ligne_("📅", "Dimanche 5 juillet, dès 10h") +
            ligne_("📍", "Avenue Ernest Solvay 43, 1310 La Hulpe") +
            ligne_("🍖", "Barbecue en fin de journée") +
            ligne_("👥", "Participants : " + (p.participants || "1")) +
          '</table>' +
          '<p>On compte sur toi. Chaque geste compte !</p>' +
          '<p style="color:#701222;font-style:italic;margin-top:24px">Semper fidelis — Former des joueurs, construire des personnes.</p>' +
        '</div>' +
      '</div>';

    var texte =
      (bonjour) + ",\n\n" +
      "Merci, ton inscription pour la journée « Notre club, notre fierté, nettoyons-le ! » est bien enregistrée.\n\n" +
      "Dimanche 5 juillet, dès 10h\n" +
      "Avenue Ernest Solvay 43, 1310 La Hulpe\n" +
      "Barbecue en fin de journée\n" +
      "Participants : " + (p.participants || "1") + "\n\n" +
      "On compte sur toi. Chaque geste compte !\n\n" +
      "Semper fidelis — Rugby Club La Hulpe";

    MailApp.sendEmail({
      to: email,
      subject: "Inscription confirmée — Nettoyons notre club ! 🏉",
      body: texte, // version texte (améliore la délivrabilité)
      htmlBody: html,
      name: EXPEDITEUR,
      replyTo: REPONDRE_A,
    });
  } catch (err) {
    // Email non envoyé (quota, adresse invalide…) : l'inscription reste valide.
  }
}

function ligne_(ico, texte) {
  return (
    '<tr>' +
      '<td style="padding:6px 10px 6px 0;font-size:18px;width:28px">' + ico + '</td>' +
      '<td style="padding:6px 0;color:#0c3327;font-weight:600">' + texte + '</td>' +
    '</tr>'
  );
}
