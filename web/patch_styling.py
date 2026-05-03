with open("index.html", "r") as f:
    text = f.read()

# 1. Update the CSS version to clear cache
text = text.replace('v=26', 'v=27')

# 2. Update the Hero Title color to sync with Sanatana Vidya (golden)
text = text.replace('color: #930b0b;', 'color: var(--golden-primary);')

# 3. Update the subtitle font style
old_subtitle = 'style="font-family: var(--font-body); font-size: 1.25rem; color: var(--golden-accent); letter-spacing: 2px; margin-bottom: 35px; font-weight: 800; text-transform: uppercase; text-shadow: 0 3px 8px rgba(0,0,0,0.9), 0 0 5px rgba(255,216,155,0.2);"'
new_subtitle = 'style="font-family: \'Cinzel\', serif; font-size: 1.35rem; color: #ffffff; letter-spacing: 3px; margin-bottom: 35px; font-weight: 500; text-transform: uppercase; text-shadow: 0 4px 10px rgba(0,0,0,0.9), 0 0 10px rgba(255,255,255,0.4);"'
text = text.replace(old_subtitle, new_subtitle)

with open("index.html", "w") as f:
    f.write(text)

with open("vibhuti-styles.css", "r") as f:
    css = f.read()

# Update the logo red to a more accurate deep red, and ensure it pops
css = css.replace('color: #930b0b; /* Exact dark red from the logo */', 'color: #A30000; /* Distinct dark red */')
# Just in case they want it even bolder
css = css.replace('font-weight: 800;', 'font-weight: 900;')

with open("vibhuti-styles.css", "w") as f:
    f.write(css)

print("Styles patched.")
