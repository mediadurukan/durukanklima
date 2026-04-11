require('dotenv').config({ path: '/root/.openclaw/workspace/durukanklima/.env' });
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

pool.query('SELECT id, jsonb_array_length(data->\'testimonials\') as testimonial_count FROM "Content"').then(r => {
  console.log('Content data:', r.rows);
  pool.end();
}).catch(e => { console.error(e.message); pool.end(); });
