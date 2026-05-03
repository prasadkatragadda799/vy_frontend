from PIL import Image, ImageDraw

# Open the original logo
img = Image.open('new-logo.png').convert('RGBA')
w, h = img.size

# Make a new perfectly square image with transparency
size = max(w, h)
square = Image.new('RGBA', (size, size), (255, 255, 255, 0))

# Paste the original inside, centered
offset_x = (size - w) // 2
offset_y = (size - h) // 2
square.paste(img, (offset_x, offset_y))

# Create a circular mask
mask = Image.new('L', (size, size), 0)
draw = ImageDraw.Draw(mask)

# Assuming the circle should be close to the borders, maybe bring it in by 5px
padding = 5
draw.ellipse((padding, padding, size - padding, size - padding), fill=255)

# Apply mask to the image, preserving the circle and making outside fully transparent
square.putalpha(mask)

square.save('new-logo-perfect-circle.png')
print("Saved strictly circle-cropped image.")
