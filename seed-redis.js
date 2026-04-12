require('dotenv').config({ path: '/root/.openclaw/workspace/durukanklima/.env' });
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function seed() {
  console.log('🌱 Starting Redis seed...');
  
  const content = require('./data/content.json');
  const settings = require('./data/settings.json');

  try {
    await redis.set('content', JSON.stringify(content));
    console.log('✅ Content seeded');
  } catch(e) {
    console.error('❌ Content error:', e.message);
  }

  try {
    await redis.set('settings', JSON.stringify(settings));
    console.log('✅ Settings seeded');
  } catch(e) {
    console.error('❌ Settings error:', e.message);
  }

  console.log('🎉 Done!');
}

seed();
