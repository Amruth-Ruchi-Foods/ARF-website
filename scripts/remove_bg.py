"""
Background remover for ingredient images.
Uses the `rembg` library (wraps U2Net AI model — no API key needed).

Usage:
  pip install rembg pillow
  python scripts/remove_bg.py

Input:  public/images/ingredients/originals/  (put your raw images here)
Output: public/images/ingredients/            (transparent PNGs saved here)
"""

from pathlib import Path
from rembg import remove
from PIL import Image
import io

INPUT_DIR  = Path("public/images/ingredients/originals")
OUTPUT_DIR = Path("public/images/ingredients")

def process():
    INPUT_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    images = list(INPUT_DIR.glob("*"))
    images = [f for f in images if f.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif"}]

    if not images:
        print(f"No images found in {INPUT_DIR}. Add your ingredient photos there and re-run.")
        return

    for img_path in images:
        print(f"Processing: {img_path.name} ...", end=" ")
        with open(img_path, "rb") as f:
            input_data = f.read()

        output_data = remove(input_data)

        # Save as PNG to preserve transparency
        out_path = OUTPUT_DIR / (img_path.stem + ".png")
        img = Image.open(io.BytesIO(output_data)).convert("RGBA")
        img.save(out_path, "PNG")
        print(f"saved → {out_path}")

    print(f"\nDone! {len(images)} image(s) processed.")

if __name__ == "__main__":
    process()
