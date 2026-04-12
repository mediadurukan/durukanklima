require('dotenv').config({ path: '/root/.openclaw/workspace/durukanklima/.env' });
const redis = require('./redis');

async function test() {
  console.log('Testing Upstash Redis...');
  
  try {
    const pong = await redis.ping();
    console.log('Ping:', pong);
  } catch(e) {
    console.error('Ping error:', e.message);
  }
  
  try {
    const data = await redis.get('content');
    console.log('Content type:', typeof data);
    if (data) {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      console.log('Content keys:', Object.keys(parsed).join(', '));
    } else {
      console.log('Content is null/empty');
    }
  } catch(e) {
    console.error('Get error:', e.message);
  }
}

test();
