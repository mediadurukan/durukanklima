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
 "excerpt": { "tr": "Klimanızı yanlış yere monte etmek verimi %30 düşürebilir. İdeal montaj yeri seçimi için dikkat etmeniz gereken ipuçları.", "en": "Installing your AC in the wrong place can reduce efficiency by 30%." },
 "content": { "tr": "## İdeal Klima Konumu Nasıl Belirlenir?\n\nKlima montajı yapılacak yerin seçimi, hem cihazın soğutma performansını hem de sizin konforunuzu doğrudan etkiler.\n\n1. Doğrudan Hava Akışı: Havayı doğrudan yatağınıza veya çalışma masanıza üfleyen konumlardan kaçının.\n2. Engelsiz Yol: Önünde perde, mobilya veya kiriş bulunan yerler hava sirkülasyonunu bozar.\n3. Yükseklik: Soğuk hava çöktüğü için klima yerden yaklaşık 2.1-2.4 metre yükseklikte olmalıdır.\n\n## Sonuç\n\nDoğru konumlandırma, klimanızın daha az enerji harcayarak daha hızlı soğutmasını sağlar.", "en": "## How to Determine the Ideal AC Location?" },
 "coverImage": "/uploads/blog/klima-montaj-yeri.jpg",
 "metaTitle": { "tr": "Klima Montajında Yer Seçimi ve Verimlilik | Durukan Klima", "en": "AC Installation Location and Efficiency | Durukan Klima" },
 "metaDescription": { "tr": "Klima nereye takılmalı? En iyi soğutma performansı için iç ve dış ünite yerleşim rehberi.", "en": "Where should AC be installed?" },
 "publishedAt": "2025-01-28",
 "readTime": { "tr": "5 dk", "en": "5 min" }
 },
 {
 "id": "3",
 "slug": "klima-arizasi-belirtileri-ne-zaman-servis-cagirmali",
 "slugEn": "ac-failure-symptoms-when-to-call-service",
 "category": { "tr": "Arıza & Onarım", "en": "Repair & Troubleshooting" },
 "title": { "tr": "Klima Arızası Belirtileri: Ne Zaman Teknik Servis Çağırmalı?", "en": "AC Failure Symptoms: When to Call Technical Service?" },
 "excerpt": { "tr": "Klimanızdan gelen tuhaf sesler veya kötü kokular büyük bir arızanın habercisi olabilir. İşte göz ardı etmemeniz gereken belirtiler.", "en": "Strange noises or bad odors from your AC may be a sign of a major failure." },
 "content": { "tr": "## Müdahale Gerektiren Kritik Belirtiler\n\nKlimanızda aşağıdaki sorunlardan birini fark ederseniz, mutlaka bir uzmana danışmalısınız.\n\n### 1. Yetersiz Soğutma/Isıtma\nCihaz hava üflüyor ancak ortam sıcaklığını değiştiremiyorsa gaz kaçağı veya kompresör sorunu olabilir.\n\n### 2. Olağandışı Sesler\nMetalik sürtünme, yüksek gürültülü çalışma veya vızıltılar fan motoru veya gevşek parçaların habercisidir.\n\n### 3. Sızıntı ve Su Damlatma\nİç üniteden su damlaması genellikle drenaj hattı tıkanıklığı veya buzlanma belirtisidir.\n\n## Sonuç\n\nErken müdahale hayat kurtarır ve bütçenizi korur.", "en": "## Critical Symptoms Requiring Intervention" },
 "coverImage": "/uploads/blog/klima-arizasi.jpg",
 "metaTitle": { "tr": "Klima Arıza Belirtileri ve Çözüm Yolları | Durukan Klima", "en": "AC Failure Symptoms and Solution Ways | Durukan Klima" },
 "metaDescription": { "tr": "Klimanız neden soğutmuyor? Ses ve su sızıntısı gibi yaygın klima arızaları.", "en": "Why isn't your AC cooling?" },
 "publishedAt": "2025-02-10",
 "readTime": { "tr": "7 dk", "en": "7 min" }
 },
 {
 "id": "4",
 "slug": "enerji-tasarrufu-icin-klima-kullanim-ipuclari",
 "slugEn": "ac-usage-tips-for-energy-saving",
 "category": { "tr": "Enerji Tasarrufu", "en": "Energy Saving" },
 "title": { "tr": "Klimayı Ekonomik Kullanmanın Yolları: Faturayı %40 Düşürün", "en": "Ways to Use AC Economically: Reduce the Bill by 40%" },
 "excerpt": { "tr": "Klima faturanızdan korkmayın! Doğru kullanım alışkanlıkları ile hem serin kalın hem de paradan tasarruf edin.", "en": "Don't be afraid of your AC bill!" },
 "content": { "tr": "## Faturayı Düşüren Kullanım Stratejileri\n\n1. Sıcaklık Dengesi: Klimayı 24-25°C derecede çalıştırmak enerji tüketimini büyük ölçüde azaltır.\n2. Kapat-Aç Yapmayın: Inverter klimalar sabit sıcaklıkta daha az yakar.\n3. İzolasyon: Kapı ve pencerelerin kapalı olduğundan emin olun.\n\n## Sonuç\n\nKüçük değişiklikler, ay sonunda faturanızda büyük farklar yaratabilir.", "en": "## Usage Strategies That Reduce the Bill" },
 "coverImage": "/uploads/blog/enerji-tasarrufu.jpg",
 "metaTitle": { "tr": "Klimada Enerji Tasarrufu ve Ekonomik Kullanım | Durukan Klima", "en": "Energy Saving and Economic Use in AC | Durukan Klima" },
 "metaDescription": { "tr": "Klima faturası nasıl düşürülür? Ekonomik klima kullanımı için derece ayarı.", "en": "How to reduce the AC bill?" },
 "publishedAt": "2025-02-22",
 "readTime": { "tr": "6 dk", "en": "6 min" }
 },
 {
 "id": "5",
 "slug": "klima-turu-secimi-split-multi-vrf",
 "slugEn": "ac-type-selection-split-multi-vrf",
 "category": { "tr": "Satın Alma Rehberi", "en": "Buying Guide" },
 "title": { "tr": "Hangi Klimayı Almalıyım? Split, Multi ve VRF Farkları", "en": "Which AC Should I Buy? Split, Multi and VRF Differences" },
 "excerpt": { "tr": "Ev veya iş yeriniz için en uygun klima sistemi hangisi? İhtiyaçlarınıza göre klima türlerini karşılaştırdık.", "en": "Which is the most suitable AC system for your home or workplace?" },
 "content": { "tr": "## Klima Sistemlerini Karşılaştıralım\n\n- Split Klimalar: Tek bir oda için ideal, en yaygın ve ekonomik çözümdür.\n- Multi Split: Tek bir dış üniteye birden fazla iç ünitenin bağlanabildiği sistemdir.\n- VRF Sistemleri: Büyük yapılar için merkezi iklimlendirme sağlayan üst düzey teknolojidir.\n\n## Sonuç\n\nSizin için en iyisini seçmek için ücretsiz keşif hizmetimizden yararlanın.", "en": "## Let's Compare AC Systems" },
 "coverImage": "/uploads/blog/klima-turu-secimi.jpg",
 "metaTitle": { "tr": "Klima Türleri: Split vs Multi vs VRF | Durukan Klima", "en": "AC Types: Split vs Multi vs VRF | Durukan Klima" },
 "metaDescription": { "tr": "Split, Multi Split ve VRF klima sistemleri arasındaki farklar.", "en": "Differences between Split, Multi Split and VRF AC systems." },
 "publishedAt": "2025-03-05",
 "readTime": { "tr": "8 dk", "en": "8 min" }
 },
 {
 "id": "6",
 "slug": "kis-aylarinda-klima-ile-isinma-rehberi",
 "slugEn": "heating-with-ac-inwinter-guide",
 "category": { "tr": "Enerji Tasarrufu", "en": "Energy Saving" },
 "title": { "tr": "Kışın Klima ile Isınma: Püf Noktaları ve Maliyetler", "en": "Heating with AC in Winter: Tips and Costs" },
 "excerpt": { "tr": "Klima ile ısınmak doğalgazdan daha mı ekonomik? Kışın verimli ısıtma için klimanızı nasıl ayarlamalısınız?", "en": "Is heating with AC more economical than natural gas?" },
 "content": { "tr": "## Inverter Teknolojisi ile Kışın Isınma\n\nYeni nesil klimalar, dış ortam soğuk olsa bile havadan ısı çekerek ortamı ısıtır.\n\n- Flapları aşağı yöne ayarlayın (Sıcak hava yükselir).\n- Dış ünitenin kar altında kalmadığından emin olun.\n\n## Sonuç\n\nDoğru BTU seçimi ve düzenli bakımla klima, kışın en konforlu ısınma yöntemlerinden biridir.", "en": "## Heating in Winter with Inverter Technology" },
 "coverImage": "/uploads/blog/klima-isitma.jpg",
 "metaTitle": { "tr": "Kışın Klima ile Isınma Yöntemleri | Durukan Klima", "en": "Heating Methods with AC in Winter | Durukan Klima" },
 "metaDescription": { "tr": "Kışın klima ile nasıl ısınılır? Isı pompası teknolojisi.", "en": "How to heat with inverter ACs in winter?" },
 "publishedAt": "2025-03-28",
 "readTime": { "tr": "7 dk", "en": "7 min" }
 },
 {
 "id": "7",
 "slug": "klima-gazı-dolumu-ne-zaman-yapılmalı",
 "slugEn": "when-to-refill-ac-gas",
 "category": { "tr": "Arıza & Onarım", "en": "Repair & Troubleshooting" },
 "title": { "tr": "Klima Gazı Dolumu Ne Zaman Yapılmalı? Soğutmamanın Sebebi Gaz mı?", "en": "When to Refill AC Gas? Is the Reason for Not Cooling Gas?" },
 "excerpt": { "tr": "Klimanızın gazı biter mi? Eksilmesi durumunda cihazda ne gibi sorunlar oluşur?", "en": "Does your AC gas run out?" },
 "content": { "tr": "## Klima Gazı Biter mi?\n\nKapalı devre bir sistem olan klimada gaz normal şartlarda bitmez. Ancak bağlantı noktalarındaki veya borulardaki sızıntılar nedeniyle gaz eksilebilir.\n\n- Üfleme yetersiz\n- Bakır boru buzlanma\n- Kompresörün sürekli çalışması\n\n## Sonuç\n\nSadece gaz basmak çözüm değildir; sızıntı bulunup onarılmalıdır.", "en": "## Does AC Gas Run Out?" },
 "coverImage": "/uploads/blog/klima-gaz-dolumu.jpg",
 "metaTitle": { "tr": "Klima Gaz Dolumu ve Sızıntı Onarımı | Durukan Klima", "en": "AC Gas Refilling and Leak Repair | Durukan Klima" },
 "metaDescription": { "tr": "Klima gazının bittiği nasıl anlaşılır? Gaz dolum fiyatları.", "en": "How to tell if the AC gas is finished?" },
 "publishedAt": "2025-04-10",
 "readTime": { "tr": "6 dk", "en": "6 min" }
 },
 {
 "id": "8",
 "slug": "klima-koku-apiyor-nedenleri-ve-cozumleri",
 "slugEn": "ac-smells-bad-causes-and-solutions",
 "category": { "tr": "Sağlık & Hijyen", "en": "Health & Hygiene" },
 "title": { "tr": "Klimadan Gelen Kötü Koku Nasıl Giderilir?", "en": "How to Get Rid of Bad Smells from the AC?" },
 "excerpt": { "tr": "Klimanızı açtığınızda odaya yayılan rutubet veya küf kokusunun nedenlerini derledik.", "en": "We compiled the causes of the damp or moldy smell from your AC." },
 "content": { "tr": "## Kötü Kokunun Kaynağı Nedir?\n\nGenellikle iç ünitede biriken bakteriler ve drenaj tepsisindeki durgun su kokuya neden olur.\n\n- Filtreleri havalandırın ve temizleyin.\n- Klima dezenfektan spreyleri kullanın.\n- Drenaj hattının tıkalı olmadığından emin olun.\n\n## Sonuç\n\nKeskin ve kalıcı kokular için profesyonel hijyenik temizlik şarttır.", "en": "## What is the Source of Bad Smell?" },
 "coverImage": "/uploads/blog/klima-koku.jpg",
 "metaTitle": { "tr": "Klimada Kötü Koku Giderme ve Hijyen | Durukan Klima", "en": "Bad Smell Removal and Hygiene in AC | Durukan Klima" },
 "metaDescription": { "tr": "Klima neden koku yapar? Küf kokuları önlemenin yolları.", "en": "Why does the AC smell?" },
 "publishedAt": "2025-04-25",
 "readTime": { "tr": "5 dk", "en": "5 min" }
 },
 {
 "id": "9",
 "slug": "klima-filtresi-temizligi-nasil-yapilir",
 "slugEn": "how-to-clean-ac-filter",
 "category": { "tr": "Bakım & Servis", "en": "Maintenance & Service" },
 "title": { "tr": "Klima Filtresi Temizliği Nasıl Yapılır? Adım Adım Kılavuz", "en": "How to Clean an AC Filter? Step-by-Step Guide" },
 "excerpt": { "tr": "Klima filtresini düzenli temizlemek hem cihazın ömrünü uzatır hem de iç mekan hava kalitesini artırır.", "en": "Regularly cleaning the AC filter extends the device's life." },
 "content": { "tr": "## Neden Filtre Temizliği Bu Kadar Önemli?\n\nFiltre tıkandığında hava akışı azalır ve verimlilik düşer.\n\n1. Klimayı kapatın.\n2. Ön kapağı açın.\n3. Filtreleri çıkarın.\n4. Ilık suyla yıkayın.\n5. Gölgede kurutun ve geri takın.\n\n## Sonuç\n\nAylık filtre temizliği elektrik faturanızı düşürür.", "en": "## Step-by-Step Filter Cleaning" },
 "coverImage": "/uploads/blog/klima-filtre-temizligi.jpg",
 "metaTitle": { "tr": "Klima Filtresi Temizliği Nasıl Yapılır? | Durukan Klima", "en": "How to Clean an AC Filter? | Durukan Klima" },
 "metaDescription": { "tr": "Klima filtresini adım adım nasıl temizleyeceğinizi öğrenin.", "en": "Learn how to clean your AC filter step by step." },
 "publishedAt": "2025-04-05",
 "readTime": { "tr": "5 dk", "en": "5 min" }
 },
 {
 "id": "10",
 "slug": "klima-omru-ne-kadar-ne-zaman-degistirilmeli",
 "slugEn": "ac-lifespan-when-to-replace",
 "category": { "tr": "Satın Alma Rehberi", "en": "Buying Guide" },
 "title": { "tr": "Klima Ömrü Ne Kadar? Yenisini Almak mı, Onartmak mı?", "en": "How Long Do ACs Last? Repair or Replace?" },
 "excerpt": { "tr": "Klimanız kaç yıl dayanır? Onarmak mı yoksa yeni almak mı daha mantıklı?", "en": "How many years will your AC last?" },
 "content": { "tr": "## Klima Kaç Yıl Dayanır?\n\nDüzgün bakım yapıldığında kaliteli bir split klima 12-15 yıl kullanılabilir.\n\n## Onarım mı, Yeni Alım mı?\n\nTamir maliyeti, cihazın günümüz değerinin %50'sini aşıyorsa yeni alma düşünülmeli.", "en": "## How Long Do ACs Last?" },
 "coverImage": "/uploads/blog/klima-omru.jpg",
 "metaTitle": { "tr": "Klima Ömrü Ne Kadar? | Durukan Klima", "en": "How Long Do ACs Last? | Durukan Klima" },
 "metaDescription": { "tr": "Klimanızın ömrünü nasıl uzatırsınız?", "en": "How to extend your AC's life?" },
 "publishedAt": "2025-04-20",
 "readTime": { "tr": "5 dk", "en": "5 min" }
 },
 {
 "id": "11",
 "slug": "klima-ariza-kodlari-ve-cozumleri-tam-liste",
 "slugEn": "ac-error-codes-and-solutions-full-list",
 "category": { "tr": "Arıza & Onarım", "en": "Repair & Troubleshooting" },
 "title": { "tr": "Klima Arıza Kodları ve Çözümleri: 10+ Marka Tam Liste (2025)", "en": "AC Error Codes and Solutions: 10+ Brands Full List (2025)" },
 "excerpt": { "tr": "Samsung, Daikin, LG, Arçelik, Vestel, Mitsubishi ve daha fazla marka için 200'den fazla arıza kodu.", "en": "Find 200+ error codes for Samsung, Daikin, LG, Arçelik and more." },
 "content": { "tr": "## Klima Arıza Kodları Nedir?\n\nModern klima cihazları sistemde bir anormallik oluştuğunda arıza kodu gösterir.\n\n> Önemli: Bir arıza kodu gördüğünüzde önce klimayı kapatın. 10 dakika bekleyip tekrar açın. Kod devam ediyorsa profesyonel servis çağırın.\n\n## Samsung Klima Arıza Kodları\n\n| Kod | Açıklama | Olası Neden | Çözüm |\n|-----|----------|-------------|-------|\n| E101 | İç-Dış Ünite Haberleşme Hatası | Kablo kopuk veya kart arızalı | Kablo bağlantılarını kontrol et |\n| E154 | İç Fan Motoru Hatası | Fan dönmüyor | Fan motoru değiştir |\n| E401 | Yüksek Basınç Koruması | Kondenser kirli | Kondenser temizle |\n| E402 | Alçak Basınç Koruması | Gaz kaçağı | Gaz kontrol et |\n\n## LG Klima Arıza Kodları\n\n| Kod | Açıklama |\n|-----|----------|\n| CH01 | Oda Sensörü Hatası |\n| CH05 | Haberleşme Hatası |\n| CH10 | İç Fan Motoru Hatası |\n\n## Arçelik / Beko Klima Arıza Kodları\n\n| Kod | Açıklama |\n|-----|----------|\n| E1 | Boru Sensörü Hatası |\n| E6 | Haberleşme Hatası |\n| E7 | Fan Motoru Hatası |\n\n## Sonuç\n\n200'den fazla arıza kodunu detaylı olarak inceledik. Arıza kodunuz için bizi arayın.", "en": "## AC Error Codes Overview" },
 "coverImage": "/uploads/blog/klima-ariza-kodlari.jpg",
 "metaTitle": { "tr": "Klima Arıza Kodları ve Çözümleri | Durukan Klima", "en": "AC Error Codes and Solutions | Durukan Klima" },
 "metaDescription": { "tr": "Klima arıza kodları ve çözümleri hakkında her şey.", "en": "AC error codes and solutions." },
 "publishedAt": "2025-04-28",
 "readTime": { "tr": "15 dk", "en": "15 min" }
 }
];

// Convert to durukanklima format
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
