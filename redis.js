// Simple Upstash Redis REST API client
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

async function redisCommand(command, ...args) {
  const body = JSON.stringify([command, ...args]);
  
  const response = await fetch(`${UPSTASH_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${UPSTASH_TOKEN}`
    },
    body
  });
  
  if (!response.ok) {
    throw new Error(`Redis error: ${response.status}`);
  }
  
  const result = await response.json();
  if (result.error) {
    throw new Error(result.error);
  }
  return result.result;
}

module.exports = {
  get: (key) => redisCommand('GET', key),
  set: (key, value) => redisCommand('SET', key, typeof value === 'string' ? value : JSON.stringify(value)),
  ping: () => redisCommand('PING'),
};
