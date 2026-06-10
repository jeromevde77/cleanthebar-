/* ===========================================================
   CleanTheClub — envoi des inscriptions vers Google Sheet
   -----------------------------------------------------------
   ⚠️  À FAIRE UNE SEULE FOIS :
   Remplace la valeur ci-dessous par l'URL de TON application
   Google Apps Script (voir GUIDE.md, étape 2).
   Elle ressemble à :
   https://script.google.com/macros/s/AKfyc.../exec
   =========================================================== */
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxu_LXdq9lgA_amKJCk62bBqnUcCLaOv1EV3XYWr7bp1KiqcEXBU2kxpBaGZ7EiotU9/exec";

const form = document.getElementById("inscription-form");
const submitBtn = document.getElementById("submit-btn");
const errorMsg = document.getElementById("error-msg");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMsg.hidden = true;

  // Validation native du navigateur (champs requis, email, etc.)
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (APPS_SCRIPT_URL.startsWith("COLLE_ICI")) {
    showError(
      "Le formulaire n'est pas encore connecté. (Astuce admin : renseigne APPS_SCRIPT_URL dans assets/script.js — voir GUIDE.md.)"
    );
    return;
  }

  setLoading(true);

  const data = new URLSearchParams(new FormData(form));

  try {
    // Apps Script ne renvoie pas d'en-têtes CORS : on poste en "no-cors".
    // La ligne est bien enregistrée côté Google ; on ne lit pas la réponse.
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data,
    });

    // Succès : on redirige vers la page de remerciement.
    const prenom = encodeURIComponent(form.prenom.value.trim());
    window.location.href = "merci.html?p=" + prenom;
  } catch (err) {
    setLoading(false);
    showError(
      "Oups, l'envoi a échoué. Vérifie ta connexion et réessaie. Si ça persiste, contacte le club."
    );
  }
});

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.classList.toggle("loading", isLoading);
  submitBtn.querySelector(".btn-label").textContent = isLoading
    ? "Envoi…"
    : "Je m'inscris";
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.hidden = false;
}
