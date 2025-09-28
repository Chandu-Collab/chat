import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: false });

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }
    // Check if user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return NextResponse.json({ error: 'User already exists.' }, { status: 409 });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert user
    const result = await pool.query(
      'INSERT INTO users (email, name, password) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, name, hashedPassword]
    );
    return NextResponse.json({ user: result.rows[0] }, { status: 201 });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Signup failed', details: errorMessage }, { status: 500 });
  }
}
