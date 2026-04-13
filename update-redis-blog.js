const fs = require('fs');
const redis = require('./redis');

async function updateBlog() {
    const blogData = JSON.parse(fs.readFileSync('/root/.openclaw/workspace/durukanklima/public/data/blog.json', 'utf8'));
    console.log('Blog verisi Redis\'e yukleniyor...');
    await redis.set('blog', JSON.stringify(blogData));
    console.log('Redis guncellendi!', blogData.length, 'yazi');
}

updateBlog().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
