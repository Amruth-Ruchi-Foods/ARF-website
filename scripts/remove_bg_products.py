"""
Background remover for product images.
Uses the `rembg` library (wraps U2Net AI model — no API key needed).

Usage:
  pip install rembg pillow
  python scripts/remove_bg_products.py

Input:  public/images/products/  (original product images)
Output: public/images/products/  (overwrites with transparent PNGs, originals backed up)
"""

from pathlib import Path
from rembg import remove
from PIL import Image
import io
import shutil

PRODUCTS_DIR = Path("public/images/products")
BACKUP_DIR   = Path("public/images/products/originals")

# Only process these specific product images (not the 3d/already-transparent ones)
TARGET_FILES = [
    "buttermilk.jpeg",
    "flaxmixseeds.jpeg",
    "gheeroastedseeds.jpeg",
    "jumbokajur.jpeg",
    "khajurseedpowder.jpeg",
    "pailwankhajur.jpeg",
]

def process():
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)

    for filename in TARGET_FILES:
        img_path = PRODUCTS_DIR / filename
        if not img_path.exists():
            print(f"Skipping (not found): {filename}")
            continue

        # Backup original
        backup_path = BACKUP_DIR / filename
        if not backup_path.exists():
            shutil.copy2(img_path, backup_path)
            print(f"Backed up: {filename} → originals/")

        print(f"Processing: {filename} ...", end=" ")
        with open(img_path, "rb") as f:
            input_data = f.read()

        output_data = remove(input_data)

        # Save as PNG with transparency
        out_path = PRODUCTS_DIR / (img_path.stem + ".png")
        img = Image.open(io.BytesIO(output_data)).convert("RGBA")
        img.save(out_path, "PNG")
        print(f"saved → {out_path.name}")

    print(f"\nDone! Update products.ts to use .png extensions.")

if __name__ == "__main__":
    process()
