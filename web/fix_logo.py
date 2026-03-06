from PIL import Image, ImageOps 

img = Image.open('new-logo.png')
# Convert to RGB to ensure no transparency bugs
img = img.convert('RGB')
w, h = img.size

# The logo provided seems to be slightly cut, probably because it's 481x512 with the circle near the edges. 
# Because it's a 481 width and 512 height, when object-fit cover applies to a square, the height (512) is scaled down/up to fit the width, which cuts off top and bottom.
# To fit perfectly in a circle, we need to pad the top and bottom and sides with the background color to make it square, and also ensure the circle itself is perfectly in the middle with a bit of breathing room.

# Sample the corners for the background color
bg_color = img.getpixel((0, 0))

# Create a larger square canvas: e.g. 550x550
size = 550
new_img = Image.new('RGB', (size, size), bg_color)

# Paste the original image centered
x = (size - w) // 2
y = (size - h) // 2
new_img.paste(img, (x, y))

# Crop the white/empty border if needed, but since it's an emblem let's just use the padded one
new_img.save('new-logo-perfect-circle.png')
print("Saved perfect circle logo with size:", new_img.size, "and bg color:", bg_color)
