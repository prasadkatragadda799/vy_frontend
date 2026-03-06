import re

file_path = '/Users/varungroup/Desktop/FINALS/vy_fsd/vy_79/web/index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Replace Intuition Power icon with image
html = re.sub(
    r'<div class="course-icon-v2"><i class="fas fa-eye"></i></div>',
    '<div class="course-image-v2"><img src="assets/intuition_power.png" alt="Intuition Power"></div>',
    html
)

# Replace Mind Power icon
html = re.sub(
    r'<div class="course-icon-v2"><i class="fas fa-brain"></i></div>',
    '<div class="course-image-v2"><img src="assets/mind_power.png" alt="Mind Power"></div>',
    html
)

# Replace Holistic Healing icon
html = re.sub(
    r'<div class="course-icon-v2"><i class="fas fa-spa"></i></div>',
    '<div class="course-image-v2"><img src="assets/holistic_healing.png" alt="Holistic Healing"></div>',
    html
)

# Change onclick toggleBenefits to showBenefitsModal
html = html.replace("toggleBenefits(", "showBenefitsModal(")

# Remove course-benefits-panel for all courses
# The panel HTML spans multiple lines, we can use regex to remove it
# It looks like: <div class="course-benefits-panel" id="benefits-intuition"> ... </div>
import re
# Regex to match the entire <div class="course-benefits-panel" ... > up to and including its closing </div>
# Assuming there are no nested divs with this specific structure or we can match until the next <button class="register-class-btn
# Actually, a simpler way is since we know exact ID names:
panels = ['intuition', 'mind', 'holistic', 'akul', 'dowsing', 'agni', 'dhanur', 'sri']
for p in panels:
    pattern = r'<div class="course-benefits-panel" id="benefits-' + p + r'">.*?</div>\s*</div>'
    # Use re.sub with re.DOTALL to let .* match newlines
    # But wait, the closing </div> of benefits-panel is followed by `<button class="register-class-btn"` or `<div class="free-tag-note"`
    # Let's match up to just before the next element
    pattern = r'<div class="course-benefits-panel" id="benefits-' + p + r'">.*?(?=(<button class="register-class-btn"|<div class="free-tag-note"))'
    html = re.sub(pattern, '', html, flags=re.DOTALL)

# Append Modal HTML just before the last </div> of .main-container or just before </body>
modal_html = """
<!-- BENEFITS MODAL DIALOG -->
<div id="benefits-modal" class="custom-modal">
  <div class="modal-overlay" onclick="closeBenefitsModal()"></div>
  <div class="modal-content glass-card-v2">
    <button class="close-modal-btn" onclick="closeBenefitsModal()"><i class="fas fa-times"></i></button>
    <div class="modal-header">
      <div class="modal-icon"><i class="fas fa-star"></i></div>
      <h3 id="modal-course-title">Course Title</h3>
    </div>
    <div class="modal-body">
      <p id="modal-course-desc" class="modal-desc">Brief course matter goes here.</p>
      <div class="modal-benefits-list">
        <h4><i class="fas fa-gem"></i> Key Benefits</h4>
        <ul id="modal-benefits-ul">
        </ul>
      </div>
    </div>
    <div class="modal-footer">
      <button class="modal-action-btn pulse-glow" onclick="closeBenefitsModal()">Got it</button>
    </div>
  </div>
</div>
"""
if "<!-- BENEFITS MODAL DIALOG -->" not in html:
    html = html.replace('</body>', f'{modal_html}\n</body>')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(html)
