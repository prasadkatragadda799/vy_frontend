import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update Intuition Power title
html = html.replace('<h3 class="course-title-v2" id="title-intuition">Intuition Power</h3>', 
                    '<h3 class="course-title-v2" id="title-intuition">Intuition Power (3 Levels)</h3>')

# 2. Update Mind Power title
html = html.replace('<h3 class="course-title-v2" id="title-mind">Mind Power</h3>', 
                    '<h3 class="course-title-v2" id="title-mind">Mind Power (3 Levels)</h3>')

# 3. Update Holistic Healing title and add text
html = html.replace('<h3 class="course-title-v2" id="title-holistic">Holistic Healing Energy Power</h3>',
                    '<h3 class="course-title-v2" id="title-holistic">Holistic Healing (3 Levels)</h3>')
html = html.replace('<p class="course-desc-v2" id="desc-holistic">Learn sacred healing techniques to channel universal\n                      energy for physical and spiritual wellness.</p>',
                    '<p class="course-desc-v2" id="desc-holistic">Learn sacred healing techniques to channel universal energy for physical and spiritual wellness.<br><br><strong>Note: The holistic healing class will be in Prana Yoga Ashramam.</strong></p>')
html = html.replace('onclick="registerForCourse(\'Holistic Healing Energy Power\')"', 
                    'onclick="registerForCourse(\'Holistic Healing\')"')

# 4. Move Akul Science block and rename the Free Techniques section
akul_start = html.find('<!-- ═══════════════ COURSE: AKUL SCIENCE ═══════════════ -->')
akul_end = html.find('</div>\n\n              <!-- ═══════════════ FREE TECHNIQUES SECTION ═══════════════ -->', akul_start)

if akul_start != -1 and akul_end != -1:
    akul_block = html[akul_start:akul_end].strip() + "\n"
    # Remove it from there
    html = html[:akul_start] + html[akul_end:]
    
    # Update Free Techniques Section Header
    html = html.replace('<span id="heading-free-tech">Free Techniques</span>',
                        '<span id="heading-free-tech">Free Techniques with a Minimal Registration</span>')
                        
    # Insert Akul Science into the techniques grid
    tech_grid_start = html.find('<div class="courses-unified-grid techniques-grid">')
    tech_insert_pos = tech_grid_start + len('<div class="courses-unified-grid techniques-grid">') + 1
    
    # Also update Akul Science from course-card-v2 to include technique-card if needed?
    akul_block = akul_block.replace('<div class="course-card-v2" data-course="Akul Science" id="course-akul">',
                                      '<div class="course-card-v2 technique-card" data-course="Akul Science" id="course-akul">')
    
    html = html[:tech_insert_pos] + "\n" + akul_block + html[tech_insert_pos:]

# 5. Update Sri Vidya description
sri_desc_orig = '<p class="course-desc-v2" id="desc-sri">The supreme Tantric-Vedic tradition of worshipping Devi\n                      (Shakti) as the ultimate reality — Para Brahman in feminine form. Sacred Sri Chakra worship.</p>'
if sri_desc_orig in html:
    html = html.replace(sri_desc_orig, '<p class="course-desc-v2" id="desc-sri">The supreme Tantric-Vedic tradition of worshipping Devi. A profound path focusing deeply on Sri Durga Sapta Sadi and Varahi Sadhana.</p>')
else:
    # Just in case whitespace differs
    html = re.sub(r'<p class="course-desc-v2" id="desc-sri">.*?</p>', 
                  '<p class="course-desc-v2" id="desc-sri">The supreme Tantric-Vedic tradition of worshipping Devi. A profound path focusing deeply on Sri Durga Sapta Sadi and Varahi Sadhana.</p>', 
                  html, flags=re.DOTALL)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Patching complete.")
