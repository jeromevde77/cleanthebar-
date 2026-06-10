#!/usr/bin/env python3
"""Visuel Instagram 1080x1080 — CleanTheClub RCLH."""
import segno
from PIL import Image, ImageDraw, ImageFont

W = H = 1080
VERT       = (12, 51, 39)
VERT_TOP   = (22, 86, 62)
VERT_BAS   = (6, 33, 25)
BORDEAUX   = (112, 18, 34)
ROSE       = (240, 0, 80)
ROSE_CLAIR = (255, 217, 225)
GRIS       = (203, 213, 207)
VERT_VIF   = (126, 224, 176)
BLANC      = (255, 255, 255)

LINK = "INSCRIS-TOI : bit.ly/3RPEP7A"
QR_URL = "http://bit.ly/3RPEP7A"

SERIF_B = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
SANS    = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
SANS_B  = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
ITAL    = "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"
def F(p, s): return ImageFont.truetype(p, s)

# ---------- fond dégradé ----------
img = Image.new("RGB", (W, H))
px = img.load()
for y in range(H):
    t = y / (H - 1)
    r = int(VERT_TOP[0] + (VERT_BAS[0]-VERT_TOP[0])*t)
    g = int(VERT_TOP[1] + (VERT_BAS[1]-VERT_TOP[1])*t)
    b = int(VERT_TOP[2] + (VERT_BAS[2]-VERT_TOP[2])*t)
    for x in range(W):
        px[x, y] = (r, g, b)
d = ImageDraw.Draw(img)

# bandeau rose en haut
d.rectangle([0, 0, W, 16], fill=ROSE)

def center(y, text, font, fill):
    w = d.textlength(text, font=font)
    d.text(((W - w) / 2, y), text, font=font, fill=fill)

# ---------- logo ----------
logo = Image.open("/home/user/cleanthebar-/assets/logo-rclh.png").convert("RGBA")
lw = 200
logo = logo.resize((lw, int(logo.height * lw / logo.width)), Image.LANCZOS)
img.paste(logo, ((W - logo.width) // 2, 48), logo)

# ---------- kicker ----------
center(270, "R U G B Y   C L U B   L A   H U L P E", F(SANS_B, 26), ROSE_CLAIR)

# ---------- slogan crescendo ----------
center(320, "NOTRE CLUB,",   F(SERIF_B, 60), GRIS)
center(388, "NOTRE FIERTÉ,", F(SERIF_B, 74), VERT_VIF)
center(466, "NETTOYONS-LE !", F(SERIF_B, 96), ROSE)

# ---------- pill date ----------
date_txt = "DIMANCHE 5 JUILLET  ·  DÈS 10H"
df = F(SANS_B, 38)
dw = d.textlength(date_txt, font=df)
pad = 34
px0 = (W - dw) / 2 - pad
d.rounded_rectangle([px0, 600, px0 + dw + 2*pad, 668], radius=34, fill=BORDEAUX)
center(610, date_txt, df, BLANC)

# ---------- infos ----------
center(694, "Avenue Ernest Solvay 43 · 1310 La Hulpe", F(SANS, 30), BLANC)
center(736, "Barbecue en fin de journée", F(SANS, 30), ROSE_CLAIR)

# ---------- carte blanche QR + lien ----------
card_x0, card_y0, card_x1, card_y1 = 150, 800, 930, 1000
d.rounded_rectangle([card_x0, card_y0, card_x1, card_y1], radius=28, fill=BLANC)

# QR
qr = segno.make(QR_URL, error="h")
qr.save("/tmp/_qr_insta.png", scale=12, dark="#701222", light="#ffffff", border=2)
qimg = Image.open("/tmp/_qr_insta.png").convert("RGBA")
qs = 150
qimg = qimg.resize((qs, qs), Image.NEAREST)
img.paste(qimg, (card_x0 + 30, card_y0 + (200 - qs)//2), qimg)

# texte dans la carte
tx = card_x0 + 30 + qs + 34
d.text((tx, card_y0 + 52), "INSCRIS-TOI", font=F(SANS_B, 40), fill=BORDEAUX)
d.text((tx, card_y0 + 104), "bit.ly/3RPEP7A", font=F(SANS_B, 36), fill=VERT)
d.text((tx, card_y0 + 150), "scanne ou clique le lien", font=F(SANS, 24), fill=(110,110,110))

# ---------- bas ----------
center(1028, "Semper fidelis  ·  ONE TEAM", F(ITAL, 32), ROSE_CLAIR)

img.save("/home/user/cleanthebar-/assets/instagram-cleantheclub.png", quality=95)
print("OK 1080x1080 généré")
