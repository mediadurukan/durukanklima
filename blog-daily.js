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

async function addBlog() {
  const newBlog = {
    "id": "22",
    "slug": "adana-yaz-sicaginda-klima-kullanimi",
    "slugEn": "ac-usage-in-adana-summer-heat",
    "category": { "tr": "Enerji Tasarrufu", "en": "Energy Saving" },
    "title": { 
      "tr": "Adana Yaz Sıcağında Klima Kullanımı: Serin Kalırken Fatura Kontrolü", 
      "en": "AC Usage in Adana Summer Heat: Stay Cool While Controlling Bills"
    },
    "excerpt": {
      "tr": "Adana'da yaz aylarında klima kullanırken hem serin kalmak hem de enerji tasarrufu yapmak mümkün. İşte uzmanından ipuçları.",
      "en": "It's possible to stay cool and save energy while using AC during summer months in Adana. Tips from experts."
    },
    "content": {
      "tr": "## Adana'da Yaz Ayları: Klima Kaçınılmaz Oldu\n\nAdana'da yaz ayları oldukça sıcak geçiyor. Haziran ile Eylül arasında hava sıcaklığı gölgede bile 35-40 dereceye kadar çıkabiliyor. Bu durum klima kullanımını zorunlu kılıyor.\n\n## Doğru Klima Kullanımı ile Tasarruf Etmenin Yolları\n\n### 1. Doğru Sıcaklık Ayarı Yapın\nKlimayı 24-26°C arasında tutmak idealdir. Her 1°C daha düşük ayar, yaklaşık %7 daha fazla enerji tüketimi demektir. Adana'nın sıcaklarında bile 24-25°C yeterli konfor sağlar.\n\n### 2. Zamanlayıcı Kullanın\nGece uyurken veya evde yokken klimayı sürekli açık bırakmayın. Zamanlayıcı ile belirli saatlerde çalışacak şekilde ayarlayın.\n\n### 3. Evi Önceden Soğutun\nKlimayı günün en sıcak saatlerinde (12:00-16:00) yoğun kullanmak yerine, sabah erken saatlerde çalıştırıp evi serin tutmak daha verimlidir.\n\n### 4. Kapı ve Pencereleri Kontrol Edin\nKlima çalışırken pencerelerin ve kapıların kapalı olduğundan emin olun. Ayrıca güneşlik kullanmak binanın ısınmasını azaltır.\n\n### 5. Düzenli Bakım Yaptırın\nTozlu ve kirli filtreler klimanın verimini düşürür. Yılda en az iki kez filtre temizliği ve bakım yaptırın.\n\n## Adana İçin Özel İpuçları\n\nAdana'nın nemli ikliminde 'hissedilen sıcaklık' gerçek sıcaklıktan daha yüksek olabilir. Bu nedenle nem kontrolü de önemlidir. Klimanızın nem alma modunu kullanmak daha konforlu bir ortam sağlayabilir.\n\n## Sonuç\n\nDoğru klima kullanımı ile hem serin kalabilir hem de elektrik faturanızı kontrol altında tutabilirsiniz. Unutmayın: En verimli klima, düzenli bakımı yapılmış olan klimalardır.",
      "en": "## Summer in Adana: AC Became Unavoidable\n\nSummer months in Adana are quite hot. Between June and September, air temperature can reach 35-40°C even in the shade. This makes AC usage mandatory.\n\n## Ways to Save While Staying Cool\n\n### 1. Set the Right Temperature\nKeeping AC between 24-26°C is ideal. Every 1°C lower setting means approximately 7% more energy consumption. Even in Adana's heat, 24-25°C provides enough comfort.\n\n### 2. Use the Timer\nDon't leave the AC running continuously when sleeping or away from home. Set it to run at specific hours using a timer.\n\n### 3. Pre-Cool Your Home\nInstead of using AC heavily during the hottest hours (12:00-16:00), running it early in the morning to keep the house cool is more efficient.\n\n### 4. Check Doors and Windows\nMake sure windows and doors are closed while AC is running. Also, using shades reduces building heating.\n\n### 5. Regular Maintenance\nDusty and dirty filters reduce AC efficiency. Have filters cleaned and maintained at least twice a year.\n\n## Special Tips for Adana\n\nDue to Adana's humid climate, 'feels like temperature' can be higher than actual temperature. Therefore, humidity control is also important. Using your AC's dehumidify mode can provide a more comfortable environment.\n\n## Conclusion\n\nWith correct AC usage, you can stay cool and keep your electricity bill under control. Remember: The most efficient AC is the one that receives regular maintenance."
    },
    "coverImage": "/uploads/blog/adana-yaz-klima.jpg",
    "metaTitle": {
      "tr": "Adana Yaz Sıcağında Klima Kullanımı | Durukan Klima",
      "en": "AC Usage in Adana Summer Heat | Durukan Klima"
    },
    "metaDescription": {
      "tr": "Adana'da yaz aylarında klima kullanırken enerji tasarrufu ipuçları.",
      "en": "Energy saving tips while using AC in Adana summer months."
    },
    "publishedAt": "2026-04-12",
    "readTime": { "tr": "6 dk", "en": "6 min" }
  };

  // Get existing blogs and add new one
  const existing = await cmd('GET', 'blog');
  const blogs = existing ? JSON.parse(existing) : [];
  
  // Check if this blog already exists
  const exists = blogs.find(b => b.slug === newBlog.slug);
  if (exists) {
    console.log('Blog already exists:', newBlog.slug);
    return;
  }
  
  // Add new blog with converted format for Redis (Turkish only for now)
  const converted = {
    id: parseInt(newBlog.id),
    slug: newBlog.slug,
    title: newBlog.title.tr,
    excerpt: newBlog.excerpt.tr,
    content: newBlog.content.tr,
    category: newBlog.category.tr,
    tags: ['klima', 'adana', 'enerji-tasarrufu'],
    published: true,
    publishedAt: newBlog.publishedAt,
    author: 'Durukan Klima',
    image: newBlog.coverImage,
    seo: {
      metaTitle: newBlog.metaTitle.tr,
      metaDescription: newBlog.metaDescription.tr,
      keywords: 'adana klima servisi, çukurova klima, enerji tasarrufu'
    }
  };
  
  blogs.push(converted);
  await cmd('SET', 'blog', JSON.stringify(blogs));
  
  // Also update JSON file
  const fs = require('fs');
  const jsonPath = '/root/.openclaw/workspace/durukanklima/public/data/blog.json';
  const fullBlogList = [...blogs.map(b => ({
    id: String(b.id),
    slug: b.slug,
    slugEn: b.slug + '-en',
    category: { tr: b.category, en: b.category },
    title: { tr: b.title, en: b.title },
    excerpt: { tr: b.excerpt, en: b.excerpt },
    content: { tr: b.content, en: b.content },
    coverImage: b.image,
    metaTitle: { tr: b.seo?.metaTitle || b.title, en: b.seo?.metaTitle || b.title },
    metaDescription: { tr: b.seo?.metaDescription || '', en: b.seo?.metaDescription || '' },
    publishedAt: b.publishedAt,
    readTime: { tr: '6 dk', en: '6 min' }
  }))];
  
  fs.writeFileSync(jsonPath, JSON.stringify(fullBlogList, null, 2));
  
  console.log('✅ Blog eklendi:', newBlog.title.tr);
  console.log('📊 Toplam blog sayısı:', blogs.length);
}

addBlog().catch(console.error);
