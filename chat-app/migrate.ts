// Simple migration runner for PostgreSQL using Node.js and pg
// Usage: npx ts-node migrate.ts

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

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
