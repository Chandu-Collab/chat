import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: false });

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    // Find user
    const userRes = await pool.query('SELECT id, email, name, password FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }
    const user = userRes.rows[0];
    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }
    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.NEXTAUTH_SECRET || 'secret', { expiresIn: '7d' });
    return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    return NextResponse.json({ error: 'Login failed', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
