import os
from bs4 import BeautifulSoup

file_path = '/Users/varungroup/Desktop/FINALS/vy_fsd/vy_79/web/index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

course_images = {
    'course-intuition': 'intuition_power.png',
    'course-mind': 'mind_power.png',
    'course-holistic': 'holistic_healing.png'
}

for course_id, img_name in course_images.items():
    c_div = soup.find('div', id=course_id)
    if c_div:
        icon_div = c_div.find('div', class_='course-icon-v2')
        if icon_div:
            img_div = soup.new_tag('div')
            img_div['class'] = ['course-image-v2']
            img = soup.new_tag('img', src=f'assets/{img_name}')
            img['alt'] = course_id.replace('course-', '').title() + ' Power'
            img_div.append(img)
            icon_div.replace_with(img_div)

# Change function calls on explore buttons
btns = soup.find_all('button', class_='course-explore-btn')
for btn in btns:
    onclick = btn.get('onclick', '')
    if 'toggleBenefits' in onclick:
        btn['onclick'] = onclick.replace('toggleBenefits', 'showBenefitsModal')

# Remove old expansion panels
for panel in soup.find_all('div', class_='course-benefits-panel'):
    panel.decompose()

# Append Modal HTML
modal_html = """
<!-- BENEFITS MODAL DIALOG -->
<div id="benefits-modal" class="custom-modal">
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
          <!-- Populated dynamically via JS -->
        </ul>
      </div>
    </div>
    <div class="modal-footer">
      <button class="modal-action-btn pulse-glow" onclick="closeBenefitsModal()">Got it</button>
    </div>
  </div>
</div>
"""
modal_soup = BeautifulSoup(modal_html, 'html.parser')

# find script tag or body end to append modal
modal_container = soup.find('div', class_='glass-card')
if modal_container:
    modal_container.append(modal_soup)
else:
    body = soup.find('body')
    if body:
        body.append(modal_soup)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(str(soup))
