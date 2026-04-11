const fs = require('fs');
const path = require('path');

const erkekIsimler = [
  'Ahmet','Mehmet','Mustafa','Ali','Hüseyin','İbrahim','Hasan','İsmail','Ömer','Yusuf',
  'Murat','Emre','Burak','Serkan','Okan','Kemal','Erdal','Selman','Ramazan','Kadir',
  'Halil','Orhan','Fatih','Tarık','Caner','Bora','Enes','Furkan','Kaan','Uğur',
  'Volkan','Selim','Cenk','Taner','Alper','Doğan','Cem','Tolga','Barış','Sinan',
  'Ferhat','Yasin','Onur','Gökhan','Ercan','Sedat','Levent','Arif','Suat','Tuncay'
];

const kadinIsimler = [
  'Fatma','Ayşe','Hatice','Zeynep','Emine','Şule','Elif','Merve','Seda','Gül',
  'Melek','Derya','Esra','Özlem','Canan','Pınar','Tuğba','Sevgi','Neslihan','Büşra',
  'Aslı','Gamze','Hülya','Nurcan','Reyhan','Sevinç','Tülay','Yasemin','Zeliha','Aysun',
  'Bahar','Dilek','Filiz','Gülay','Hande','İlknur','Kübra','Leyla','Miray','Nihal'
];

const soyadHarfleri = 'ABCÇDEĞFGHIJKLMNOÖPRSŞTUÜVYZ'.split('');

const hizmetler = [
  'Klima Bakımı','Klima Montajı','Klima Arızası','Klima Gaz Dolumu',
  'Kombi Bakımı','Kombi Arızası','Kombi Montajı','Klima Temizliği',
  'Klima Demontajı','Kombi Gaz Ayarı'
];

const klimaYorumlar = [
  'Klimam soğutmuyordu, aynı gün geldiler ve sorunu hızlıca çözdüler. Çok memnun kaldım.',
  'Klima montajını çok profesyonelce yaptılar. Temiz ve düzgün iş çıkardılar.',
  'Gaz dolumu için aradım, aynı gün geldiler. Fiyat da gayet uygundu.',
  'Klimam sesler çıkarıyordu, ustalar geldi sorunu buldu ve halletti. Teşekkürler.',
  'Yaz ortasında klimam bozuldu, acil geldiler. Çok şükür o gün çözdüler.',
  'Klima bakımını düzenli yaptırıyorum, hep aynı kalite hizmet alıyorum.',
  'Klima temizliğini çok özenle yaptılar. Ev tertemiz kaldı.',
  'Klima kurulumu için aradım. Zamanında geldiler, işi sağlam yaptılar.',
  'Klimadan su damlıyordu, ustalar bakı, drain hattını temizledi, sorun bitti.',
  'Klima hiç soğutmuyordu, gaz dolumu yapıldı, şimdi buz gibi soğutuyor.',
  'Çok hızlı ve güler yüzlü hizmet. Kesinlikle tavsiye ederim.',
  'Klima arızasında hemen geldiler. Orijinal parça kullandılar, sorun kalmadı.',
  'Fiyatları çok uygun ve işleri kaliteli. Memnun kaldım.',
  'Klimam kaçırıyordu, kompresör değişti, şimdi sorunsuz çalışıyor.',
  'Montaj çok hızlı bitti. İçeriye hiçbir iz bırakmadılar, helal olsun.',
  'Klima filtrelerini temizlediler, elektrik faturam düştü. Harika!',
  'Servis çok hızlı geldi. Bekletmediler, sorunumu aynı gün çözdüler.',
  'Klima arızasında iki farklı yerden teklif aldım, burası hem ucuz hem kaliteliydi.',
  'Profesyonel ekip, işini bilen ustalar. Bir daha sorunum olursa yine arayacağım.',
  'Klimam çalışmıyordu. Kart arızasıydı, orijinal parça taktılar, tamam oldu.',
  'Yeni aldığım klimanın montajını yaptırdım. Çok şık ve düzgün kurulum.',
  'Sesli çalışıyordu klimam, bakımda fan motoru değişti, şimdi sessiz.',
  'Klima gaz dolumunda çok dürüst davrandılar, ne kadar dolduklarını gösterdiler.',
  'Ekip çok nazik ve saygılı. Evi tertemiz bıraktılar.',
  'Annemin evindeki klimayı tamir ettirdim. Çok hızlı ve kaliteli iş.',
];

const kombiYorumlar = [
  'Kombim arızalandı, kış ortasında mahsur kaldık. Aynı gün geldiler, ısındık.',
  'Kombi bakımını her yıl yaptırıyorum, her seferinde aynı özen ve kalite.',
  'Kombimden ses geliyordu, ustalar baktı, hava aldı. Temizledi, sorun bitti.',
  'Kombi montajını çok hızlı ve temiz yaptılar. Takdir ettim doğrusu.',
  'Kombimiz su kaybediyordu. Usta geldi sızdıran yeri buldu ve kapattı.',
  'Kombi arızasında diğer servisler erteliyordu, burası aynı gün geldi.',
  'Kombi bakımından sonra doğalgaz faturam %20 düştü. Süper!',
  'Kombi gaz ayarı çok önemliymış, farkı hemen anladım. Teşekkürler.',
  'Kış başında kombi bakımı yaptırdım, sezonu sorunsuz geçirdim.',
  'Kombimiz ateşleme yapmıyordu. Arızayı buldu, parça değişti, sorun bitti.',
  'Kombi bakım fiyatı çok uygun. Hizmet kalitesi de mükemmel.',
  'Ustalar çok bilgili, neyin neden bozulduğunu açıklayarak anlattılar.',
  'Kombim çok iyi çalışıyor artık. Bir dahaki bakımda da buraya başvuracağım.',
  'Kombi montajını zamanında ve sorunsuz tamamladılar.',
  'Yıllık bakım anlaşması yaptık, çok memnunuz. Öneririm.',
  'Kombimizin ısı eşanjörü temizlendi, verim arttı gözle görülür şekilde.',
  'Acil kombi arızasında bile gece gelmekten çekinmediler.',
  'Orijinal parça kullanmaları çok güven verici. Teşekkürler.',
  'Ekip çok temiz çalışıyor. Geldikleri gibi gidiyorlar, iz bırakmıyorlar.',
  'Kombi revizyonu mükemmel oldu. Sanki yeni kombim var gibi.',
];

function rastgeleSecim(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function soyadUret() {
  return rastgeleSecim(soyadHarfleri) + '.';
}

const yorumlar = [];

for (let i = 1; i <= 500; i++) {
  const erkekMi = Math.random() > 0.45;
  const isim = erkekMi
    ? rastgeleSecim(erkekIsimler)
    : rastgeleSecim(kadinIsimler);
  const soyad = soyadUret();
  const hizmet = rastgeleSecim(hizmetler);
  const kombiMi = hizmet.startsWith('Kombi');
  const yorumMetni = kombiMi
    ? rastgeleSecim(kombiYorumlar)
    : rastgeleSecim(klimaYorumlar);

  yorumlar.push({
    id: i,
    name: `${isim} ${soyad}`,
    rating: 5,
    text: yorumMetni,
    service: hizmet
  });
}

// content.json'u oku ve testimonials'ı güncelle
const contentPath = path.join(__dirname, 'data', 'content.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
content.testimonials = yorumlar;
fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf8');

console.log(`✅ ${yorumlar.length} müşteri yorumu oluşturuldu ve kaydedildi.`);
