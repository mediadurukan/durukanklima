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

const blogPosts = [
  {
    id: 1,
    slug: 'klima-bakimi-neden-onemli',
    title: 'Klima Bakımı Neden Önemli?',
    excerpt: 'Klima bakımı yalnızca performansı artırmak için değil, aynı zamanda cihazınızın ömrünü uzatmak ve enerji tasarrufu sağlamak için de kritik öneme sahiptir.',
    content: 'Klima bakımı yalnızca performansı artırmak için değil, aynı zamanda cihazınızın ömrünü uzatmak ve enerji tasarrufu sağlamak için de kritik öneme sahiptir.\n\nDüzenli bakım ile:\n- Klima performansı %20-30 artar\n- Elektrik faturanız düşer\n- Cihaz ömrü uzar\n- Arıza riski azalır',
    category: 'Klima Bakımı',
    tags: ['klima', 'bakım', 'enerji'],
    published: true,
    publishedAt: '2025-01-15',
    author: 'Durukan Klima',
    image: ''
  },
  {
    id: 2,
    slug: 'kombi-kis-ayarlari',
    title: 'Kış Aylarında Kombi Kullanım İpuçları',
    excerpt: 'Kış aylarında kombinizin verimli çalışması ve enerji tasarrufu için dikkat etmeniz gereken önemli noktalar.',
    content: 'Kış aylarında kombinizin verimli çalışması için:\n\n1. Kombinizi yılda en az bir kez bakıma götürün\n2. Termostatı optimal sıcaklıkta tutun (20-22°C)\n3. Peteklerin önünü kapatmayın\n4. Oda sıcaklığını gece düşürün',
    category: 'Kombi Bakımı',
    tags: ['kombi', 'kış', 'enerji tasarrufu'],
    published: true,
    publishedAt: '2025-01-10',
    author: 'Durukan Klima',
    image: ''
  },
  {
    id: 3,
    slug: 'klima-gaz-doldurma-ne-zaman',
    title: 'Klima Gazı Ne Zaman Doldurulmalı?',
    excerpt: 'Klimanız yeterince soğutmuyorsa veya 3-4 yıldan beri gaz dolumu yaptırmadıysanız, gaz takviyesi gerekebilir.',
    content: 'Klima gaz dolumu gerektiren durumlar:\n\n- Klimanız yeterince soğutmuyorsa\n- 3-4 yıldan beri gaz dolumu yaptırmadıysanız\n- Klimadan garip sesler geliyorsa\n- Elektrik faturanız normale göre arttıysa',
    category: 'Klima Gaz Dolumu',
    tags: ['klima', 'gaz dolumu', 'arıza'],
    published: true,
    publishedAt: '2025-01-05',
    author: 'Durukan Klima',
    image: ''
  }
];

cmd('SET', 'blog', JSON.stringify(blogPosts)).then(r => console.log('Blog seeded:', r)).catch(e => console.error('Error:', e));
