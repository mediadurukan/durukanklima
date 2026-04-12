const https = require('https');
const url = new URL('https://legible-panther-85373.upstash.io');
const token = 'gQAAAAAAAU19AAIncDI1NWU1MDI5NjVlZjA0OWExYjU0NTRlNTc4MjUwMjc4NnAyODUzNzM';
const fs = require('fs');

function cmd(...args) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(args);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token, 'Content-Length': Buffer.byteLength(body) }
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
  // Get existing count
  const existing = await cmd('GET', 'blog');
  const blogs = existing ? JSON.parse(existing) : [];
  const nextId = blogs.length + 1;

  // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];

  const newBlog = {
    id: nextId.toString(),
    slug: `kombi-kullaniminda-tasarruf-${nextId}`,
    slugEn: `boiler-usage-tips-${nextId}`,
    category: { tr: "Kombi & Isıtma", en: "Boiler & Heating" },
    title: {
      tr: "Kombi Kullanımında %30 Tasarruf Etmenin Yolları",
      en: "Ways to Save 30% on Boiler Usage"
    },
    excerpt: {
      tr: "Kış aylarında doğalgaz faturanız kabarıyor mu? Kombiyi doğru kullanarak tasarruf edebilirsiniz.",
      en: "Is your gas bill skyrocketing in winter? You can save by using your boiler correctly."
    },
    content: {
      tr: `## Kombi Faturanızı Düşürmenin Etkili Yolları

Kış aylarında kombi kullanımı ev bütçesinde önemli bir kalem oluşturuyor. Ancak doğru kullanım yöntemleriyle doğalgaz faturanızda %30'a varan tasarruf sağlamak mümkün.

### 1. Doğru Sıcaklık Ayarı
Kombiyi 50-55°C arasında tutmak idealidir. Her 1°C artış yaklaşık %6-7 daha fazla gaz tüketimi demek. Evde kimse yokken 30°C'e düşürmek tasarruf sağlar.

### 2. Zamanlayıcı Kullanın
Kombiyi sürekli çalıştırmak yerine, günün belirli saatlerinde çalışacak şekilde programlayın. Gece uyurken 30°C, gündüz evdeyken 50°C idealdir.

### 3. Radyatör Vanalarını Kontrol Edin
Kullanılmayan odaların radyatör vanalarını kapatın. Böylece ısınması gereken alan azalır ve kombi daha verimli çalışır.

### 4. Pencereleri ve Kapıları Kontrol Edin
Kışın pencerelerden ve kapılardan ısı kaybı %25-30'u bulabilir. Pencere ve kapıların izolasyonunu kontrol edin.

### 5. Radyatör Arkalarına Yalıtım
Radyatörlerin arkasına alüminyum folyo veya özel yalıtım panelleri yerleştirmek, ısının duvara değil odaya yönelmesini sağlar.

### 6. Yıllık Bakım Yaptırın
Bakımsız kombi verimi düşer. Yılda bir kez profesyonel bakım, kombinin optimum verimlilikle çalışmasını sağlar.

## Sonuç
Küçük değişiklikler büyük tasarruf demek. Bugünden başlayarak bu ipuçlarını uygulayın ve faturanızda farkı görün!`,
      en: `## Effective Ways to Lower Your Boiler Bill

Boiler usage in winter months constitutes a significant item in the household budget. However, it is possible to save up to 30% on your gas bill with the right usage methods.

### 1. Set the Right Temperature
Keeping the boiler between 50-55°C is ideal. Every 1°C increase means approximately 6-7% more gas consumption. Lowering it to 30°C when no one is home provides savings.

### 2. Use the Timer
Instead of running the boiler continuously, program it to run at specific times of the day. 30°C while sleeping, 50°C during the day when at home is ideal.

### 3. Control Radiator Valves
Close the radiator valves in unused rooms. This reduces the area that needs heating and the boiler operates more efficiently.

### 4. Check Windows and Doors
Heat loss from windows and doors in winter can reach 25-30%. Check the insulation of windows and doors.

### 5. Insulation Behind Radiators
Placing aluminum foil or special insulation panels behind radiators ensures that heat is directed into the room rather than the wall.

### 6. Annual Maintenance
An unmaintained boiler loses efficiency. Annual professional maintenance ensures the boiler operates at optimal efficiency.

## Conclusion
Small changes mean big savings. Start applying these tips today and see the difference in your bill!`
    },
    coverImage: `https://picsum.photos/seed/kombi-tasarruf-${nextId}/800/400`,
    metaTitle: {
      tr: "Kombi Kullanımında Tasarruf Yolları | Durukan Klima",
      en: "Boiler Usage Saving Tips | Durukan Klima"
    },
    metaDescription: {
      tr: "Kışın doğalgaz faturanızı düşürmenin etkili yolları.",
      en: "Effective ways to lower your gas bill in winter."
    },
    publishedAt: dateStr,
    readTime: { tr: "7 dk", en: "7 min" }
  };

  // Add to Redis
  const converted = {
    id: parseInt(newBlog.id),
    slug: newBlog.slug,
    title: newBlog.title.tr,
    excerpt: newBlog.excerpt.tr,
    content: newBlog.content.tr,
    category: newBlog.category.tr,
    tags: ['kombi', 'dogalgaz', 'tasarruf', 'adana'],
    published: true,
    publishedAt: newBlog.publishedAt,
    author: 'Durukan Klima',
    image: newBlog.coverImage,
    seo: {
      metaTitle: newBlog.metaTitle.tr,
      metaDescription: newBlog.metaDescription.tr,
      keywords: 'adana kombi servisi, dogalgaz tasarrufu, cukurova kombi'
    }
  };

  blogs.push(converted);
  await cmd('SET', 'blog', JSON.stringify(blogs));

  // Update JSON file
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
    readTime: { tr: '7 dk', en: '7 min' }
  }))];
  fs.writeFileSync(jsonPath, JSON.stringify(fullBlogList, null, 2));

  console.log('✅ Blog eklendi:', newBlog.title.tr);
  console.log('📅 Yayınlanma tarihi:', dateStr);
  console.log('📊 Toplam blog:', blogs.length);

  // GitHub commit
  const { execSync } = require('child_process');
  try {
    execSync('cd /root/.openclaw/workspace/durukanklima && git add -A && git commit -m "Blog: ' + newBlog.title.tr + ' (' + dateStr + ')" && git push', { stdio: 'inherit' });
    console.log("✅ GitHub'a commit edildi!");
  } catch (e) {
    console.log('⚠️ GitHub commit hatası:', e.message);
  }
}

addBlog().catch(console.error);
