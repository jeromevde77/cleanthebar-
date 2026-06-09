# 🏉 CleanTheClub — Guide de mise en route

Page d'inscription pour l'événement **CleanTheClub du 5 juillet** du Rugby Club La Hulpe.
Ce guide est prévu pour être suivi **sans connaissance technique**. Compte ~20 minutes.

Tu vas obtenir :
- une **page d'inscription** aux couleurs du club,
- les inscriptions qui arrivent toutes seules dans un **Google Sheet** que tu possèdes,
- un **lien court** + un **QR code** à coller sur les affiches et les réseaux.

---

## 🅰️ Partie A — Mettre le site en ligne (GitHub Pages)

1. Sur GitHub, ouvre le dépôt **`cleanthebar-`**.
2. Clique sur **Settings** (Paramètres) en haut.
3. Dans le menu de gauche, clique sur **Pages**.
4. Sous **Build and deployment > Source**, choisis **Deploy from a branch**.
5. Sélectionne la branche qui contient ces fichiers (par ex. `main`), dossier **`/ (root)`**, puis **Save**.
6. Attends ~1 minute, recharge la page : GitHub affiche l'adresse de ton site, du type :

   ```
   https://jeromevde77.github.io/cleanthebar-/
   ```

   👉 C'est **l'adresse publique de ta page d'inscription**. Garde-la sous la main.

> 💡 Le QR code fourni pointe déjà vers cette adresse. Si ton adresse est différente,
> regénère le QR (voir Partie D).

---

## 🅱️ Partie B — Connecter les inscriptions à un Google Sheet

Le formulaire doit envoyer les inscriptions quelque part. On utilise un **Google Sheet**
(gratuit, illimité, c'est toi qui le possèdes).

1. Va sur [sheets.google.com](https://sheets.google.com) et crée un **nouveau Google Sheet**.
   Nomme-le par ex. *« CleanTheClub — Inscriptions »*.
2. Dans le menu, clique sur **Extensions > Apps Script**.
3. Efface le code affiché, puis **copie-colle tout le contenu du fichier
   [`apps-script/Code.gs`](apps-script/Code.gs)** de ce projet.
4. Clique sur 💾 **Enregistrer**.
5. En haut à droite, clique sur **Déployer > Nouveau déploiement**.
6. Clique sur l'engrenage ⚙️ à côté de « Sélectionner le type » et choisis **Application Web**.
7. Règle :
   - **Description** : `CleanTheClub`
   - **Exécuter en tant que** : **Moi** (ton compte)
   - **Qui a accès** : **Tout le monde**
8. Clique sur **Déployer**. Google va te demander d'**autoriser** l'accès :
   accepte (clique sur « Autoriser », choisis ton compte, puis « Avancé » >
   « Accéder à … » si un avertissement apparaît — c'est normal, c'est ton propre script).
9. Copie l'**URL de l'application Web** qui s'affiche. Elle se termine par `/exec` :

   ```
   https://script.google.com/macros/s/AKfyc............/exec
   ```

> ✅ Test rapide : colle cette URL dans ton navigateur. Tu dois voir le message
> *« CleanTheClub : endpoint actif ✅ »*. Si oui, c'est bon !

---

## 🅲️ Partie C — Brancher la page sur ton Google Sheet

1. Dans le dépôt GitHub, ouvre le fichier **`assets/script.js`**.
2. Clique sur le crayon ✏️ (Edit) en haut à droite.
3. Tout en haut, remplace cette ligne :

   ```js
   const APPS_SCRIPT_URL = "COLLE_ICI_TON_URL_APPS_SCRIPT";
   ```

   par ton URL `/exec` copiée à l'étape B9 :

   ```js
   const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfyc......./exec";
   ```

4. Clique sur **Commit changes** (Valider).
5. Attends ~1 minute, puis ouvre ta page (`https://jeromevde77.github.io/cleanthebar-/`)
   et fais un **test d'inscription**. La ligne doit apparaître dans ton Google Sheet 🎉.

---

## 🅳️ Partie D — Lien court + QR code

### Le QR code (déjà prêt)
Le QR code est dans **`assets/qr-cleantheclub.png`** (et `.svg` pour l'impression grand format).
Il pointe vers ta page. Tu peux le mettre directement sur tes affiches.

Une **affiche A4 prête à imprimer** est aussi fournie : ouvre **`affiche.html`** dans ton
navigateur et fais *Imprimer > Enregistrer en PDF*.

### Un lien court à dire / écrire (facultatif)
L'adresse GitHub est un peu longue à taper. Pour un lien facile à retenir :

1. Va sur [tinyurl.com](https://tinyurl.com).
2. Colle ton adresse `https://jeromevde77.github.io/cleanthebar-/`.
3. Dans *« Customize »*, mets un alias mémorisable, par ex. **`cleantheclub`**.
4. Tu obtiens : `https://tinyurl.com/cleantheclub` — parfait pour les réseaux et le bouche-à-oreille.

> 🔁 Si tu préfères que le **QR code** pointe vers ce lien court (ou vers un lien `rclh.be`
> plus tard), regénère-le :
> ```
> python3 tools/generate_qr.py https://tinyurl.com/cleantheclub
> ```

---

## 🅴️ Partie E — Le jour J

- Ouvre ton **Google Sheet** : tu as la liste complète (prénom, nom, email, téléphone,
  nombre de participants) avec l'heure d'inscription. Idéal pour pointer à l'arrivée.
- Tu peux trier, filtrer, ou faire la somme de la colonne *« Nb participants »* pour
  connaître le nombre total de personnes attendues.

---

## 🛠️ Récapitulatif des fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | La page d'inscription |
| `merci.html` | Page de confirmation après inscription |
| `affiche.html` | Affiche A4 imprimable avec le QR code |
| `assets/style.css` | Le design (couleurs RCLH) |
| `assets/script.js` | Envoi des inscriptions ← **à configurer (Partie C)** |
| `assets/logo-rclh.png` | Logo officiel du club |
| `assets/qr-cleantheclub.png` / `.svg` | Le QR code |
| `apps-script/Code.gs` | Le backend Google Sheet (Partie B) |
| `tools/generate_qr.py` | Pour regénérer le QR si l'URL change |

---

**ONE TEAM — Former des joueurs, construire des personnes.** 💚🍷
