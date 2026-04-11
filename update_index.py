#!/usr/bin/env python3
import re

with open('public/index.html', 'r') as f:
    html = f.read()

# 1. Add statistics section AFTER hero section (before hizmetler section)
stats_section = '''
<!-- ── İSTATİSTİKLER (ANİMATED COUNTERS) ── -->
<section class="statistics-section" id="istatistikler">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">İstatistikler</span>
      <h2>Rakamlarla Durukan Klima</h2>
      <p>10 yıllık deneyim, 500+ mutlu müşteri</p>
    </div>
    <div class="stats-counter-grid" id="stats-counter-grid">
      <div class="stat-counter-card">
        <div class="counter-icon">😊</div>
        <div class="counter-number" data-target="500" data-suffix="+">0</div>
        <div class="counter-label">Mutlu Müşteri</div>
      </div>
      <div class="stat-counter-card">
        <div class="counter-icon">🏆</div>
        <div class="counter-number" data-target="10" data-suffix="">0</div>
        <div class="counter-label">Yıl Deneyim</div>
      </div>
      <div class="stat-counter-card">
        <div class="counter-icon">🛡️</div>
        <div class="counter-number" data-target="100" data-suffix="%">0</div>
        <div class="counter-label">Orijinal Parça</div>
      </div>
      <div class="stat-counter-card">
        <div class="counter-icon">👨‍🔧</div>
        <div class="counter-number" data-target="5" data-suffix="">0</div>
        <div class="counter-label">Uzman Teknisyen</div>
      </div>
    </div>
  </div>
</section>
'''

# Find insertion point: after hero section, before hizmetler
hero_end = html.find('<section class="services" id="hizmetler">')
if hero_end != -1:
    html = html[:hero_end] + stats_section + html[hero_end:]
    print("Added statistics section")
else:
    print("Could not find hizmetler section")

# 2. Update working hours section to show village hours from content.json
# Replace the hours section with more detailed structure
old_hours = '''<div class="hours-table">
        <h3>📅 Mesai Saatleri</h3>
        <div class="hours-row"><span class="day">Pazartesi – Cuma</span><span class="time" id="h-weekday">08:00 – 19:00</span></div>
        <div class="hours-row"><span class="day">Cumartesi</span><span class="time" id="h-saturday">08:00 – 17:00</span></div>
        <div class="hours-row"><span class="day">Pazar</span><span class="closed" id="h-sunday">Kapalı</span></div>
      </div>'''

new_hours = '''<div class="hours-table">
        <h3>📅 Mesai Saatleri</h3>
        <div class="hours-row"><span class="day">Pazartesi – Cuma</span><span class="time" id="h-weekday">08:00 – 19:00</span></div>
        <div class="hours-row"><span class="day">Cumartesi</span><span class="time" id="h-saturday">08:00 – 17:00</span></div>
        <div class="hours-row"><span class="day">Pazar</span><span class="closed" id="h-sunday">Kapalı</span></div>
      </div>
      <div class="hours-table" style="margin-top:16px;">
        <h3>🚗 Köy Servisi</h3>
        <div class="hours-row"><span class="day" id="h-village-day1">Salı</span><span class="time" id="h-village-time1">09:00 – 17:00</span></div>
        <div class="hours-row"><span class="day" id="h-village-day2">Cuma</span><span class="time" id="h-village-time2">09:00 – 17:00</span></div>
      </div>'''

if old_hours in html:
    html = html.replace(old_hours, new_hours)
    print("Updated working hours section")
else:
    print("Could not find old hours section")

# 3. Update service area section to show full village list from serviceAreas array
# Find the village-days-text and make it a link to the villages list
old_village_note = '''<p style="text-align:center;margin-top:20px;color:#64748b;font-size:0.9rem;" id="village-days-text">🚗 Tüm Adana ilçelerine aynı gün servis verilmektedir.</p>'''

new_village_note = '''<div class="village-list-container" id="village-list-container" style="margin-top:20px;display:none;">
        <p style="text-align:center;margin-bottom:16px;font-weight:600;color:var(--primary);">📋 Tüm Hizmet Bölgelerimiz</p>
        <div class="village-tags" id="village-tags"></div>
      </div>
      <p style="text-align:center;margin-top:16px;color:#64748b;font-size:0.9rem;">
        <span id="village-days-text">🚗 Tüm Adana ilçelerine aynı gün servis verilmektedir.</span>
        <br /><button onclick="toggleVillageList()" style="background:none;border:none;color:var(--primary);font-weight:600;cursor:pointer;font-size:0.85rem;text-decoration:underline;margin-top:6px;" id="toggle-village-btn">Tüm bölgeleri gör →</button>
      </p>'''

if old_village_note in html:
    html = html.replace(old_village_note, new_village_note)
    print("Updated village list section")
else:
    print("Could not find old village note")

# 4. Add calculator links to blog preview section
old_blog_preview = '''<a href="/blog" class="btn btn-outline" style="display:inline-flex;">📚 Tüm Yazıları Gör</a>'''

new_blog_preview = '''<a href="/blog" class="btn btn-outline" style="display:inline-flex;">📚 Tüm Yazıları Gör</a>
      <div style="margin-top:20px;padding-top:20px;border-top:1px solid var(--border);text-align:center;">
        <p style="font-size:0.9rem;color:var(--text-light);margin-bottom:12px;">Hesaplama araçlarımız</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
          <a href="/btu-hesaplama" class="btn btn-outline" style="padding:10px 18px;font-size:0.85rem;">❄️ BTU Hesapla</a>
          <a href="/elektrik-tuketim" class="btn btn-outline" style="padding:10px 18px;font-size:0.85rem;">⚡ Elektrik Hesapla</a>
        </div>
      </div>'''

if old_blog_preview in html:
    html = html.replace(old_blog_preview, new_blog_preview)
    print("Updated blog preview section")

with open('public/index.html', 'w') as f:
    f.write(html)

print("index.html updated successfully")