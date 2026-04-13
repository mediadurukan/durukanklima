require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
const PDFDocument = require('pdfkit');
const axios = require('axios');
const redis = require('./redis');

const app = express();
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'ok',
    redisUrl: process.env.UPSTASH_REDIS_REST_URL ? 'SET' : 'NOT SET',
    redisToken: process.env.UPSTASH_REDIS_REST_TOKEN ? 'SET' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV
  });
});

const JWT_SECRET   = process.env.JWT_SECRET   || 'durukan-secret';
const ADMIN_USER   = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS   = process.env.ADMIN_PASSWORD || 'durukan2024';
const PORT         = process.env.PORT          || 3000;

// --- Helpers ---
async function getData(table) {
  const data = await redis.get(table);
  if (!data) return null;
  // Data may be string (JSON) or already-parsed object
  if (typeof data === 'string') {
    try { return JSON.parse(data); }
      catch { return null; }
  }
  return data;
}

async function setData(table, data) {
  await redis.set(table, data);
}

// read() and write() wrappers for backward compatibility with helper functions that call them
async function read(table) {
  return getData(table);
}

async function write(table, data) {
  return setData(table, data);
}

function deepMerge(target, source) {
  const r = { ...target };
  for (const k of Object.keys(source)) {
    if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k]))
      r[k] = deepMerge(target[k] || {}, source[k]);
    else r[k] = source[k];
  }
  return r;
}

// --- Sayfa görünürlük middleware ---
function checkPage(route) {
  return async (req, res, next) => {
    try {
      const s = await getData('settings');
      if (!s) return next();
      const pageConf = (s.pages || {})[route];
      if (pageConf && pageConf.enabled === false) {
        return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
      }
    } catch {}
    next();
  };
}

// --- Auth middleware ---
function auth(req, res, next) {
  const h = req.headers['authorization'];
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'Yetkisiz' });
  try { req.user = jwt.verify(h.slice(7), JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Geçersiz token' }); }
}

// --- Statik dosyalar ---
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ═══════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı' });
  }
});

app.get('/api/verify', auth, (req, res) => res.json({ valid: true, user: req.user.username }));

// ═══════════════════════════════════════════
// CONTENT
// ═══════════════════════════════════════════
app.get('/api/content', async (req, res) => {
  try {
    const lang = req.query.lang === 'en' ? 'en' : 'tr';
    const data = await getData('content') || {};
    // If bilingual content exists, extract the requested language
    if (lang === 'en' && data._bilingual) {
      const out = {};
      for (const [key, val] of Object.entries(data)) {
        if (key === '_bilingual') continue;
        if (val && typeof val === 'object' && !Array.isArray(val)) {
          out[key] = {};
          for (const [k, v] of Object.entries(val)) {
            if (v && typeof v === 'object' && 'tr' in v && 'en' in v) {
              out[key][k] = v[lang] ?? v.tr ?? v;
            } else {
              out[key][k] = v;
            }
          }
        } else {
          out[key] = val;
        }
      }
      return res.json(out);
    }
    res.json(data);
  }
  catch { res.status(500).json({ error: 'Okunamadı' }); }
});

app.put('/api/content', auth, async (req, res) => {
  try {
    const existing = (await getData('content')) || {};
    const updated = deepMerge(existing, req.body);
    await setData('content', updated);
    res.json({ success: true, data: updated });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/content/:section', auth, async (req, res) => {
  try {
    const data = (await getData('content')) || {};
    data[req.params.section] = req.body;
    await setData('content', data);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════
// GENERATE REVIEWS
// ═══════════════════════════════════════════
app.post('/api/generate-reviews', auth, async (req, res) => {
  try {
    const erkekIsimler = ['Ahmet','Mehmet','Mustafa','Ali','Hüseyin','İbrahim','Hasan','İsmail','Ömer','Yusuf','Murat','Emre','Burak','Serkan','Okan','Kemal','Erdal','Selman','Ramazan','Kadir','Halil','Orhan','Fatih','Tarık','Caner','Bora','Enes','Furkan','Kaan','Uğur','Volkan','Selim','Cenk','Taner','Alper','Doğan','Cem','Tolga','Barış','Sinan','Ferhat','Yasin','Onur','Gökhan','Ercan','Sedat','Levent','Arif','Suat','Tuncay'];
    const kadinIsimler = ['Fatma','Ayşe','Hatice','Zeynep','Emine','Şule','Elif','Merve','Seda','Gül','Melek','Derya','Esra','Özlem','Canan','Pınar','Tuğba','Sevgi','Neslihan','Büşra','Aslı','Gamze','Hülya','Nurcan','Reyhan','Sevinç','Tülay','Yasemin','Zeliha','Aysun','Bahar','Dilek','Filiz','Gülay','Hande','İlknur','Kübra','Leyla','Miray','Nihal'];
    const soyadHarfleri = 'ABCÇDEĞFGHIJKLMNOÖPRSŞTUÜVYZ'.split('');
    const hizmetler = ['Klima Bakımı','Klima Montajı','Klima Arızası','Klima Gaz Dolumu','Kombi Bakımı','Kombi Arızası','Kombi Montajı','Klima Temizliği','Klima Demontajı','Kombi Gaz Ayarı'];
    const klimaYorumlar = ['Klimam soğutmuyordu, aynı gün geldiler ve sorunu hızlıca çözdüler. Çok memnun kaldım.','Klima montajını çok profesyonelce yaptılar. Temiz ve düzgün iş çıkardılar.','Gaz dolumu için aradım, aynı gün geldiler. Fiyat da gayet uygundu.','Klimam sesler çıkarıyordu, ustalar geldi sorunu buldu ve halletti. Teşekkürler.','Yaz ortasında klimam bozuldu, acil geldiler. Çok şükür o gün çözdüler.','Klima bakımını düzenli yaptırıyorum, hep aynı kalite hizmet alıyorum.','Klima temizliğini çok özenle yaptılar. Ev tertemiz kaldı.','Klima kurulumu için aradım. Zamanında geldiler, işi sağlam yaptılar.','Klimadan su damlıyordu, ustalar bakı, drain hattını temizledi, sorun bitti.','Klima hiç soğutmuyordu, gaz dolumu yapıldı, şimdi buz gibi soğutuyor.','Çok hızlı ve güler yüzlü hizmet. Kesinlikle tavsiye ederim.','Klima arızasında hemen geldiler. Orijinal parça kullandılar, sorun kalmadı.','Fiyatları çok uygun ve işleri kaliteli. Memnun kaldım.','Klimam kaçırıyordu, kompresör değişti, şimdi sorunsuz çalışıyor.','Montaj çok hızlı bitti. İçeriye hiçbir iz bırakmadılar, helal olsun.'];
    const kombiYorumlar = ['Kombim arızalandı, kış ortasında mahsur kaldık. Aynı gün geldiler, ısındık.','Kombi bakımını her yıl yaptırıyorum, her seferinde aynı özen ve kalite.','Kombimden ses geliyordu, ustalar baktı, hava aldı. Temizledi, sorun bitti.','Kombi montajını çok hızlı ve temiz yaptılar. Takdir ettim doğrusu.','Kombimiz su kaybediyordu. Usta geldi sızdıran yeri buldu ve kapattı.','Kombi arızasında diğer servisler erteliyordu, burası aynı gün geldi.','Kombi bakımından sonra doğalgaz faturam %20 düştü. Süper!','Kombi gaz ayarı çok önemliymış, farkı hemen anladım. Teşekkürler.','Kış başında kombi bakımı yaptırdım, sezonu sorunsuz geçirdim.','Kombimiz ateşleme yapmıyordu. Arızayı buldu, parça değişti, sorun bitti.'];
    const rnd = arr => arr[Math.floor(Math.random() * arr.length)];
    const yorumlar = [];
    for (let i = 1; i <= 500; i++) {
      const erkekMi = Math.random() > 0.45;
      const isim = erkekMi ? rnd(erkekIsimler) : rnd(kadinIsimler);
      const soyad = rnd(soyadHarfleri) + '.';
      const hizmet = rnd(hizmetler);
      const text = hizmet.startsWith('Kombi') ? rnd(kombiYorumlar) : rnd(klimaYorumlar);
      yorumlar.push({ id: i, name: `${isim} ${soyad}`, rating: 5, text, service: hizmet });
    }
    const content = (await getData('content')) || {};
    content.testimonials = yorumlar;
    await setData('content', content);
    res.json({ success: true, testimonials: yorumlar });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════
app.get('/api/settings', async (req, res) => {
  try {
    const s = await getData('settings');
    if (!s) return res.json({});
    // Analytics ID'yi public'e aç ama smtp şifrelerini gizle
    const pub = { analytics: s.analytics, seo: s.seo, geo: s.geo, features: s.features, logo: s.logo, favicon: s.favicon };
    res.json(pub);
  } catch { res.status(500).json({ error: 'Okunamadı' }); }
});

app.get('/api/settings/all', auth, async (req, res) => {
  try { res.json(await getData('settings') || {}); }
  catch { res.status(500).json({ error: 'Okunamadı' }); }
});

app.put('/api/settings', auth, async (req, res) => {
  try {
    const existing = (await getData('settings')) || {};
    const updated = deepMerge(existing, req.body);
    await setData('settings', updated);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Logo upload - Redis'e base64 olarak kaydet
app.post('/api/upload/logo', auth, async (req, res) => {
  try {
    const settings = (await getData('settings')) || {};
    const { fileData } = req.body || {};
    if (!fileData) return res.status(400).json({ error: 'Dosya verisi yok' });
    
    // Base64 data'yı Redis'e kaydet (data URL olarak)
    settings.logo = fileData;
    await setData('settings', settings);
    res.json({ success: true, url: fileData });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Favicon upload - Redis'e base64 olarak kaydet
app.post('/api/upload/favicon', auth, async (req, res) => {
  try {
    const settings = (await getData('settings')) || {};
    const { fileData } = req.body || {};
    if (!fileData) return res.status(400).json({ error: 'Dosya verisi yok' });
    
    settings.favicon = fileData;
    await setData('settings', settings);
    res.json({ success: true, url: fileData });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════
// LEADS (Servis Talepleri)
// ═══════════════════════════════════════════
app.post('/api/leads', async (req, res) => {
  try {
    const leads = (await getData('leads')) || [];
    const trackCode = 'DK-' + Date.now().toString(36).toUpperCase().slice(-6);
    const lead = {
      id: Date.now(),
      ...req.body,
      trackCode,
      status: 'new',
      createdAt: new Date().toISOString(),
      notes: '',
      ip: req.ip,
    };
    if (!lead.name || !lead.phone) return res.status(400).json({ error: 'Ad ve telefon zorunlu' });
    leads.unshift(lead);
    await setData('leads', leads);

    // Hatırlatıcı ekle (6 ay sonra)
    try {
      const reminders = (await getData('reminders')) || [];
      const remDate = new Date(); remDate.setMonth(remDate.getMonth() + 6);
      reminders.push({
        id: Date.now() + 1,
        leadId: lead.id,
        name: lead.name,
        phone: lead.phone,
        service: lead.service || '',
        note: `${lead.service || 'Klima'} bakım hatırlatıcısı`,
        remindAt: remDate.toISOString().slice(0, 10),
        sent: false,
        createdAt: new Date().toISOString()
      });
      await setData('reminders', reminders);
    } catch {}

    // SMS gönder
    try { await sendSMS(lead); } catch {}

    res.json({ success: true, id: lead.id, trackCode });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/leads', auth, async (req, res) => {
  try {
    const leads = (await getData('leads')) || [];
    const { status, limit = 50, offset = 0 } = req.query;
    const filtered = status ? leads.filter(l => l.status === status) : leads;
    res.json({
      total: filtered.length,
      leads: filtered.slice(+offset, +offset + +limit),
      stats: {
        new: leads.filter(l => l.status === 'new').length,
        contacted: leads.filter(l => l.status === 'contacted').length,
        completed: leads.filter(l => l.status === 'completed').length,
        cancelled: leads.filter(l => l.status === 'cancelled').length,
        total: leads.length,
      }
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/leads/:id', auth, async (req, res) => {
  try {
    const leads = (await getData('leads')) || [];
    const idx = leads.findIndex(l => l.id === +req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Bulunamadı' });
    leads[idx] = { ...leads[idx], ...req.body, updatedAt: new Date().toISOString() };
    await setData('leads', leads);
    res.json({ success: true, lead: leads[idx] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/leads/:id', auth, async (req, res) => {
  try {
    const leads = (await getData('leads')) || [];
    await setData('leads', leads.filter(l => l.id !== +req.params.id));
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════
// BLOG
// ═══════════════════════════════════════════
app.get('/api/blog', async (req, res) => {
  try {
    const lang = req.query.lang === 'en' ? 'en' : 'tr';
    const posts = (await getData('blog')) || [];
    const { limit = 10, offset = 0, category, tag } = req.query;
    let filtered = posts.filter(p => p.published);
    if (category) filtered = filtered.filter(p => {
      const cat = typeof p.category === 'object' ? p.category[lang] || p.category.tr : p.category;
      return cat === category;
    });
    if (tag) filtered = filtered.filter(p => p.tags?.includes(tag));
    res.json({
      total: filtered.length,
      posts: filtered.slice(+offset, +offset + +limit).map(p => ({
        id: p.id, slug: p.slug,
        title: typeof p.title === 'object' ? (p.title[lang] || p.title.tr || '') : p.title,
        excerpt: typeof p.excerpt === 'object' ? (p.excerpt[lang] || p.excerpt.tr || '') : p.excerpt,
        category: typeof p.category === 'object' ? (p.category[lang] || p.category.tr || '') : p.category,
        tags: p.tags, publishedAt: p.publishedAt,
        author: p.author, image: p.image
      }))
    });
  } catch { res.status(500).json({ error: 'Okunamadı' }); }
});

app.get('/api/blog/all', auth, async (req, res) => {
  try { res.json(await getData('blog') || []); }
  catch { res.status(500).json({ error: 'Okunamadı' }); }
});

app.get('/api/blog/:slug', async (req, res) => {
  try {
    const lang = req.query.lang === 'en' ? 'en' : 'tr';
    const posts = (await getData('blog')) || [];
    const raw = posts.find(p => p.slug === req.params.slug && p.published);
    if (!raw) return res.status(404).json({ error: 'Yazı bulunamadı' });
    // Flatten TR/EN content fields
    const post = {
      ...raw,
      title: typeof raw.title === 'object' ? (raw.title[lang] || raw.title.tr || '') : raw.title,
      excerpt: typeof raw.excerpt === 'object' ? (raw.excerpt[lang] || raw.excerpt.tr || '') : raw.excerpt,
      content: typeof raw.content === 'object' ? (raw.content[lang] || raw.content.tr || '') : raw.content,
      category: typeof raw.category === 'object' ? (raw.category[lang] || raw.category.tr || '') : raw.category,
    };
    res.json(post);
  } catch { res.status(500).json({ error: 'Okunamadı' }); }
});

app.post('/api/blog', auth, async (req, res) => {
  try {
    const posts = (await getData('blog')) || [];
    const post = {
      id: Date.now(),
      slug: slugify(req.body.title || 'yeni-yazi'),
      ...req.body,
      published: req.body.published ?? false,
      publishedAt: req.body.published ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    };
    posts.unshift(post);
    await setData('blog', posts);
    res.json({ success: true, post });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/blog/:id', auth, async (req, res) => {
  try {
    const posts = (await getData('blog')) || [];
    const idx = posts.findIndex(p => p.id === +req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Bulunamadı' });
    const wasPublished = posts[idx].published;
    posts[idx] = {
      ...posts[idx], ...req.body,
      slug: req.body.title ? slugify(req.body.title) : posts[idx].slug,
      updatedAt: new Date().toISOString(),
      publishedAt: (!wasPublished && req.body.published) ? new Date().toISOString() : posts[idx].publishedAt,
    };
    await setData('blog', posts);
    res.json({ success: true, post: posts[idx] });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/blog/:id', auth, async (req, res) => {
  try {
    const posts = (await getData('blog')) || [];
    await setData('blog', posts.filter(p => p.id !== +req.params.id));
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════
// SERVİS TAKİP
// ═══════════════════════════════════════════
app.get('/api/track/:code', async (req, res) => {
  try {
    const leads = (await getData('leads')) || [];
    const lead = leads.find(l => l.trackCode === req.params.code.toUpperCase());
    if (!lead) return res.status(404).json({ error: 'Talep bulunamadı' });
    const statusMap = {
      'new':       { label: 'Talebiniz alındı',          icon: '📋', pct: 20 },
      'contacted': { label: 'Teknisyen yönlendirildi',   icon: '📞', pct: 50 },
      'scheduled': { label: 'Randevu oluşturuldu',       icon: '📅', pct: 65 },
      'enroute':   { label: 'Teknisyen yolda',           icon: '🚗', pct: 80 },
      'completed': { label: 'Servis tamamlandı',         icon: '✅', pct: 100 },
      'cancelled': { label: 'İptal edildi',              icon: '❌', pct: 0 },
    };
    const info = statusMap[lead.status] || statusMap['new'];
    res.json({
      trackCode: lead.trackCode,
      name: lead.name,
      service: lead.service || '',
      status: lead.status,
      statusLabel: info.label,
      statusIcon: info.icon,
      progress: info.pct,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt || lead.createdAt,
      technician: lead.technician || null,
      appointmentDate: lead.appointmentDate || null,
      notes: lead.publicNote || '',
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════
// TEKNİSYENLER
// ═══════════════════════════════════════════
app.get('/api/technicians', auth, async (req, res) => {
  try { res.json(await getData('technicians') || []); }
  catch { res.status(500).json({ error: 'Okunamadı' }); }
});

app.post('/api/technicians', auth, async (req, res) => {
  try {
    const list = (await getData('technicians')) || [];
    const item = { id: Date.now(), ...req.body, active: true };
    list.push(item);
    await setData('technicians', list);
    res.json({ success: true, item });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/technicians/:id', auth, async (req, res) => {
  try {
    const list = (await getData('technicians')) || [];
    const idx = list.findIndex(t => t.id === +req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Bulunamadı' });
    list[idx] = { ...list[idx], ...req.body };
    await setData('technicians', list);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/technicians/:id', auth, async (req, res) => {
  try {
    const list = (await getData('technicians')) || [];
    await setData('technicians', list.filter(t => t.id !== +req.params.id));
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════
// RANDEVULAR (TAKVİM)
// ═══════════════════════════════════════════
app.get('/api/appointments', auth, async (req, res) => {
  try {
    const { date, techId } = req.query;
    let list = (await getData('appointments')) || [];
    if (date) list = list.filter(a => a.date === date);
    if (techId) list = list.filter(a => a.technicianId === +techId);
    res.json(list);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/appointments', auth, async (req, res) => {
  try {
    const list = (await getData('appointments')) || [];
    const appt = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
    list.push(appt);
    await setData('appointments', list);
    // Lead'e randevu bilgisini ekle
    if (appt.leadId) {
      try {
        const leads = (await getData('leads')) || [];
        const idx = leads.findIndex(l => l.id === appt.leadId);
        if (idx !== -1) {
          leads[idx].status = 'scheduled';
          leads[idx].appointmentDate = appt.date + ' ' + appt.time;
          leads[idx].technician = appt.technicianName;
          leads[idx].updatedAt = new Date().toISOString();
          await setData('leads', leads);
        }
      } catch {}
    }
    res.json({ success: true, appt });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/appointments/:id', auth, async (req, res) => {
  try {
    const list = (await getData('appointments')) || [];
    const idx = list.findIndex(a => a.id === +req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Bulunamadı' });
    list[idx] = { ...list[idx], ...req.body };
    await setData('appointments', list);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/appointments/:id', auth, async (req, res) => {
  try {
    const list = (await getData('appointments')) || [];
    await setData('appointments', list.filter(a => a.id !== +req.params.id));
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════
// HATIRLATICLAR
// ═══════════════════════════════════════════
app.get('/api/reminders', auth, async (req, res) => {
  try {
    const list = (await getData('reminders')) || [];
    const today = new Date().toISOString().slice(0, 10);
    const { filter } = req.query;
    let result = list;
    if (filter === 'due') result = list.filter(r => !r.sent && r.remindAt <= today);
    else if (filter === 'upcoming') result = list.filter(r => !r.sent && r.remindAt > today);
    else if (filter === 'sent') result = list.filter(r => r.sent);
    res.json({ total: result.length, due: list.filter(r => !r.sent && r.remindAt <= today).length, reminders: result });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/reminders', auth, async (req, res) => {
  try {
    const list = (await getData('reminders')) || [];
    const item = { id: Date.now(), ...req.body, sent: false, createdAt: new Date().toISOString() };
    list.push(item);
    await setData('reminders', list);
    res.json({ success: true, item });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/reminders/:id', auth, async (req, res) => {
  try {
    const list = (await getData('reminders')) || [];
    const idx = list.findIndex(r => r.id === +req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Bulunamadı' });
    list[idx] = { ...list[idx], ...req.body };
    await setData('reminders', list);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/reminders/:id/send', auth, async (req, res) => {
  try {
    const list = (await getData('reminders')) || [];
    const idx = list.findIndex(r => r.id === +req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Bulunamadı' });
    const r = list[idx];
    const content = (await getData('content')) || {};
    const companyName = content.company?.name || 'Durukan Klima';
    const msg = `Sayın ${r.name}, ${r.service || 'klima'} bakım zamanınız geldi! ${companyName} olarak sizi bekliyoruz. Randevu: ${content.contact?.phone || ''}`;
    await sendSmsRaw(r.phone, msg);
    list[idx].sent = true;
    list[idx].sentAt = new Date().toISOString();
    await setData('reminders', list);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/reminders/:id', auth, async (req, res) => {
  try {
    const list = (await getData('reminders')) || [];
    await setData('reminders', list.filter(r => r.id !== +req.params.id));
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════
// PDF İŞ EMRİ
// ═══════════════════════════════════════════
app.get('/api/leads/:id/pdf', auth, async (req, res) => {
  try {
    const leads = (await getData('leads')) || [];
    const lead = leads.find(l => l.id === +req.params.id);
    if (!lead) return res.status(404).json({ error: 'Bulunamadı' });
    const content = (await getData('content')) || {};
    const company = content.company || {};
    const contact = content.contact || {};

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="is-emri-${lead.trackCode || lead.id}.pdf"`);
    doc.pipe(res);

    // Başlık
    doc.rect(0, 0, 612, 100).fill('#1a6fa8');
    doc.fillColor('white').fontSize(22).font('Helvetica-Bold').text(company.name || 'Durukan Klima', 50, 30);
    doc.fontSize(11).font('Helvetica').text(contact.phone || '', 50, 58);
    doc.text(contact.address || 'Adana', 50, 72);
    doc.fontSize(16).font('Helvetica-Bold').text('İŞ EMRİ', 450, 42, { align: 'right' });

    // Takip kodu
    doc.fillColor('#1a6fa8').fontSize(12).font('Helvetica-Bold')
       .text(`Takip Kodu: ${lead.trackCode || '-'}`, 380, 108, { align: 'right' });

    // Müşteri Bilgileri
    doc.fillColor('#1e293b').fontSize(13).font('Helvetica-Bold').text('MÜŞTERİ BİLGİLERİ', 50, 120);
    doc.moveTo(50, 136).lineTo(562, 136).strokeColor('#e2e8f0').stroke();

    const fields = [
      ['Ad Soyad', lead.name],
      ['Telefon', lead.phone],
      ['Adres', lead.address || '-'],
      ['Hizmet Türü', lead.service || '-'],
      ['Marka', lead.brand || '-'],
      ['Tarih', new Date(lead.createdAt).toLocaleDateString('tr-TR')],
      ['Teknisyen', lead.technician || '-'],
      ['Randevu', lead.appointmentDate || '-'],
    ];

    let y = 145;
    fields.forEach(([label, value]) => {
      doc.fillColor('#64748b').fontSize(10).font('Helvetica').text(label + ':', 50, y);
      doc.fillColor('#1e293b').fontSize(10).font('Helvetica-Bold').text(value || '-', 180, y);
      y += 22;
    });

    // Arıza Açıklaması
    y += 10;
    doc.fillColor('#1e293b').fontSize(13).font('Helvetica-Bold').text('ARIZA AÇIKLAMASI', 50, y);
    doc.moveTo(50, y + 16).lineTo(562, y + 16).strokeColor('#e2e8f0').stroke();
    y += 26;
    doc.fillColor('#334155').fontSize(10).font('Helvetica')
       .text(lead.message || 'Belirtilmedi', 50, y, { width: 512, lineGap: 4 });

    // Yapılan İşler (boş kutu)
    y += 80;
    doc.fillColor('#1e293b').fontSize(13).font('Helvetica-Bold').text('YAPILAN İŞLEMLER', 50, y);
    doc.moveTo(50, y + 16).lineTo(562, y + 16).strokeColor('#e2e8f0').stroke();
    y += 26;
    for (let i = 0; i < 5; i++) {
      doc.moveTo(50, y + i * 24).lineTo(562, y + i * 24).strokeColor('#e2e8f0').lineWidth(0.5).stroke();
    }

    // Notlar
    y += 140;
    doc.fillColor('#1e293b').fontSize(13).font('Helvetica-Bold').text('NOTLAR', 50, y);
    doc.moveTo(50, y + 16).lineTo(562, y + 16).strokeColor('#e2e8f0').stroke();
    y += 26;
    doc.fillColor('#334155').fontSize(10).font('Helvetica')
       .text(lead.notes || '-', 50, y, { width: 512 });

    // İmza alanı
    y += 80;
    doc.moveTo(50, y).lineTo(200, y).strokeColor('#334155').lineWidth(1).stroke();
    doc.moveTo(370, y).lineTo(562, y).strokeColor('#334155').lineWidth(1).stroke();
    doc.fillColor('#64748b').fontSize(9).text('Teknisyen İmzası', 50, y + 6);
    doc.text('Müşteri İmzası', 370, y + 6);

    // Footer
    doc.fillColor('#94a3b8').fontSize(8)
       .text(`${company.name || 'Durukan Klima'} — ${new Date().toLocaleDateString('tr-TR')} — ${lead.trackCode || ''}`, 50, 780, { align: 'center', width: 512 });

    doc.end();
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════
// SMS YARDIMCILARI
// ═══════════════════════════════════════════
async function sendSmsRaw(phone, message) {
  const s = (await getData('settings')) || {};
  const sms = s.sms || {};
  if (!sms.enabled || !sms.netgsmUser || !sms.netgsmPass) return;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '').replace(/^0/, '90');
  const url = `https://api.netgsm.com.tr/sms/send/get/?usercode=${sms.netgsmUser}&password=${sms.netgsmPass}&gsmno=${cleanPhone}&message=${encodeURIComponent(message)}&msgheader=${sms.netgsmHeader || 'DURUKAN'}`;
  await axios.get(url, { timeout: 8000 });
}

async function sendSMS(lead) {
  const s = (await getData('settings')) || {};
  const sms = s.sms || {};
  if (!sms.enabled) return;
  const content = (await getData('content')) || {};
  const company = content.company?.name || 'Durukan Klima';
  const phone = content.contact?.phone || '';
  if (sms.sendToCustomer) {
    const msg = `Sayın ${lead.name}, servis talebiniz alındı (${lead.trackCode}). Sizi en kısa sürede arayacağız. ${company} - ${phone}`;
    await sendSmsRaw(lead.phone, msg);
  }
  if (sms.sendToOwner && sms.ownerPhone) {
    const msg = `YENİ TALEP: ${lead.name} - ${lead.phone} - ${lead.service || '-'} - ${lead.address || '-'} (${lead.trackCode})`;
    await sendSmsRaw(sms.ownerPhone, msg);
  }
}

// ═══════════════════════════════════════════
// SITEMAP & ROBOTS (SEO)
// ═══════════════════════════════════════════
app.get('/sitemap.xml', async (req, res) => {
  try {
    const settings = (await getData('settings')) || {};
    const content = (await getData('content')) || {};
    const base = settings.seo?.canonicalUrl || `http://localhost:${PORT}`;
    const posts = (content.testimonials ? (await getData('blog')) || [] : []).filter(p => p.published);
    const blogPosts = (await getData('blog')) || [];
    const publishedPosts = blogPosts.filter(p => p.published);
    const pages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/blog', priority: '0.8', changefreq: 'daily' },
      { url: '/fiyatlar', priority: '0.9', changefreq: 'monthly' },
      { url: '/btu-hesaplama', priority: '0.8', changefreq: 'monthly' },
      { url: '/elektrik-tuketim', priority: '0.8', changefreq: 'monthly' },
      { url: '/cukurova-klima-servisi', priority: '0.9', changefreq: 'monthly' },
      { url: '/seyhan-klima-servisi', priority: '0.9', changefreq: 'monthly' },
      { url: '/saricam-klima-servisi', priority: '0.8', changefreq: 'monthly' },
      { url: '/yuregir-klima-servisi', priority: '0.8', changefreq: 'monthly' },
      { url: '/kozan-klima-servisi', priority: '0.7', changefreq: 'monthly' },
      { url: '/ceyhan-klima-servisi', priority: '0.7', changefreq: 'monthly' },
      { url: '/imamoglu-klima-servisi', priority: '0.7', changefreq: 'monthly' },
      { url: '/#hizmetler', priority: '0.8', changefreq: 'monthly' },
      { url: '/#iletisim', priority: '0.7', changefreq: 'monthly' },
    ];
    const blogUrls = publishedPosts.map(p => ({
      url: `/blog/${p.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: p.updatedAt?.slice(0, 10)
    }));
    const all = [...pages, ...blogUrls];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(p => `  <url>
    <loc>${base}${p.url}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    ${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;
    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  } catch { res.status(500).send('Sitemap oluşturulamadı'); }
});

app.get('/robots.txt', async (req, res) => {
  const settings = (await getData('settings')) || {};
  const base = settings.seo?.canonicalUrl || `http://localhost:${PORT}`;
  res.setHeader('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nSitemap: ${base}/sitemap.xml\n`);
});

// ═══════════════════════════════════════════
// TESTIMONIALS API
// ═══════════════════════════════════════════
app.get('/api/testimonials', async (req, res) => {
  try {
    const content = (await getData('content')) || {};
    const testimonials = content.testimonials || [];
    const { limit = 50, offset = 0, filter } = req.query;
    let result = testimonials;
    if (filter === 'klima') result = result.filter(t => t.service && !t.service.startsWith('Kombi'));
    if (filter === 'kombi') result = result.filter(t => t.service && t.service.startsWith('Kombi'));
    res.json({ total: result.length, testimonials: result.slice(+offset, +offset + +limit) });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ═══════════════════════════════════════════
// BTU & ELECTRICITY CALCULATOR PAGES
// ═══════════════════════════════════════════
app.get('/btu-hesaplama', checkPage('/btu-hesaplama'), (req, res) => res.sendFile(path.join(__dirname, 'public', 'blog', 'klima-btu-hesaplama.html')));
app.get('/elektrik-tuketim', checkPage('/elektrik-tuketim'), (req, res) => res.sendFile(path.join(__dirname, 'public', 'blog', 'klima-elektrik-tuketim-hesaplama.html')));


// ═══════════════════════════════════════════
// SAYFA YÖNLENDIRMELERI
// ═══════════════════════════════════════════
app.get('/', checkPage('/'), (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/blog', checkPage('/blog'), (req, res) => res.sendFile(path.join(__dirname, 'public', 'blog', 'index.html')));
app.get('/blog/:slug', checkPage('/blog'), (req, res) => res.sendFile(path.join(__dirname, 'public', 'blog', 'post.html')));
app.get('/fiyatlar', checkPage('/fiyatlar'), (req, res) => res.sendFile(path.join(__dirname, 'public', 'fiyatlar.html')));
app.get('/teklif', checkPage('/teklif'), (req, res) => res.sendFile(path.join(__dirname, 'public', 'teklif.html')));
app.get('/takip', checkPage('/takip'), (req, res) => res.sendFile(path.join(__dirname, 'public', 'takip.html')));
// İlçe bazlı sayfalar
const ilceler = ['cukurova','seyhan','saricam','yuregir','kozan','ceyhan','imamoglu'];
ilceler.forEach(ilce => {
  app.get(`/${ilce}-klima-servisi`, checkPage(`/${ilce}-klima-servisi`), (req, res) => res.sendFile(path.join(__dirname, 'public', 'ilce.html')));
});
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin', 'index.html')));
app.get('/admin/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'admin', 'dashboard.html')));

// ═══════════════════════════════════════════
// YARDIMCI
// ═══════════════════════════════════════════
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// Vercel serverless - export app directly
module.exports = app;

// Local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Durukan Klima sunucusu başlatıldı`);
    console.log(`🌐 Site:     http://localhost:${PORT}`);
  });
}
