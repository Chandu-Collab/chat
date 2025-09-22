import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database-service';

export async function POST(request: NextRequest) {
  try {
    const { userId = '00000000-0000-0000-0000-000000000001', title } = await request.json();

    const chat = await DatabaseService.createChat({
      user_id: userId,
      title: title || 'New Chat'
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error('New chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}