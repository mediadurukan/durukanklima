const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, 'public', 'data', 'blog.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Yeni blog yazıları (fiyatlar hariç)
const newBlogs = [
  {
    id: "25",
    slug: "adana-klima-montaj-fiyatlari-2026",
    slugEn: "adana-klima-montaj-fiyatlari-2026-en",
    category: { tr: "Fiyat Rehberi", en: "Fiyat Rehberi" },
    title: { tr: "Adana Klima Montaj Fiyatları 2026", en: "Adana Klima Montaj Fiyatları 2026" },
    excerpt: { tr: "Adanada klima montaji ne kadar? 2026 guncel klima montaj fiyatları, marka ve model bazında detaylı bilgi.", en: "Adanada klima montaji ne kadar?" },
    content: { 
      tr: "## Adana Klima Montaj Fiyatları 2026\n\nKlima montaji, cihazin omru ve performansi icin kritik oneme sahiptir. Adanada klima montaj fiyatları marka, model ve guc kapasitesine gore degisiklik gostermektedir.\n\n### Klima Montaj Fiyatlarini Etkileyen Faktörler\n\n1. Klimanin Gucu (BTU): 9000 BTU, 12000 BTU, 18000 BTU, 24000 BTU gibi farkli kapasiteler farkli fiyatlandirma gerektirir.\n\n2. Marka: Arcelik, Beko, Samsung, LG, Daikin, Mitsubishi gibi markalarin montaj gereksinimleri farklilik gosterebilir.\n\n3. Montaj Yeri: Ic unite ve dis unite arasindaki mesafe, duvar tipi, zemin kat veya cati kati gibi faktorler fiyati etkiler.\n\n### Klima Montajinda Dikkat Edilmesi Gerekenler\n\n✓ Isinin ehli bir teknisyen tarafindan montaj yapilmalidir\n✓ Vakumlama islemi mutlaka yapilmalidir\n✓ Boru mesafesi standartlarin disina cikmamalidir\n✓ Elektrik tesisati kontrol edilmelidir\n\n### Adanada Klima Montaji\n\nAdanada klima montaji icin Cucurova, Seyhan, Saricam ve Yuregir ilcelerine hizmet veriyoruz. Ayni gun randevu ile kapinizda olabiliriz.",
      en: "## Adana Klima Montaj Fiyatlari\n\nKlima montaji icin Adanada guncel fiyatlar." 
    },
    coverImage: "/uploads/blog/klima-montaj.jpg",
    metaTitle: { tr: "Adana Klima Montaj Fiyatları 2026 | Durukan Klima", en: "Adana Klima Montaj Fiyatları 2026" },
    metaDescription: { tr: "Adana klima montaj fiyatları 2026. Klima montaj ne kadar?", en: "Adana klima montaj fiyatları" },
    publishedAt: "2026-04-13",
    readTime: { tr: "6 dk", en: "6 min" },
    published: true
  },
  {
    id: "26",
    slug: "cukurova-klima-servisi-nereden-alinir",
    slugEn: "cukurova-klima-servisi-nereden-alinir-en",
    category: { tr: "Yerel SEO", en: "Yerel SEO" },
    title: { tr: "Cucurova Klima Servisi: Guvenilir Hizmet Nereden Alinir?", en: "Cucurova Klima Servisi: Guvenilir Hizmet Nereden Alinir?" },
    excerpt: { tr: "Adana Cucurovada klima servisi ararken nelere dikkat etmeli? Guvenilir klima servisi secimi icin ipuclari.", en: "Cucurovada klima servisi nasil secilir?" },
    content: { 
      tr: "## Cucurova Klima Servisi Secerken Nelere Dikkat Edilmeli?\n\nCucurova, Adananin en prestijli bolgesi olarak birçok site, rezidans ve is merkezine ev sahipligi yapmaktadir. Klima ihtiyaci da bu yogunluga paralel olarak artmaktadir.\n\n### Guvenilir Klima Servisi Nasil Secilir?\n\n1. Yetkili Servis Olmasi: Oncelikle yetkili veya deneyimli servisleri tercih edin.\n\n2. Musteri Yorumlari: Internet uzerindeki yorumlari ve puanlari inceleyin.\n\n3. Fiyat Seffafligi: Onceden fiyat veren, gizli kalem olmayan servisleri secin.\n\n4. Garanti Sunmasi: Iscilik ve parca garantisi veren firmalar daha guvenilirdir.\n\n5. Hiz: Ayni gun servis imkani sunan firmalari tercih edin.\n\n### Cucurovada Klima Hizmetleri\n\nCucurova bolgesinde verdigimiz hizmetler:\n\n- Klina Montaji\n- Klima Bakimi\n- Klima Ariza Onarim\n- Klima Gaz Dolumu\n- Kombi Servisi",
      en: "## Cucurova Klima Servisi\n\nCucurovada guvenilir klima servisi nasil bulunur?"
    },
    coverImage: "/uploads/blog/cukurova-klima.jpg",
    metaTitle: { tr: "Cucurova Klima Servisi | Durukan Klima", en: "Cucurova Klima Servisi | Durukan Klima" },
    metaDescription: { tr: "Cucurova klima servisi. Adana Cucurovada klima servisi.", en: "Cucurova klima servisi" },
    publishedAt: "2026-04-13",
    readTime: { tr: "5 dk", en: "5 min" },
    published: true
  },
  {
    id: "27",
    slug: "seyhan-klima-bakimi-en-iyi-servis",
    slugEn: "seyhan-klima-bakimi-en-iyi-servis-en",
    category: { tr: "Yerel SEO", en: "Yerel SEO" },
    title: { tr: "Seyhan Klima Bakimi: En Iyi Servis Hangisi?", en: "Seyhan Klima Bakimi: En Iyi Servis Hangisi?" },
    excerpt: { tr: "Adana Seyhanda klima bakimi icin en iyi servis hangisi? Klima bakiminda dikkat edilmesi gerekenler.", en: "Seyhanda klima bakimi icin en iyi servis." },
    content: { 
      tr: "## Seyhan Klima Bakimi: En Iyi Servis Hangisi?\n\nSeyhan, Adananin merkez ilçesi olarak yogun bir nufusa sahiptir. Klima bakimi ihtiyaci da bu yogunluga paralel olarak artmaktadir.\n\n### Klima Bakimi Neden Onemli?\n\nKlima bakimi sadece cihazin omrunu uzatmakla kalmaz, ayni zamanda:\n\n- Enerji tasarrufu saglar (%15-20ye varan)\n- Saglikli hava kalitesi sunar\n- Ariza riskini azaltir\n- Fatura artisini onler\n\n### Klima Bakiminda Yapilan Islemler\n\n1. Filtre temizligi veya degisimi\n2. Ic ve dis unite temizligi\n3. Gaz basinç kontrolu\n4. Elektrik baglantilari kontrolu\n5. Drenaj hatti temizligi",
      en: "## Seyhan Klima Bakimi\n\nSeyhanda en iyi klima bakimi servisi."
    },
    coverImage: "/uploads/blog/seyhan-klima.jpg",
    metaTitle: { tr: "Seyhan Klima Bakimi | Durukan Klima", en: "Seyhan Klima Bakimi | Durukan Klima" },
    metaDescription: { tr: "Seyhan klima bakimi. Adana Seyhanda klima bakim servisi.", en: "Seyhan klima bakimi" },
    publishedAt: "2026-04-13",
    readTime: { tr: "5 dk", en: "5 min" },
    published: true
  },
  {
    id: "28",
    slug: "adana-klima-ariza-en-sik-gorulen-sorunlar",
    slugEn: "adana-klima-ariza-en-sik-gorulen-sorunlar-en",
    category: { tr: "Ariza & Onarim", en: "Ariza & Onarim" },
    title: { tr: "Adanada Klima Ariazlarinda En Sik Karsilasilan 10 Sorun", en: "Adanada Klima Ariazlarinda En Sik Karsilasilan 10 Sorun" },
    excerpt: { tr: "Klima arizalarinda en sik gorulen sorunlar neler? Evde cozulebilen ve mutlaka servise goturulmesi gereken arizalar.", en: "Klima arizalarinda en sik karsilasikan sorunlar." },
    content: { 
      tr: "## Adanada Klima Ariazlarinda En Sik Karsilasilan Sorunlar\n\nKlimalar zamanla cesitli arizalarla karsilasebilir. İste en sik gorulen 10 klima arizasi:\n\n### 1. Klimadan Soguk Hava Gelmiyor\nNedeni: Gaz kacagi, kompresor arizasi veya elektronik kart problemi\n\n### 2. Klimadan Su Damlamasi\nNedeni: Drenaj hatti tikanikligi veya fazla gaz\n\n### 3. Klimadan Kotu Koku Geliyor\nNedeni: Bakteri ve kuf birikimi\n\n### 4. Klimada Ses Yapiyor\nNedeni: Gevsemis vida, fan motoru arizasi\n\n### 5. Kumanda Calismiyor\nNedeni: Pil bitmesi veya alici kart arizasi\n\n### 6. Klimada E4 Hatasi\nNedeni: Ic unite EEPROM hatasi\n\n### 7. Dis Unite Calismiyor\nNedeni: Elektrik kesintisi, kondansator arizasi\n\n### 8. Klimada Sogutma Yetersiz\nNedeni: Kirli filtre, gaz azligi",
      en: "## Klima Ariza Sorunlari\n\nKlimalarda en sik gorulen arizalar."
    },
    coverImage: "/uploads/blog/klima-ariza.jpg",
    metaTitle: { tr: "Klima Ariza Sorunlari | Durukan Klima", en: "Klima Ariza Sorunlari | Durukan Klima" },
    metaDescription: { tr: "Klima arizalarinda en sik gorulen sorunlar neler?", en: "Klima ariza sorunlari" },
    publishedAt: "2026-04-13",
    readTime: { tr: "6 dk", en: "6 min" },
    published: true
  },
  {
    id: "29",
    slug: "klima-gaz-dolumu-ne-kadar-surer",
    slugEn: "klima-gaz-dolumu-ne-kadar-surer-en",
    category: { tr: "Teknik Bilgiler", en: "Teknik Bilgiler" },
    title: { tr: "Klima Gaz Dolumu Ne Kadar Surer? Detayli Rehber", en: "Klima Gaz Dolumu Ne Kadar Surer? Detayli Rehber" },
    excerpt: { tr: "Klima gaz dolumu ne kadar surer? Gaz dolumu oncesi ve sonrasi dikkat edilmesi gerekenler.", en: "Klima gaz dolumu ne kadar surer?" },
    content: { 
      tr: "## Klima Gaz Dolumu Ne Kadar Surer?\n\nKlima gaz dolumu, klimanin sogutma icin kullandigi refrigerant gazinin yenilenmesi islemidir.\n\n### Gaz Dolumu Ne Kadar Surer?\n\nNormal sartlarda klima gaz dolumu 30 dakika ile 1 saat arasinda tamamlanir.\n\n### Gaz Dolumunu Etkileyen Faktörler\n\n1. Sizintinin Buyuklugu: Buyuk sizinti varsa once sizinti tamiri gerekir.\n\n2. Klimanin Kapasitesi: Buyuk BTUluk klimalar daha fazla gaz gerektirir.\n\n3. Sistem Durumu: Vakumlama suresi de eklenebilir.\n\n### Gaz Dolumu Oncesi Yapilmasi Gerekenler\n\n✓ Ariza tespiti yapilmali\n✓ Sizinti kontrolu yapilmali\n✓ Vakumlama islemi tamamlanmali",
      en: "## Klima Gaz Dolumu\n\nKlima gaz dolumu suresi ve dikkat edilmesi gerekenler."
    },
    coverImage: "/uploads/blog/klima-gaz-dolumu.jpg",
    metaTitle: { tr: "Klima Gaz Dolumu Ne Kadar Surer? | Durukan Klima", en: "Klima Gaz Dolumu | Durukan Klima" },
    metaDescription: { tr: "Klima gaz dolumu ne kadar surer? Gaz dolumu rehberi.", en: "Klima gaz dolumu suresi" },
    publishedAt: "2026-04-13",
    readTime: { tr: "5 dk", en: "5 min" },
    published: true
  },
  {
    id: "30",
    slug: "kombi-bakim-neden-onemli",
    slugEn: "kombi-bakim-neden-onemli-en",
    category: { tr: "Bakim & Servis", en: "Bakim & Servis" },
    title: { tr: "Kombi Bakimi Neden Bu Kadar Onemli?", en: "Kombi Bakimi Neden Bu Kadar Onemli?" },
    excerpt: { tr: "Kis oncesi kombi bakimi neden sarts? Kombi bakiminin avantajlari ve dikkat edilmesi gerekenler.", en: "Kombi bakimi neden onemli?" },
    content: { 
      tr: "## Kombi Bakimi Neden Onemli?\n\nKis aylarinin yaklasmasiyla birlikte kombi bakimi kritik bir hale geliyor. Yillik kombi bakimi hem guvenliginiz hem de cebiniz icin onemli.\n\n### Kombi Bakiminin 5 Onemli Avantaji\n\n1. Guvenlik: Karbonmonoksit zehirlenmesi riskini onler\n2. Tasarruf: Duzgun calisan kombi %15-20 daha az gaz yakar\n3. Omur: Bakimli kombi 2-3 kat daha uzun omurlu olur\n4. Performans: Isinma kalitesi artar, ortam daha konforlu olur\n5. Ariza Onleme: Buyuk arizalarin onune gecer\n\n### Kombi Bakiminda Yapilan Islemler\n\n- Yanma odasi temizligi\n- Bulor kontrolu ve temizligi\n- Elektronik kart kontrolu\n- Hidrolik basinç ayari\n- Emniyet ventili kontrolu",
      en: "## Kombi Bakimi Neden Onemli?\n\nKombi bakiminin avantajlari."
    },
    coverImage: "/uploads/blog/kombi-bakim.jpg",
    metaTitle: { tr: "Kombi Bakimi Neden Onemli? | Durukan Klima", en: "Kombi Bakimi | Durukan Klima" },
    metaDescription: { tr: "Kombi bakimi neden onemli? Kombi bakiminin avantajlari.", en: "Kombi bakimi neden onemli" },
    publishedAt: "2026-04-13",
    readTime: { tr: "5 dk", en: "5 min" },
    published: true
  },
  {
    id: "31",
    slug: "adana-klima-servis-secimi",
    slugEn: "adana-klima-servis-secimi-en",
    category: { tr: "Tuketici Rehberi", en: "Tuketici Rehberi" },
    title: { tr: "Adanada Klima Servisi Secerken Dikkat Edilmesi Gereken 7 Madde", en: "Adanada Klima Servisi Secerken Dikkat Edilmesi Gereken 7 Madde" },
    excerpt: { tr: "Klima servisi secerken nelere dikkat etmeli? Adanada klima servisi secimi icin kapsamli rehber.", en: "Klima servisi secerken dikkat edilecekler." },
    content: { 
      tr: "## Adanada Klima Servisi Secimi: 7 Altin Kural\n\nKlima servisi secimi, cihazinizin omru ve performansi icin kritik oneme sahiptir. İste dikkat etmeniz gereken 7 madde:\n\n### 1. Deneyim ve Uzmanlik\nKlima sektorunde en az 5-10 yil deneyimi olan firmalari tercih edin.\n\n### 2. Yetki Belgesi\nServis personelinin ilgili sertifikalara sahip oldugundan emin olun.\n\n### 3. Sefaf Fiyat\nOnceden fiyat vermeyen, gizli kalemler cikaran firmalardan uzak durun.\n\n### 4. Garanti Sunmasi\nIscilik ve kullanilan parcalar icin garanti veren firmalari tercih edin.\n\n### 5. Hiz ve Erisilebilirlik\nAcil durumlarda ayni gun veya en gec ertesi gun hizmet verebilmeliler.\n\n### 6. Musteri Yorumlari\nGoogle, sosyal medya ve forumlardaki musteri yorumlarini okuyun.\n\n### 7. Orijinal Parca Kullanimi\nOrijinal veya orijinal esdegeri kaliteli parca kullanan firmalari secin.",
      en: "## Klima Servisi Secimi\n\nKlima servisi secerken dikkat edilecekler."
    },
    coverImage: "/uploads/blog/servis-secimi.jpg",
    metaTitle: { tr: "Klima Servisi Secimi | Durukan Klima", en: "Klima Servisi Secimi | Durukan Klima" },
    metaDescription: { tr: "Klima servisi secerken dikkat edilecekler.", en: "Klima servisi secimi" },
    publishedAt: "2026-04-13",
    readTime: { tr: "6 dk", en: "6 min" },
    published: true
  },
  {
    id: "32",
    slug: "klima-montaj-surekli-yanlis-yapiliyor",
    slugEn: "klima-montaj-surekli-yanlis-yapiliyor-en",
    category: { tr: "Montaj Rehberi", en: "Montaj Rehberi" },
    title: { tr: "Klima Montajinda Surekli Yapilan 5 Hata (Ve Cozumleri)", en: "Klima Montajinda Surekli Yapilan 5 Hata (Ve Cozumleri)" },
    excerpt: { tr: "Klima montajinda en sik yapilan hatalar neler? Bu hatalardan kacinmak icin ne yapmalisiniz?", en: "Klima montajinda yapilan hatalar." },
    content: { 
      tr: "## Klima Montajinda Yapilan 5 Yaygin Hata\n\nKlima montaji gorundugu kadar kolay bir is degildir. İste en sik karsilasilan montaj hatalari:\n\n### Hata 1: Vakumlama Yapilmamasi\nSorun: Nem ve hava sisteme girerek korozyon ve arizaya neden olur.\nCozum: Montaj sonrasi mutlaka 20-30 dakika vakumlama yapilmalidir.\n\n### Hata 2: Boru Mesafesinin Uzun Tutulmasi\nSorun: Gaz kacagi riski artar, performans duser.\nCozum: Standart mesafe (3-15 metre) asilmamalidir.\n\n### Hata 3: Dis Unite Gunes Altinda\nSorun: Aşiri isinma nedeniyle verim duser, omur kisalir.\nCozum: Golge veya guneslik altina monte edilmelidir.\n\n### Hata 4: Ic Unite Direkt Yataga\nSorun: Direkt soguk hava saglik sorunlarina yol acabillir.\nCozum: Hava akisi yatabin uzerine degil, yanina yonlendirilmelidir.",
      en: "## Klima Montaj Hatalari\n\nKlima montajinda yapilan yaygin hatalar."
    },
    coverImage: "/uploads/blog/klima-montaj-hatasi.jpg",
    metaTitle: { tr: "Klima Montaj Hatalari | Durukan Klima", en: "Klima Montaj Hatalari | Durukan Klima" },
    metaDescription: { tr: "Klima montajinda yapilan hatalar neler?", en: "Klima montaj hatalari" },
    publishedAt: "2026-04-13",
    readTime: { tr: "5 dk", en: "5 min" },
    published: true
  },
  {
    id: "33",
    slug: "inverter-klima-nedir-avantajlari",
    slugEn: "inverter-klima-nedir-avantajlari-en",
    category: { tr: "Satin Alma Rehberi", en: "Satin Alma Rehberi" },
    title: { tr: "Inverter Klima Nedir? Avantajlari ve Normal Klima Farki", en: "Inverter Klima Nedir? Avantajlari ve Normal Klima Farki" },
    excerpt: { tr: "Inverter klima ile normal klima arasindaki fark nedir? Inverter klima avantajlari neler?", en: "Inverter klima nedir?" },
    content: { 
      tr: "## Inverter Klima Nedir?\n\nInverter klima, son yillarin en popler klima teknolojisidir. Geleneksel klimalardan farki, kompresor hizini ayarlayabilmesidir.\n\n### Inverter vs Normal Klima\n\n| Ozellik | Inverter Klima | Normal Klima |\n|---------|----------------|--------------|\n| Kompresor | Hizini ayarlar | Surekli calisir, durur |\n| Enerji | %40-50 tasarruf | Standart tuketim |\n| Ses | Cok sessiz | Normal sesli |\n\n### Inverter Klima Avantajlari\n\n1. Enerji Tasarrufu: %40-50 daha az elektrik tuketimi\n2. Sessiz Calisma: Gece modunda neredeyse sessiz\n3. Hizli Sogutma/Isitma: Hedef sicakliga daha cabuk ulasir\n4. Daha Uzun Omur: Surekli dur-kalk yapmadigi icin daha az yipranir\n5. Konfor: Sabit sicaklikta tutar, dalgalanma olmaz",
      en: "## Inverter Klima Nedir?\n\nInverter klima avantajlari ve normal klima farki."
    },
    coverImage: "/uploads/blog/inverter-klima.jpg",
    metaTitle: { tr: "Inverter Klima Nedir? | Durukan Klima", en: "Inverter Klima Nedir? | Durukan Klima" },
    metaDescription: { tr: "Inverter klima nedir? Inverter klima avantajlari neler?", en: "Inverter klima nedir" },
    publishedAt: "2026-04-13",
    readTime: { tr: "5 dk", en: "5 min" },
    published: true
  },
  {
    id: "34",
    slug: "klima-kullanim-hatalari-enerji-zarari",
    slugEn: "klima-kullanim-hatalari-enerji-zarari-en",
    category: { tr: "Enerji Tasarrufu", en: "Enerji Tasarrufu" },
    title: { tr: "Klima Kullanim Hatalari: Elektrik Faturaniza Gundelik 50TL Ekleyen 8 Yanlis", en: "Klima Kullanim Hatalari: Elektrik Faturaniza Gundelik 50TL Ekleyen 8 Yanlis" },
    excerpt: { tr: "Klima kullanirken yapilan hatalar neler? Bu hatalardan kacinarak nasil tasarruf edebilirsiniz?", en: "Klima kullanım hatalari ve tasarruf yollari." },
    content: { 
      tr: "## Klima Kullanim Hatalari: 8 Buyuk Yanlis\n\nKlima kullanımında yapılan hatalar hem performansı düsürür hem de faturaları kabartır.\n\n### 1. Cok Dusuk Sicaklik\nHata: 18-20C ayarlamak\nGercek: 24-26C yeterli ve daha tasarruflu\nZarar: Gereksiz %30-40 fazla enerji\n\n### 2. Acik-Kapa Yapmak\nHata: Odadan cikinca klimayi kapatmak\nGercek: Inverter klimalar sabit sicaklikta daha az yakar\nZarar: Her acista yuksek enerji sarfiyati\n\n### 3. Filtreleri Temizlememek\nHata: Yilda bir veya hic filtre temizlememek\nGercek: 3-6 ayda bir temizlenmeli\nZarar: %15-20 daha fazla enerji tuketimi\n\n### 4. Kapi ve Pencere Acmak\nHata: Klimanin calistigi odada pencere acmak\nZarar: Surekli ek sogutma yukü",
      en: "## Klima Kullanim Hatalari\n\nKlima kullanımında yapılan hatalar ve tasarruf yollari."
    },
    coverImage: "/uploads/blog/klima-kullanim-hatasi.jpg",
    metaTitle: { tr: "Klima Kullanim Hatalari | Durukan Klima", en: "Klima Kullanim Hatalari | Durukan Klima" },
    metaDescription: { tr: "Klima kullanım hatalari neler? Elektrik tasarrufu nasil yapılır?", en: "Klima kullanım hatalari" },
    publishedAt: "2026-04-13",
    readTime: { tr: "6 dk", en: "6 min" },
    published: true
  },
  {
    id: "35",
    slug: "adana-kisin-klima-isitma-maliyeti",
    slugEn: "adana-kisin-klima-isitma-maliyeti-en",
    category: { tr: "Enerji Tasarrufu", en: "Enerji Tasarrufu" },
    title: { tr: "Adanada Kışın Klima ile Isınma Maliyeti Ne Kadar?", en: "Adanada Kışın Klima ile Isınma Maliyeti Ne Kadar?" },
    excerpt: { tr: "Kışın klima ile ısınmak dogalgazdan ucuz mu? Klima ısıtma maliyeti hesaplama.", en: "Klima ile ısınma maliyeti ne kadar?" },
    content: { 
      tr: "## Adanada Kışın Klima ile Isınma: Maliyet Analizi\n\nAdanada kış aylarında klima ile ısınmak dogalgaz veya peke alternatif olabilir mi?\n\n### Klima ile Isınma Maliyeti\n\nOrtalama bir klima (12000 BTU) saatte 1-1.5 kW elektrik tuketir.\n\nGünluk 8 saat kullanım: 8-12 kW\nAylik: 240-360 kW\nAylik maliyet (3TL/kW): 720-1080TL\n\n### Dogalgaz ile Isınma Maliyeti\n\nOrtalama bir dogalgazli kombi aylik 300-500TL dogalgaz faturosi olusturabilir.\n\n### Karsilastirma\n\n| Yontem | Aylik Maliyet | Avantaj |\n|---------|----------------|----------|\n| Dogalgaz Kombi | 300-500TL | Daha ucuz |\n| Inverter Klima | 720-1080TL | Temiz, kolay |\n\n### Klima ile Isınmanın Avantajları\n\n- Kurulum maliyeti düsük\n- Bakim maliyeti düsük\n- Kullanimi kolay\n- Temiz ve sessiz",
      en: "## Klima ile Isınma Maliyeti\n\nKışın klima ile ısınma maliyeti hesaplaması."
    },
    coverImage: "/uploads/blog/kis-klima-isitma.jpg",
    metaTitle: { tr: "Klima ile Isınma Maliyeti | Durukan Klima", en: "Klima ile Isınma Maliyeti | Durukan Klima" },
    metaDescription: { tr: "Kışın klima ile ısınma maliyeti ne kadar?", en: "Klima ısınma maliyeti" },
    publishedAt: "2026-04-13",
    readTime: { tr: "6 dk", en: "6 min" },
    published: true
  }
];

// Yeni blogları ekle
data.push(...newBlogs);

// Kaydet
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log(`${newBlogs.length} yeni blog eklendi. Toplam: ${data.length} yazı`);
