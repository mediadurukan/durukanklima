require('dotenv').config({ path: '/root/.openclaw/workspace/durukanklima/.env' });
const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const content = require('./data/content.json');
const settings = require('./data/settings.json');

async function seed() {
  console.log('🌱 Starting seed...');

  try {
    await pool.query(
      'INSERT INTO "Content" (id, data) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET data = $1',
      [JSON.stringify(content)]
    );
    console.log('✅ Content seeded');
  } catch(e) {
    console.error('❌ Content error:', e.message);
  }

  try {
    await pool.query(
      'INSERT INTO "Settings" (id, data) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET data = $1',
      [JSON.stringify(settings)]
    );
    console.log('✅ Settings seeded');
  } catch(e) {
    console.error('❌ Settings error:', e.message);
  }

  console.log('🎉 Done!');
  await pool.end();
}

seed();
