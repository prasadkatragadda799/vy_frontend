import re
import sys

def main():
    try:
        with open('web/index.html', 'r', encoding='utf-8') as f:
            html = f.read()
    except FileNotFoundError:
        print("web/index.html not found.")
        return

    # 1. Find the registration tab content
    reg_tab_start = html.find('<!-- REGISTRATION TAB CONTENT -->')
    if reg_tab_start == -1:
        print("Could not find REGISTRATION TAB CONTENT")
        return
        
    # Find the end of the registration tab content (it's the end of the "donate" section essentially)
    reg_tab_end = html.find('            </section>', reg_tab_start)
    if reg_tab_end == -1:
        print("Could not find end of registration tab")
        return

    # Extract the box specifically 
    box_start = html.find('<div class="registration-box"', reg_tab_start)
    box_end = html.rfind('              </div>', reg_tab_start, reg_tab_end)
    box_end = html.rfind('              </div>', reg_tab_start, box_end)
    # Actually, using regex for extraction is simpler
    import re
    match = re.search(r'<!-- REGISTRATION TAB CONTENT -->\s*<div id="tab-registration"[^>]+>\s*(<div class="registration-box".*?</form>\s*</div>)\s*</div>', html, re.DOTALL)
    
    if not match:
        print("Could not extract registration box with regex")
        return
        
    reg_box = match.group(1)

    # Prepare the new section block to insert into courses
    courses_block = f"""
            <!-- ═══════════════════════════════════════════════════════ -->
            <!-- COURSE REGISTRATION FORM -->
            <!-- ═══════════════════════════════════════════════════════ -->
            <div style="margin-top: 60px;">
              <h2 class="section-heading" id="course-registration-heading">
                <span class="accent">✦</span>
                Course Registration
                <span class="accent">✦</span>
              </h2>
{reg_box}
            </div>
"""

    # 2. Insert into the classes section
    classes_section_end = html.find('</section>', html.find('<section id="classes"'))
    
    html = html[:classes_section_end] + courses_block + "            " + html[classes_section_end:]

    # 3. Remove the registration tab contents and the registration tab button from the donate section
    # Removing Registration Tab button
    html = re.sub(r'\s*<button class="support-tab"[^>]+switchTab\(\'registration\'\).*?</button>', '', html, flags=re.DOTALL)
    
    # Removing Registration Tab Content
    html = re.sub(r'\s*<!-- REGISTRATION TAB CONTENT -->.*?<div id="tab-registration".*?</form>\s*</div>\s*</div>', '', html, flags=re.DOTALL)
    
    # Remove the .support-tabs-container wrap, keeping just the donation button? Or entirely remove tab nav?
    # Keeping the original donation tab since the user said "donation tab as it is it used to be" - might just mean the whole tab div with one button or tabs nav intact.
    # Let's just remove the button. If it's a single tab, it will look like a header. 
    # Or just leave the tab nav with both buttons if they purely want it "as it was" but functional? No, the registration block is now in Courses. Let's remove the whole tab container to avoid a single useless tab button.
    html = re.sub(r'\s*<!-- TABS NAVIGATION -->.*?</div>\s*<!-- DONATION TAB CONTENT -->', '\n              <!-- DONATION CONTENT -->', html, flags=re.DOTALL)
    
    # We must also clean up the JS `switchTab` calls in `registerForCourse`
    js_match = re.search(r'(function registerForCourse\(courseName\) \{.*?setTimeout\(\(\) => \{).*?(const sel = document.getElementById\("reg-class"\);)', html, re.DOTALL)
    if js_match:
        html = html[:js_match.start(0)] + js_match.group(1) + "\n        " + js_match.group(2) + html[js_match.end(0):]
    
    # Update registerForCourse switchTab removing and scrollToSection("donate") -> scrollToSection("classes") or course-registration-heading
    html = html.replace('scrollToSection("donate");', 'document.getElementById("course-registration-heading").scrollIntoView({ behavior: "smooth" });')
    
    with open('web/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
        
    print("All transformations applied successfully.")

if __name__ == '__main__':
    main()
