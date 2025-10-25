// Test script to create a sample user for testing
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function createTestUser() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
  });

  try {
    console.log('Creating test user...');
    
    const email = 'test@example.com';
    const name = 'Test User';
    const password = 'password123';
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if user already exists
    const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      console.log('❌ Test user already exists');
      await pool.end();
      return;
    }
    
    // Insert user
    const result = await pool.query(
      'INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, name, hashedPassword]
    );
    
    console.log('✅ Test user created successfully:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('   User ID:', result.rows[0].id);
    
    await pool.end();
  } catch (err) {
    console.error('❌ Error creating test user:', err);
    await pool.end();
    process.exit(1);
  }
}

createTestUser();