const { Redis } = require('@upstash/redis');

// Lazily create client to ensure env vars are loaded
let _redis = null;

function getClient() {
  if (!_redis) {
    console.log('UPSTASH_REDIS_REST_URL:', process.env.UPSTASH_REDIS_REST_URL ? 'SET' : 'NOT SET');
    console.log('UPSTASH_REDIS_REST_TOKEN:', process.env.UPSTASH_REDIS_REST_TOKEN ? 'SET' : 'NOT SET');
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return _redis;
}

module.exports = {
  get: (...args) => getClient().get(...args),
  set: (...args) => getClient().set(...args),
};
