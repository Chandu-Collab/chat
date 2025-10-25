// Script to verify database tables were created
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function verifyTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
  });

  try {
    console.log('Checking database tables...');
    
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    const result = await pool.query(tablesQuery);
    console.log('\n📋 Tables in database:');
    result.rows.forEach(row => {
      console.log(`  ✅ ${row.table_name}`);
    });

    // Check table structures
    for (const table of ['users', 'chats', 'messages']) {
      const columnsQuery = `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = $1 AND table_schema = 'public'
        ORDER BY ordinal_position;
      `;
      
      const columns = await pool.query(columnsQuery, [table]);
      console.log(`\n📊 Structure of ${table} table:`);
      columns.rows.forEach(col => {
        console.log(`  • ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(NOT NULL)' : ''}`);
      });
    }

    await pool.end();
    console.log('\n✅ Database verification complete!');
  } catch (err) {
    console.error('❌ Error verifying database:', err);
    await pool.end();
    process.exit(1);
  }
}

verifyTables();