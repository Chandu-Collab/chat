// Simple migration runner for PostgreSQL using Node.js and pg (CommonJS style)
// Usage: node migrate.cjs

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
  });

  try {
    console.log('Connecting to PostgreSQL...');
    const client = await pool.connect();
    console.log('Connected!');
    client.release();

    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('Running migration...');
    await pool.query(schema);
    console.log('✅ Migration complete!');
    await pool.end();
  } catch (err) {
    console.error('Migration failed:', err);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
