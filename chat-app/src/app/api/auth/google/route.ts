import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: false });

// This endpoint expects: { email, name, googleId }
export async function POST(req: NextRequest) {
  try {
    const { email, name, googleId } = await req.json();
    if (!email || !googleId) {
      return NextResponse.json({ error: 'Email and Google ID are required.' }, { status: 400 });
    }
    // Check if user exists
    let userRes = await pool.query('SELECT id, email, name FROM users WHERE email = $1', [email]);
    let user = userRes.rows[0];
    if (!user) {
      // Create user if not exists
      const insertRes = await pool.query(
        'INSERT INTO users (email, name, google_id) VALUES ($1, $2, $3) RETURNING id, email, name',
        [email, name || '', googleId]
      );
      user = insertRes.rows[0];
    }
    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.NEXTAUTH_SECRET || 'secret', { expiresIn: '7d' });
    return NextResponse.json({ token, user });
  } catch (err) {
    return NextResponse.json({ error: 'Google login/signup failed', details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
