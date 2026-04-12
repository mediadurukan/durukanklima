// Durukan Klima — Ana Site JS
// İçerik API'den çekilir, Schema.org ve Analytics dinamik yüklenir

// ── Language Support ──────────────────────────────────────
let currentLang = localStorage.getItem('dl_lang') || 'tr';

function getLang() { return currentLang; }

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('dl_lang', lang);
  loadContent();
  updateLangToggleUI();
}

function updateLangToggleUI() {
  document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}

function createLangToggle() {
  return '<div class="lang-toggle" style="display:inline-flex;align-items:center;gap:2px;background:#f0f0f0;border-radius:20px;padding:2px;margin-left:8px;">' +
    '<button class="lang-toggle-btn" data-lang="tr" onclick="setLang(\'tr\')" style="border:none;background:transparent;cursor:pointer;padding:4px 10px;border-radius:18px;font-size:12px;font-weight:600;' +
    (currentLang === 'tr' ? 'background:#1a6fa8;color:white;' : 'color:#555;') + '">TR</button>' +
    '<button class="lang-toggle-btn" data-lang="en" onclick="setLang(\'en\')" style="border:none;background:transparent;cursor:pointer;padding:4px 10px;border-radius:18px;font-size:12px;font-weight:600;' +
    (currentLang === 'en' ? 'background:#1a6fa8;color:white;' : 'color:#555;') + '">EN</button>' +
    '</div>';
}

async function loadContent() {
  const langParam = currentLang === 'en' ? '?lang=en' : '';
  const [contentRes, settingsRes, blogRes] = await Promise.allSettled([
    fetch('/api/content' + langParam).then(r => r.json()),
    fetch('/api/settings').then(r => r.json()),
    fetch('/api/blog?limit=3').then(r => r.json()),
  ]);

  if (contentRes.status === 'fulfilled') applyContent(contentRes.value);
  if (settingsRes.status === 'fulfilled') applySettings(settingsRes.value);
  if (blogRes.status === 'fulfilled')    renderBlogPreview(blogRes.value.posts || []);
}

// ── İçerik ──────────────────────────────────────
function applyContent(d) {
  const c = d.company || {};
  const contact = d.contact || {};
  const hero = d.hero || {};

  // Meta & başlık
  setText('nav-company-name', c.name);
  setText('footer-company-name', c.name);
  setText('footer-slogan', c.description || c.slogan);
  setText('footer-copyright', `© ${new Date().getFullYear()} ${c.name}. Tüm hakları saklıdır.`);

  // Hero
  setText('hero-title', hero.title);
  setText('hero-subtitle', hero.subtitle);

  const statsEl = document.getElementById('hero-stats');
  if (statsEl && hero.stats) {
    statsEl.innerHTML = hero.stats.map(s =>
      `<div class="stat-item">
        <span class="stat-value">${s.value}</span>
        <span class="stat-label">${s.label}</span>
      </div>`).join('');
  }

  // Linkler
  const tel = `tel:${contact.phone?.replace(/\s/g, '')}`;
  const wpBase = `https://wa.me/${contact.whatsapp}`;
  const wpMsg = encodeURIComponent('Merhaba, Durukan Klima hizmetleri hakkında bilgi almak istiyorum.');
  const wp = `${wpBase}?text=${wpMsg}`;

  ['nav-call-btn','nav-call-btn-mobile','hero-call-btn','contact-call-btn','float-phone'].forEach(id => setHref(id, tel));
  ['hero-wp-btn','hours-wp-btn','contact-wp-btn','contact-wp-link','float-wp','footer-wp'].forEach(id => setHref(id, wp));

  // Çalışma saatleri canlı badge
  updateBusinessStatus(contact.hours);

  setText('nav-phone', contact.phone);
  setText('nav-phone-mobile', contact.phone);
  setText('contact-phone-link', contact.phone);
  setHref('contact-phone-link', tel);
  setHref('footer-phone', tel);
  setText('footer-phone', contact.phone);
  setText('contact-address', contact.address);
  setText('footer-address', contact.address);

  if (contact.hours) {
    setText('h-weekday', contact.hours.weekdays);
    setText('h-saturday', contact.hours.saturday);
    setText('h-sunday', contact.hours.sunday);
    setText('h-emergency', contact.hours.emergency);
    setText('contact-weekdays', contact.hours.weekdays);
  }

  if (contact.mapUrl) {
    const mapEl = document.getElementById('contact-map');
    if (mapEl) mapEl.innerHTML = `<iframe src="${contact.mapUrl}" allowfullscreen loading="lazy" style="width:100%;height:100%;border:none;border-radius:14px;"></iframe>`;
  }

  // Schema.org telefon güncelle
  updateSchema(contact, c);

  // Hizmetler
  const svcEl = document.getElementById('services-grid');
  if (svcEl && d.services) {
    svcEl.innerHTML = d.services.map(s =>
      `<div class="service-card" itemscope itemtype="https://schema.org/Service">
        <div class="service-icon">${s.icon}</div>
        <h3 itemprop="name">${s.title}</h3>
        <p itemprop="description">${s.description}</p>
        ${s.details ? `<ul class="service-details">${s.details.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}
      </div>`).join('');
  }

  // Footer hizmetler
  const fsvcEl = document.getElementById('footer-services');
  if (fsvcEl && d.services) {
    fsvcEl.innerHTML = d.services.map(s => `<li><a href="#hizmetler">${s.title}</a></li>`).join('');
  }

  // Markalar
  const brandEl = document.getElementById('brands-grid');
  if (brandEl && d.brands) {
    brandEl.innerHTML = d.brands.map(b => {
      const brand = typeof b === 'object' ? b : { name: b, logo: '', url: '' };
      const abbr = brand.name.slice(0, 2).toUpperCase();
      if (brand.logo) {
        return `<div class="brand-card">
          <img class="brand-logo"
               src="${brand.logo}"
               alt="${brand.name} logosu"
               loading="lazy"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
          <div class="brand-logo-fallback" style="display:none;">${abbr}</div>
          <span class="brand-name">${brand.name}</span>
        </div>`;
      } else {
        return `<div class="brand-card">
          <div class="brand-logo-fallback">${abbr}</div>
          <span class="brand-name">${brand.name}</span>
        </div>`;
      }
    }).join('');
  }

  // Neden biz
  const whyEl = document.getElementById('why-grid');
  if (whyEl && d.whyUs) {
    whyEl.innerHTML = d.whyUs.map(w =>
      `<div class="why-card">
        <div class="why-icon">${w.icon}</div>
        <h3>${w.title}</h3>
        <p>${w.description}</p>
      </div>`).join('');
  }

  // Hizmet bölgesi
  if (d.serviceArea) {
    setText('area-center-text', `${d.serviceArea.center} ve çevre ilçelere hizmet veriyoruz.`);
    const list = d.serviceArea.districts || d.serviceArea.villages || [];
    // villages-grid artık district-card içinde yok; sadece fallback için bırakıyoruz
    const vEl = document.getElementById('villages-grid');
    if (vEl) {
      vEl.style.display = 'none'; // district kartlar statik HTML'de
    }
    const daysEl = document.getElementById('village-days-text');
    if (daysEl) daysEl.textContent = `🚗 Tüm Adana ilçelerine aynı gün servis verilmektedir.`;
  }

  // Populate village tags if element exists
  const vTagsEl = document.getElementById('village-tags');
  if (vTagsEl && d.serviceAreas?.length) {
    vTagsEl.innerHTML = d.serviceAreas.map(v =>
      '<span class="village-tag">📍 ' + v + '</span>'
    ).join('');
  }
  // Update village service hours
  if (d.workingHours) {
    if (d.workingHours.village && d.workingHours.village[0]) {
      const v1 = d.workingHours.village[0];
      const v1d = document.getElementById('h-village-day1');
      const v1t = document.getElementById('h-village-time1');
      if (v1d) v1d.textContent = v1.days || 'Salı';
      if (v1t) v1t.textContent = v1.hours || '09:00 – 17:00';
    }
    if (d.workingHours.village && d.workingHours.village[1]) {
      const v2 = d.workingHours.village[1];
      const v2d = document.getElementById('h-village-day2');
      const v2t = document.getElementById('h-village-time2');
      if (v2d) v2d.textContent = v2.days || 'Cuma';
      if (v2t) v2t.textContent = v2.hours || '09:00 – 17:00';
    }
  }


  // Yorumlar — sayfalama sistemi
  if (d.testimonials?.length) {
    initReviews(d.testimonials);
  }

  // SSS
  const faqEl = document.getElementById('faq-list');
  if (faqEl && d.faq) {
    faqEl.innerHTML = d.faq.map((f, i) =>
      `<div class="faq-item" id="faq-${i}">
        <button class="faq-question" onclick="toggleFaq(${i})">
          ${f.question}
          <span class="faq-arrow">▼</span>
        </button>
        <div class="faq-answer">${f.answer}</div>
      </div>`).join('');
  }
}

// ── Ayarlar & Analytics ──────────────────────────
function applySettings(s) {
  // SEO meta güncelle
  if (s.seo) {
    setMeta('description', s.seo.siteDescription);
    setMeta('keywords', s.seo.keywords);
    document.title = s.seo.siteTitle || document.title;
    setOG('og:title', s.seo.siteTitle);
    setOG('og:description', s.seo.siteDescription);
    if (s.seo.canonicalUrl) {
      const can = document.getElementById('canonical');
      if (can) can.href = s.seo.canonicalUrl;
    }
  }

  // GEO meta
  if (s.geo) {
    setMetaN('geo.placename', `${s.geo.city}, ${s.geo.region}`);
    setMetaN('geo.position', `${s.geo.latitude};${s.geo.longitude}`);
    setMetaN('ICBM', `${s.geo.latitude}, ${s.geo.longitude}`);
  }

  // Google Analytics
  if (s.analytics?.googleAnalyticsId) {
    const id = s.analytics.googleAnalyticsId;
    const ga = document.createElement('script');
    ga.async = true;
    ga.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(ga);
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', id);
    window.gtag = gtag;
  }

  // GTM
  if (s.analytics?.googleTagManagerId) {
    const gtmId = s.analytics.googleTagManagerId;
    const ns = document.createElement('script');
    ns.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`;
    document.head.appendChild(ns);
  }

  // Özellik görünürlükleri
  if (s.features) {
    const f = s.features;
    const hide = id => { const e = document.getElementById(id); if (e) e.style.display = 'none'; };
    if (f.floatingPhone?.enabled === false)    hide('float-phone');
    if (f.floatingWhatsapp?.enabled === false) hide('float-wp');
    if (f.navPhone?.enabled === false)         hide('nav-call-btn');
    if (f.heroCallBtn?.enabled === false)      hide('hero-call-btn');
    if (f.whatsappButtons?.enabled === false) {
      ['hero-wp-btn','hours-wp-btn','contact-wp-btn','contact-wp-link','footer-wp'].forEach(hide);
    }
  }
}

// ── Schema.org güncelle ─────────────────────────
function updateSchema(contact, company) {
  const el = document.getElementById('schema-local');
  if (!el) return;
  try {
    const s = JSON.parse(el.textContent);
    if (contact.phone) s.telephone = '+90-' + contact.phone.replace(/^0/, '').replace(/\s/g, '-');
    if (company.name) s.name = company.name;
    if (company.description) s.description = company.description;
    el.textContent = JSON.stringify(s, null, 2);
  } catch {}
}

// ── Blog Önizleme ───────────────────────────────
function renderBlogPreview(posts) {
  const el = document.getElementById('blog-preview-grid');
  if (!el || !posts.length) {
    const section = document.getElementById('blog-preview');
    if (section) section.style.display = 'none';
    return;
  }
  el.innerHTML = posts.map(p => `
    <a href="/blog/${p.slug}" class="blog-card" style="text-decoration:none;">
      <div class="blog-card-img">${getCategoryIcon(p.category)}</div>
      <div class="blog-card-body">
        <span class="blog-category">${p.category || 'Blog'}</span>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
        <div class="blog-card-footer">
          <span>${formatDate(p.publishedAt)}</span>
          <span class="blog-read-more">Okumaya devam et →</span>
        </div>
      </div>
    </a>`).join('');
}

// ── Form gönder ─────────────────────────────────
async function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit-btn');
  const result = document.getElementById('form-result');
  btn.disabled = true;
  btn.textContent = '⏳ Gönderiliyor...';
  result.className = 'form-result';

  const data = {
    name:    document.getElementById('f-name').value,
    phone:   document.getElementById('f-phone').value,
    service: document.getElementById('f-service').value,
    brand:   document.getElementById('f-brand').value,
    address: document.getElementById('f-address').value,
    message: document.getElementById('f-message').value,
    source:  'web-form',
  };

  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) {
      result.innerHTML = `✅ Talebiniz alındı! En kısa sürede sizi arayacağız.<br><small>Takip kodunuz: <strong>${json.trackCode}</strong> — <a href="/takip?kod=${json.trackCode}" style="color:var(--primary)">Talebinizi takip edin →</a></small>`;
      result.className = 'form-result success';
      e.target.reset();
      if (window.gtag) gtag('event', 'lead_form_submit', { service: data.service });
    } else {
      throw new Error(json.error);
    }
  } catch (err) {
    result.textContent = '❌ Bir sorun oluştu. Lütfen telefon ile arayın.';
    result.className = 'form-result error';
  } finally {
    btn.disabled = false;
    btn.textContent = '📋 Servis Talebi Gönder';
  }
}

// ── Yardımcılar ─────────────────────────────────
function setText(id, t) { const e = document.getElementById(id); if (e && t !== undefined) e.textContent = t; }
function setHref(id, h) { const e = document.getElementById(id); if (e && h) e.href = h; }
function setMeta(name, c) { const e = document.querySelector(`meta[name="${name}"]`); if (e && c) e.content = c; }
function setMetaN(name, c) { const e = document.querySelector(`meta[name="${name}"]`); if (e) e.content = c; }
function setOG(prop, c) { const e = document.querySelector(`meta[property="${prop}"]`); if (e && c) e.content = c; }

function toggleFaq(i) {
  const item = document.getElementById(`faq-${i}`);
  if (!item) return;
  const open = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('open'));
  if (!open) item.classList.add('open');
}

function toggleMenu() {
  document.getElementById('nav-links').classList.toggle('open');
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getCategoryIcon(cat) {
  const map = { 'Klima Bakımı': '❄️', 'Beyaz Eşya': '🫧', 'Enerji': '⚡', 'İpuçları': '💡' };
  return map[cat] || '📝';
}

// ── Yorumlar Sayfalama ──────────────────────────
const REVIEWS_PER_PAGE = 8;
let allReviews = [], filteredReviews = [], currentPage = 1, activeFilter = 'tümü';

function initReviews(reviews) {
  allReviews = reviews;
  filteredReviews = reviews;
  renderReviews();
}

function filterReviews(filter, btn) {
  activeFilter = filter;
  document.querySelectorAll('.review-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filteredReviews = filter === 'tümü'
    ? allReviews
    : allReviews.filter(r => r.service?.includes(filter));
  currentPage = 1;
  renderReviews();
}

function renderReviews() {
  const grid = document.getElementById('testimonials-grid');
  const pag  = document.getElementById('reviews-pagination');
  const sum  = document.getElementById('reviews-summary');
  if (!grid) return;

  const total = filteredReviews.length;
  const totalPages = Math.ceil(total / REVIEWS_PER_PAGE);
  const start = (currentPage - 1) * REVIEWS_PER_PAGE;
  const slice = filteredReviews.slice(start, start + REVIEWS_PER_PAGE);

  // Yorumlar
  grid.innerHTML = slice.map(t =>
    `<div class="testimonial-card" itemscope itemtype="https://schema.org/Review">
      <div class="stars">${'⭐'.repeat(t.rating)}</div>
      <p itemprop="reviewBody">"${t.text}"</p>
      <div class="testimonial-footer">
        <span class="testimonial-name" itemprop="author">${t.name}</span>
        <span class="testimonial-service">${t.service}</span>
      </div>
    </div>`).join('');

  // Özet
  if (sum) sum.textContent = `${total} yorumdan ${start + 1}–${Math.min(start + REVIEWS_PER_PAGE, total)} arası gösteriliyor`;

  // Sayfalama
  if (!pag) return;
  pag.innerHTML = '';

  // Geri butonu
  const prev = makePageBtn('‹', currentPage === 1, () => goPage(currentPage - 1));
  pag.appendChild(prev);

  // Sayfa numaraları (akıllı kısaltma)
  const pages = smartPages(currentPage, totalPages);
  pages.forEach(p => {
    if (p === '...') {
      const dots = document.createElement('span');
      dots.textContent = '…';
      dots.style.cssText = 'padding:0 4px;color:#94a3b8;font-size:0.9rem;';
      pag.appendChild(dots);
    } else {
      const btn = makePageBtn(p, false, () => goPage(p));
      if (p === currentPage) btn.classList.add('active');
      pag.appendChild(btn);
    }
  });

  // İleri butonu
  const next = makePageBtn('›', currentPage === totalPages, () => goPage(currentPage + 1));
  pag.appendChild(next);
}

function goPage(p) {
  currentPage = p;
  renderReviews();
  document.getElementById('yorumlar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function makePageBtn(label, disabled, onClick) {
  const btn = document.createElement('button');
  btn.className = 'page-btn';
  btn.textContent = label;
  btn.disabled = disabled;
  if (!disabled) btn.addEventListener('click', onClick);
  return btn;
}

function smartPages(cur, total) {
  if (total <= 7) return Array.from({length: total}, (_, i) => i + 1);
  const pages = new Set([1, total, cur]);
  if (cur > 1) pages.add(cur - 1);
  if (cur < total) pages.add(cur + 1);
  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) result.push('...');
    result.push(p);
    prev = p;
  }
  return result;
}

// ── Canlı İşletme Durumu Badge ──────────────────
function updateBusinessStatus(hours) {
  const badge = document.getElementById('business-status-badge');
  if (!badge) return;

  const now = new Date();
  const day = now.getDay(); // 0=Pazar, 6=Cumartesi
  const h = now.getHours();
  const m = now.getMinutes();
  const time = h * 60 + m;

  function parseTime(str) {
    if (!str) return null;
    const parts = str.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1] || 0);
  }

  let isOpen = false;
  if (day >= 1 && day <= 5) {
    // Hafta içi
    const [openStr, closeStr] = (hours?.weekdays || '08:00 - 19:00').split(' - ');
    const open = parseTime(openStr?.trim());
    const close = parseTime(closeStr?.trim());
    if (open !== null && close !== null) isOpen = time >= open && time < close;
  } else if (day === 6) {
    // Cumartesi
    const [openStr, closeStr] = (hours?.saturday || '08:00 - 17:00').split(' - ');
    const open = parseTime(openStr?.trim());
    const close = parseTime(closeStr?.trim());
    if (open !== null && close !== null) isOpen = time >= open && time < close;
  }
  // Pazar kapalı

  badge.textContent = isOpen ? '● Açık' : '● Kapalı';
  badge.style.cssText = `
    display:inline-flex;align-items:center;gap:4px;
    padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600;
    background:${isOpen ? '#dcfce7' : '#fee2e2'};
    color:${isOpen ? '#16a34a' : '#dc2626'};
  `;
}

// ── Hero Hızlı Form ─────────────────────────────
let hqfService = '', hqfDist = '';

function hqfSelect(service) {
  hqfService = service;
  document.querySelectorAll('#hqf-step-1 .hqf-opt').forEach(b => b.classList.remove('selected'));
  event.target.classList.add('selected');
  setTimeout(() => {
    document.getElementById('hqf-step-1').classList.remove('active');
    document.getElementById('hqf-step-2').classList.add('active');
    document.querySelectorAll('#hqf-progress .hqf-dot')[0].classList.add('done');
    document.querySelectorAll('#hqf-progress .hqf-dot')[1].classList.add('active');
  }, 300);
}

function hqfDistrict(dist) {
  hqfDist = dist;
  document.querySelectorAll('#hqf-step-2 .hqf-opt').forEach(b => b.classList.remove('selected'));
  event.target.classList.add('selected');
  setTimeout(() => {
    document.getElementById('hqf-step-2').classList.remove('active');
    document.getElementById('hqf-step-3').classList.add('active');
    document.querySelectorAll('#hqf-progress .hqf-dot')[1].classList.add('done');
    document.querySelectorAll('#hqf-progress .hqf-dot')[2].classList.add('active');
  }, 300);
}

async function hqfSubmit() {
  const phone = document.getElementById('hqf-phone').value.trim();
  if (!phone || phone.length < 10) {
    document.getElementById('hqf-phone').style.borderColor = '#ef4444';
    return;
  }
  try {
    await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Hızlı Form', phone, service: hqfService, address: hqfDist, source: 'hero-quick-form' })
    });
  } catch {}
  document.getElementById('hqf-step-3').classList.remove('active');
  document.getElementById('hqf-step-4').classList.add('active');
  document.getElementById('hqf-progress').style.display = 'none';
  if (window.gtag) gtag('event', 'quick_form_submit', { service: hqfService, district: hqfDist });
}

// ── Başlat ──────────────────────────────────────

// ── Animated Counters ───────────────────────
function animateCounters() {
  const counters = document.querySelectorAll('.counter-number');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target) || 0;
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current.toLocaleString('tr-TR') + suffix;
      }, 25);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ── Toggle Village List ─────────────────────
function toggleVillageList() {
  const container = document.getElementById('village-list-container');
  const btn = document.getElementById('toggle-village-btn');
  if (!container) return;
  const isVisible = container.style.display !== 'none';
  container.style.display = isVisible ? 'none' : 'block';
  if (btn) btn.textContent = isVisible ? 'Tüm bölgeleri gör →' : 'Bölgeleri gizle ←';
}

document.addEventListener('DOMContentLoaded', () => {
  // Language toggle init - desktop
  const langContainer = document.getElementById('lang-toggle-container');
  if (langContainer) langContainer.innerHTML = createLangToggle();
  
  // Language toggle init - mobile
  const langContainerMobile = document.getElementById('lang-toggle-container-mobile');
  if (langContainerMobile) langContainerMobile.innerHTML = createLangToggle();
  
  updateLangToggleUI();
  
  loadContent();
  animateCounters();
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.getElementById('nav-links')?.classList.remove('open');
      }
    });
  });
});

// ── Mobile Menu Toggle ──────────────────────
function toggleMenu() {
  const nav = document.getElementById('nav-links');
  const hamburger = document.getElementById('hamburger');
  if (!nav) return;
  nav.classList.toggle('open');
  if (hamburger) hamburger.classList.toggle('active');
}
