import re

with open('web/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Extract the registration block
reg_start = html.find('<!-- REGISTRATION TAB CONTENT -->')
reg_end = html.find('</section>', reg_start)
# Find the exact end of tab-registration div. It ends right before section id="footer" or the next section.
# Let's use regex or string manipulation carefully.
tab_reg_str = html[reg_start:reg_end]
# We only want the div id="tab-registration", which ends before `</section>` in the `donate` section.
# Actually, the div ends a bit before `</section>`.
last_div = tab_reg_str.rfind('</div>')
tab_reg_content = tab_reg_str[:last_div+6] # roughly, but let's be more precise:

# Let's extract the registration box itself (inside the tab-registration div)
box_start = html.find('<div class="registration-box"', reg_start)
# The box ends right before the closing div of tab-registration.
box_end = html.find('              </div>\n            </section>', reg_start)
reg_box_content = html[box_start:box_end]

# 2. Add a Registration heading to the registration block
reg_wrapper = f"""
              <!-- COURSE REGISTRATION SECTION -->
              <h2 class="section-heading" style="margin-top: 60px;" id="course-registration-heading">
                <span class="accent">✦</span>
                Course Registration
                <span class="accent">✦</span>
              </h2>
              {reg_box_content}
"""

# 3. Insert into the classes section
classes_end = html.find('            </section>', html.find('<section id="classes"'))
html = html[:classes_end] + reg_wrapper + html[classes_end:]

# 4. Remove the registration tab button from the donate section
tab_btn_start = html.find('<button class="support-tab" onclick="switchTab(\'registration\')"')
tab_btn_end = html.find('</button>', tab_btn_start) + 9
html = html[:tab_btn_start] + html[tab_btn_end:]

# Also remove the whole REGISTRATION TAB CONTENT from the donate section
reg_content_start = html.find('<!-- REGISTRATION TAB CONTENT -->')
donate_section_end = html.find('            </section>', reg_content_start)
html = html[:reg_content_start] + "            </section>\n          </div>\n        </div>" + html[donate_section_end+22:] # wait, let's just replace the exact range
# Let's find where tab-registration starts and ends precisely

# 5. We also want to remove the remaining "Donation" tab button since there's only one.
# But just in case, let's leave the Donation tab button and just make it static?
# The user said "and donation tab as it is it used to be", so maybe they want the tab looking thing.
# Let's remove both buttons and the container to make it clean, or just leave container with 1 button?
# Let's remove the whole .support-tabs-container.

with open('patch_html2_auto.py', 'w') as f:
    f.write('''
import re

with open("web/index.html", "r") as f:
    text = f.read()

# Extract registration block
m = re.search(r'<!-- REGISTRATION TAB CONTENT -->.*?<div class="registration-box".*?(<form id="registration-form".*?</form>)\\s*</div>\\s*</div>', text, re.DOTALL)
if m:
    reg_block = """
              <!-- COURSE REGISTRATION SECTION -->
              <h2 class="section-heading" style="margin-top: 60px;" id="course-registration-heading">
                <span class="accent">✦</span>
                Course Registration
                <span class="accent">✦</span>
              </h2>
              <div class="registration-box" style="
                    background: rgba(255, 255, 255, 0.95);
                    padding: 30px;
                    border-radius: 24px;
                    max-width: 500px;
                    margin: 0 auto;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    color: #2d4563;
                  ">
                <div style="width: 100%; margin-bottom: 20px; border-radius: 15px; overflow: hidden; border: 2px solid var(--golden-primary); box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                  <img src="form_banner.jpg" alt="Class Registration" style="width: 100%; display: block; object-fit: cover; height: auto;">
                </div>
                """ + m.group(1) + """
              </div>
"""
    
    # insert before the end of classes section
    classes_section_end = text.find('</section>', text.find('id="classes"'))
    text = text[:classes_section_end] + reg_block + "\\n            " + text[classes_section_end:]

    # remove the registration tab and content from donate section
    text = re.sub(r'<button class="support-tab" onclick="switchTab\(\\'registration\\'\)".*?</button>', '', text, flags=re.DOTALL)
    text = re.sub(r'<!-- REGISTRATION TAB CONTENT -->.*?<div id="tab-registration".*?</form>\\s*</div>\\s*</div>', '', text, flags=re.DOTALL)

    # remove the donation tab button too since it\'s the only one left
    text = re.sub(r'<!-- TABS NAVIGATION -->.*?</div>\\s*<!-- DONATION TAB CONTENT -->', '<!-- DONATION TAB CONTENT -->', text, flags=re.DOTALL)

    with open("web/index.html", "w") as out:
        out.write(text)
    print("Patched successfully!")
else:
    print("Could not find registration block")
''')

