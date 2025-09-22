import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function initDatabase() {
  // Create a direct connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
  });

  try {
    console.log('Connecting to PostgreSQL database...');
    
    // Test connection first
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL successfully');
    client.release();

    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema
    console.log('Creating database tables...');
    await pool.query(schema);
    console.log('✅ Database schema created successfully');

    // Create a default user for testing
    console.log('Creating default user...');
    const defaultUser = await pool.query(`
      INSERT INTO users (id, email, name) 
      VALUES ('00000000-0000-0000-0000-000000000001', 'user@example.com', 'Default User')
      ON CONFLICT (email) DO NOTHING
      RETURNING id;
    `);

    if (defaultUser.rows.length > 0) {
      console.log('✅ Default user created with ID:', defaultUser.rows[0].id);
    } else {
      console.log('ℹ️  Default user already exists');
    }

    console.log('🎉 Database initialization completed successfully!');
    await pool.end();
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    await pool.end();
    process.exit(1);
  }
}

initDatabase();