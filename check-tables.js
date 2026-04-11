require('dotenv').config({ path: '/root/.openclaw/workspace/durukanklima/.env' });
const { Pool } = require('pg');

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  // First check if DATABASE_URL exists in .env
  console.log('Checking .env...');
  const fs = require('fs');
  const envContent = fs.readFileSync('/root/.openclaw/workspace/durukanklima/.env', 'utf8');
  console.log('.env content:', envContent);
  
  // Check tables
  const result = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
  `);
  console.log('Tables:', result.rows);
  
  await pool.end();
}

check().catch(console.error);
