from PIL import Image
from collections import Counter

img = Image.open('new-logo.png').convert('RGB')
w, h = img.size

colors = []
for y in range(int(h * 0.7), int(h * 0.95)):
    for x in range(int(w * 0.3), int(w * 0.7)):
        r, g, b = img.getpixel((x, y))
        if r > 100 and r < 200 and g < 30 and b < 30:
            colors.append(f"#{r:02x}{g:02x}{b:02x}")

counter = Counter(colors)
print("Most common deep red pixels:", counter.most_common(5))
