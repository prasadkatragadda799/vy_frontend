from PIL import Image

img = Image.open('new-logo.png')
w, h = img.size

# We want a square. Let's make it h x h
new_size = max(w, h)
# Create a new image with white background
new_img = Image.new('RGB', (new_size, new_size), (251, 240, 227)) # guess cream bg

# Paste original image at center
offset_x = (new_size - w) // 2
offset_y = (new_size - h) // 2

new_img.paste(img, (offset_x, offset_y))
new_img.save('new-logo-square.png')
print("Padded to", new_img.size)
