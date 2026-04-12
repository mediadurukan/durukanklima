require('dotenv').config({ path: '/root/.openclaw/workspace/durukanklima/.env' });
const { Redis } = require('@upstash/redis');
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

redis.get('content').then(r => {
  console.log('Content exists:', r ? 'YES' : 'NO');
  if (r) {
    const parsed = JSON.parse(r);
    console.log('Keys:', Object.keys(parsed).join(', '));
  }
}).catch(e => console.error('Error:', e.message));
