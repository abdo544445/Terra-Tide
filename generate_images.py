import os
from PIL import Image, ImageDraw, ImageFont

# Color Palette
COLORS = {
    'primary': '#2C3E50',
    'secondary': '#D35400',
    'background': '#FDFBF7',
    'card': '#FFFFFF',
    'success': '#27AE60'
}

# Image Data
IMAGES = [
    {'name': 'hero-banner.png', 'size': (1920, 600), 'color': COLORS['background'], 'text': 'Terra & Tide - Sustainable Home Decor'},
    {'name': 'cat-living.png', 'size': (400, 500), 'color': '#E0E0E0', 'text': 'Living Collection'},
    {'name': 'cat-kitchen.png', 'size': (400, 500), 'color': '#D0D0D0', 'text': 'Kitchen Collection'},
    {'name': 'cat-wellness.png', 'size': (400, 500), 'color': '#C0C0C0', 'text': 'Wellness Collection'},
]

# Product Images
categories = {
    'living': 6,
    'kitchen': 6,
    'wellness': 6
}

for cat, count in categories.items():
    for i in range(1, count + 1):
        IMAGES.append({
            'name': f'{cat}{i}.png',
            'size': (300, 300),
            'color': COLORS['card'], # Using card color, maybe add a border or slightly different background
            'text': f'{cat.capitalize()} Product {i}'
        })

OUTPUT_DIR = 'images'

def generate_images():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    try:
        # Try to load a font, otherwise use default
        font = ImageFont.truetype("arial.ttf", 40)
    except IOError:
        font = ImageFont.load_default()

    for img_data in IMAGES:
        # specific color override for products to make them visible against white background
        bg_color = img_data['color']
        if 'Product' in img_data['text']:
             bg_color = '#F0F0F0' # Light gray for product placeholders

        img = Image.new('RGB', img_data['size'], color=bg_color)
        d = ImageDraw.Draw(img)

        # Calculate text position to center it
        # textbbox was added in Pillow 8.0.0, getsize is deprecated
        try:
            bbox = d.textbbox((0, 0), img_data['text'], font=font)
            text_width = bbox[2] - bbox[0]
            text_height = bbox[3] - bbox[1]
        except AttributeError:
             # Fallback for older Pillow versions
             text_width, text_height = d.textsize(img_data['text'], font=font)

        x = (img_data['size'][0] - text_width) / 2
        y = (img_data['size'][1] - text_height) / 2

        d.text((x, y), img_data['text'], fill=COLORS['primary'], font=font)

        # Add a border for visibility
        d.rectangle([(0,0), (img_data['size'][0]-1, img_data['size'][1]-1)], outline=COLORS['secondary'], width=5)

        filepath = os.path.join(OUTPUT_DIR, img_data['name'])
        img.save(filepath)
        print(f"Generated: {filepath}")

if __name__ == "__main__":
    generate_images()
