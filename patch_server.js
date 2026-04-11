const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// Find insertion point: after the app.get('/robots.txt' section closing
const marker = "res.send(`User-agent: *\\nAllow: /\\nDisallow: /admin\\nDisallow: /api\\nSitemap: ${base}/sitemap.xml\\n`);";
const markerIdx = content.indexOf(marker);
if (markerIdx === -1) { console.error('Marker not found'); process.exit(1); }

// Find the closing of that block: \n}); after marker
const blockEndIdx = content.indexOf('\n});', markerIdx);
const insertPos = blockEndIdx + 5; // after '\n});'

const newRoutes = `

// ═══════════════════════════════════════════
// TESTIMONIALS API
// ═══════════════════════════════════════════
app.get('/api/testimonials', (req, res) => {
  try {
    const content = read('content');
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
`;

content = content.slice(0, insertPos) + newRoutes + content.slice(insertPos);
fs.writeFileSync('server.js', content);
console.log('Patched successfully');