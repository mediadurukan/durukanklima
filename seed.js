require('dotenv').config({ path: '/root/.openclaw/workspace/durukanklima/.env' });
const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seed() {
  console.log('🌱 Starting seed...');
  console.log('DB URL:', process.env.DATABASE_URL ? 'set' : 'NOT SET');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not set!');
    process.exit(1);
  }

  const content = require('./data/content.json');
  const settings = require('./data/settings.json');

  try {
    await pool.query(
      'INSERT INTO "Content" (id, "data") VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET "data" = $1',
      [JSON.stringify(content)]
    );
    console.log('✅ Content seeded');
  } catch(e) {
    console.error('❌ Content seed error:', e.message);
  }

  try {
    await pool.query(
      'INSERT INTO "Settings" (id, "data") VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET "data" = $1',
      [JSON.stringify(settings)]
    );
    console.log('✅ Settings seeded');
  } catch(e) {
    console.error('❌ Settings seed error:', e.message);
  }

  console.log('🎉 Seed completed!');
  await pool.end();
}

seed().catch(e => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
