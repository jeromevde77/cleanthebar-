#!/usr/bin/env python3
"""Visuel Instagram 1080x1080 — CleanTheClub RCLH, fond photo terrain."""
import segno
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W = H = 1080
VERT       = (12, 51, 39)
BORDEAUX   = (112, 18, 34)
ROSE       = (240, 0, 80)
ROSE_CLAIR = (255, 217, 225)
GRIS       = (222, 230, 225)
VERT_VIF   = (126, 224, 176)
BLANC      = (255, 255, 255)

QR_URL = "http://bit.ly/3RPEP7A"
SERIF_B = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
SANS    = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
SANS_B  = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
ITAL    = "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"
def F(p, s): return ImageFont.truetype(p, s)

# ---------- fond : photo terrain (cover 1080x1080) ----------
photo = Image.open("/root/.claude/uploads/6f4f19df-aa34-5656-9bdf-8d9cc16b0f7a/403c1b4b-6488485bec512d8a4ac14e7d44c5fee569cf922d.jpeg").convert("RGB")
photo = photo.crop((0, 0, 500, 567))                 # partie photo (terrain, ballon, seau)
scale = max(W / photo.width, H / photo.height)
photo = photo.resize((int(photo.width*scale), int(photo.height*scale)), Image.LANCZOS)
left = (photo.width - W) // 2
top  = (photo.height - H) // 2
photo = photo.crop((left, top, left + W, top + H))
photo = photo.filter(ImageFilter.GaussianBlur(5))    # floute les incrustations

img = photo.convert("RGB")

# ---------- voile vert pour la lisibilité ----------
overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
od = ImageDraw.Draw(overlay)
for y in range(H):
    # plus sombre en haut (slogan) et en bas (carte), un peu moins au milieu
    a = 205 - int(70 * (1 - abs((y - H/2) / (H/2))))   # 135..205
    od.line([(0, y), (W, y)], fill=(10, 40, 30, a))
img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

d = ImageDraw.Draw(img)
d.rectangle([0, 0, W, 16], fill=ROSE)

def center(y, text, font, fill):
    w = d.textlength(text, font=font)
    d.text(((W - w) / 2, y), text, font=font, fill=fill)

# ---------- logo ----------
logo = Image.open("/home/user/cleanthebar-/assets/logo-rclh.png").convert("RGBA")
lw = 196
logo = logo.resize((lw, int(logo.height * lw / logo.width)), Image.LANCZOS)
img.paste(logo, ((W - logo.width) // 2, 46), logo)

center(266, "R U G B Y   C L U B   L A   H U L P E", F(SANS_B, 26), ROSE_CLAIR)
center(316, "NOTRE CLUB,",    F(SERIF_B, 60), GRIS)
center(384, "NOTRE FIERTÉ,",  F(SERIF_B, 74), VERT_VIF)
center(462, "NETTOYONS-LE !", F(SERIF_B, 96), ROSE)

# pill date
date_txt = "DIMANCHE 5 JUILLET  ·  DÈS 10H"
df = F(SANS_B, 38)
dw = d.textlength(date_txt, font=df); pad = 34
px0 = (W - dw) / 2 - pad
d.rounded_rectangle([px0, 600, px0 + dw + 2*pad, 668], radius=34, fill=BORDEAUX)
center(610, date_txt, df, BLANC)

center(694, "Avenue Ernest Solvay 43 · 1310 La Hulpe", F(SANS, 30), BLANC)
center(736, "Barbecue en fin de journée", F(SANS, 30), ROSE_CLAIR)

# carte blanche QR + lien
cx0, cy0, cx1, cy1 = 150, 800, 930, 1000
d.rounded_rectangle([cx0, cy0, cx1, cy1], radius=28, fill=BLANC)
qr = segno.make(QR_URL, error="h")
qr.save("/tmp/_qr_insta2.png", scale=12, dark="#701222", light="#ffffff", border=2)
qimg = Image.open("/tmp/_qr_insta2.png").convert("RGBA").resize((150, 150), Image.NEAREST)
img.paste(qimg, (cx0 + 30, cy0 + 25), qimg)
tx = cx0 + 30 + 150 + 34
d.text((tx, cy0 + 52), "INSCRIS-TOI", font=F(SANS_B, 40), fill=BORDEAUX)
d.text((tx, cy0 + 104), "bit.ly/3RPEP7A", font=F(SANS_B, 36), fill=VERT)
d.text((tx, cy0 + 150), "scanne ou clique le lien", font=F(SANS, 24), fill=(110, 110, 110))

center(1028, "Semper fidelis  ·  ONE TEAM", F(ITAL, 32), ROSE_CLAIR)

img.save("/home/user/cleanthebar-/assets/instagram-cleantheclub-photo.png", quality=95)
print("OK fond photo généré")
