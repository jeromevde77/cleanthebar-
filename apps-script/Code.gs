/**
 * Inscription Nettoyage — Rugby Club La Hulpe
 * Enregistre chaque inscription dans une feuille Google Sheet
 * et envoie un email de confirmation à l'inscrit.
 * Le statut de l'email est écrit dans la colonne "Statut email".
 */

var VERSION = "v7";
var SHEET_NAME = "Inscriptions";
var ENTETES = ["Horodatage", "Prénom", "Nom", "Email", "Téléphone", "Nb participants", "Statut email"];

var ENVOYER_EMAIL = true;
var EXPEDITEUR = "Rugby Club La Hulpe";
var REPONDRE_A = "contact@rugbylahulpe.be";

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var sheet = getSheet_();
    var p = (e && e.parameter) || {};
    sheet.appendRow([new Date(), p.prenom||"", p.nom||"", p.email||"", p.telephone||"", p.participants||"", ""]);
    var row = sheet.getLastRow();
    var statut = envoyerConfirmation_(p);     // renvoie le statut de l'email
    sheet.getRange(row, 7).setValue(statut);  // écrit le statut dans la colonne G
    return jsonOut_({ result: "ok" });
  } catch (err) {
    return jsonOut_({ result: "error", message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput("Inscription Nettoyage " + VERSION + " : endpoint actif ✅")
    .setMimeType(ContentService.MimeType.TEXT);
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(ENTETES);
    sheet.getRange(1, 1, 1, ENTETES.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  // garantit l'en-tête de la colonne statut même sur une feuille déjà existante
  if (sheet.getRange(1, 7).getValue() !== "Statut email") {
    sheet.getRange(1, 7).setValue("Statut email").setFontWeight("bold");
  }
  return sheet;
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Envoie l'email et RENVOIE un texte de statut (écrit dans la feuille). */
function envoyerConfirmation_(p) {
  if (!ENVOYER_EMAIL) return "désactivé";
  var email = (p.email || "").trim();
  if (!email) return "pas d'email fourni";
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
    var texte = bonjour + ",\n\nMerci, ton inscription est bien enregistrée.\n\nDimanche 5 juillet dès 10h\nAvenue Ernest Solvay 43, 1310 La Hulpe\nBarbecue en fin de journée\nParticipants : " + (p.participants || "1") + "\n\nSemper fidelis — Rugby Club La Hulpe";
    MailApp.sendEmail({ to: email, subject: "Inscription confirmée — Nettoyons notre club ! 🏉", body: texte, htmlBody: html, name: EXPEDITEUR, replyTo: REPONDRE_A });
    return "ENVOYÉ ✅";
  } catch (err) {
    return "ERREUR: " + err;
  }
}

function ligne_(ico, texte) {
  return '<tr><td style="padding:6px 10px 6px 0;font-size:18px;width:28px">' + ico +
    '</td><td style="padding:6px 0;color:#0c3327;font-weight:600">' + texte + '</td></tr>';
}
