#!/usr/bin/env python3
"""
Génère le QR code CleanTheClub aux couleurs du Rugby Club La Hulpe.

Usage :
    python3 tools/generate_qr.py [URL]

Sans argument, utilise l'URL GitHub Pages par défaut.
Quand tu auras un lien court (ex. rclh.be/clean), relance :
    python3 tools/generate_qr.py https://rclh.be/clean

Dépendances : pip install segno pillow
"""
import sys
import segno
from PIL import Image

BORDEAUX = "#701222"
VERT = "#0c3327"
ROOT = __file__.rsplit("/tools/", 1)[0]

DEFAULT_URL = "https://jeromevde77.github.io/cleanthebar-/"
url = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_URL

# Correction d'erreur élevée (H) pour rester scannable avec le logo au centre.
qr = segno.make(url, error="h")

# 1) Version simple, vectorielle (idéale pour l'impression / affiches A3).
qr.save(f"{ROOT}/assets/qr-cleantheclub.svg", scale=10,
        dark=BORDEAUX, light="#ffffff", border=4)

# 2) Version PNG haute résolution avec le logo RCLH au centre.
tmp_png = f"{ROOT}/assets/_qr_base.png"
qr.save(tmp_png, scale=20, dark=BORDEAUX, light="#ffffff", border=4)

qr_img = Image.open(tmp_png).convert("RGBA")
logo = Image.open(f"{ROOT}/assets/logo-rclh.png").convert("RGBA")

# Le logo occupe ~22% de la largeur du QR (sûr avec correction H).
target = int(qr_img.width * 0.22)
ratio = target / logo.width
logo = logo.resize((target, int(logo.height * ratio)), Image.LANCZOS)

# Pastille blanche derrière le logo pour le détacher du motif.
pad = int(target * 0.12)
badge = Image.new("RGBA", (logo.width + 2 * pad, logo.height + 2 * pad), (255, 255, 255, 255))
badge.paste(logo, (pad, pad), logo)

pos = ((qr_img.width - badge.width) // 2, (qr_img.height - badge.height) // 2)
qr_img.alpha_composite(badge, pos)
qr_img.save(f"{ROOT}/assets/qr-cleantheclub.png")

print("QR généré pour :", url)
print(" -", f"{ROOT}/assets/qr-cleantheclub.png")
print(" -", f"{ROOT}/assets/qr-cleantheclub.svg")
