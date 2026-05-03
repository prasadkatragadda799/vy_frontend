from PIL import Image, ImageDraw

img = Image.open('new-logo.png').convert('RGBA')
w, h = img.size

# We know width is 481, height is 512. The circle is visually centered horizontally, but maybe not vertically? 
# Usually we just take a centered perfect square and mask it.
size = min(w, h)
top = (h - size) // 2
bottom = top + size
left = (w - size) // 2
right = left + size
crop_img = img.crop((left, top, right, bottom))

# Scale to a standard square pixel size to be safe (512x512)
crop_img = crop_img.resize((512, 512), Image.Resampling.LANCZOS)

mask = Image.new('L', (512, 512), 0)
draw = ImageDraw.Draw(mask)
# Leave a small 2px anti-alias border transparent
padding = 2
draw.ellipse((padding, padding, 512 - padding, 512 - padding), fill=255)

crop_img.putalpha(mask)
crop_img.save('new-logo-perfect-circle.png')
print("Successfully generated true perfect circle tight crop!")
