#!/usr/bin/env python3
"""
Generate PWA icons from fitforg-logo.png
- 192x192 standard
- 512x512 standard
- 512x512 maskable (with safe zone padding)
- apple-touch-icon 180x180
- favicon 32x32, 16x16
"""
from PIL import Image
import os

SRC = "/home/z/my-project/public/fitforg-logo.png"
OUT_DIR = "/home/z/my-project/public/icons"

os.makedirs(OUT_DIR, exist_ok=True)

src = Image.open(SRC).convert("RGBA")
print(f"Source: {src.size}, mode={src.mode}")

def save_square(size, name, maskable=False):
    """Resize logo onto a square canvas. For maskable, add ~20% padding (safe zone)."""
    if maskable:
        # Maskable icons need the logo in the central 80% ("safe zone")
        # so it doesn't get cropped by various mask shapes (circle, squircle, etc.)
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 255))  # black bg
        logo_size = int(size * 0.72)  # logo takes ~72% of canvas
        resized = src.resize((logo_size, logo_size), Image.LANCZOS)
        offset = ((size - logo_size) // 2, (size - logo_size) // 2)
        canvas.paste(resized, offset, resized)
    else:
        # Standard icon — logo fills most of canvas with small margin
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 255))
        logo_size = int(size * 0.85)
        resized = src.resize((logo_size, logo_size), Image.LANCZOS)
        offset = ((size - logo_size) // 2, (size - logo_size) // 2)
        canvas.paste(resized, offset, resized)
    out = os.path.join(OUT_DIR, name)
    canvas.save(out, "PNG", optimize=True)
    print(f"Saved {out} ({size}x{size})")

# Generate all required PWA sizes
save_square(192, "icon-192.png")
save_square(512, "icon-512.png")
save_square(512, "icon-512-maskable.png", maskable=True)
save_square(180, "apple-touch-icon.png")
save_square(32, "favicon-32.png")
save_square(16, "favicon-16.png")

# Also create an apple-touch-icon at root (Apple convention)
apple = Image.open(os.path.join(OUT_DIR, "apple-touch-icon.png"))
apple.save("/home/z/my-project/public/apple-touch-icon.png", "PNG", optimize=True)

# ICO favicon (multi-res)
ico_sizes = [(16,16), (32,32), (48,48), (64,64)]
ico_images = []
for s in [16, 32, 48, 64]:
    canvas = Image.new("RGBA", (s, s), (0, 0, 0, 255))
    ls = int(s * 0.85)
    r = src.resize((ls, ls), Image.LANCZOS)
    canvas.paste(r, ((s-ls)//2, (s-ls)//2), r)
    ico_images.append(canvas)
ico_images[0].save("/home/z/my-project/public/favicon.ico",
                   format="ICO",
                   sizes=[(s, s) for s in [16, 32, 48, 64]],
                   append_images=ico_images[1:])
print("Saved favicon.ico (multi-res)")
print("\nAll icons generated.")
