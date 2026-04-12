const https = require('https');
const url = new URL('https://legible-panther-85373.upstash.io');
const token = 'gQAAAAAAAU19AAIncDI1NWU1MDI5NjVlZjA0OWExYjU0NTRlNTc4MjUwMjc4NnAyODUzNzM';

function cmd(...args) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(args);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'Content-Length': Buffer.byteLength(body) }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => { try { resolve(JSON.parse(data).result); } catch(e) { reject(e); } });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

const posts = [
 {
 "id": "1",
 "slug": "klima-bakiminin-onemi-nedir",
 "slugEn": "importance-of-ac-maintenance",
 "category": { "tr": "Bakım & Servis", "en": "Maintenance & Service" },
 "title": { "tr": "Klima Bakımının Önemi: Neden Her Yıl Yapılmalı?", "en": "Importance of AC Maintenance: Why Every Year?" },
 "excerpt": { "tr": "Düzenli klima bakımı sadece performansı artırmakla kalmaz, aynı zamanda sağlığınızı korur ve enerji tasarrufu sağlar.", "en": "Regular AC maintenance not only increases performance, but also protects your health and provides energy savings." },
 "content": { "tr": "## Neden Klima Bakımı Yaptırmalısınız?\n\nKlima bakımı, cihazınızın uzun ömürlü olması ve verimli çalışması için kritik bir öneme sahiptir. İşte düzenli bakımın temel faydaları:\n\n### 1. Enerji Tasarrufu\nKirli filtreler ve tıkanmış bobinler, klimanın havayı soğutmak için daha fazla çalışmasına neden olur. Bakımı yapılan bir klima, enerji faturanızda %15'e varan tasarruf sağlayabilir.\n\n### 2. Sağlıklı Hava Kalitesi\nKlimalar iç mekandaki havayı filtreler. Bakımsız klimalarda biriken toz, küf ve bakteriler solunum yolları hastalıklarına yol açabilir.\n\n### 3. Cihaz Ömrünü Uzatma\nKüçük sorunların erkenden tespiti, büyük ve maliyetli arızaları önler. Kompresör gibi ana parçaların ömrü düzenli bakımla iki katına çıkabilir.\n\n## Sonuç\n\nYılda en az bir kez profesyonel klima bakımı yaptırmak, konforunuz ve bütçeniz için en iyi yatırımdır.", "en": "## Why Should You Get AC Maintenance?\n\nAC maintenance is critical for your device to have a long life and work efficiently." },
 "coverImage": "/uploads/blog/klima-bakim-onemi.jpg",
 "metaTitle": { "tr": "Klima Bakımının Önemi: Sağlık ve Tasarruf | Durukan Klima", "en": "Importance of AC Maintenance: Health and Savings | Durukan Klima" },
 "metaDescription": { "tr": "Klima bakımı neden önemli? Enerji tasarrufu, hava kalitesi ve cihaz ömrü üzerindeki etkileri hakkında her şey.", "en": "Why is AC maintenance important? Everything about the effects on energy saving, air quality and device life." },
 "publishedAt": "2025-01-15",
 "readTime": { "tr": "6 dk", "en": "6 min" }
 },
 {
 "id": "2",
 "slug": "klima-montaji-nerede-yapilmali-yer-secimi",
 "slugEn": "where-to-install-ac-location-choice",
 "category": { "tr": "Montaj Rehberi", "en": "Installation Guide" },
 "title": { "tr": "Klima Montajında Yer Seçimi: En Verimli Konum Neresi?", "en": "Location Choice in AC Installation: Where is the Most Efficient Location?" },
 "excerpt": { "tr": "Klimanızı yanlış yere monte etmek verimi %30 düşürebilir. İdeal montaj yeri seçimi için dikkat etmeniz gereken ipuçları.", "en": "Installing your AC in the wrong place can reduce efficiency by 30%. Tips you should pay attention to for ideal installation location choice." },
 "content": { "tr": "## İdeal Klima Konumu Nasıl Belirlenir?\n\nKlima montajı yapılacak yerin seçimi, hem cihazın soğutma performansını hem de sizin konforunuzu doğrudan etkiler.\n\n1. Doğrudan Hava Akışı: Havayı doğrudan yatağınıza veya çalışma masanıza üfleyen konumlardan kaçının.\n2. Engelsiz Yol: Önünde perde, mobilya veya kiriş bulunan yerler hava sirkülasyonunu bozar.\n3. Yükseklik: Soğuk hava çöktüğü için klima yerden yaklaşık 2.1-2.4 metre yükseklikte olmalıdır.\n\n## Sonuç\n\nDoğru konumlandırma, klimanızın daha az enerji harcayarak daha hızlı soğutmasını sağlar.", "en": "## How to Determine the Ideal AC Location?\n\nThe choice of location for AC installation directly affects both the cooling performance of the device and your comfort." },
 "coverImage": "/uploads/blog/klima-montaj-yeri.jpg",
 "metaTitle": { "tr": "Klima Montajında Yer Seçimi ve Verimlilik | Durukan Klima", "en": "AC Installation Location and Efficiency | Durukan Klima" },
 "metaDescription": { "tr": "Klima nereye takılmalı? En iyi soğutma performansı için iç ve dış ünite yerleşim rehberi.", "en": "Where should AC be installed? Interior and exterior unit placement guide for the best cooling performance." },
 "publishedAt": "2025-01-28",
 "readTime": { "tr": "5 dk", "en": "5 min" }
 }
];

// Convert to durukanklima format (Turkish only for now)
const converted = posts.map(p => ({
  id: parseInt(p.id),
  slug: p.slug,
  title: p.title.tr,
  excerpt: p.excerpt.tr,
  content: p.content.tr,
  category: p.category.tr,
  tags: ['klima', 'adana', p.category.tr.toLowerCase().replace(/ & /g, '-')],
  published: true,
  publishedAt: p.publishedAt,
  author: 'Durukan Klima',
  image: p.coverImage,
  seo: {
    metaTitle: p.metaTitle.tr,
    metaDescription: p.metaDescription.tr,
    keywords: 'adana klima servisi, çukurova klima, ' + p.category.tr.toLowerCase()
  }
}));

cmd('SET', 'blog', JSON.stringify(converted)).then(r => console.log('Blog seeded:', r)).catch(e => console.error('Error:', e));
