const https = require('https');

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

function redisCommand(command, ...args) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify([command, ...args]);
    
    const url = new URL(KV_URL);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KV_TOKEN}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.error) {
            reject(new Error(result.error));
          } else {
            resolve(result.result);
          }
        } catch(e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = {
  get: (key) => redisCommand('GET', key),
  set: (key, value) => redisCommand('SET', key, typeof value === 'string' ? value : JSON.stringify(value)),
  ping: () => redisCommand('PING'),
};
