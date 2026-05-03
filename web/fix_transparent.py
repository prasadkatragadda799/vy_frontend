from PIL import Image

img = Image.open('new-logo.png')
img = img.convert('RGBA')
w, h = img.size

size = 550
# Create a new image with transparent background
new_img = Image.new('RGBA', (size, size), (255, 255, 255, 0))

x = (size - w) // 2
y = (size - h) // 2
new_img.paste(img, (x, y))

new_img.save('new-logo-perfect-circle.png')
print("Saved perfect circle logo with transparency")
