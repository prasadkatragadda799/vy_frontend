from PIL import Image

img = Image.open('new-logo.png')
img = img.convert('RGB')
w, h = img.size

# The logo is a circle with "VIBHUTI YOGA" written near the bottom center.
# We'll sample pixels in the lower-middle area and find the darkest red.
max_redness = 0
best_color = (0,0,0)

for y in range(int(h * 0.7), int(h * 0.95)):
    for x in range(int(w * 0.3), int(w * 0.7)):
        r, g, b = img.getpixel((x, y))
        # look for a pixel that is very red (high r, low g and b)
        redness = r - max(g, b)
        if redness > max_redness and r < 200: # avoid pure bright red if it's a dark logo
            max_redness = redness
            best_color = (r, g, b)

print(f"Exact red color found: #{best_color[0]:02x}{best_color[1]:02x}{best_color[2]:02x}")
